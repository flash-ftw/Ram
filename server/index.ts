import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { pool } from "./db";
import connectPgSimple from "connect-pg-simple";
import { storage } from "./storage";

// Declare session extend for TypeScript
declare module "express-session" {
  interface SessionData {
    user: {
      id: number;
      username: string;
      isAdmin: boolean;
    };
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize session store with PostgreSQL
const PostgreSqlStore = connectPgSimple(session);
app.use(
  session({
    store: new PostgreSqlStore({
      pool: pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "modernshowroom-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize admin user if this is the first run
  try {
    // Check if any admin users exist first
    const adminUsers = await storage.getAllAdminUsers?.() || [];
    
    if (adminUsers.length === 0) {
      // Create default admin user
      await storage.createUser({
        username: "admin",
        password: "admin123", // In a real app, you'd hash this
        isAdmin: true
      });
      console.log("Created default admin user: admin / admin123");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

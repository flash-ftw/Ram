import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { pool } from "./db";
import connectPgSimple from "connect-pg-simple";
import { storage } from "./storage";
import { ensureUploadDirectoriesExist } from "./utils/ensure-upload-dirs";
import { getCorsConfig } from "./utils/cors";
import path from "path";
import fs from "fs";

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
// Configurer CORS pour les appels API
app.use(cors(getCorsConfig()));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Direct route for serving SVG files - must come before other routes
app.get('/uploads/products/:filename', (req, res) => {
  const filePath = path.join(process.cwd(), 'public', 'uploads', 'products', req.params.filename);
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.svg') {
      res.setHeader('Content-Type', 'image/svg+xml');
    } else if (ext === '.jpg' || ext === '.jpeg') {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (ext === '.png') {
      res.setHeader('Content-Type', 'image/png');
    } else if (ext === '.gif') {
      res.setHeader('Content-Type', 'image/gif');
    } else if (ext === '.webp') {
      res.setHeader('Content-Type', 'image/webp');
    }
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

// Direct route for serving brand logo files
app.get('/uploads/brands/:filename', (req, res) => {
  const filePath = path.join(process.cwd(), 'public', 'uploads', 'brands', req.params.filename);
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.svg') {
      res.setHeader('Content-Type', 'image/svg+xml');
    } else if (ext === '.jpg' || ext === '.jpeg') {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (ext === '.png') {
      res.setHeader('Content-Type', 'image/png');
    } else if (ext === '.gif') {
      res.setHeader('Content-Type', 'image/gif');
    } else if (ext === '.webp') {
      res.setHeader('Content-Type', 'image/webp');
    }
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

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
  // Ensure all upload directories exist
  ensureUploadDirectoriesExist();
  
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

  // Use the PORT environment variable if available (for Railway deployment)
  // otherwise default to port 5000
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

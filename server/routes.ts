import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactSubmissionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories API
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const featured = req.query.featured === 'true';
      const categories = req.query.category ? 
        Array.isArray(req.query.category) ? 
          req.query.category as string[] : 
          [req.query.category as string] : 
        undefined;
      
      const minPrice = req.query.minPrice ? 
        parseFloat(req.query.minPrice as string) : 
        undefined;
      
      const maxPrice = req.query.maxPrice ? 
        parseFloat(req.query.maxPrice as string) : 
        undefined;
      
      const sortBy = req.query.sortBy as string | undefined;
      const search = req.query.search as string | undefined;
      
      const products = await storage.getProducts({
        featured,
        categories,
        minPrice,
        maxPrice,
        sortBy,
        search
      });
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Single Product API
  app.get("/api/products/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Contact Form Submission API
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process contact submission" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

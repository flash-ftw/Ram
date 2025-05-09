import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertContactSubmissionSchema, 
  insertProductSchema, 
  insertCategorySchema, 
  insertBrandSchema, 
  insertUserSchema 
} from "@shared/schema";
import bcrypt from "bcryptjs";

// Authentication middleware
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

// Admin middleware
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.user && req.session.user.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, we'd use bcrypt.compare to check the password
      // const passwordMatches = await bcrypt.compare(password, user.password);
      // For simplicity, we'll just check if passwords match directly
      const passwordMatches = password === user.password;
      
      if (!passwordMatches) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user in session (but exclude password)
      const { password: _, ...userWithoutPassword } = user;
      req.session.user = userWithoutPassword;
      
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });
  
  app.get("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie('connect.sid');
      res.setHeader('Content-Type', 'application/json');
      res.json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/auth/me", isAuthenticated, (req, res) => {
    res.json({ user: req.session.user });
  });
  
  // Create initial admin if none exists
  app.post("/api/auth/init", async (req, res) => {
    try {
      // Check if any admin users exist
      const adminUsers = await storage.getAllAdminUsers();
      
      if (adminUsers.length > 0) {
        return res.status(400).json({ message: "Admin users already exist" });
      }
      
      // Create admin user
      const adminUser = {
        username: "admin",
        password: "admin123", // In a real app, hash this with bcrypt
        isAdmin: true
      };
      
      const user = await storage.createUser(adminUser);
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json({
        message: "Admin user created successfully",
        user: userWithoutPassword
      });
    } catch (error) {
      console.error("Init error:", error);
      res.status(500).json({ message: "Failed to initialize admin user" });
    }
  });

  // Categories API - Public endpoints
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });
  
  // Categories API - Admin specific GET endpoints
  app.get("/api/admin/categories", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  app.get("/api/admin/categories/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const category = await storage.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Categories API - Admin endpoints
  app.post("/api/admin/categories", isAuthenticated, isAdmin, async (req, res) => {
    try {
      // Validate the name field exists before generating slug
      if (!req.body.name) {
        return res.status(400).json({ 
          message: "Invalid category data", 
          errors: [{ path: ["name"], message: "Name is required" }] 
        });
      }
      
      // Generate a slug from the name
      const { name, ...rest } = req.body;
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const categoryData = {
        name,
        slug,
        ...rest
      };
      
      const validatedData = insertCategorySchema.parse(categoryData);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/admin/categories/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      // Generate a slug if name is being updated
      let categoryData = { ...req.body };
      if (req.body.name) {
        const slug = req.body.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        categoryData.slug = slug;
      }
      
      const validatedData = insertCategorySchema.partial().parse(categoryData);
      const category = await storage.updateCategory(id, validatedData);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const result = await storage.deleteCategory(id);
      if (!result) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Brands API - Public endpoints
  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getAllBrands();
      res.json(brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  app.get("/api/brands/:slug", async (req, res) => {
    try {
      const brand = await storage.getBrandBySlug(req.params.slug);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      console.error("Error fetching brand:", error);
      res.status(500).json({ message: "Failed to fetch brand" });
    }
  });
  
  // Brands API - Admin specific GET endpoints
  app.get("/api/admin/brands", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const brands = await storage.getAllBrands();
      res.json(brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });
  
  app.get("/api/admin/brands/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid brand ID" });
      }
      
      const brand = await storage.getBrandById(id);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      
      res.json(brand);
    } catch (error) {
      console.error("Error fetching brand by ID:", error);
      res.status(500).json({ message: "Failed to fetch brand" });
    }
  });

  // Brands API - Admin endpoints
  app.post("/api/admin/brands", isAuthenticated, isAdmin, async (req, res) => {
    try {
      // Validate the name field exists before generating slug
      if (!req.body.name) {
        return res.status(400).json({ 
          message: "Invalid brand data", 
          errors: [{ path: ["name"], message: "Name is required" }] 
        });
      }
      
      // Generate a slug from the name
      const { name, ...rest } = req.body;
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const brandData = {
        name,
        slug,
        ...rest
      };
      
      const validatedData = insertBrandSchema.parse(brandData);
      const brand = await storage.createBrand(validatedData);
      res.status(201).json(brand);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid brand data", errors: error.errors });
      }
      console.error("Error creating brand:", error);
      res.status(500).json({ message: "Failed to create brand" });
    }
  });

  app.put("/api/admin/brands/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid brand ID" });
      }
      
      // Generate a slug if name is being updated
      let brandData = { ...req.body };
      if (req.body.name) {
        const slug = req.body.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        brandData.slug = slug;
      }
      
      const validatedData = insertBrandSchema.partial().parse(brandData);
      const brand = await storage.updateBrand(id, validatedData);
      
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      
      res.json(brand);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid brand data", errors: error.errors });
      }
      console.error("Error updating brand:", error);
      res.status(500).json({ message: "Failed to update brand" });
    }
  });

  app.delete("/api/admin/brands/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid brand ID" });
      }
      
      const result = await storage.deleteBrand(id);
      if (!result) {
        return res.status(404).json({ message: "Brand not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting brand:", error);
      res.status(500).json({ message: "Failed to delete brand" });
    }
  });

  // Products API - Public endpoints
  app.get("/api/products", async (req, res) => {
    try {
      const featured = req.query.featured === 'true';
      
      const categories = req.query.category ? 
        Array.isArray(req.query.category) ? 
          req.query.category as string[] : 
          [req.query.category as string] : 
        undefined;
      
      const brands = req.query.brand ? 
        Array.isArray(req.query.brand) ? 
          req.query.brand as string[] : 
          [req.query.brand as string] : 
        undefined;
      
      const minPrice = req.query.minPrice ? 
        parseFloat(req.query.minPrice as string) : 
        undefined;
      
      const maxPrice = req.query.maxPrice ? 
        parseFloat(req.query.maxPrice as string) : 
        undefined;
      
      const sortBy = req.query.sortBy as string | undefined;
      const search = req.query.search as string | undefined;
      
      // Pagination
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      
      const products = await storage.getProducts({
        featured,
        categories,
        brands,
        minPrice,
        maxPrice,
        sortBy,
        search,
        limit,
        offset
      });
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Products API - Admin endpoints
  app.get("/api/admin/products", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching all products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/admin/products/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/admin/products", isAuthenticated, isAdmin, async (req, res) => {
    try {
      // Validate the name field exists before generating slug
      if (!req.body.name) {
        return res.status(400).json({ 
          message: "Invalid product data", 
          errors: [{ path: ["name"], message: "Name is required" }] 
        });
      }
      
      // Generate a slug from the name
      const { name, ...rest } = req.body;
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const productData = {
        name,
        slug,
        ...rest
      };
      
      const validatedData = insertProductSchema.parse(productData);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      // Generate a slug if name is being updated
      let productData = { ...req.body };
      if (req.body.name) {
        const slug = req.body.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        productData.slug = slug;
      }
      
      const validatedData = insertProductSchema.partial().parse(productData);
      const product = await storage.updateProduct(id, validatedData);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const result = await storage.deleteProduct(id);
      if (!result) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Contact submissions - Public endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      console.error("Error creating contact submission:", error);
      res.status(500).json({ message: "Failed to process contact submission" });
    }
  });

  // Contact submissions - Admin endpoints
  app.get("/api/admin/contact-submissions", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });

  app.get("/api/admin/contact-submissions/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid submission ID" });
      }
      
      const submission = await storage.getContactSubmissionById(id);
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }
      
      res.json(submission);
    } catch (error) {
      console.error("Error fetching contact submission:", error);
      res.status(500).json({ message: "Failed to fetch contact submission" });
    }
  });

  app.put("/api/admin/contact-submissions/:id/mark-read", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid submission ID" });
      }
      
      const result = await storage.markContactSubmissionAsRead(id);
      if (!result) {
        return res.status(404).json({ message: "Submission not found" });
      }
      
      res.json({ message: "Submission marked as read" });
    } catch (error) {
      console.error("Error marking contact submission as read:", error);
      res.status(500).json({ message: "Failed to mark submission as read" });
    }
  });

  app.delete("/api/admin/contact-submissions/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid submission ID" });
      }
      
      const result = await storage.deleteContactSubmission(id);
      if (!result) {
        return res.status(404).json({ message: "Submission not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting contact submission:", error);
      res.status(500).json({ message: "Failed to delete contact submission" });
    }
  });

  // Server creation
  const httpServer = createServer(app);
  return httpServer;
}

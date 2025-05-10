import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertContactSubmissionSchema, 
  insertProductSchema, 
  insertCategorySchema, 
  insertBrandSchema, 
  insertUserSchema,
  insertOrderSchema,
  OrderStatus
} from "@shared/schema";
import bcrypt from "bcryptjs";
import { 
  fileUploadMiddleware, 
  uploadProductImage, 
  uploadBrandLogo, 
  uploadProductGalleryImages, 
  serveUploadedFiles 
} from "./utils/upload";
import path from "path";
import fs from "fs";

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
  // Direct route for serving specific files
  app.get("/api/image/:type/:filename", (req, res) => {
    const { type, filename } = req.params;
    if (!type || !filename) {
      return res.status(400).send("Invalid parameters");
    }
    
    const validTypes = ["products", "brands"];
    if (!validTypes.includes(type)) {
      return res.status(400).send("Invalid file type");
    }
    
    const filePath = path.join(process.cwd(), "public", "uploads", type, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found");
    }
    
    const ext = path.extname(filename).toLowerCase();
    if (ext === ".svg") {
      res.setHeader("Content-Type", "image/svg+xml");
      return res.send(fs.readFileSync(filePath, "utf8"));
    } else if (ext === ".jpg" || ext === ".jpeg") {
      res.setHeader("Content-Type", "image/jpeg");
    } else if (ext === ".png") {
      res.setHeader("Content-Type", "image/png");
    } else if (ext === ".gif") {
      res.setHeader("Content-Type", "image/gif");
    } else if (ext === ".webp") {
      res.setHeader("Content-Type", "image/webp");
    } else {
      res.setHeader("Content-Type", "application/octet-stream");
    }
    
    res.sendFile(filePath);
  });
  
  // Set up the static file serving for uploaded files - this must come before other routes
  serveUploadedFiles(app);
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

  // Add PATCH endpoint for categories (for partial updates)
  app.patch("/api/admin/categories/:id", isAuthenticated, isAdmin, async (req, res) => {
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
      
      res.setHeader('Content-Type', 'application/json');
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
  app.post("/api/admin/brands", isAuthenticated, isAdmin, fileUploadMiddleware, uploadBrandLogo, async (req, res) => {
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

  app.put("/api/admin/brands/:id", isAuthenticated, isAdmin, fileUploadMiddleware, uploadBrandLogo, async (req, res) => {
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

  // Add PATCH endpoint for brands (for partial updates)
  app.patch("/api/admin/brands/:id", isAuthenticated, isAdmin, fileUploadMiddleware, uploadBrandLogo, async (req, res) => {
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
      
      res.setHeader('Content-Type', 'application/json');
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
      
      // Support de filtre par categoryId (numérique)
      let categoryId: number | undefined = undefined;
      if (req.query.categoryId) {
        categoryId = parseInt(req.query.categoryId as string);
      }
      
      // Support de filtre par brandId (numérique)
      let brandId: number | undefined = undefined;
      if (req.query.brandId) {
        brandId = parseInt(req.query.brandId as string);
      }
      
      // Support de filtre par categorie via slug (pour compatibilité)
      const categories = req.query.category ? 
        Array.isArray(req.query.category) ? 
          req.query.category as string[] : 
          [req.query.category as string] : 
        undefined;
      
      // Support de filtre par marque via slug (pour compatibilité)
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
      
      // Nouveaux filtres pour spécifications motos
      const motorType = req.query.motorType as string | undefined;
      const displacement = req.query.displacement as string | undefined;
      const cooling = req.query.cooling as string | undefined;
      const fuelSystem = req.query.fuelSystem as string | undefined;
      const transmission = req.query.transmission as string | undefined;
      const startType = req.query.startType as string | undefined;
      const brakes = req.query.brakes as string | undefined;
      const wheelSize = req.query.wheelSize as string | undefined;
      
      // Filtres numériques pour spécifications motos
      const maxSpeedMin = req.query.maxSpeedMin ? 
        parseInt(req.query.maxSpeedMin as string) : 
        undefined;
      
      const maxSpeedMax = req.query.maxSpeedMax ? 
        parseInt(req.query.maxSpeedMax as string) : 
        undefined;
      
      const weightMin = req.query.weightMin ? 
        parseInt(req.query.weightMin as string) : 
        undefined;
      
      const weightMax = req.query.weightMax ? 
        parseInt(req.query.weightMax as string) : 
        undefined;
      
      // Pagination
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      
      const products = await storage.getProducts({
        featured,
        categories,
        brands,
        categoryId,     // Ajout du filtre par ID de catégorie
        brandId,        // Ajout du filtre par ID de marque
        minPrice,
        maxPrice,
        sortBy,
        search,
        limit,
        offset,
        // Nouveaux filtres pour spécifications motos
        motorType,
        displacement,
        cooling,
        fuelSystem,
        transmission,
        startType,
        brakes,
        wheelSize,
        maxSpeedMin,
        maxSpeedMax,
        weightMin,
        weightMax
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

  app.post("/api/admin/products", isAuthenticated, isAdmin, fileUploadMiddleware, uploadProductImage, uploadProductGalleryImages, async (req, res) => {
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
      
      // Process the data to ensure correct types
      const productData = {
        name,
        slug,
        price: parseFloat(rest.price),
        categoryId: parseInt(rest.categoryId),
        brandId: parseInt(rest.brandId),
        featured: rest.featured === 'true',
        inStock: rest.inStock === 'true',
        quantity: parseInt(rest.quantity),
        // Maintain the correct type for other fields
        description: rest.description,
        features: rest.features,
        mainImage: rest.mainImage,
        galleryImages: rest.galleryImages ? JSON.parse(rest.galleryImages) : [],
        originalPrice: rest.originalPrice ? parseFloat(rest.originalPrice) : undefined
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

  app.put("/api/admin/products/:id", isAuthenticated, isAdmin, fileUploadMiddleware, uploadProductImage, uploadProductGalleryImages, async (req, res) => {
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
      
      // Convert form field types
      if (productData.price) productData.price = parseFloat(productData.price);
      if (productData.originalPrice) productData.originalPrice = parseFloat(productData.originalPrice);
      if (productData.categoryId) productData.categoryId = parseInt(productData.categoryId);
      if (productData.brandId) productData.brandId = parseInt(productData.brandId);
      if (productData.quantity) productData.quantity = parseInt(productData.quantity);
      if (productData.featured !== undefined) productData.featured = productData.featured === 'true';
      if (productData.inStock !== undefined) productData.inStock = productData.inStock === 'true';
      if (productData.galleryImages) {
        try {
          productData.galleryImages = typeof productData.galleryImages === 'string' 
            ? JSON.parse(productData.galleryImages)
            : productData.galleryImages;
        } catch (e) {
          // If not JSON, ensure it's an array
          productData.galleryImages = Array.isArray(productData.galleryImages) 
            ? productData.galleryImages 
            : [productData.galleryImages];
        }
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

  // Add PATCH endpoint for products (for partial updates)
  app.patch("/api/admin/products/:id", isAuthenticated, isAdmin, fileUploadMiddleware, uploadProductImage, uploadProductGalleryImages, async (req, res) => {
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
      
      // Convert form field types
      if (productData.price) productData.price = parseFloat(productData.price);
      if (productData.originalPrice) productData.originalPrice = parseFloat(productData.originalPrice);
      if (productData.categoryId) productData.categoryId = parseInt(productData.categoryId);
      if (productData.brandId) productData.brandId = parseInt(productData.brandId);
      if (productData.quantity) productData.quantity = parseInt(productData.quantity);
      if (productData.featured !== undefined) productData.featured = productData.featured === 'true';
      if (productData.inStock !== undefined) productData.inStock = productData.inStock === 'true';
      if (productData.galleryImages) {
        try {
          productData.galleryImages = typeof productData.galleryImages === 'string' 
            ? JSON.parse(productData.galleryImages)
            : productData.galleryImages;
        } catch (e) {
          // If not JSON, ensure it's an array
          productData.galleryImages = Array.isArray(productData.galleryImages) 
            ? productData.galleryImages 
            : [productData.galleryImages];
        }
      }
      
      const validatedData = insertProductSchema.partial().parse(productData);
      const product = await storage.updateProduct(id, validatedData);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.setHeader('Content-Type', 'application/json');
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

  // Orders API - Public endpoint for creating orders
  app.post("/api/orders", async (req, res) => {
    try {
      // Validate order data
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Orders API - Admin endpoints
  app.get("/api/admin/orders", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/orders/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const order = await storage.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.patch("/api/admin/orders/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const validatedData = insertOrderSchema.partial().parse(req.body);
      const order = await storage.updateOrder(id, validatedData);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  app.patch("/api/admin/orders/:id/status", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const { status } = req.body;
      if (!status || !Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({ 
          message: "Invalid status value", 
          validValues: Object.values(OrderStatus) 
        });
      }
      
      const result = await storage.updateOrderStatus(id, status);
      if (!result) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Get the updated order to return
      const updatedOrder = await storage.getOrderById(id);
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  app.patch("/api/admin/orders/:id/payment", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const result = await storage.markOrderAsPaid(id);
      if (!result) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Get the updated order to return
      const updatedOrder = await storage.getOrderById(id);
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error marking order as paid:", error);
      res.status(500).json({ message: "Failed to mark order as paid" });
    }
  });

  app.delete("/api/admin/orders/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const result = await storage.deleteOrder(id);
      if (!result) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ message: "Failed to delete order" });
    }
  });

  // Server creation
  const httpServer = createServer(app);
  return httpServer;
}

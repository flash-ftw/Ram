import { 
  users, 
  type User, 
  type InsertUser, 
  categories, 
  type Category, 
  type InsertCategory, 
  products, 
  type Product, 
  type InsertProduct,
  brands,
  type Brand,
  type InsertBrand,
  contactSubmissions,
  type ContactSubmission,
  type InsertContactSubmission
} from "@shared/schema";
import { sampleCategories, sampleProducts, sampleBrands } from "./products";
import { db } from "./db";
import { eq, ilike, and, or, desc, asc, between, gte, lte, inArray } from "drizzle-orm";

// Interface for storage methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyUser(username: string, password: string): Promise<User | undefined>;
  getAllAdminUsers(): Promise<User[]>;
  
  // Brand methods
  getAllBrands(): Promise<Brand[]>;
  getBrandById(id: number): Promise<Brand | undefined>;
  getBrandBySlug(slug: string): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: number, brand: Partial<InsertBrand>): Promise<Brand | undefined>;
  deleteBrand(id: number): Promise<boolean>;
  
  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Product methods
  getProducts(options?: {
    featured?: boolean;
    categories?: string[];
    brands?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]>;
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductCount(): Promise<number>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Contact submission methods
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  getContactSubmissionById(id: number): Promise<ContactSubmission | undefined>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  markContactSubmissionAsRead(id: number): Promise<boolean>;
  deleteContactSubmission(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }

  async verifyUser(username: string, password: string): Promise<User | undefined> {
    const [user] = await db.select()
      .from(users)
      .where(and(
        eq(users.username, username),
        eq(users.password, password) // Note: In a real app, you should use proper password hashing
      ));
    return user;
  }

  async getAllAdminUsers(): Promise<User[]> {
    return await db.select()
      .from(users)
      .where(eq(users.isAdmin, true));
  }

  // Brand methods
  async getAllBrands(): Promise<Brand[]> {
    return await db.select().from(brands).orderBy(brands.name);
  }

  async getBrandById(id: number): Promise<Brand | undefined> {
    const [brand] = await db.select().from(brands).where(eq(brands.id, id));
    return brand;
  }

  async getBrandBySlug(slug: string): Promise<Brand | undefined> {
    const [brand] = await db.select().from(brands).where(eq(brands.slug, slug));
    return brand;
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const [createdBrand] = await db.insert(brands).values(brand).returning();
    return createdBrand;
  }

  async updateBrand(id: number, data: Partial<InsertBrand>): Promise<Brand | undefined> {
    const [updatedBrand] = await db.update(brands)
      .set(data)
      .where(eq(brands.id, id))
      .returning();
    return updatedBrand;
  }

  async deleteBrand(id: number): Promise<boolean> {
    const result = await db.delete(brands).where(eq(brands.id, id));
    return result.rowCount > 0;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [createdCategory] = await db.insert(categories).values(category).returning();
    return createdCategory;
  }

  async updateCategory(id: number, data: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db.update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount > 0;
  }

  // Product methods
  async getProducts(options: {
    featured?: boolean;
    categories?: string[];
    brands?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<Product[]> {
    let query = db.select().from(products);
    
    // Build the where conditions based on options
    const whereConditions = [];
    
    // Filter by featured
    if (options.featured) {
      whereConditions.push(eq(products.featured, true));
    }
    
    // Filter by price range
    if (options.minPrice !== undefined) {
      whereConditions.push(gte(products.price, options.minPrice));
    }
    
    if (options.maxPrice !== undefined) {
      whereConditions.push(lte(products.price, options.maxPrice));
    }
    
    // Filter by search query
    if (options.search) {
      whereConditions.push(
        or(
          ilike(products.name, `%${options.search}%`),
          ilike(products.description, `%${options.search}%`)
        )
      );
    }
    
    // Filter by categories
    if (options.categories && options.categories.length > 0) {
      // Get category IDs from slugs
      const categoryPromises = options.categories.map(slug => this.getCategoryBySlug(slug));
      const categoryResults = await Promise.all(categoryPromises);
      
      // Filter out undefined results and extract IDs
      const categoryIds = categoryResults
        .filter((category): category is Category => category !== undefined)
        .map(category => category.id);
      
      if (categoryIds.length > 0) {
        whereConditions.push(inArray(products.categoryId, categoryIds));
      }
    }
    
    // Filter by brands
    if (options.brands && options.brands.length > 0) {
      // Get brand IDs from slugs
      const brandPromises = options.brands.map(slug => this.getBrandBySlug(slug));
      const brandResults = await Promise.all(brandPromises);
      
      // Filter out undefined results and extract IDs
      const brandIds = brandResults
        .filter((brand): brand is Brand => brand !== undefined)
        .map(brand => brand.id);
      
      if (brandIds.length > 0) {
        whereConditions.push(inArray(products.brandId, brandIds));
      }
    }
    
    // Apply all where conditions if they exist
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }
    
    // Apply sorting
    if (options.sortBy) {
      switch (options.sortBy) {
        case 'price-asc':
          query = query.orderBy(asc(products.price));
          break;
        case 'price-desc':
          query = query.orderBy(desc(products.price));
          break;
        case 'newest':
          query = query.orderBy(desc(products.createdAt));
          break;
        case 'name-asc':
          query = query.orderBy(asc(products.name));
          break;
        case 'name-desc':
          query = query.orderBy(desc(products.name));
          break;
        default:
          // Default sorting by featured and then newest
          query = query.orderBy(desc(products.featured), desc(products.createdAt));
          break;
      }
    } else {
      // Default sorting
      query = query.orderBy(desc(products.featured), desc(products.createdAt));
    }
    
    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.offset(options.offset);
    }
    
    // Execute the query
    return await query;
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProductCount(): Promise<number> {
    const result = await db.select({ count: db.$count(products.id)}).from(products);
    return result[0].count || 0;
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [createdProduct] = await db.insert(products).values(product).returning();
    return createdProduct;
  }

  async updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined> {
    // Get current product to check if slug needs to be updated with name
    const currentProduct = await this.getProductById(id);
    if (!currentProduct) return undefined;

    const updateData = {...data};
    
    // If name is being updated but slug is not provided, generate slug from name
    if (data.name && !data.slug) {
      updateData.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const [updatedProduct] = await db.update(products)
      .set({...updateData, updatedAt: new Date()})
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  }

  // Contact submissions methods
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async getContactSubmissionById(id: number): Promise<ContactSubmission | undefined> {
    const [submission] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id));
    return submission;
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [createdSubmission] = await db.insert(contactSubmissions).values(submission).returning();
    return createdSubmission;
  }

  async markContactSubmissionAsRead(id: number): Promise<boolean> {
    const result = await db.update(contactSubmissions)
      .set({ read: true })
      .where(eq(contactSubmissions.id, id))
      .returning();
    return result.length > 0;
  }

  async deleteContactSubmission(id: number): Promise<boolean> {
    const result = await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
    return result.rowCount > 0;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private brandsMap: Map<number, Brand>;
  private categoriesMap: Map<number, Category>;
  private productsMap: Map<number, Product>;
  private contactSubmissionsMap: Map<number, ContactSubmission>;
  currentId: number;
  brandId: number;
  categoryId: number;
  productId: number;
  submissionId: number;

  constructor() {
    this.users = new Map();
    this.brandsMap = new Map();
    this.categoriesMap = new Map();
    this.productsMap = new Map();
    this.contactSubmissionsMap = new Map();
    this.currentId = 1;
    this.brandId = 1;
    this.categoryId = 1;
    this.productId = 1;
    this.submissionId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create admin user
    this.createUser({
      username: "admin",
      password: "admin123", // In a real app, use proper password hashing
      isAdmin: true
    });
    
    // Add sample brands
    sampleBrands.forEach(brand => {
      const id = this.brandId++;
      this.brandsMap.set(id, { 
        ...brand, 
        id, 
        createdAt: new Date() 
      });
    });

    // Add sample categories
    sampleCategories.forEach(category => {
      const id = this.categoryId++;
      this.categoriesMap.set(id, { 
        ...category, 
        id, 
        description: `Collection of ${category.name.toLowerCase()}`,
        createdAt: new Date() 
      });
    });
    
    // Add sample products
    sampleProducts.forEach(product => {
      const id = this.productId++;
      const now = new Date();
      this.productsMap.set(id, { 
        ...product, 
        id,
        brandId: Math.ceil(Math.random() * this.brandId - 1) || 1,
        inStock: true,
        quantity: Math.floor(Math.random() * 100) + 1,
        createdAt: now,
        updatedAt: now
      });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async verifyUser(username: string, password: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username && user.password === password
    );
  }
  
  async getAllAdminUsers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.isAdmin);
  }
  
  // Brand methods
  async getAllBrands(): Promise<Brand[]> {
    return Array.from(this.brandsMap.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }

  async getBrandById(id: number): Promise<Brand | undefined> {
    return this.brandsMap.get(id);
  }

  async getBrandBySlug(slug: string): Promise<Brand | undefined> {
    return Array.from(this.brandsMap.values()).find(
      (brand) => brand.slug === slug
    );
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const id = this.brandId++;
    const now = new Date();
    const newBrand: Brand = { ...brand, id, createdAt: now };
    this.brandsMap.set(id, newBrand);
    return newBrand;
  }

  async updateBrand(id: number, data: Partial<InsertBrand>): Promise<Brand | undefined> {
    const brand = this.brandsMap.get(id);
    if (!brand) return undefined;
    
    const updatedBrand: Brand = { ...brand, ...data };
    this.brandsMap.set(id, updatedBrand);
    return updatedBrand;
  }

  async deleteBrand(id: number): Promise<boolean> {
    return this.brandsMap.delete(id);
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categoriesMap.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categoriesMap.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categoriesMap.values()).find(
      (category) => category.slug === slug
    );
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const now = new Date();
    const newCategory: Category = { ...category, id, createdAt: now };
    this.categoriesMap.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, data: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categoriesMap.get(id);
    if (!category) return undefined;
    
    const updatedCategory: Category = { ...category, ...data };
    this.categoriesMap.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categoriesMap.delete(id);
  }
  
  // Product methods
  async getProducts(options: {
    featured?: boolean;
    categories?: string[];
    brands?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<Product[]> {
    let filteredProducts = Array.from(this.productsMap.values());
    
    // Filter by featured
    if (options.featured) {
      filteredProducts = filteredProducts.filter(product => product.featured);
    }
    
    // Filter by categories
    if (options.categories && options.categories.length > 0) {
      // Get category IDs from slugs
      const categoryIds: number[] = [];
      for (const slug of options.categories) {
        const category = await this.getCategoryBySlug(slug);
        if (category) {
          categoryIds.push(category.id);
        }
      }
      
      if (categoryIds.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          categoryIds.includes(product.categoryId)
        );
      }
    }

    // Filter by brands
    if (options.brands && options.brands.length > 0) {
      // Get brand IDs from slugs
      const brandIds: number[] = [];
      for (const slug of options.brands) {
        const brand = await this.getBrandBySlug(slug);
        if (brand) {
          brandIds.push(brand.id);
        }
      }
      
      if (brandIds.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          product.brandId !== undefined && brandIds.includes(product.brandId)
        );
      }
    }
    
    // Filter by price range
    if (options.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => 
        product.price >= options.minPrice!
      );
    }
    
    if (options.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => 
        product.price <= options.maxPrice!
      );
    }
    
    // Filter by search query
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort products
    if (options.sortBy) {
      switch (options.sortBy) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case 'name-asc':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          // Default sorting: featured first, then newest
          filteredProducts.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          break;
      }
    } else {
      // Default sorting: featured first, then newest
      filteredProducts.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }
    
    // Apply pagination
    if (options.limit || options.offset) {
      const start = options.offset || 0;
      const end = options.limit ? start + options.limit : undefined;
      filteredProducts = filteredProducts.slice(start, end);
    }
    
    return filteredProducts;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.productsMap.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getProductCount(): Promise<number> {
    return this.productsMap.size;
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.productsMap.get(id);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.productsMap.values()).find(
      (product) => product.slug === slug
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const now = new Date();
    const newProduct: Product = { 
      ...product, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.productsMap.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.productsMap.get(id);
    if (!product) return undefined;
    
    const updateData = {...data};
    
    // If name is being updated but slug is not provided, generate slug from name
    if (data.name && !data.slug) {
      updateData.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    const updatedProduct: Product = { 
      ...product, 
      ...updateData,
      updatedAt: new Date()
    };
    this.productsMap.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.productsMap.delete(id);
  }
  
  // Contact submission methods
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissionsMap.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getContactSubmissionById(id: number): Promise<ContactSubmission | undefined> {
    return this.contactSubmissionsMap.get(id);
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.submissionId++;
    const now = new Date();
    const newSubmission: ContactSubmission = { 
      ...submission, 
      id, 
      createdAt: now,
      read: false
    };
    this.contactSubmissionsMap.set(id, newSubmission);
    return newSubmission;
  }

  async markContactSubmissionAsRead(id: number): Promise<boolean> {
    const submission = this.contactSubmissionsMap.get(id);
    if (!submission) return false;
    
    submission.read = true;
    this.contactSubmissionsMap.set(id, submission);
    return true;
  }

  async deleteContactSubmission(id: number): Promise<boolean> {
    return this.contactSubmissionsMap.delete(id);
  }
}

// Create and export the storage implementation based on environment
const useDatabase = process.env.DATABASE_URL !== undefined;
export const storage = useDatabase ? new DatabaseStorage() : new MemStorage();

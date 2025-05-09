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
  contactSubmissions,
  type ContactSubmission,
  type InsertContactSubmission
} from "@shared/schema";
import { sampleCategories, sampleProducts } from "./products";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  
  // Product methods
  getProducts(options?: {
    featured?: boolean;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    search?: string;
  }): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  
  // Contact submission methods
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categoriesMap: Map<number, Category>;
  private productsMap: Map<number, Product>;
  private contactSubmissionsMap: Map<number, ContactSubmission>;
  currentId: number;
  categoryId: number;
  productId: number;
  submissionId: number;

  constructor() {
    this.users = new Map();
    this.categoriesMap = new Map();
    this.productsMap = new Map();
    this.contactSubmissionsMap = new Map();
    this.currentId = 1;
    this.categoryId = 1;
    this.productId = 1;
    this.submissionId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample categories
    sampleCategories.forEach(category => {
      const id = this.categoryId++;
      this.categoriesMap.set(id, { ...category, id });
    });
    
    // Add sample products
    sampleProducts.forEach(product => {
      const id = this.productId++;
      this.productsMap.set(id, { ...product, id });
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categoriesMap.values());
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categoriesMap.values()).find(
      (category) => category.slug === slug
    );
  }
  
  // Product methods
  async getProducts(options: {
    featured?: boolean;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    search?: string;
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
          // For simplicity, we'll just sort by ID in reverse
          filteredProducts.sort((a, b) => b.id - a.id);
          break;
        case 'bestselling':
          // This would require sales data, so we'll just keep the default order
          break;
        // Default is 'featured', which we'll implement as a random order
        default:
          break;
      }
    }
    
    return filteredProducts;
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.productsMap.values()).find(
      (product) => product.slug === slug
    );
  }
  
  // Contact submission methods
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.submissionId++;
    const newSubmission: ContactSubmission = { ...submission, id };
    this.contactSubmissionsMap.set(id, newSubmission);
    return newSubmission;
  }
}

export const storage = new MemStorage();

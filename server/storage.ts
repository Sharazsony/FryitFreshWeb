import { 
  users, products, cartItems, orders, orderItems, contactMessages,
  type User, type InsertUser, 
  type Product, type InsertProduct,
  type CartItem, type InsertCartItem,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type ContactMessage, type InsertContactMessage
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Cart operations
  getCartItems(userId: number): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  
  // Order operations
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Contact operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  
  // Session store
  sessionStore: any; // Using any to avoid type issues with session store
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any type for session store
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
    
    // Initially check if we need to create an admin user
    this.initializeAdminUser();
    
    // Seed products if needed
    this.seedProductsIfEmpty();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username.toLowerCase()));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));
    return user;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db
      .insert(users)
      .values({
        ...user,
        username: user.username.toLowerCase(),
        email: user.email.toLowerCase()
      })
      .returning();
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product;
  }
  
  async getAllProducts(): Promise<Product[]> {
    return db.select().from(products);
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(eq(products.category, category));
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }
  
  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
  
  // Cart methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return db
      .select()
      .from(cartItems)
      .where(eq(cartItems.userId, userId));
  }
  
  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if this product is already in the cart
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, cartItem.userId),
          eq(cartItems.productId, cartItem.productId)
        )
      );
    
    if (existingItem) {
      // Update quantity instead of adding a new item
      return this.updateCartItemQuantity(existingItem.id, existingItem.quantity + cartItem.quantity) as Promise<CartItem>;
    }
    
    const [newCartItem] = await db
      .insert(cartItems)
      .values(cartItem)
      .returning();
    return newCartItem;
  }
  
  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updatedCartItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedCartItem;
  }
  
  async removeFromCart(id: number): Promise<boolean> {
    const result = await db
      .delete(cartItems)
      .where(eq(cartItems.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
  
  async clearCart(userId: number): Promise<boolean> {
    const result = await db
      .delete(cartItems)
      .where(eq(cartItems.userId, userId));
    return true;
  }
  
  // Order methods
  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    // Create the order
    const [newOrder] = await db
      .insert(orders)
      .values(order)
      .returning();
    
    // Add order items
    for (const item of items) {
      await db
        .insert(orderItems)
        .values({
          ...item,
          orderId: newOrder.id
        });
    }
    
    return newOrder;
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));
    return order;
  }
  
  async getUserOrders(userId: number): Promise<Order[]> {
    return db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }
  
  // Contact methods
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db
      .insert(contactMessages)
      .values(message)
      .returning();
    return newMessage;
  }
  
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }
  
  // Helper methods for initialization
  private async initializeAdminUser() {
    // Check if admin users exist
    const adminUser = await this.getUserByUsername("admin");
    const adminGmailUser = await this.getUserByEmail("admin@gmail.com");
    
    // Create default admin user if not exists
    if (!adminUser) {
      console.log("Creating default admin user...");
      await this.createUser({
        username: "admin",
        email: "admin@fruitfresh.com",
        password: "$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm", // 'password'
        firstName: "Admin",
        lastName: "User",
        role: "admin"
      });
    }
    
    // Create Gmail admin user if not exists
    if (!adminGmailUser) {
      console.log("Creating Gmail admin user...");
      // Create admin with email admin@gmail.com and password admin123
      await this.createUser({
        username: "adminGmail",
        email: "admin@gmail.com",
        password: "$2b$10$dh/iZwZ3vTjqsD7LlvGx2eqAeAm3sJv0lHQJWI4Z8MeClxVn9ZONu", // 'admin123'
        firstName: "Admin",
        lastName: "Gmail",
        role: "admin"
      });
    }
  }
  
  private async seedProductsIfEmpty() {
    // Check if there are any products
    const productCount = await db.select().from(products);
    if (productCount.length === 0) {
      console.log("Seeding initial products...");
      const productData: InsertProduct[] = [
        {
          name: "Organic Apples",
          description: "Fresh, locally grown organic apples. Perfect for eating or baking.",
          price: 399, // $3.99
          category: "fruits",
          imageUrl: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500",
          unit: "lb",
          stock: 50
        },
        {
          name: "Organic Carrots",
          description: "Sweet and crunchy organic carrots freshly harvested from local farms.",
          price: 249, // $2.49
          category: "vegetables",
          imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500",
          unit: "bunch",
          stock: 40
        },
        {
          name: "Organic Strawberries",
          description: "Sweet and juicy organic strawberries. Perfect for desserts or snacking.",
          price: 499, // $4.99
          category: "fruits",
          imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500",
          unit: "pint",
          stock: 30
        },
        {
          name: "Organic Spinach",
          description: "Fresh organic spinach, rich in nutrients and perfect for salads or cooking.",
          price: 349, // $3.49
          category: "vegetables",
          imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500",
          unit: "bunch",
          stock: 35
        },
        {
          name: "Organic Tomatoes",
          description: "Vine-ripened organic tomatoes, bursting with flavor and freshness.",
          price: 399, // $3.99
          category: "vegetables",
          imageUrl: "https://pixabay.com/get/g4fc77db397e07a75e917b446f202ea846ee51018bc165e6924e54bf8c205371f152ec6fa41b0d8af842f6ef7a37b4583_1280.jpg",
          unit: "lb",
          stock: 45
        },
        {
          name: "Organic Avocados",
          description: "Creamy, nutrient-rich organic avocados. Perfect for any meal or snack.",
          price: 299, // $2.99
          category: "fruits",
          imageUrl: "https://pixabay.com/get/g68ebe6159455aff2dacbb2ad22d588574d7f6433ea98a227fc8b456000401b3b82ae336b8f7597726ceaf1a817eb0890a42a27cedb57f13e9a9c7d1a494aa2ed_1280.jpg",
          unit: "each",
          stock: 38
        },
        {
          name: "Organic Kale",
          description: "Nutrient-dense organic kale, freshly harvested and ready for your healthy recipes.",
          price: 299, // $2.99
          category: "vegetables",
          imageUrl: "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500",
          unit: "bunch",
          stock: 25
        },
        {
          name: "Organic Blueberries",
          description: "Sweet, plump organic blueberries packed with antioxidants.",
          price: 599, // $5.99
          category: "fruits",
          imageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500",
          unit: "pint",
          stock: 20
        }
      ];
      
      // Insert each product
      for (const product of productData) {
        await this.createProduct(product);
      }
    }
  }
}

export const storage = new DatabaseStorage();

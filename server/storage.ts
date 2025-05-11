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
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
  sessionStore: session.SessionStore;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private userStore: Map<number, User>;
  private productStore: Map<number, Product>;
  private cartItemStore: Map<number, CartItem>;
  private orderStore: Map<number, Order>;
  private orderItemStore: Map<number, OrderItem>;
  private contactMessageStore: Map<number, ContactMessage>;
  
  sessionStore: session.SessionStore;
  
  private userId: number = 1;
  private productId: number = 1;
  private cartItemId: number = 1;
  private orderId: number = 1;
  private orderItemId: number = 1;
  private contactMessageId: number = 1;
  
  constructor() {
    this.userStore = new Map();
    this.productStore = new Map();
    this.cartItemStore = new Map();
    this.orderStore = new Map();
    this.orderItemStore = new Map();
    this.contactMessageStore = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24h
    });
    
    // Create admin user
    this.createUser({
      username: "admin",
      email: "admin@fruitfresh.com",
      password: "hashed_admin_password", // This will be hashed in auth.ts
      firstName: "Admin",
      lastName: "User",
      role: "admin"
    });
    
    // Seed some initial products
    this.seedProducts();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.userStore.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.userStore.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.userStore.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const timestamp = new Date();
    const newUser: User = { ...user, id };
    this.userStore.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.userStore.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.userStore.set(id, updatedUser);
    return updatedUser;
  }
  
  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    return this.productStore.get(id);
  }
  
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.productStore.values());
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.productStore.values()).filter(
      (product) => product.category === category
    );
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const newProduct: Product = { 
      ...product, 
      id,
      createdAt: new Date()
    };
    this.productStore.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.productStore.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.productStore.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.productStore.delete(id);
  }
  
  // Cart methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItemStore.values()).filter(
      (item) => item.userId === userId
    );
  }
  
  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if this product is already in the cart
    const existingItem = Array.from(this.cartItemStore.values()).find(
      (item) => item.userId === cartItem.userId && item.productId === cartItem.productId
    );
    
    if (existingItem) {
      // Update quantity instead of adding a new item
      return this.updateCartItemQuantity(existingItem.id, existingItem.quantity + cartItem.quantity) as Promise<CartItem>;
    }
    
    const id = this.cartItemId++;
    const newCartItem: CartItem = { 
      ...cartItem, 
      id,
      addedAt: new Date()
    };
    this.cartItemStore.set(id, newCartItem);
    return newCartItem;
  }
  
  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItemStore.get(id);
    if (!cartItem) return undefined;
    
    const updatedCartItem = { ...cartItem, quantity };
    this.cartItemStore.set(id, updatedCartItem);
    return updatedCartItem;
  }
  
  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItemStore.delete(id);
  }
  
  async clearCart(userId: number): Promise<boolean> {
    const cartItemsToDelete = Array.from(this.cartItemStore.values())
      .filter(item => item.userId === userId)
      .map(item => item.id);
    
    cartItemsToDelete.forEach(id => this.cartItemStore.delete(id));
    return true;
  }
  
  // Order methods
  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const id = this.orderId++;
    const newOrder: Order = { 
      ...order, 
      id,
      createdAt: new Date()
    };
    this.orderStore.set(id, newOrder);
    
    // Add order items
    items.forEach(item => {
      const orderItemId = this.orderItemId++;
      const newOrderItem: OrderItem = { 
        ...item, 
        orderId: id,
        id: orderItemId
      };
      this.orderItemStore.set(orderItemId, newOrderItem);
    });
    
    return newOrder;
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orderStore.get(id);
  }
  
  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orderStore.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orderStore.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orderStore.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Contact methods
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageId++;
    const newMessage: ContactMessage = { 
      ...message, 
      id,
      createdAt: new Date()
    };
    this.contactMessageStore.set(id, newMessage);
    return newMessage;
  }
  
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessageStore.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  // Helper method to seed initial products
  private seedProducts() {
    const products: InsertProduct[] = [
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
    
    products.forEach(product => this.createProduct(product));
  }
}

export const storage = new MemStorage();

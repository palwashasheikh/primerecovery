import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync("ecommerce.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    category TEXT,
    variants TEXT,
    options TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    firebase_order_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    variant_title TEXT,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

// Migration logic to add missing columns without deleting the database
function migrateDatabase() {
  const tableInfo = db.prepare("PRAGMA table_info(products)").all() as any[];
  const columns = tableInfo.map(c => c.name);
  
  if (!columns.includes("variants")) {
    console.log("Adding 'variants' column to products table...");
    db.exec("ALTER TABLE products ADD COLUMN variants TEXT");
  }
  
  if (!columns.includes("options")) {
    console.log("Adding 'options' column to products table...");
    db.exec("ALTER TABLE products ADD COLUMN options TEXT");
  }

  // Migrate order_items table
  const orderItemsInfo = db.prepare("PRAGMA table_info(order_items)").all() as any[];
  const orderItemsColumns = orderItemsInfo.map(c => c.name);
  if (!orderItemsColumns.includes("variant_title")) {
    console.log("Adding 'variant_title' column to order_items table...");
    db.exec("ALTER TABLE order_items ADD COLUMN variant_title TEXT");
  }
}

migrateDatabase();

async function syncProducts() {
  try {
    // Check if we already have products to avoid overwriting manual changes
    const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as any;
    if (productCount && productCount.count > 0) {
      console.log("Products already exist in database. Skipping automatic sync to preserve data.");
      return;
    }

    console.log("Fetching products from teckwave.com...");
    const response = await fetch("https://teckwave.com/products.json", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    
    const data = await response.json() as { products: any[] };
    
    if (data.products && data.products.length > 0) {
      db.exec("PRAGMA foreign_keys = OFF");
      const insertProduct = db.prepare(`
        INSERT OR REPLACE INTO products (id, name, description, price, image, category, variants, options) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      for (const product of data.products) {
        const id = product.id;
        const name = product.title;
        const description = product.body_html;
        // Convert USD/CAD price to AED (approx 3.67 multiplier)
        const rawPrice = parseFloat(product.variants?.[0]?.price || "0");
        const price = Math.round(rawPrice * 3.67); 
        const image = product.images?.[0]?.src || product.image?.src || "https://picsum.photos/seed/teckwave-placeholder/1200/800";
        const category = product.product_type;
        const variants = JSON.stringify(product.variants || []);
        const options = JSON.stringify(product.options || []);
        
        insertProduct.run(id, name, description, price, image, category, variants, options);
      }
      
      db.exec("PRAGMA foreign_keys = ON");
      console.log(`Successfully synced ${data.products.length} products.`);
    }
  } catch (error) {
    console.error("Error syncing products:", error);
  }
}

async function startServer() {
  // Sync products before starting the server
  await syncProducts();
  
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request Logger
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/products", (req, res) => {
    try {
      const products = db.prepare("SELECT * FROM products").all() as any[];
      const parsedProducts = products.map(p => ({
        ...p,
        variants: JSON.parse(p.variants || '[]'),
        options: JSON.parse(p.options || '[]')
      }));
      res.json(parsedProducts);
    } catch (error) {
      console.error("Database error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/orders", (req, res) => {
    const { customerName, customerEmail, items, totalAmount, firebaseOrderId } = req.body;
    
    try {
      db.exec("BEGIN TRANSACTION");
      
      const orderResult = db.prepare("INSERT INTO orders (customer_name, customer_email, total_amount, firebase_order_id) VALUES (?, ?, ?, ?)")
        .run(customerName, customerEmail, totalAmount, firebaseOrderId || null);
      
      const orderId = orderResult.lastInsertRowid;
      const insertItem = db.prepare("INSERT INTO order_items (order_id, product_id, variant_title, quantity, price) VALUES (?, ?, ?, ?, ?)");
      
      for (const item of items) {
        insertItem.run(orderId, item.id, item.selectedVariant?.title || null, item.quantity, item.price);
      }
      
      db.exec("COMMIT");
      res.status(201).json({ success: true, orderId: Number(orderId) });
    } catch (error) {
      db.exec("ROLLBACK");
      console.error("Order error:", error);
      res.status(500).json({ success: false, error: "Failed to place order" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

import db from './db';

// Ejecutar inicialización de tablas solo una vez
export function initializeDatabase() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS pizzas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS offers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pizza_id INTEGER NOT NULL,
        discount_percentage REAL NOT NULL,
        discount_fixed REAL,
        start_date DATETIME,
        end_date DATETIME,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pizza_id) REFERENCES pizzas(id)
      );
      
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pizza_id INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pizza_id) REFERENCES pizzas(id)
      );
    `);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

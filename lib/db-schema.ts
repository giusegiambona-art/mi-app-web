import db from './db';

// Inicializar tabla de pizzas
export function initializePizzasTable() {
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
  `);
}

// Inicializar tabla de ofertas
export function initializeOffersTable() {
  db.exec(`
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
  `);
}

// Inicializar tabla de imagenes
export function initializeImagesTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pizza_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pizza_id) REFERENCES pizzas(id)
    );
  `);
}

// Inicializar todo
export function initializeDatabase() {
  initializePizzasTable();
  initializeOffersTable();
  initializeImagesTable();
}

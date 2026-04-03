# 🔌 API Reference

## Autenticación

### Login
```
POST /api/admin/login

{
  "key": "tu_clave_admin"
}

Response:
{
  "success": true
}
// También establece cookie: admin_token
```

---

## Pizzas

### Obtener todas las pizzas
```
GET /api/admin/pizzas

Response:
[
  {
    "id": 1,
    "name": "Margherita",
    "description": "Tomate, mozzarella, albahaca",
    "price": 12.50,
    "image_url": "/uploads/...",
    "active_offers": 1,
    "created_at": "2024-04-03..."
  }
]
```

### Crear pizza
```
POST /api/admin/pizzas

{
  "name": "Pizza Pepperoni",
  "description": "Limón y tomate",
  "price": 14.99,
  "image_url": "" // opcional
}

Response:
{
  "id": 2,
  "name": "Pizza Pepperoni",
  ...
}
```

### Actualizar pizza
```
PUT /api/admin/pizzas

{
  "id": 1,
  "name": "Margherita Premium",
  "description": "Nuevo texto",
  "price": 15.00,
  "image_url": "/uploads/..."
}

Response:
{
  "success": true
}
```

### Eliminar pizza
```
DELETE /api/admin/pizzas?id=1

Response:
{
  "success": true
}
```

---

## Ofertas

### Obtener todas las ofertas
```
GET /api/admin/offers

Response:
[
  {
    "id": 1,
    "pizza_id": 1,
    "pizza_name": "Margherita",
    "price": 12.50,
    "discount_percentage": 20,
    "discount_fixed": 0,
    "start_date": "2024-04-03...",
    "end_date": "2024-04-10...",
    "is_active": true
  }
]
```

### Crear oferta
```
POST /api/admin/offers

{
  "pizza_id": 1,
  "discount_percentage": 20,
  "discount_fixed": 0,
  "start_date": "2024-04-03T10:00:00",
  "end_date": "2024-04-10T23:59:59"
}

Response:
{
  "id": 1,
  "pizza_id": 1,
  ...
}
```

### Actualizar oferta
```
PUT /api/admin/offers

{
  "id": 1,
  "discount_percentage": 25,
  "discount_fixed": 0,
  "start_date": "2024-04-03T10:00:00",
  "end_date": "2024-04-15T23:59:59",
  "is_active": true
}

Response:
{
  "success": true
}
```

### Eliminar oferta
```
DELETE /api/admin/offers?id=1

Response:
{
  "success": true
}
```

---

## Imágenes

### Subir imagen
```
POST /api/admin/upload

Content-Type: multipart/form-data

body:
  - file: <image file>
  - pizza_id: 1

Response:
{
  "success": true,
  "url": "/uploads/1-1234567890-pizza.jpg",
  "filename": "1-1234567890-pizza.jpg"
}
```

### Obtener imágenes de una pizza
```
GET /api/admin/upload?pizza_id=1

Response:
[
  {
    "id": 1,
    "pizza_id": 1,
    "image_url": "/uploads/...",
    "created_at": "2024-04-03..."
  }
]
```

---

## Pizzas Públicas (sin autenticación)

### Obtener todas las pizzas
```
GET /api/pizzas

Response:
[
  {
    "id": 1,
    "name": "Margherita",
    "description": "Tomate, mozzarella, albahaca",
    "price": 12.50,
    "image_url": "/uploads/...",
    "discount": 20,         // null si no hay oferta
    "has_offer": true       // boolean
  }
]
```

---

## Códigos de Error

| Código | Mensaje | Solución |
|--------|---------|----------|
| 400 | Parámetros requeridos | Verifica que enviaste todos los campos |
| 401 | No autorizado | Haz login primero en /admin |
| 500 | Error en el servidor | Revisa los logs de Next.js |

---

## Ejemplos con curl

### Login
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"key":"admin123"}' \
  -c cookies.txt
```

### Crear pizza
```bash
curl -X POST http://localhost:3000/api/admin/pizzas \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Hawaiana",
    "description": "Piña y jamón",
    "price": 13.99
  }'
```

### Obtener pizzas públicas
```bash
curl http://localhost:3000/api/pizzas
```

---

## Ejemplo con JavaScript/Fetch

```javascript
// Login
const loginRes = await fetch('/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'admin123' })
});

// Crear pizza (después de login)
const pizzaRes = await fetch('/api/admin/pizzas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Hawaiana',
    description: 'Piña y jamón',
    price: 13.99
  })
});

const newPizza = await pizzaRes.json();
console.log(newPizza.id); // ID de la nueva pizza

// Subir imagen
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('pizza_id', newPizza.id);

const uploadRes = await fetch('/api/admin/upload', {
  method: 'POST',
  body: formData
});
```

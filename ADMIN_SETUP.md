# 🍕 Sistema de Administración - Pizzería WhatsApp

## Configuración Inicial

### 1. **Variables de Entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
ADMIN_KEY=tu_clave_super_segura_aqui
```

Cambia `tu_clave_super_segura_aqui` por una clave fuerte. Ejemplo:
```
ADMIN_KEY=PizzaMaster2024!#@$
```

### 2. **Acceder al Panel de Administración**

1. Ve a `http://localhost:3000/admin`
2. Ingresa la clave que configuraste en `ADMIN_KEY`
3. ¡Acceso concedido!

## Funcionalidades

### 🍕 Gestión de Pizzas

#### Crear Pizza
- Rellena el formulario con:
  - **Nombre**: Nombre de la pizza
  - **Descripción**: Ingredientes y detalles
  - **Precio**: Precio en tu moneda
- Haz clic en "Crear"

#### Subir Foto
- Una vez creada la pizza, puedes subir una imagen
- La imagen se guarda automáticamente

#### Editar Pizza
- Haz clic en "Editar" en la tarjeta de la pizza
- Modifica los datos
- Haz clic en "Actualizar"

#### Eliminar Pizza
- Haz clic en "Eliminar"
- Confirma la acción

### 🏷️ Gestión de Ofertas

#### Crear Oferta
- **Pizza**: Selecciona a cuál pizza aplicar
- **Descuento %**: Descuento porcentual (ej: 20 = 20%)
- **Descuento $**: Descuento fijo en dinero
- **Fecha inicio**: Cuándo empieza la oferta
- **Fecha fin**: Cuándo termina la oferta
- **Activa**: Marca si está disponible

#### Editar Oferta
- Haz clic en "Editar"
- Modifica los parámetros
- Haz clic en "Actualizar"

#### Eliminar Oferta
- Haz clic en "Eliminar"
- Confirma la acción

## Seguridad

### Autenticación
- ✅ Sistema de clave única
- ✅ Tokens con expiración (24 horas)
- ✅ Cookies seguras (HttpOnly, SameSite)

### Protección de Rutas
- Todas las API de administración requieren autenticación
- Las claves se hashean con SHA256
- Los tokens se validan en cada petición

### Mejoras Recomendadas (Producción)
- [ ] Use HTTPS obligatorio
- [ ] Agregue 2FA (autenticación de dos factores)
- [ ] Implemente rate limiting en login
- [ ] Use contraseñas más fuertes
- [ ] Agregue logs de auditoría
- [ ] Use un servicio de almacenamiento en la nube (Cloudinary, S3)

## Estructura de Base de Datos

### Tabla: pizzas
```sql
id (INTEGER, PRIMARY KEY)
name (TEXT)
description (TEXT)
price (REAL)
image_url (TEXT)
created_at (DATETIME)
updated_at (DATETIME)
```

### Tabla: offers
```sql
id (INTEGER, PRIMARY KEY)
pizza_id (INTEGER, FOREIGN KEY)
discount_percentage (REAL)
discount_fixed (REAL)
start_date (DATETIME)
end_date (DATETIME)
is_active (BOOLEAN)
created_at (DATETIME)
```

### Tabla: images
```sql
id (INTEGER, PRIMARY KEY)
pizza_id (INTEGER, FOREIGN KEY)
image_url (TEXT)
created_at (DATETIME)
```

## API Endpoints

### Autenticación
- `POST /api/admin/login` - Login con clave

### Pizzas
- `GET /api/admin/pizzas` - Obtener todas las pizzas
- `POST /api/admin/pizzas` - Crear pizza
- `PUT /api/admin/pizzas` - Actualizar pizza
- `DELETE /api/admin/pizzas?id=X` - Eliminar pizza

### Ofertas
- `GET /api/admin/offers` - Obtener todas las ofertas
- `POST /api/admin/offers` - Crear oferta
- `PUT /api/admin/offers` - Actualizar oferta
- `DELETE /api/admin/offers?id=X` - Eliminar oferta

### Imágenes
- `POST /api/admin/upload` - Subir imagen
- `GET /api/admin/upload?pizza_id=X` - Obtener imágenes

## Solución de Problemas

### "Clave incorrecta"
- Verifica que `ADMIN_KEY` está configurada en `.env.local`
- Reinicia el servidor: `npm run dev`
- Asegúrate de que la clave es correcta

### Las imágenes no se suben
- Verifica que la carpeta `public/uploads` existe
- Comprueba permisos de escritura
- Asegúrate que el archivo es una imagen válida

### Token expirado
- Los tokens expiran después de 24 horas
- Vuelve a login en `/admin`

## Próximas Mejoras

- [ ] Integración con WhatsApp Business API
- [ ] Gestión de pedidos
- [ ] Sistema de pagos
- [ ] Notificaciones automáticas
- [ ] Historial de vendas
- [ ] Estadísticas y reportes

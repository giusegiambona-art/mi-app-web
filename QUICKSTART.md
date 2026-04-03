# 🍕 Quick Start - Panel de Administración

## 1️⃣ Configuración (2 minutos)

### Paso 1: Crear archivo `.env.local`
En la raíz del proyecto, crea un archivo llamado `.env.local` con:

```bash
ADMIN_KEY=tu_clave_segura_aqui
```

**Ejemplos de claves seguras:**
- `PizzaMaster2024!@#`
- `AdminPizza_SecurePass123`
- `MyPizzaShop#2024Admin`

### Paso 2: Asegúrate que el servidor está corriendo
```bash
npm run dev
```

Deberías ver:
```
✓ Ready in XXXms
- Local: http://localhost:3000
```

## 2️⃣ Acceder al Panel

Ve a: **http://localhost:3000/admin**

Ingresa tu clave (la que configuraste en `.env.local`)

## 3️⃣ Crear tu Primera Pizza

1. En la pestaña "Pizzas", rellena:
   - **Nombre**: "Margherita"
   - **Descripción**: "Tomate, mozzarella fresca, albahaca"
   - **Precio**: "12.50"

2. Haz clic en "Crear"

3. Luego, sube una foto haciendo clic en "Selecciona archivo"

## 4️⃣ Crear una Oferta

1. Ve a la pestaña "Ofertas"

2. Selecciona la pizza que creaste

3. Ingresa un descuento:
   - **Descuento %**: "20" (para 20% off)
   - O **Descuento €**: "2.50" (para quitar €2.50)

4. Haz clic en "Crear"

## 5️⃣ Ver en el Catálogo Público

Ve a: **http://localhost:3000**

Deberías ver tu pizza con su imagen y oferta

---

## 📁 Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `.env.local` | Tu clave de admin (⚠️ NO subir a git) |
| `app/admin/` | Interfaz del admin |
| `app/api/admin/` | APIs protegidas |
| `lib/auth.ts` | Sistema de autenticación |
| `lib/db-schema.ts` | Esquema de base de datos |
| `ADMIN_SETUP.md` | Documentación completa |

---

## 🔐 Seguridad Important

### ✅ Lo que está protegido:
- Panel admin requiere clave
- Tokens expiran en 24 horas
- Cookies son HttpOnly (no se pueden acceder desde JS)
- Claves se hashean con SHA256

### ⚠️ Lo que debes hacer:
```bash
# 1. NUNCA subas .env.local a git
# (ya está en .gitignore, pero revisa antes de push)

# 2. Cambia ADMIN_KEY en producción
# Usa algo como: openssl rand -base64 32

# 3. Usa HTTPS en producción
```

---

## 🐛 Solucionar Problemas

### "Clave incorrecta"
```bash
# Verifica que .env.local exista
ls .env.local

# Reinicia el servidor
npm run dev
```

### Las imágenes no se suben
```bash
# Crea la carpeta de uploads
mkdir -p public/uploads

# O reinicia el servidor (se crea automáticamente)
```

### "No autorizado" en APIs
- Asegúrate que has ingresado correctamente en `/admin`
- Los cookies pueden haber expirado (24h)
- Vuelve a hacer login

---

## 📞 Próximos Pasos

Después de configurar el admin, puedes:

1. **Integrar WhatsApp** (en progreso)
   - Conectar con WhatsApp Business API
   - Recibir pedidos por WhatsApp

2. **Sistema de Pedidos**
   - Guardar pedidos en BD
   - Mostrar historial

3. **Pagos** (opcional)
   - Integrar Stripe o MercadoPago
   - Confirmar pagos automáticamente

4. **Notificaciones**
   - Email confirmación
   - SMS notifications

---

## 📚 Documentación Completa

Para más detalles, ve a [ADMIN_SETUP.md](ADMIN_SETUP.md)

¿Necesitas ayuda? Revisa los logs en la consola de Next.js.

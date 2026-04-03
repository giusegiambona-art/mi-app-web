import crypto from 'crypto';

// La clave de administrador (DEBE estar en variables de entorno en producción)
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin123';

// Crear un hash SHA256 de la clave
function hashKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

// Verificar la clave de administrador
export function verifyAdminKey(key: string): boolean {
  const hashedInput = hashKey(key);
  const hashedStored = hashKey(ADMIN_KEY);
  return hashedInput === hashedStored;
}

// Crear un JWT simple (sin librerías externas)
export function createAdminToken(): string {
  const payload = {
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
  };
  
  // Base64 encode del payload
  const token = Buffer.from(JSON.stringify(payload)).toString('base64');
  return token;
}

// Verificar token
export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const now = Math.floor(Date.now() / 1000);
    
    if (decoded.exp < now) {
      return false; // Token expirado
    }
    
    return decoded.role === 'admin';
  } catch {
    return false;
  }
}

// Middleware para proteger rutas
export function getAdminFromRequest(request: Request): string | null {
  const cookie = request.headers.get('cookie');
  if (!cookie) return null;
  
  const tokens = cookie.split(';');
  const adminToken = tokens.find(t => t.trim().startsWith('admin_token='));
  
  if (!adminToken) return null;
  
  const token = adminToken.split('=')[1];
  if (!verifyAdminToken(token)) return null;
  
  return token;
}

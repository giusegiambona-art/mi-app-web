import { getAdminFromRequest } from '@/lib/auth';
import db from '@/lib/db';
import fs from 'fs';
import path from 'path';

function requireAdmin(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    throw new Error('No autorizado');
  }
}

// POST - Subir imagen
export async function POST(request: Request) {
  try {
    requireAdmin(request);
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pizzaId = formData.get('pizza_id') as string;
    
    if (!file || !pizzaId) {
      return Response.json(
        { error: 'Archivo y pizza_id requeridos' },
        { status: 400 }
      );
    }
    
    // Crear directorio público si no existe
    const publicDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const filename = `${pizzaId}-${timestamp}-${file.name}`;
    const filepath = path.join(publicDir, filename);
    
    // Guardar archivo
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    
    // Guardar URL en BD
    const imageUrl = `/uploads/${filename}`;
    
    // Actualizar pizza con la imagen
    db.prepare(`
      UPDATE pizzas SET image_url = ? WHERE id = ?
    `).run(imageUrl, pizzaId);
    
    // También guardar en tabla de imágenes para historial
    db.prepare(`
      INSERT INTO images (pizza_id, image_url) VALUES (?, ?)
    `).run(pizzaId, imageUrl);
    
    return Response.json({
      success: true,
      url: imageUrl,
      filename
    });
  } catch (error) {
    console.error('Error en upload:', error);
    return Response.json(
      { error: 'Error al subir archivo' },
      { status: 500 }
    );
  }
}

// GET - Obtener todas las imágenes de una pizza
export async function GET(request: Request) {
  try {
    requireAdmin(request);
    
    const url = new URL(request.url);
    const pizzaId = url.searchParams.get('pizza_id');
    
    if (!pizzaId) {
      return Response.json(
        { error: 'pizza_id requerido' },
        { status: 400 }
      );
    }
    
    const images = db.prepare(`
      SELECT * FROM images WHERE pizza_id = ? ORDER BY created_at DESC
    `).all(pizzaId);
    
    return Response.json(images);
  } catch (error) {
    return Response.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }
}

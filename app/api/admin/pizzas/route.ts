import { getAdminFromRequest } from '@/lib/auth';
import db from '@/lib/db';

// Verificar que el usuario es admin
function requireAdmin(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    throw new Error('No autorizado');
  }
}

// GET - Obtener todas las pizzas
export async function GET(request: Request) {
  try {
    requireAdmin(request);
    
    const pizzas = db.prepare(`
      SELECT p.*, 
             (SELECT COUNT(*) FROM offers WHERE pizza_id = p.id AND is_active = 1) as active_offers
      FROM pizzas p
      ORDER BY p.id DESC
    `).all();
    
    return Response.json(pizzas);
  } catch (error) {
    return Response.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }
}

// POST - Crear nueva pizza
export async function POST(request: Request) {
  try {
    requireAdmin(request);
    
    const body = await request.json();
    const { name, description, price, image_url } = body;
    
    if (!name || price === undefined) {
      return Response.json(
        { error: 'Nombre y precio requeridos' },
        { status: 400 }
      );
    }
    
    const result = db.prepare(`
      INSERT INTO pizzas (name, description, price, image_url)
      VALUES (?, ?, ?, ?)
    `).run(name, description || '', price, image_url || '');
    
    return Response.json({
      id: result.lastInsertRowid,
      name,
      description,
      price,
      image_url
    });
  } catch (error) {
    return Response.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }
}

// PUT - Actualizar pizza
export async function PUT(request: Request) {
  try {
    requireAdmin(request);
    
    const body = await request.json();
    const { id, name, description, price, image_url } = body;
    
    if (!id) {
      return Response.json(
        { error: 'ID requerido' },
        { status: 400 }
      );
    }
    
    db.prepare(`
      UPDATE pizzas 
      SET name = ?, description = ?, price = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, description || '', price, image_url || '', id);
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }
}

// DELETE - Eliminar pizza
export async function DELETE(request: Request) {
  try {
    requireAdmin(request);
    
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return Response.json(
        { error: 'ID requerido' },
        { status: 400 }
      );
    }
    
    // Eliminar ofertas asociadas
    db.prepare('DELETE FROM offers WHERE pizza_id = ?').run(id);
    
    // Eliminar imágenes asociadas
    db.prepare('DELETE FROM images WHERE pizza_id = ?').run(id);
    
    // Eliminar pizza
    db.prepare('DELETE FROM pizzas WHERE id = ?').run(id);
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }
}

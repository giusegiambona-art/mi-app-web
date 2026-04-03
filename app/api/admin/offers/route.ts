import { getAdminFromRequest } from '@/lib/auth';
import db from '@/lib/db';

function requireAdmin(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    throw new Error('No autorizado');
  }
}

// GET - Obtener todas las ofertas
export async function GET(request: Request) {
  try {
    requireAdmin(request);
    
    const offers = db.prepare(`
      SELECT o.*, p.name as pizza_name, p.price
      FROM offers o
      JOIN pizzas p ON o.pizza_id = p.id
      ORDER BY o.id DESC
    `).all();
    
    return Response.json(offers);
  } catch (error) {
    return Response.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }
}

// POST - Crear nueva oferta
export async function POST(request: Request) {
  try {
    requireAdmin(request);
    
    const body = await request.json();
    const { pizza_id, discount_percentage, discount_fixed, start_date, end_date } = body;
    
    if (!pizza_id || (!discount_percentage && !discount_fixed)) {
      return Response.json(
        { error: 'pizza_id y descuento requeridos' },
        { status: 400 }
      );
    }
    
    const result = db.prepare(`
      INSERT INTO offers (pizza_id, discount_percentage, discount_fixed, start_date, end_date, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `).run(pizza_id, discount_percentage || 0, discount_fixed || 0, start_date || null, end_date || null);
    
    return Response.json({
      id: result.lastInsertRowid,
      pizza_id,
      discount_percentage,
      discount_fixed,
      start_date,
      end_date,
      is_active: true
    });
  } catch (error) {
    return Response.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }
}

// PUT - Actualizar oferta
export async function PUT(request: Request) {
  try {
    requireAdmin(request);
    
    const body = await request.json();
    const { id, discount_percentage, discount_fixed, start_date, end_date, is_active } = body;
    
    if (!id) {
      return Response.json(
        { error: 'ID requerido' },
        { status: 400 }
      );
    }
    
    db.prepare(`
      UPDATE offers 
      SET discount_percentage = ?, discount_fixed = ?, start_date = ?, end_date = ?, is_active = ?
      WHERE id = ?
    `).run(discount_percentage || 0, discount_fixed || 0, start_date || null, end_date || null, is_active ? 1 : 0, id);
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }
}

// DELETE - Eliminar oferta
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
    
    db.prepare('DELETE FROM offers WHERE id = ?').run(id);
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }
}

import db from '@/lib/db';

// Este endpoint devuelve todas las pizzas disponibles
// Útil para mostrar en el catálogo público
export async function GET() {
  try {
    const pizzas = db.prepare(`
      SELECT p.*, 
             (SELECT discount_percentage FROM offers 
              WHERE pizza_id = p.id AND is_active = 1 LIMIT 1) as discount,
             (SELECT COUNT(*) FROM offers 
              WHERE pizza_id = p.id AND is_active = 1) as has_offer
      FROM pizzas p
      ORDER BY p.id
    `).all();
    
    return Response.json(pizzas);
  } catch (error) {
    return Response.json(
      { error: 'Error al obtener pizzas' },
      { status: 500 }
    );
  }
}

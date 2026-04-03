import { verifyAdminKey, createAdminToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key) {
      return Response.json(
        { error: 'Clave requerida' },
        { status: 400 }
      );
    }

    if (!verifyAdminKey(key)) {
      return Response.json(
        { error: 'Clave de administrador incorrecta' },
        { status: 401 }
      );
    }

    const token = createAdminToken();

    const response = Response.json({ success: true });

    // Establer cookie segura
    response.headers.set(
      'Set-Cookie',
      `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
    );

    return response;
  } catch (error) {
    return Response.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
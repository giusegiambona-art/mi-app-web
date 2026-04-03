'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar si hay token en cookies
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/pizzas', {
          method: 'GET',
        });
        
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });
      
      if (response.ok) {
        setIsLoggedIn(true);
        setKey('');
      } else {
        const data = await response.json();
        setError(data.error || 'Error de autenticación');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleLogout = () => {
    // Eliminar cookie
    document.cookie = 'admin_token=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setIsLoggedIn(false);
    router.push('/admin');
  };

  if (isLoggedIn === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Verificando autenticación...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Panel de Administración</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-2">
                Clave de Administrador
              </label>
              <input
                id="key"
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Ingresa tu clave"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Acceder
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">🍕 Admin Pizzería - Precios en €</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}

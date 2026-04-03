'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  discount: number | null;
  has_offer: boolean;
}

export default function Home() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pizzas')
      .then(res => res.json())
      .then(setPizzas)
      .finally(() => setLoading(false));
  }, []);

  const calculatePrice = (pizza: Pizza) => {
    if (pizza.discount) {
      return (pizza.price * (1 - pizza.discount / 100)).toFixed(2);
    }
    return pizza.price.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-red-600">🍕 Pizzería Online</h1>
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
          >
            Admin
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestras Pizzas</h2>
          <p className="text-xl text-gray-600">Elige tu favita y pide por WhatsApp</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Cargando pizzas...</div>
        ) : pizzas.length === 0 ? (
          <div className="text-center text-gray-600">No hay pizzas disponibles</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pizzas.map((pizza) => (
              <div
                key={pizza.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* Imagen */}
                {pizza.image_url ? (
                  <img
                    src={pizza.image_url}
                    alt={pizza.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl">🍕</span>
                  </div>
                )}

                {/* Oferta badge */}
                {pizza.has_offer && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ¡OFERTA!
                  </div>
                )}

                {/* Contenido */}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pizza.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{pizza.description}</p>

                  {/* Precio */}
                  <div className="mb-4">
                    {pizza.has_offer && pizza.discount ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-green-600">
                          ${calculatePrice(pizza)}
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                          ${pizza.price.toFixed(2)}
                        </span>
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                          -{pizza.discount}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900">
                        ${pizza.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Botón WhatsApp */}
                  <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-semibold flex items-center justify-center gap-2">
                    <span>💬</span>
                    Pedir por WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
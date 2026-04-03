'use client';

import { useState, useEffect } from 'react';

interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  active_offers: number;
}

interface Offer {
  id: number;
  pizza_id: number;
  pizza_name: string;
  discount_percentage: number;
  discount_fixed: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  price: number;
}

export default function AdminPage() {
  const [tab, setTab] = useState<'pizzas' | 'offers'>('pizzas');
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estado para formulario de pizza
  const [formPizza, setFormPizza] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    image_url: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editingPizza, setEditingPizza] = useState<number | null>(null);

  // Estado para formulario de oferta
  const [formOffer, setFormOffer] = useState({
    id: '',
    pizza_id: '',
    discount_percentage: '',
    discount_fixed: '',
    start_date: '',
    end_date: '',
    is_active: true
  });
  const [editingOffer, setEditingOffer] = useState<number | null>(null);

  // Cargar pizzas
  useEffect(() => {
    if (tab === 'pizzas') {
      loadPizzas();
    }
  }, [tab]);

  // Cargar ofertas
  useEffect(() => {
    if (tab === 'offers') {
      loadOffers();
    }
  }, [tab]);

  const loadPizzas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/pizzas', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setPizzas(data);
      }
    } catch (err) {
      setError('Error al cargar pizzas');
    } finally {
      setLoading(false);
    }
  };

  const loadOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/offers', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (err) {
      setError('Error al cargar ofertas');
    } finally {
      setLoading(false);
    }
  };

  // Guardar pizza
  const handleSavePizza = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const method = editingPizza ? 'PUT' : 'POST';
      const body = {
        ...formPizza,
        id: editingPizza || undefined,
        price: parseFloat(formPizza.price)
      };

      const response = await fetch('/api/admin/pizzas', {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const pizzaData = await response.json();
        const pizzaId = pizzaData.id || editingPizza;

        // Si hay una imagen seleccionada, subirla
        if (selectedImage && pizzaId) {
          try {
            await uploadImageForPizza(selectedImage, pizzaId);
          } catch (err) {
            setError('Error al subir imagen');
            return;
          }
        }

        setFormPizza({ id: '', name: '', description: '', price: '', image_url: '' });
        setSelectedImage(null);
        setEditingPizza(null);
        loadPizzas();
      } else {
        const data = await response.json();
        setError(data.error || 'Error al guardar');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  // Editar pizza
  const handleEditPizza = (pizza: Pizza) => {
    setFormPizza({
      id: pizza.id.toString(),
      name: pizza.name,
      description: pizza.description,
      price: pizza.price.toString(),
      image_url: pizza.image_url
    });
    setSelectedImage(null); // Reset selected image when editing
    setEditingPizza(pizza.id);
  };

  // Eliminar pizza
  const handleDeletePizza = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta pizza?')) {
      try {
        const response = await fetch(`/api/admin/pizzas?id=${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          loadPizzas();
        } else {
          setError('Error al eliminar');
        }
      } catch (err) {
        setError('Error de conexión');
      }
    }
  };

  // Guardar oferta
  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const method = editingOffer ? 'PUT' : 'POST';
      const body = {
        ...formOffer,
        id: editingOffer || undefined,
        discount_percentage: parseFloat(formOffer.discount_percentage) || 0,
        discount_fixed: parseFloat(formOffer.discount_fixed) || 0,
        pizza_id: parseInt(formOffer.pizza_id)
      };

      const response = await fetch('/api/admin/offers', {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setFormOffer({
          id: '',
          pizza_id: '',
          discount_percentage: '',
          discount_fixed: '',
          start_date: '',
          end_date: '',
          is_active: true
        });
        setEditingOffer(null);
        loadOffers();
      } else {
        const data = await response.json();
        setError(data.error || 'Error al guardar');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  // Editar oferta
  const handleEditOffer = (offer: Offer) => {
    setFormOffer({
      id: offer.id.toString(),
      pizza_id: offer.pizza_id.toString(),
      discount_percentage: offer.discount_percentage.toString(),
      discount_fixed: offer.discount_fixed.toString(),
      start_date: offer.start_date || '',
      end_date: offer.end_date || '',
      is_active: offer.is_active
    });
    setEditingOffer(offer.id);
  };

  // Eliminar oferta
  const handleDeleteOffer = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
      try {
        const response = await fetch(`/api/admin/offers?id=${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          loadOffers();
        } else {
          setError('Error al eliminar');
        }
      } catch (err) {
        setError('Error de conexión');
      }
    }
  };

  // Subir imagen para una pizza específica
  const uploadImageForPizza = async (file: File, pizzaId: number) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pizza_id', pizzaId.toString());

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        console.error('Error al subir imagen', data || response.status);
        throw new Error('Error al subir imagen');
      }

      const json = await response.json();
      return json;
    } catch (err) {
      console.error('Error al subir imagen:', err);
      throw err;
    }
  };

  // Subir imagen (para pizzas existentes)
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, pizzaId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadImageForPizza(file, pizzaId);
      loadPizzas();
    } catch (err) {
      setError('Error al subir imagen');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setTab('pizzas')}
          className={`px-4 py-3 font-medium transition ${
            tab === 'pizzas'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pizzas
        </button>
        <button
          onClick={() => setTab('offers')}
          className={`px-4 py-3 font-medium transition ${
            tab === 'offers'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Ofertas
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* TAB: PIZZAS */}
      {tab === 'pizzas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">
                {editingPizza ? 'Editar Pizza' : 'Nueva Pizza'}
              </h2>

              <form onSubmit={handleSavePizza} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={formPizza.name}
                  onChange={(e) => setFormPizza({ ...formPizza, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />

                <textarea
                  placeholder="Descripción"
                  value={formPizza.description}
                  onChange={(e) => setFormPizza({ ...formPizza, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />

                <input
                  type="number"
                  placeholder="Precio (€)"
                  value={formPizza.price}
                  onChange={(e) => setFormPizza({ ...formPizza, price: e.target.value })}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />

                {/* Campo de imagen */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Foto de la pizza (opcional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setSelectedImage(file || null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {selectedImage && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Vista previa"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedImage.name}
                      </p>
                    </div>
                  )}
                  {editingPizza && formPizza.image_url && !selectedImage && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Imagen actual:</p>
                      <img
                        src={formPizza.image_url}
                        alt="Imagen actual"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingPizza ? 'Actualizar' : 'Crear'}
                </button>

                {editingPizza && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPizza(null);
                      setFormPizza({ id: '', name: '', description: '', price: '', image_url: '' });
                      setSelectedImage(null);
                    }}
                    className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Lista de pizzas */}
          <div className="lg:col-span-2">
            {loading ? (
              <p>Cargando...</p>
            ) : pizzas.length === 0 ? (
              <p className="text-gray-600">No hay pizzas creadas</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pizzas.map((pizza) => (
                  <div key={pizza.id} className="bg-white p-4 rounded-lg shadow-md">
                    {pizza.image_url && (
                      <img
                        src={pizza.image_url}
                        alt={pizza.name}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                    )}

                    <div className="mb-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadImage(e, pizza.id)}
                        className="w-full text-sm"
                      />
                    </div>

                    <h3 className="font-bold text-lg">{pizza.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{pizza.description}</p>
                    <p className="text-2xl font-bold text-blue-600 mb-2">€{pizza.price}</p>
                    <p className="text-xs text-gray-500 mb-3">
                      {pizza.active_offers} oferta(s) activa(s)
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPizza(pizza)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletePizza(pizza.id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: OFERTAS */}
      {tab === 'offers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">
                {editingOffer ? 'Editar Oferta' : 'Nueva Oferta'}
              </h2>

              <form onSubmit={handleSaveOffer} className="space-y-4">
                <select
                  value={formOffer.pizza_id}
                  onChange={(e) => setFormOffer({ ...formOffer, pizza_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Selecciona una pizza</option>
                  {pizzas.map((pizza) => (
                    <option key={pizza.id} value={pizza.id}>
                      {pizza.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Descuento por porcentaje (%)"
                  value={formOffer.discount_percentage}
                  onChange={(e) => setFormOffer({ ...formOffer, discount_percentage: e.target.value })}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />

                <input
                  type="number"
                  placeholder="Descuento fijo (€)"
                  value={formOffer.discount_fixed}
                  onChange={(e) => setFormOffer({ ...formOffer, discount_fixed: e.target.value })}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />

                <input
                  type="datetime-local"
                  placeholder="Fecha inicio"
                  value={formOffer.start_date}
                  onChange={(e) => setFormOffer({ ...formOffer, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />

                <input
                  type="datetime-local"
                  placeholder="Fecha fin"
                  value={formOffer.end_date}
                  onChange={(e) => setFormOffer({ ...formOffer, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formOffer.is_active}
                    onChange={(e) => setFormOffer({ ...formOffer, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Activa</span>
                </label>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingOffer ? 'Actualizar' : 'Crear'}
                </button>

                {editingOffer && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingOffer(null);
                      setFormOffer({
                        id: '',
                        pizza_id: '',
                        discount_percentage: '',
                        discount_fixed: '',
                        start_date: '',
                        end_date: '',
                        is_active: true
                      });
                    }}
                    className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Lista de ofertas */}
          <div className="lg:col-span-2">
            {loading ? (
              <p>Cargando...</p>
            ) : offers.length === 0 ? (
              <p className="text-gray-600">No hay ofertas creadas</p>
            ) : (
              <div className="space-y-3">
                {offers.map((offer) => (
                  <div key={offer.id} className="bg-white p-4 rounded-lg shadow-md">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Pizza</p>
                        <p className="font-bold">{offer.pizza_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Precio Original</p>
                        <p className="font-bold">€{offer.price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Descuento %</p>
                        <p className="font-bold">{offer.discount_percentage}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Descuento €</p>
                        <p className="font-bold">€{offer.discount_fixed}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          offer.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {offer.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditOffer(offer)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

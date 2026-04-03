'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  category: string;
  image_url: string;
  business_id: string;
  marketplace_businesses: {
    id: string;
    name: string;
    city: string;
    rating: number;
  };
}

export default function Marketplace() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'agendamento', title: '📅 Agendamento', icon: '📅' },
    { id: 'videoconferencia', title: '🎥 Videoconferência', icon: '🎥' },
    { id: 'elearning', title: '🎓 E-learning', icon: '🎓' },
    { id: 'helpdesk', title: '💬 Helpdesk', icon: '💬' },
    { id: 'documentos', title: '📄 Documentos', icon: '📄' }
  ];

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_services')
        .select(`
          *,
          marketplace_businesses (
            id,
            name,
            city,
            rating
          )
        `)
        .eq('is_active', true)
        .limit(100);

      if (error) throw error;
      setServices(data || []);
      setFilteredServices(data || []);
    } catch (err) {
      console.error('Erro ao carregar serviços:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = services;

    if (selectedCategory) {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.marketplace_businesses?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [selectedCategory, searchTerm, services]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            🏪 Marketplace de Serviços
          </Link>
          <div className="flex gap-4">
            <Link href="/marketplace/empresario/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
              Sou Empresário
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-800 font-semibold">
              ← Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Encontre os Melhores Serviços</h1>
          <p className="text-xl text-blue-100">Empresários e consultores prontos para ajudar</p>
        </div>
      </section>

      {/* Search & Filter */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Procure por serviço, empresa ou especialidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                selectedCategory === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {cat.icon} {cat.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Carregando serviços...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">Nenhum serviço encontrado</p>
            <button
              onClick={() => { setSelectedCategory(''); setSearchTerm(''); }}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <Link key={service.id} href={`/marketplace/servicos/${service.id}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden h-full flex flex-col">
                  {/* Card Image */}
                  <div className="h-40 bg-gradient-to-r from-blue-400 to-indigo-400 overflow-hidden">
                    {service.image_url ? (
                      <img src={service.image_url} alt={service.name} className="w-full h-full object-cover hover:scale-105 transition" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                        {service.category === 'agendamento' && '📅'}
                        {service.category === 'videoconferencia' && '🎥'}
                        {service.category === 'elearning' && '🎓'}
                        {service.category === 'helpdesk' && '💬'}
                        {service.category === 'documentos' && '📄'}
                      </div>
                    )}
                  </div>

                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4">
                    <h3 className="text-lg font-bold">{service.name}</h3>
                    <p className="text-blue-100 text-sm">{service.marketplace_businesses?.name}</p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                    <div className="space-y-3 mb-6 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Preço:</span>
                        <span className="text-2xl font-bold text-blue-600">€{service.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Duração:</span>
                        <span className="text-gray-800 font-semibold">{service.duration_minutes} min</span>
                      </div>
                      {service.marketplace_businesses?.city && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Local:</span>
                          <span className="text-gray-800 font-semibold">{service.marketplace_businesses.city}</span>
                        </div>
                      )}
                      {service.marketplace_businesses?.rating && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Avaliação:</span>
                          <span className="text-yellow-500 font-semibold">⭐ {service.marketplace_businesses.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition">
                      Ver Detalhes →
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Quer oferecer seus serviços?</h2>
          <Link href="/marketplace/empresario/registar" className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition">
            Registre seu Negócio →
          </Link>
        </div>
      </section>
    </div>
  );
}

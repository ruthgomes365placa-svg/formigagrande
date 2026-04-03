'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [business, setBusiness] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeServices: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
    rating: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const businessData = localStorage.getItem('marketplace_business');
        if (!businessData) {
          window.location.href = '/marketplace/empresario/login';
          return;
        }

        const business = JSON.parse(businessData);
        
        // Carregar dados atualizados do negócio
        const { data: businessDataUpdated, error: businessError } = await supabase
          .from('marketplace_businesses')
          .select('*')
          .eq('id', business.id)
          .single();

        if (!businessError && businessDataUpdated) {
          setBusiness(businessDataUpdated);
          localStorage.setItem('marketplace_business', JSON.stringify(businessDataUpdated));
        } else {
          setBusiness(business);
        }

        // Carregar serviços
        const { data: servicesData, error: servicesError } = await supabase
          .from('marketplace_services')
          .select('*')
          .eq('business_id', business.id)
          .order('created_at', { ascending: false });

        if (servicesError) throw servicesError;

        setServices(servicesData || []);

        // Calcular estatísticas
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('marketplace_bookings')
          .select('*')
          .eq('business_id', business.id);

        if (bookingsError) throw bookingsError;

        const activeServices = (servicesData || []).filter(s => s.is_active).length;
        const totalBookings = (bookingsData || []).length;
        const monthlyRevenue = (bookingsData || [])
          .filter(b => {
            const bookingDate = new Date(b.scheduled_date);
            const now = new Date();
            return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
          })
          .reduce((sum, b) => sum + (b.amount || 0), 0);

        setStats({
          activeServices,
          totalBookings,
          monthlyRevenue,
          rating: (businessDataUpdated?.rating || business.rating || 0)
        });
      } catch (err) {
        console.error('Erro:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('marketplace_business');
    window.location.href = '/marketplace/empresario/login';
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Tem certeza que quer deletar este serviço?')) return;

    try {
      // Deletar bookings primeiro
      await supabase
        .from('marketplace_bookings')
        .delete()
        .eq('service_id', serviceId);

      // Deletar serviço
      const { error } = await supabase
        .from('marketplace_services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      setServices(services.filter(s => s.id !== serviceId));
      alert('✓ Serviço deletado com sucesso!');
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao deletar serviço');
    }
  };

  if (isLoading || !business) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {business.profile_image_url && (
              <img
                src={business.profile_image_url}
                alt={business.name}
                className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-lg"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">{business.name}</h1>
              <p className="text-blue-100 mt-1">{business.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            🚪 Sair
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo ao seu dashboard! 👋</h2>
          <p className="text-gray-600">Gerencie seus serviços e agendamentos</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <p className="text-gray-600 font-semibold mb-2">SERVIÇOS ATIVOS</p>
            <p className="text-4xl font-bold text-blue-600">{stats.activeServices}</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <p className="text-gray-600 font-semibold mb-2">AGENDAMENTOS</p>
            <p className="text-4xl font-bold text-green-600">{stats.totalBookings}</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <p className="text-gray-600 font-semibold mb-2">RECEITA (MÊS)</p>
            <p className="text-4xl font-bold text-purple-600">€{stats.monthlyRevenue.toFixed(2)}</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <p className="text-gray-600 font-semibold mb-2">AVALIAÇÃO</p>
            <p className="text-4xl font-bold text-yellow-600">⭐ {stats.rating.toFixed(1)}</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* New Service */}
          <Link href="/marketplace/empresario/servico/novo">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
              <p className="text-5xl mb-4">➕</p>
              <h3 className="text-xl font-bold mb-2">Novo Serviço</h3>
              <p className="text-blue-100">Adicione um novo serviço à plataforma</p>
            </div>
          </Link>

          {/* Bookings */}
          <Link href="/marketplace/empresario/agendamentos">
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
              <p className="text-5xl mb-4">📅</p>
              <h3 className="text-xl font-bold mb-2">Agendamentos</h3>
              <p className="text-green-100">Veja todos os agendamentos</p>
            </div>
          </Link>

          {/* Disponibilidade */}
          <Link href="/marketplace/empresario/disponibilidade">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
              <p className="text-5xl mb-4">⏰</p>
              <h3 className="text-xl font-bold mb-2">Disponibilidade</h3>
              <p className="text-purple-100">Configure seus horários</p>
            </div>
          </Link>

          {/* Lottery */}
          <Link href="/marketplace/empresario/sorteios">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
              <p className="text-5xl mb-4">🎲</p>
              <h3 className="text-xl font-bold mb-2">Sorteios</h3>
              <p className="text-yellow-100">Gerar números aleatórios</p>
            </div>
          </Link>

          {/* Profile */}
          <Link href="/marketplace/empresario/perfil">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-lg shadow-lg p-8 hover:shadow-xl transition cursor-pointer">
              <p className="text-5xl mb-4">👤</p>
              <h3 className="text-xl font-bold mb-2">Meu Perfil</h3>
              <p className="text-pink-100">Edite seus dados e foto</p>
            </div>
          </Link>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Meus Serviços</h2>

          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">Nenhum serviço criado ainda</p>
              <Link href="/marketplace/empresario/servico/novo">
                <span className="text-blue-600 hover:text-blue-700 font-semibold">Criar primeiro serviço →</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => (
                <div key={service.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                  {/* Service Image */}
                  {service.image_url && (
                    <div className="h-32 bg-gray-200 overflow-hidden">
                      <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-800">{service.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {service.is_active ? '✓ Ativo' : '✗ Inativo'}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description || 'Sem descrição'}</p>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-blue-600">€{service.price.toFixed(2)}</span>
                      {service.duration_minutes && (
                        <span className="text-gray-600 text-sm">⏱ {service.duration_minutes}min</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/marketplace/empresario/servico/editar?id=${service.id}`} className="flex-1">
                        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                          ✏️ Editar
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                      >
                        🗑️ Deletar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
  business_id: string;
  marketplace_businesses: {
    id: string;
    name: string;
    city: string;
    phone: string;
    description: string;
    rating: number;
    email: string;
  };
}

export default function ServiceDetail() {
  const params = useParams();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1); // 1=data/hora, 2=dados cliente

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('marketplace_services')
        .select(`
          *,
          marketplace_businesses (
            id,
            name,
            city,
            phone,
            description,
            rating,
            email
          )
        `)
        .eq('id', serviceId)
        .single();

      if (dbError) throw dbError;
      setService(data);
    } catch (err: any) {
      setError('Serviço não encontrado');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
      }
    }
    return slots;
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleClientDataChange = (e: any) => {
    const { name, value } = e.target;
    setClientData(prev => ({ ...prev, [name]: value }));
  };

  const handleBooking = async (e: any) => {
    e.preventDefault();

    if (bookingStep === 1) {
      if (!selectedDate || !selectedTime) {
        setError('Selecione data e hora');
        return;
      }
      setBookingStep(2);
      return;
    }

    if (bookingStep === 2) {
      if (!clientData.name || !clientData.email || !clientData.phone) {
        setError('Preencha todos os dados');
        return;
      }

      setIsBooking(true);
      try {
        const { data, error: dbError } = await supabase
          .from('marketplace_bookings')
          .insert({
            service_id: serviceId,
            business_id: service!.business_id,
            client_name: clientData.name,
            client_email: clientData.email,
            client_phone: clientData.phone,
            scheduled_date: selectedDate,
            scheduled_time: selectedTime,
            duration_minutes: service!.duration_minutes,
            status: 'pending',
            amount: service!.price,
            payment_status: 'pending'
          })
          .select()
          .single();

        if (dbError) throw dbError;

        // Aqui você poderia enviar um email com a confirmação
        setError('');
        setIsBooking(false);

        // Mostrar mensagem de sucesso
        alert(`✓ Agendamento solicitado!\n\nO empresário ${service!.marketplace_businesses.name} validará sua solicitação em breve. Receberá um email em ${clientData.email} com a confirmação.`);

        // Redirecionar para home
        window.location.href = '/marketplace';
      } catch (err: any) {
        setError('Erro ao criar agendamento: ' + err.message);
      } finally {
        setIsBooking(false);
      }
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (error && !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Link href="/marketplace/servicos" className="text-blue-600 hover:underline">← Voltar aos serviços</Link>
        </div>
      </div>
    );
  }

  if (!service) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link href="/marketplace/servicos" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Voltar aos serviços
          </Link>
        </div>
      </nav>

      {/* Service Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{service.name}</h1>
              <p className="text-gray-600 mb-6">{service.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Preço</p>
                  <p className="text-2xl font-bold text-blue-600">€{service.price.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Duração</p>
                  <p className="text-2xl font-bold text-green-600">{service.duration_minutes} min</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Categoria</p>
                  <p className="text-2xl font-bold text-purple-600">{service.category}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Avaliação</p>
                  <p className="text-2xl font-bold text-yellow-600">⭐ {service.marketplace_businesses?.rating || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Business Profile */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">👤 Sobre o Prestador</h2>
              <div className="flex gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-4xl">
                  🏢
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{service.marketplace_businesses?.name}</h3>
                  {service.marketplace_businesses?.city && (
                    <p className="text-gray-600">📍 {service.marketplace_businesses.city}</p>
                  )}
                  {service.marketplace_businesses?.phone && (
                    <p className="text-gray-600">📞 {service.marketplace_businesses.phone}</p>
                  )}
                  {service.marketplace_businesses?.description && (
                    <p className="text-gray-700 mt-3">{service.marketplace_businesses.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Agendar</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleBooking} className="space-y-6">
                {bookingStep === 1 && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Data *</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={getMinDate()}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Hora *</label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Selecione uma hora</option>
                        {generateTimeSlots().map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {bookingStep === 2 && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600 mb-4">Data e hora selecionadas:</p>
                      <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <p className="text-blue-900 font-semibold">📅 {selectedDate} às {selectedTime}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Seu Nome *</label>
                      <input
                        type="text"
                        name="name"
                        value={clientData.name}
                        onChange={handleClientDataChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="João Silva"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={clientData.email}
                        onChange={handleClientDataChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={clientData.phone}
                        onChange={handleClientDataChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+351 91 234 5678"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  {bookingStep === 2 && (
                    <button
                      type="button"
                      onClick={() => setBookingStep(1)}
                      className="flex-1 bg-gray-300 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-400 transition"
                    >
                      ← Voltar
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isBooking}
                    className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 ${
                      bookingStep === 1 ? 'w-full' : ''
                    }`}
                  >
                    {isBooking ? 'Agendando...' : bookingStep === 1 ? 'Continuar →' : 'Confirmar Agendamento'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

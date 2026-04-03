'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Booking {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  amount: number;
  marketplace_services: {
    name: string;
  };
}

export default function Bookings() {
  const [business, setBusiness] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const businessData = localStorage.getItem('marketplace_business');
        if (!businessData) {
          window.location.href = '/marketplace/empresario/login';
          return;
        }

        const business = JSON.parse(businessData);
        setBusiness(business);

        // Carregar agendamentos
        const { data, error } = await supabase
          .from('marketplace_bookings')
          .select(`
            *,
            marketplace_services (
              name
            )
          `)
          .eq('business_id', business.id)
          .order('scheduled_date', { ascending: false });

        if (error) throw error;
        setBookings(data || []);
        setFilteredBookings(data || []);
      } catch (err) {
        console.error('Erro:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(b => b.status === statusFilter));
    }
  }, [statusFilter, bookings]);

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('marketplace_bookings')
        .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) throw error;

      // Atualizar liste local
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'confirmed' } : b
      ));
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao confirmar agendamento');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Tem certeza que quer cancelar este agendamento?')) return;

    try {
      const { error } = await supabase
        .from('marketplace_bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao cancelar agendamento');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/marketplace/empresario/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Agendamentos</h1>
          <div className="w-24"></div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: 'all', label: 'Todos', color: 'gray' },
            { id: 'pending', label: 'Pendentes', color: 'yellow' },
            { id: 'confirmed', label: 'Confirmados', color: 'green' },
            { id: 'completed', label: 'Concluídos', color: 'blue' },
            { id: 'cancelled', label: 'Cancelados', color: 'red' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                statusFilter === filter.id
                  ? `bg-${filter.color}-600 text-white`
                  : `bg-${filter.color}-100 text-${filter.color}-800 hover:bg-${filter.color}-200`
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">Nenhum agendamento encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status === 'pending' ? '⏰ Pendente' :
                     booking.status === 'confirmed' ? '✓ Confirmado' :
                     booking.status === 'completed' ? '✓ Concluído' :
                     '✗ Cancelado'}
                  </span>
                  <span className="text-lg font-bold text-blue-600">€{booking.amount?.toFixed(2) || '0.00'}</span>
                </div>

                {/* Service */}
                <h3 className="text-lg font-bold text-gray-800 mb-3">{booking.marketplace_services.name}</h3>

                {/* Client Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-700">
                    <span className="font-semibold text-gray-600 w-20">Cliente:</span>
                    <span>{booking.client_name}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="font-semibold text-gray-600 w-20">Email:</span>
                    <a href={`mailto:${booking.client_email}`} className="text-blue-600 hover:underline">{booking.client_email}</a>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="font-semibold text-gray-600 w-20">Telefone:</span>
                    <a href={`tel:${booking.client_phone}`} className="text-blue-600 hover:underline">{booking.client_phone}</a>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-blue-900 font-semibold">
                    📅 {new Date(booking.scheduled_date).toLocaleDateString('pt-PT')} às {booking.scheduled_time}
                  </p>
                </div>

                {/* Actions */}
                {booking.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfirmBooking(booking.id)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      ✓ Confirmar
                    </button>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      ✗ Rejeitar
                    </button>
                  </div>
                )}

                {(booking.status === 'confirmed' || booking.status === 'completed') && (
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="w-full bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition font-semibold"
                  >
                    Cancelar Agendamento
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

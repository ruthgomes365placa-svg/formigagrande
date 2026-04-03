'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const WEEKDAYS = [
  { id: 0, name: 'Domingo' },
  { id: 1, name: 'Segunda' },
  { id: 2, name: 'Terça' },
  { id: 3, name: 'Quarta' },
  { id: 4, name: 'Quinta' },
  { id: 5, name: 'Sexta' },
  { id: 6, name: 'Sábado' }
];

export default function Disponibilidade() {
  const [business, setBusiness] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [availability, setAvailability] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    day_of_week: 1,
    start_time: '09:00',
    end_time: '18:00'
  });

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

        // Carregar serviços
        const { data: servicesData } = await supabase
          .from('marketplace_services')
          .select('id, name')
          .eq('business_id', business.id);

        if (servicesData && servicesData.length > 0) {
          setServices(servicesData);
          setSelectedService(servicesData[0].id);
          loadAvailability(servicesData[0].id);
        }
      } catch (err) {
        console.error('Erro:', err);
      }
    };

    loadData();
  }, []);

  const loadAvailability = async (serviceId: string) => {
    try {
      const { data } = await supabase
        .from('marketplace_availability')
        .select('*')
        .eq('service_id', serviceId)
        .eq('is_available', true)
        .order('day_of_week', { ascending: true });

      setAvailability(data || []);
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  const handleAddSchedule = async () => {
    if (!selectedService) {
      alert('Selecione um serviço');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('marketplace_availability')
        .insert([{
          service_id: selectedService,
          day_of_week: newSchedule.day_of_week,
          start_time: newSchedule.start_time,
          end_time: newSchedule.end_time,
          is_available: true
        }]);

      if (error) throw error;

      alert('✓ Horário adicionado!');
      loadAvailability(selectedService);
      setNewSchedule({ day_of_week: 1, start_time: '09:00', end_time: '18:00' });
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao adicionar horário');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Remover este horário?')) return;

    try {
      const { error } = await supabase
        .from('marketplace_availability')
        .delete()
        .eq('id', scheduleId);

      if (error) throw error;

      loadAvailability(selectedService);
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao remover horário');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/marketplace/empresario/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Disponibilidade</h1>
          <div className="w-24"></div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Select Service */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Selecione um Serviço</h2>
            
            {services.length === 0 ? (
              <p className="text-gray-600">Nenhum serviço criado. <Link href="/marketplace/empresario/servico/novo" className="text-blue-600 underline">Criar serviço</Link></p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(service => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service.id);
                      loadAvailability(service.id);
                    }}
                    className={`p-4 rounded-lg border-2 font-semibold transition ${
                      selectedService === service.id
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add New Schedule */}
          {selectedService && (
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">➕ Adicionar Novo Horário</h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Dia da Semana</label>
                  <select
                    value={newSchedule.day_of_week}
                    onChange={(e) => setNewSchedule({ ...newSchedule, day_of_week: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg text-gray-800"
                  >
                    {WEEKDAYS.map(day => (
                      <option key={day.id} value={day.id}>{day.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Hora Início</label>
                  <input
                    type="time"
                    value={newSchedule.start_time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Hora Fim</label>
                  <input
                    type="time"
                    value={newSchedule.end_time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, end_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-gray-800"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleAddSchedule}
                    disabled={isSaving}
                    className="w-full bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-semibold disabled:bg-gray-400 disabled:text-white"
                  >
                    {isSaving ? '⏳...' : '✓ Adicionar'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Current Schedule */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">📅 Horários Disponíveis</h3>

            {availability.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Nenhum horário configurado</p>
                <p className="text-gray-500">Adicione horários acima para começar a receber agendamentos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availability.map(schedule => {
                  const day = WEEKDAYS.find(d => d.id === schedule.day_of_week);
                  return (
                    <div key={schedule.id} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-800">{day?.name}</p>
                          <p className="text-blue-600 font-semibold text-lg">
                            🕐 {schedule.start_time} - {schedule.end_time}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="text-red-600 hover:text-red-800 font-bold text-xl"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

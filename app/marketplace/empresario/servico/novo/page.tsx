'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CreateService() {
  const [business, setBusiness] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: '60',
    capacity: '1',
    image_url: ''
  });

  useEffect(() => {
    const businessData = localStorage.getItem('marketplace_business');
    if (!businessData) {
      window.location.href = '/marketplace/empresario/login';
      return;
    }
    setBusiness(JSON.parse(businessData));
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.price) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: dbError } = await supabase
        .from('marketplace_services')
        .insert({
          business_id: business.id,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          duration_minutes: parseInt(formData.duration_minutes),
          capacity: parseInt(formData.capacity),
          category: business.category,          image_url: formData.image_url,          is_active: true
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setSuccess('✓ Serviço criado com sucesso!');
      setFormData({ name: '', description: '', price: '', duration_minutes: '60', capacity: '1', image_url: '' });
      
      setTimeout(() => {
        window.location.href = '/marketplace/empresario/dashboard';
      }, 1500);
    } catch (err: any) {
      setError('Erro: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!business) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  const categoryEmoji: Record<string, string> = {
    agendamento: '📅',
    videoconferencia: '🎥',
    elearning: '🎓',
    helpdesk: '💬',
    documentos: '📄'
  };

  const categoryName: Record<string, string> = {
    agendamento: 'Agendamento e Consultas',
    videoconferencia: 'Videoconferência',
    elearning: 'E-learning',
    helpdesk: 'Helpdesk',
    documentos: 'Portal de Documentos'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/marketplace/empresario/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Novo Serviço</h1>
          <div className="w-24"></div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Criar Novo Serviço</h2>
            <p className="text-gray-600">Categoria: <span className="font-semibold">{categoryEmoji[business.category]} {categoryName[business.category]}</span></p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Serviço *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Consulta de 1 hora"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descreva detalhadamente o que seu cliente vai receber"
                rows={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preço (EUR) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 font-semibold">€</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="99.90"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duração (minutos)</label>
                <input
                  type="number"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Capacidade (clientes por sessão)</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">🖼️ Foto do Serviço (URL)</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://exemplo.com/servico.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">Cole a URL de uma imagem (JPG, PNG) ou use um serviço como Imgur ou Cloudinary</p>
              {formData.image_url && (
                <div className="mt-3">
                  <img src={formData.image_url} alt="Preview" className="h-32 w-full rounded-lg object-cover border-2 border-blue-500" />
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Dica:</strong> Complete seu perfil e adicione horários de disponibilidade para receber agendamentos.
              </p>
            </div>

            <div className="flex gap-4">
              <Link href="/marketplace/empresario/dashboard" className="flex-1 bg-gray-300 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-400 transition text-center">
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
              >
                {isLoading ? 'Criando...' : 'Criar Serviço'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

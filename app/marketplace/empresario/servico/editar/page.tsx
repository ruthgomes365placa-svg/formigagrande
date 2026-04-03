'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function EditarServicoContent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('id');
  
  const [business, setBusiness] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: '',
    capacity: '',
    is_active: true,
    image_url: ''
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

        if (!serviceId) {
          alert('Erro: Serviço não especificado');
          return;
        }

        // Carregar serviço
        const { data, error } = await supabase
          .from('marketplace_services')
          .select('*')
          .eq('id', serviceId)
          .eq('business_id', business.id)
          .single();

        if (error) throw error;

        setService(data);
        setFormData({
          name: data.name,
          description: data.description || '',
          price: data.price.toString(),
          duration_minutes: data.duration_minutes?.toString() || '',
          capacity: data.capacity?.toString() || '1',
          is_active: data.is_active,
          image_url: data.image_url || ''
        });
      } catch (err) {
        console.error('Erro:', err);
        alert('Erro ao carregar serviço');
      }
    };

    loadData();
  }, [serviceId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price) {
      alert('Nome e preço são obrigatórios');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      alert('Preço inválido');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('marketplace_services')
        .update({
          name: formData.name,
          description: formData.description,
          price: price,
          duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
          capacity: parseInt(formData.capacity) || 1,
          is_active: formData.is_active,
          image_url: formData.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', serviceId);

      if (error) throw error;

      alert('✓ Serviço atualizado com sucesso!');
      window.location.href = '/marketplace/empresario/dashboard';
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao atualizar serviço');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que quer DELETAR este serviço? Esta ação é irreversível!')) {
      return;
    }

    try {
      // Deletar primeiro os bookings associados
      await supabase
        .from('marketplace_bookings')
        .delete()
        .eq('service_id', serviceId);

      // Depois deletar o serviço
      const { error } = await supabase
        .from('marketplace_services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      alert('✓ Serviço deletado com sucesso!');
      window.location.href = '/marketplace/empresario/dashboard';
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao deletar serviço');
    }
  };

  if (!service) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/marketplace/empresario/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Editar Serviço</h1>
          <div className="w-24"></div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Nome do Serviço *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Consulta de 1 hora"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Descrição</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva os detalhes do serviço..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">🖼️ Foto do Serviço (URL)</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://exemplo.com/servico.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Cole a URL de uma imagem ou use um serviço como Imgur/Cloudinary</p>
              {formData.image_url && (
                <div className="mt-3">
                  <img src={formData.image_url} alt="Preview" className="h-32 w-full rounded-lg object-cover border-2 border-blue-500" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Preço (€) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Duração (minutos)</label>
                <input
                  type="number"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleInputChange}
                  placeholder="60"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Capacidade (clientes)</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Categoria</label>
              <input
                type="text"
                value={business?.category || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed capitalize"
              />
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-5 h-5 border border-gray-300 rounded"
                />
                <span className="text-gray-700 font-semibold">✓ Serviço ativo</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">Desative para ocultar do marketplace</p>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400"
              >
                {isSubmitting ? '💾 Salvando...' : '💾 Salvar Alterações'}
              </button>
              <button
                type="button"
                onClick={() => window.location.href = '/marketplace/empresario/dashboard'}
                className="flex-1 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                ✕ Cancelar
              </button>
            </div>

            <button
              type="button"
              onClick={handleDelete}
              className="w-full bg-red-100 text-red-600 px-6 py-3 rounded-lg hover:bg-red-200 transition font-semibold border border-red-300"
            >
              🗑️ Deletar Serviço
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function EditarServicoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <EditarServicoContent />
    </Suspense>
  );
}

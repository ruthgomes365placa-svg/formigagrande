'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MeuPerfil() {
  const [business, setBusiness] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    description: '',
    website: '',
    profile_image_url: ''
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

        // Carregar dados atualizados from Supabase
        const { data, error } = await supabase
          .from('marketplace_businesses')
          .select('*')
          .eq('id', business.id)
          .single();

        if (error) throw error;

        setBusiness(data);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          city: data.city || '',
          country: data.country || '',
          description: data.description || '',
          website: data.website || '',
          profile_image_url: data.profile_image_url || ''
        });
      } catch (err) {
        console.error('Erro:', err);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('marketplace_businesses')
        .update({
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
          country: formData.country,
          description: formData.description,
          website: formData.website,
          profile_image_url: formData.profile_image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', business.id);

      if (error) throw error;

      // Atualizar localStorage
      const updatedBusiness = { ...business, ...formData };
      localStorage.setItem('marketplace_business', JSON.stringify(updatedBusiness));
      setBusiness(updatedBusiness);

      setIsEditing(false);
      alert('✓ Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao salvar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  if (!business) {
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
          <h1 className="text-xl font-bold text-gray-800">Meu Perfil</h1>
          <div className="w-24"></div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* Header with Badges */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{business.name}</h2>
                <p className="text-gray-600">{business.email}</p>
              </div>
              {business.is_verified && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                  ✓ Verificado
                </span>
              )}
            </div>

            {/* Profile Picture Preview */}
            {business.profile_image_url && (
              <div className="mb-4">
                <img
                  src={business.profile_image_url}
                  alt="Perfil"
                  className="h-32 w-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                />
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-semibold">Inscrição</p>
                <p className="text-lg font-bold text-blue-600">
                  {new Date(business.created_at).toLocaleDateString('pt-PT')}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-semibold">Categoria</p>
                <p className="text-lg font-bold text-yellow-600 capitalize">{business.category}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-semibold">Avaliação</p>
                <p className="text-lg font-bold text-purple-600">
                  ⭐ {business.rating || 0} ({business.total_reviews || 0})
                </p>
              </div>
            </div>
          </div>

          <hr className="my-8" />

          {/* Edit Button */}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full mb-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              ✏️ Editar Perfil
            </button>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Nome do Negócio</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 disabled:bg-gray-50"
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email não pode ser alterado</p>
            </div>

            {/* Profile Photo URL */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">🖼️ Foto de Perfil (URL)</label>
              <input
                type="url"
                name="profile_image_url"
                value={formData.profile_image_url}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="https://exemplo.com/foto.jpg"
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 disabled:bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Cole a URL de uma imagem (JPG, PNG) ou use um serviço como Imgur ou Cloudinary</p>
              {formData.profile_image_url && (
                <div className="mt-3">
                  <img src={formData.profile_image_url} alt="Preview" className="h-24 w-24 rounded-lg object-cover border-2 border-blue-500" />
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Telefone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="+351 XXX XXX XXX"
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 disabled:bg-gray-50"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Cidade</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Lisboa"
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 disabled:bg-gray-50"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">País</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Portugal"
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 disabled:bg-gray-50"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="https://www.exemplo.pt"
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 disabled:bg-gray-50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Descrição do Negócio</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Descreva seu negócio e serviços..."
                rows={5}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 disabled:bg-gray-50 resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-400"
              >
                {isSaving ? '💾 Salvando...' : '💾 Salvar Alterações'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: business.name,
                    email: business.email,
                    phone: business.phone || '',
                    city: business.city || '',
                    country: business.country || '',
                    description: business.description || '',
                    website: business.website || '',
                    profile_image_url: business.profile_image_url || ''
                  });
                }}
                className="flex-1 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                ✕ Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

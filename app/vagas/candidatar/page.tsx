'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CandidatarPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    professionalTitle: '',
    bio: '',
    skills: '',
    yearExperience: 0,
    motivation: '',
  });

  const [files, setFiles] = useState({
    cv: null as File | null,
    video: null as File | null,
    portfolio: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'yearExperience' ? parseInt(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles((prev) => ({
        ...prev,
        [name]: selectedFiles[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Aqui você implementaria o upload dos arquivos para Supabase Storage
      // Por enquanto, vamos simular o envio

      const candidate = {
        ...formData,
        skills: formData.skills.split(',').map((s) => s.trim()),
        cv: files.cv?.name || 'cv.pdf',
        video: files.video?.name || 'video.mp4',
        portfolio: files.portfolio?.name || 'portfolio.pdf',
      };

      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(
        'Candidatura enviada com sucesso! 🎉 Você receberá um email de confirmação.'
      );
      setTimeout(() => {
        router.push('/vagas');
      }, 2000);
    } catch (err) {
      setError('Erro ao enviar candidatura. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Formiga Grande
          </Link>
          <div className="flex gap-6">
            <Link href="/vagas" className="text-gray-700 hover:text-blue-600 font-semibold">
              ← Voltar às Vagas
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">
            📝 Crie Seu Perfil Profissional
          </h1>
          <p className="text-lg text-green-100">
            Mostre seus melhores atributos e oportunidades para você!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Tips */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-8">
            <h3 className="font-bold text-blue-900 mb-3">💡 Dicas para um Perfil Impactante:</h3>
            <ul className="text-blue-800 space-y-2">
              <li>✓ Escreva uma bio clara e concisa que resuma sua experiência</li>
              <li>✓ Adicione um vídeo de apresentação pessoal (máximo 2 minutos)</li>
              <li>✓ Liste suas principais habilidades separadas por vírgula</li>
              <li>✓ Explique por que está interessado nesta vaga</li>
              <li>✓ Inclua documentos em PDF: CV, portfólio e certificações</li>
            </ul>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">👤 Informações Pessoais</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Nome Completo *"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Localização (Cidade, País)"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Professional Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">💼 Informações Profissionais</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="professionalTitle"
                  placeholder="Título Profissional *"
                  value={formData.professionalTitle}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
                <select
                  name="yearExperience"
                  value={formData.yearExperience}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                >
                  <option value={0}>Anos de Experiência</option>
                  <option value={1}>0-1 ano</option>
                  <option value={2}>1-2 anos</option>
                  <option value={3}>2-3 anos</option>
                  <option value={5}>3-5 anos</option>
                  <option value={10}>5+ anos</option>
                </select>
              </div>

              <textarea
                name="bio"
                placeholder="Conte um pouco sobre você (máximo 500 caracteres) *"
                value={formData.bio}
                onChange={handleInputChange}
                maxLength={500}
                rows={4}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
              <p className="text-sm text-gray-600 mt-2">
                {formData.bio.length}/500 caracteres
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Habilidades</h2>

              <textarea
                name="skills"
                placeholder="Liste suas principais habilidades separadas por vírgula (ex: React, Node.js, TypeScript) *"
                value={formData.skills}
                onChange={handleInputChange}
                rows={3}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Motivation */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🚀 Por Que Esta Vaga?</h2>

              <textarea
                name="motivation"
                placeholder="Explique por que está interessado nesta vaga e como você pode agregar valor à nossa empresa (máximo 500 caracteres) *"
                value={formData.motivation}
                onChange={handleInputChange}
                maxLength={500}
                rows={4}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
              <p className="text-sm text-gray-600 mt-2">
                {formData.motivation.length}/500 caracteres
              </p>
            </div>

            {/* File Uploads */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📎 Anexar Arquivos</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    📄 Currículo (CV) - PDF *
                  </label>
                  <input
                    type="file"
                    name="cv"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                    className="block w-full text-gray-500 border border-gray-300 rounded-lg px-4 py-3"
                  />
                  {files.cv && (
                    <p className="text-green-600 mt-2">✓ {files.cv.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    🎥 Vídeo de Apresentação (MP4 - máx 2 min)
                  </label>
                  <input
                    type="file"
                    name="video"
                    accept=".mp4,.webm"
                    onChange={handleFileChange}
                    className="block w-full text-gray-500 border border-gray-300 rounded-lg px-4 py-3"
                  />
                  {files.video && (
                    <p className="text-green-600 mt-2">✓ {files.video.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    🎨 Portfólio / Certificações - PDF
                  </label>
                  <input
                    type="file"
                    name="portfolio"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-gray-500 border border-gray-300 rounded-lg px-4 py-3"
                  />
                  {files.portfolio && (
                    <p className="text-green-600 mt-2">✓ {files.portfolio.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg text-green-700">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
            >
              {loading ? '⏳ Enviando...' : '✅ Enviar Candidatura'}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-8 text-center text-gray-600">
            <p className="text-sm">
              Seus dados serão armazenados com segurança por <strong>3 meses</strong>
            </p>
            <p className="text-sm mt-2">
              Sua candidatura será revisada pela nossa equipe
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 Formiga Grande. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

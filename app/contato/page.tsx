'use client';

import Link from 'next/link';
import { useState } from 'react';


export default function Contato() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/xdawrkod', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
          _replyto: 'formigagrande.oficial@gmail.com',
          _subject: 'Novo Orçamento - Formiga Grande'
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar o formulário');
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Formiga Grande
          </Link>
          
        </div>
      </nav>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-sm hover:text-blue-100 mb-4 inline-block">
            ← Voltar para Home
          </Link>
          <h1 className="text-4xl font-bold">Entre em Contato</h1>
          <p className="text-lg mt-2 text-blue-100">Estamos prontos para ajudar com seu projeto</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Solicitar Orçamento</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nome *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Telefone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Serviço de Interesse *</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um serviço</option>
                  <option value="landing-pages">Landing Pages</option>
                  <option value="seo">Consultoria SEO</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="mentorias">Mentorias</option>
                  <option value="sistemas-web">Sistemas Web</option>
                  <option value="manutencao">Manutenção</option>
                  <option value="hospedagem">Hospedagem</option>
                  <option value="design">Design/UX</option>
                  <option value="educacao">Educação</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Mensagem *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva seu projeto..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Enviando...' : 'Enviar Solicitação'}
              </button>
            </form>

            {status === 'success' && (
              <div className="mt-4 rounded-lg bg-green-100 border border-green-300 p-4 text-green-800">
                Obrigado, recebemos seu contato!
              </div>
            )}

            {status === 'error' && (
              <div className="mt-4 rounded-lg bg-red-100 border border-red-300 p-4 text-red-800">
                Ocorreu um problema ao enviar. Tente novamente mais tarde.
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">📧 Email</p>
                  <p className="text-lg font-semibold">formigagrande.oficial@gmail.com</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">📱 Telefone</p>
                  <p className="text-lg font-semibold">+244 925250510</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">📍 Localização</p>
                  <p className="text-lg font-semibold">Luanda, Cabinda - Angola</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">⏰ Horário de Atendimento</p>
                  <p className="text-lg font-semibold">Segunda a Sexta: 8h às 15h</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Por que nos escolher?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-bold">✓</span>
                  <span>Resposta rápida garantida em até 2 horas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-bold">✓</span>
                  <span>Consultoria gratuita para entender seu projeto</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-bold">✓</span>
                  <span>Orçamento transparente sem surpresas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-bold">✓</span>
                  <span>Suporte contínuo após o projeto</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Formiga Grande. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

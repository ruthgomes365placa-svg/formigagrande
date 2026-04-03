'use client';

import { useState } from 'react';
import Link from 'next/link';
import StripeCheckoutButton from './components/StripeCheckoutButton';
import ServicesMenu from './components/ServicesMenu';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'servicos' | 'contato'>('dashboard');

  const services = [
    { id: 'landing-pages', title: 'Desenvolvimento de Landing Pages', description: 'Crie páginas de destino atraentes que convertem visitantes em clientes.', price: 'EURO 10.00', color: 'from-blue-500 to-blue-600' },
    { id: 'seo', title: 'Consultoria em SEO', description: 'Otimize seu site para motores de busca e aumente sua visibilidade online.', price: 'EURO 17.00', color: 'from-green-500 to-green-600' },
    { id: 'ecommerce', title: 'Criação de E-commerce', description: 'Desenvolva lojas virtuais completas, seguras e prontas para vender.', price: 'EURO 7.00', color: 'from-red-500 to-red-600' },
    { id: 'mentorias', title: 'Mentorias Individuais', description: 'Acompanhamento personalizado para novos desenvolvedores.', price: 'EURO 8.00', color: 'from-indigo-500 to-indigo-600' },
    { id: 'sistemas-web', title: 'Desenvolvimento de Sistemas Web', description: 'Construa aplicações web robustas, escaláveis e modernas.', price: 'EURO 35.00', color: 'from-cyan-500 to-cyan-600' },
    { id: 'manutencao', title: 'Manutenção de Sites', description: 'Mantenha seu site seguro, atualizado e funcionando perfeitamente.', price: 'EURO 10.00', color: 'from-amber-500 to-amber-600' },
    { id: 'hospedagem-deploy', title: 'Hospedagem e Deploy', description: 'Infraestrutura em nuvem com segurança, performance e suporte 24/7.', price: 'EURO 9.00', color: 'from-orange-500 to-orange-600' },
    { id: 'design', title: 'Design e UX/UI', description: 'Interfaces visuais incríveis que encantam seus usuários.', price: 'EURO 5.00', color: 'from-fuchsia-500 to-fuchsia-600' },
    { id: 'educacao', title: 'Educação e Conhecimento', description: 'Capacite sua equipe com cursos, workshops e comunidade de aprendizado.', price: 'EURO 5.00', color: 'from-violet-500 to-violet-600' }
  ];

  const movingTexts = [
    'Transformamos ideias em soluções digitais de alto impacto',
    'Websites, marketplaces, automações e consultoria completa',
    'Foco em conversão, performance e experiência do usuário',
    'Suporte contínuo com atendimento rápido e transparente',
    'Seu projeto online pronto para escalar 24/7'
  ];

  const topBars = ['Sistemas de Agendamento', 'Marketplace & Vendas', 'Dashboard e Analytics'];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <ServicesMenu />
            <Link href="/" className="text-2xl font-bold text-blue-600">Formiga Grande</Link>
          </div>
          <div className="flex gap-6 items-center">
            <Link href="/sobre" className="text-gray-700 hover:text-blue-600 transition font-semibold">Sobre</Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition font-semibold">Blog</Link>
            <Link href="/vagas" className="text-gray-700 hover:text-blue-600 transition font-semibold">Vagas</Link>
            <Link href="/suporte" className="text-gray-700 hover:text-blue-600 transition font-semibold">Suporte</Link>
            <Link href="/marketplace/servicos" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-bold transition shadow-lg"> Marketplace</Link>
            <Link href="/contato" className="text-gray-700 hover:text-blue-600 transition font-semibold">Contacto</Link>
            <Link href="/vip" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black px-4 py-2 rounded-full font-bold transition shadow-lg animate-pulse"> VIP</Link>
          </div>
        </div>
      </nav>

      <section className="relative bg-black overflow-hidden h-screen">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" preload="auto">
          <source src="/video.mp4" type="video/mp4" />
          Seu navegador não suporta vídeo HTML5.
        </video>

        <div className="absolute inset-0 bg-black/40 z-10" />

        <div className="h-screen relative z-20 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <div className="relative inline-flex items-center justify-center mb-5">
              <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-40">
                <span className="w-24 h-2 bg-blue-300 rounded-full"></span>
                <span className="w-24 h-2 bg-green-300 rounded-full"></span>
                <span className="w-24 h-2 bg-purple-300 rounded-full"></span>
              </div>
              <h1 className="relative text-5xl md:text-7xl font-bold">Formiga Grande</h1>
            </div>

            <div className="flex justify-center gap-2 mb-4">
              {['dashboard', 'servicos', 'contato'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as 'dashboard' | 'servicos' | 'contato')}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === tab ? 'bg-white text-black' : 'bg-white/20 text-white hover:bg-white/35'}`}>
                  {tab === 'dashboard' ? 'Dashboard' : tab === 'servicos' ? 'Serviços' : 'Contato'}
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {topBars.map((bar) => (
                <span key={bar} className="px-4 py-2 rounded-full border border-white/50 bg-white/15 backdrop-blur-sm text-sm font-semibold">
                  {bar}
                </span>
              ))}
            </div>

            <p className="text-xl md:text-2xl mb-8">Se quiser, criaremos um site com sistema de pagamento que vai direto para sua conta bancária em Angola.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/marketplace/servicos" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition">Ver Serviços</Link>
              <Link href="/contato" className="bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-lg font-bold text-lg transition">Contacto</Link>
            </div>

            <div className="mt-6 h-10 overflow-hidden">
              <div className="flex items-center whitespace-nowrap gap-16 text-white text-lg font-semibold animate-marquee">
                {movingTexts.concat(movingTexts).map((item, idx) => (
                  <span key={`${item}-${idx}`} className="inline-block">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nossos Serviços</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Clique em qualquer serviço para conhecer a estrutura completa, subtarefas e como podemos ajudar seu projeto.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="h-full flex flex-col">
                <Link href={`/services/${service.id}`}>
                  <div className={`bg-gradient-to-br ${service.color} text-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer`}>
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-blue-50 mb-3">{service.description}</p>
                    <p className="text-white font-semibold mb-4">Preço estimado: {service.price}</p>
                    <div className="flex items-center justify-between"><span className="text-sm font-semibold">Saiba mais</span><span className="text-xl"></span></div>
                  </div>
                </Link>
                <div className="mt-4"><StripeCheckoutButton serviceId={service.id} label="Pagar com Visa/Mastercard" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

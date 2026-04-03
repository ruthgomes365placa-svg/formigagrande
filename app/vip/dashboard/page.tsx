'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VIPCheckoutButton from '../../components/VIPCheckoutButton';

interface Member {
  id: string;
  email: string;
  name: string;
  subscription_status: string;
}

export default function VIPDashboard() {
  const [member, setMember] = useState<Member | null>(null);
  const [activeTab, setActiveTab] = useState<'videos' | 'arquivos' | 'chat'>('videos');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se usuário está autenticado
    const token = localStorage.getItem('vip_token');
    const userData = localStorage.getItem('vip_user');

    if (!token || !userData) {
      router.push('/vip');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setMember(parsedUser);
    } catch (error) {
      router.push('/vip');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('vip_token');
    localStorage.removeItem('vip_user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">🔄 Carregando...</div>
      </div>
    );
  }

  if (!member) {
    return null;
  }

  const isActive = member.subscription_status === 'active' || member.subscription_status === 'trial';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-md sticky top-0 z-50 border-b border-purple-500/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-3xl font-bold text-white hover:text-purple-300">
                Formiga Grande
              </Link>
              <div className="hidden sm:block text-purple-300">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent font-bold">
                  👑 VIP
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-purple-200 hidden sm:inline">{member.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Welcome */}
      <section className="bg-gradient-to-r from-purple-700/50 to-indigo-700/50 border-b border-purple-500/30 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            Bem-vindo ao Área VIP, {member.name}! 🎉
          </h1>
          <p className="text-purple-200 text-lg">
            Acesse seus conteúdos exclusivos, vídeos aulas, arquivos e rede com outros membros
          </p>
        </div>
      </section>

      {/* Subscription Status */}
      {!isActive && (
        <section className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-b border-orange-500/30 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-yellow-300 mb-2">Ative sua Subscrição!</h2>
                <p className="text-yellow-200">
                  Upgrade para VIP e desbloqueie acesso completo a todos os conteúdos exclusivos
                </p>
              </div>
              <div className="flex-shrink-0">
                <VIPCheckoutButton 
                  memberId={member.id} 
                  email={member.email}
                  className="w-full md:w-auto"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {isActive && (
        <section className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-b border-green-500/30 py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✅</span>
              <div>
                <p className="text-green-300 font-bold">Subscrição Ativa</p>
                <p className="text-green-200 text-sm">Você tem acesso completo a todos os conteúdos</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'videos'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                : 'bg-purple-800/50 text-white border border-purple-500/50 hover:bg-purple-700/50'
            }`}
          >
            📺 Vídeos Aulas
          </button>
          <button
            onClick={() => setActiveTab('arquivos')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'arquivos'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                : 'bg-purple-800/50 text-white border border-purple-500/50 hover:bg-purple-700/50'
            }`}
          >
            📂 Arquivos PDF
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                : 'bg-purple-800/50 text-white border border-purple-500/50 hover:bg-purple-700/50'
            }`}
          >
            💬 Chat Exclusivo
          </button>
        </div>

        {/* Content Sections */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            {/* Curso de IA Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-2">🤖 Curso de Inteligência Artificial</h2>
              <p className="text-blue-100">6 aulas completas para dominar IA. Assista, aprenda e domine!</p>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { num: 1, title: "Aula 1: Introdução a IA" },
                { num: 2, title: "Aula 2: Machine Learning" },
                { num: 3, title: "Aula 3: Deep Learning" },
                { num: 4, title: "Aula 4: Processamento de Linguagem Natural" },
                { num: 5, title: "Aula 5: Visão Computacional" },
                { num: 6, title: "Aula 6: Projetos Práticos" },
              ].map((aula) => (
                <div key={aula.num} className="bg-purple-800/30 border border-purple-500/50 rounded-lg overflow-hidden hover:border-purple-400 transition flex flex-col">
                  {/* Video Player */}
                  <div className="bg-black h-40 flex items-center justify-center text-blue-400 hover:text-blue-300 cursor-pointer group">
                    <a href={`/video-aula ${aula.num}.mp4`} target="_blank" rel="noopener noreferrer" className="text-6xl group-hover:scale-125 transition transform">
                      ▶️
                    </a>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-white font-bold mb-2">{aula.title}</h3>
                    <p className="text-purple-200 text-sm mb-4 flex-1">
                      📹 Vídeo interativo com exemplos práticos
                    </p>
                    <a 
                      href={`/video-aula ${aula.num}.mp4`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-2 rounded font-semibold transition text-center"
                    >
                      ▶️ Asistir Agora
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Video Player Modal */}
            <div className="mt-12 bg-purple-800/30 border border-purple-500/50 rounded-lg overflow-hidden p-6">
              <h3 className="text-white font-bold mb-4 text-xl">📺 Assistir Vídeo em Tela Cheia</h3>
              <div className="bg-black rounded-lg overflow-hidden">
                <video
                  controls
                  width="100%"
                  height="auto"
                  className="w-full"
                  controlsList="nodownload"
                >
                  <source src="/video-aula 1.mp4" type="video/mp4" />
                  Seu navegador não suporta vídeo HTML5
                </video>
              </div>
              <p className="text-purple-200 text-sm mt-4">
                💡 Dica: Selecione a qualidade desejada nos controles do vídeo. Todos os 6 vídeos estão disponíveis para download na sua biblioteca.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'arquivos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 border border-purple-500/50 rounded-lg p-6 hover:border-purple-400 transition flex items-center gap-4">
              <div className="text-6xl">📄</div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-2">E-book: Guia Completo</h3>
                <p className="text-purple-200 text-sm mb-3">PDF - 150 páginas</p>
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-2 rounded font-semibold transition">
                  ⬇️ Baixar
                </button>
              </div>
            </div>

            <div className="bg-purple-800/30 border border-purple-500/50 rounded-lg p-6 hover:border-purple-400 transition flex items-center gap-4">
              <div className="text-6xl">📋</div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-2">Template: Planejamento</h3>
                <p className="text-purple-200 text-sm mb-3">PDF - 20 páginas</p>
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-2 rounded font-semibold transition">
                  ⬇️ Baixar
                </button>
              </div>
            </div>

            <div className="bg-purple-800/30 border border-purple-500/50 rounded-lg p-6 hover:border-purple-400 transition flex items-center gap-4">
              <div className="text-6xl">📌</div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-2">Checklist: 30 Passos</h3>
                <p className="text-purple-200 text-sm mb-3">PDF - 10 páginas</p>
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-2 rounded font-semibold transition">
                  ⬇️ Baixar
                </button>
              </div>
            </div>

            <div className="bg-purple-800/30 border border-purple-500/50 rounded-lg p-6 hover:border-purple-400 transition flex items-center gap-4">
              <div className="text-6xl">🎯</div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-2">Roadmap: Passo a Passo</h3>
                <p className="text-purple-200 text-sm mb-3">PDF - 15 páginas</p>
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-2 rounded font-semibold transition">
                  ⬇️ Baixar
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-purple-800/30 border border-purple-500/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">💬 Chat Exclusivo VIP</h2>
            <div className="bg-black/30 rounded-lg h-96 overflow-y-auto mb-4 p-4">
              <div className="text-center text-purple-300 py-12">
                <p className="text-lg">Conecte-se com outros membros VIP</p>
                <p className="text-sm mt-2">Chat em tempo real exclusivo para a comunidade</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-3 bg-purple-700/50 border border-purple-500/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-300"
              />
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold transition">
                Enviar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black/30 border-t border-purple-500/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-purple-300">
          <p>&copy; 2026 Formiga Grande - Área VIP. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

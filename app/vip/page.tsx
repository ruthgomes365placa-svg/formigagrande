'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VIPPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/vip-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: isLogin ? undefined : name,
          action: isLogin ? 'login' : 'register',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro na operação');
        return;
      }

      // Salvar token no localStorage
      localStorage.setItem('vip_token', data.token);
      localStorage.setItem('vip_user', JSON.stringify(data.member));

      setSuccess(data.message);
      setTimeout(() => {
        router.push('/vip/dashboard');
      }, 1500);
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-white hover:text-purple-300">
            Formiga Grande
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-white hover:text-purple-300 font-semibold">
              Home
            </Link>
            <Link href="/sobre" className="text-white hover:text-purple-300 font-semibold">
              Sobre
            </Link>
            <Link href="/blog" className="text-white hover:text-purple-300 font-semibold">
              Blog
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* VIP Badge */}
          <div className="text-center mb-8 animate-pulse">
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-sm tracking-wider">
              👑 ACESSO VIP EXCLUSIVO 👑
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {isLogin ? 'Bem-vindo de Volta!' : 'Junte-se à Comunidade VIP'}
              </h1>
              <p className="text-purple-200">
                {isLogin
                  ? 'Acesse seus conteúdos exclusivos'
                  : 'Desbloqueie vídeos aulas, arquivos e muito mais'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-white font-semibold mb-2 block">Nome Completo</label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-400/50 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-200"
                  />
                </div>
              )}

              <div>
                <label className="text-white font-semibold mb-2 block">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-purple-400/50 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-200"
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-purple-400/50 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-200"
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 transform hover:scale-105 text-lg"
              >
                {loading ? '⏳ Processando...' : isLogin ? '🔓 Entrar' : '🚀 Criar Conta VIP'}
              </button>
            </form>

            {/* Toggle */}
            <div className="text-center mt-6 text-purple-200">
              {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
                className="text-yellow-400 font-bold hover:text-yellow-300 underline"
              >
                {isLogin ? 'Crie aqui' : 'Entrar'}
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-500/30">
              <div className="text-3xl mb-2">📺</div>
              <p className="text-sm text-purple-200 font-semibold">Vídeos Aulas</p>
            </div>
            <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-500/30">
              <div className="text-3xl mb-2">📂</div>
              <p className="text-sm text-purple-200 font-semibold">Arquivos PDF</p>
            </div>
            <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-500/30">
              <div className="text-3xl mb-2">💬</div>
              <p className="text-sm text-purple-200 font-semibold">Chat Exclusivo</p>
            </div>
          </div>

          {/* Pricing Section */}
          {success && (
            <div className="mt-12 bg-gradient-to-br from-green-900/50 to-green-800/50 border border-green-500/50 rounded-2xl p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-green-300 mb-2">Pronto para contratar?</h2>
                <p className="text-green-200 mb-6">Após criar sua conta, você pode assinar nosso plano VIP para acessar todos os conteúdos exclusivos.</p>
                
                <div className="bg-black/30 px-6 py-4 rounded-lg inline-block mb-6">
                  <div className="text-5xl font-bold text-white">€99.90</div>
                  <div className="text-green-300 font-semibold">por mês</div>
                  <div className="text-sm text-green-200 mt-2">Canceled anytime • Sem contrato</div>
                </div>

                <div className="space-y-2 mb-6 text-left">
                  <p className="text-green-200">✅ Acesso completo a todos os vídeos</p>
                  <p className="text-green-200">✅ Download de arquivos e PDFs</p>
                  <p className="text-green-200">✅ Chat exclusivo com a comunidade</p>
                  <p className="text-green-200">✅ Atualizações mensais de conteúdo</p>
                </div>
              </div>
            </div>
          )}

          {/* CTA Button - Back to Home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block text-purple-300 hover:text-purple-100 transition underline"
            >
              ← Voltar à página inicial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 border-t border-purple-500/30 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-purple-300">
          <p>&copy; 2026 Formiga Grande. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

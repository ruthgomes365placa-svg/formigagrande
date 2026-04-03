'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface JobOpening {
  id: string;
  title: string;
  department: string;
  salary_range: string;
  requirements: string;
  description: string;
  benefits: string;
  created_at: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de vagas (em produção, viria do Supabase)
    setTimeout(() => {
      setJobs([
        {
          id: '1',
          title: 'Desenvolvedor Full Stack',
          department: 'Desenvolvimento',
          salary_range: '€ 1.500 - € 2.500',
          requirements: 'React, Node.js, PostgreSQL, 2+ anos de experiência',
          description:
            'Procuramos um desenvolvedor apaixonado por código limpo e arquitetura escalável.',
          benefits:
            'WFH, Bônus, Formação contínua, Seguro de saúde',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Designer UX/UI',
          department: 'Design',
          salary_range: '€ 1.200 - € 1.800',
          requirements: 'Figma, Prototyping, 3+ anos de experiência',
          description:
            'Crie interfaces incríveis que transformem a experiência do usuário.',
          benefits:
            'WFH 3x/semana, Ambiente criativo, Equipamento completo',
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          title: 'Especialista em Marketing Digital',
          department: 'Marketing',
          salary_range: '€ 1.400 - € 2.000',
          requirements:
            'SEO, Google Ads, Analytics, Community Management, 2+ anos',
          description:
            'Lidere nossas estratégias de marketing digital e crescimento.',
          benefits:
            'Bônus de performance, Conferências, Networking',
          created_at: new Date(Date.now() - 172800000).toISOString(),
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const timeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const days = Math.floor(diff / 86400000);

    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    return `${days} dias atrás`;
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
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-semibold">
              Home
            </Link>
            <Link href="/sobre" className="text-gray-700 hover:text-blue-600 font-semibold">
              Sobre
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-semibold">
              Blog
            </Link>
            <Link href="/vagas" className="text-blue-600 font-bold border-b-2 border-blue-600">
              Vagas
            </Link>
            <Link href="/vip" className="text-gray-700 hover:text-purple-600 font-semibold">
              👑 VIP
            </Link>
          </div>
        </div>
      </nav>

      {/* Header Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🚀 Oportunidades de Emprego</h1>
          <p className="text-xl text-blue-100">
            Junte-se à nossa equipe e faça parte de algo extraordinário
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Filtros</h3>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Departamento</h4>
                <div className="space-y-2">
                  <label className="flex items-center text-gray-600 hover:text-gray-800">
                    <input type="checkbox" className="mr-2" />
                    Desenvolvimento
                  </label>
                  <label className="flex items-center text-gray-600 hover:text-gray-800">
                    <input type="checkbox" className="mr-2" />
                    Design
                  </label>
                  <label className="flex items-center text-gray-600 hover:text-gray-800">
                    <input type="checkbox" className="mr-2" />
                    Marketing
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Tipo de Contrato</h4>
                <div className="space-y-2">
                  <label className="flex items-center text-gray-600 hover:text-gray-800">
                    <input type="checkbox" className="mr-2" />
                    Período Integral
                  </label>
                  <label className="flex items-center text-gray-600 hover:text-gray-800">
                    <input type="checkbox" className="mr-2" />
                    Part-Time
                  </label>
                  <label className="flex items-center text-gray-600 hover:text-gray-800">
                    <input type="checkbox" className="mr-2" />
                    Freelancer
                  </label>
                </div>
              </div>

              <Link
                href="/vagas/candidatar"
                className="w-full mt-8 inline-block bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-lg text-center transition"
              >
                📝 Criar Meu Perfil
              </Link>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">🔄 Carregando vagas...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-blue-600"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">{job.title}</h3>
                        <p className="text-gray-600 font-semibold">{job.department}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {timeAgo(job.created_at)}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4">{job.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">💰 Salário</p>
                        <p className="font-bold text-gray-800">{job.salary_range}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">📌 Localização</p>
                        <p className="font-bold text-gray-800">Remoto / Híbrido</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 font-semibold mb-2">✅ Requisitos</p>
                      <p className="text-gray-700">{job.requirements}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 font-semibold mb-2">🎁 Benefícios</p>
                      <p className="text-gray-700">{job.benefits}</p>
                    </div>

                    <Link
                      href={`/vagas/candidatar?job=${job.id}`}
                      className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2 px-6 rounded-lg transition"
                    >
                      🎯 Candidatar-se
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">🌟 Não encontrou a vaga ideal?</h2>
          <p className="text-xl mb-6">
            Crie seu perfil profissional e deixa que as oportunidades venham até você!
          </p>
          <Link
            href="/vagas/candidatar"
            className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition text-lg"
          >
            ➕ Criar Perfil Profissional
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 Formiga Grande. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

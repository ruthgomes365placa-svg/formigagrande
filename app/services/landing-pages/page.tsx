'use client';

import Link from 'next/link';
import { useState } from 'react';


export default function LandingPages() {
  const [selectedTask, setSelectedTask] = useState(0);

  const subtasks = [
    {
      title: "Análise e Planejamento",
      description: "Analisamos seu produto e público-alvo",
      details: [
        "Pesquisa de mercado",
        "Definição de buyer persona",
        "Análise de concorrentes",
        "Estratégia de conversão"
      ]
    },
    {
      title: "Design e Prototipagem",
      description: "Criamos designs modernos e responsivos",
      details: [
        "Wireframes",
        "Protótipos interativos",
        "Design responsivo",
        "Testes de usabilidade"
      ]
    },
    {
      title: "Desenvolvimento",
      description: "Implementação técnica com as melhores práticas",
      details: [
        "HTML/CSS otimizado",
        "JavaScript interativo",
        "Otimização de performance",
        "SEO on-page"
      ]
    },
    {
      title: "Integração e Deploy",
      description: "Colocamos sua página ao vivo",
      details: [
        "Integração com ferramentas de email",
        "Configuração de DNS",
        "SSL e segurança",
        "Monitoramento e analytics"
      ]
    }
  ];

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
      <header className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-sm hover:text-blue-100 mb-4 inline-block">
            ← Voltar para Home
          </Link>
          <h1 className="text-4xl font-bold">Desenvolvimento de Landing Pages</h1>
          <p className="text-lg mt-2 text-blue-100">Páginas de destino que convertem visitantes em clientes</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Overview */}
        <section className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Sobre o Serviço</h2>
          <p className="text-gray-700 mb-4">
            Uma landing page bem-designed é essencial para converter visitantes em leads qualificados. 
            Nós criamos páginas otimizadas que capturam atenção, transmitem confiança e geram ações.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-2xl font-bold text-blue-600">98%</p>
              <p className="text-sm text-gray-600">Taxa de Conversão Média</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-2xl font-bold text-green-600">2-4</p>
              <p className="text-sm text-gray-600">Semanas de Desenvolvimento</p>
            </div>
            <div className="bg-orange-50 p-4 rounded">
              <p className="text-2xl font-bold text-orange-600">∞</p>
              <p className="text-sm text-gray-600">Atualizações Ilimitadas</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-2xl font-bold text-purple-600">24h</p>
              <p className="text-sm text-gray-600">Suporte Prioritário</p>
            </div>
          </div>
        </section>

        {/* Subtasks */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Etapas do Projeto</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Task List */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {subtasks.map((task, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTask(index)}
                    className={`w-full text-left p-4 border-b transition-colors ${
                      selectedTask === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-sm opacity-75">{task.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Task Details */}
            <div className="md:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4">{subtasks[selectedTask].title}</h3>
                <p className="text-gray-600 mb-6">{subtasks[selectedTask].description}</p>
                <h4 className="font-semibold text-lg mb-4">Atividades Incluídas:</h4>
                <ul className="space-y-3">
                  {subtasks[selectedTask].details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 font-bold mr-3">✓</span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Pronto para sua Landing Page?</h3>
          <p className="mb-6">Entre em contato agora para uma consulta gratuita</p>
          <a href="/contato" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Solicitar Orçamento
          </a>
        </section>
      </main>
    </div>
  );
}

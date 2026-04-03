'use client';

import Link from 'next/link';
import { useState } from 'react';


export default function SEOConsultoria() {
  const [selectedTask, setSelectedTask] = useState(0);

  const subtasks = [
    {
      title: "Auditoria Técnica",
      description: "Análise da saúde do teu site",
      details: [
        "Verificação de velocidade de carregamento",
        "Análise de erros de código e crawling",
        "Avaliação de indexação no Google",
        "Verificação de mobile responsiveness",
        "Teste de core web vitals"
      ]
    },
    {
      title: "Pesquisa de Palavras-chave",
      description: "Descobre o que os teus clientes procuram",
      details: [
        "Análise de palavras-chave relevantes",
        "Identificação de intenção de busca",
        "Análise de volume de pesquisa",
        "Classificação de dificuldade",
        "Oportunidades de nichos não explorados"
      ]
    },
    {
      title: "SEO On-Page",
      description: "Otimização interna do site",
      details: [
        "Otimização de títulos e meta descrições",
        "Estruturação de conteúdo com headings",
        "Otimização de imagens e alt text",
        "Implementação de schema markup",
        "Melhorias de UX e legibilidade"
      ]
    },
    {
      title: "SEO Local",
      description: "Apareça no Google Maps e pesquisas locais",
      details: [
        "Otimização do Google Business Profile",
        "Geração de citações locais",
        "Avaliações e reputação online",
        "Schemas locais estruturados",
        "Estratégia de local SEO multi-localização"
      ]
    },
    {
      title: "Relatórios Mensais",
      description: "Acompanhamento contínuo com dados",
      details: [
        "Posicionamento de palavras-chave",
        "Análise de tráfego orgânico",
        "Relatório de conversões",
        "Comparativo com concorrentes",
        "Recomendações de próximos passos"
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
      <header className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-sm hover:text-green-100 mb-4 inline-block">
            ← Voltar para Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Consultoria em SEO</h1>
          <h2 className="text-2xl mb-6 font-light text-green-100">
            Não basta ter um site, ele precisa de ser encontrado por quem quer comprar.
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl">
            SEO é mais que simplesmente aparecer no Google. É aparecer para as pessoas certas, 
            na hora certa, com a mensagem certa. Transformamos visitantes em clientes.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Overview */}
        <section className="bg-white p-8 rounded-lg shadow-md mb-12">
          <h2 className="text-3xl font-bold mb-6">Por que SEO é Essencial?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <p className="text-3xl font-bold text-green-600 mb-2">93%</p>
              <p className="text-gray-700 font-semibold">Das buscas começam no Google</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-3xl font-bold text-blue-600 mb-2">+300%</p>
              <p className="text-gray-700 font-semibold">Aumento médio de tráfego</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <p className="text-3xl font-bold text-orange-600 mb-2">6-12m</p>
              <p className="text-gray-700 font-semibold">Tempo para primeiros resultados</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <p className="text-3xl font-bold text-purple-600 mb-2">ROI</p>
              <p className="text-gray-700 font-semibold">Retorno de 5x a 10x</p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-12">O Que Fazemos</h2>
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
                        ? 'bg-green-600 text-white'
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
                <h3 className="text-2xl font-bold mb-4 text-green-600">{subtasks[selectedTask].title}</h3>
                <p className="text-gray-600 mb-6 text-lg">{subtasks[selectedTask].description}</p>
                <h4 className="font-semibold text-lg mb-4 text-gray-800">Atividades Incluídas:</h4>
                <ul className="space-y-3">
                  {subtasks[selectedTask].details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 font-bold mr-3 text-xl">✓</span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Diferencial */}
        <section className="bg-gradient-to-r from-green-50 to-green-100 p-8 rounded-lg mb-12 border-l-4 border-green-600">
          <h3 className="text-2xl font-bold text-green-800 mb-4">🎯 Nosso Diferencial</h3>
          <p className="text-gray-700 text-lg">
            <strong>Relatórios Mensais de Posicionamento e Tráfego Orgânico</strong>
          </p>
          <p className="text-gray-600 mt-3">
            Você recebe dados reais e acionáveis mensalmente. Não vendemos promessas vazias, 
            vendemos resultados. Cada relatório mostra exatamente onde você está, para onde está indo, 
            e o que fazer para chegar mais rápido.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-green-600 to-green-800 text-white p-8 rounded-lg text-center">
          <h3 className="text-3xl font-bold mb-4">Quer Aparecer no Topo do Google?</h3>
          <p className="text-lg mb-8 text-green-100">Solicite uma análise gratuita do seu site e veja quantas oportunidades está deixando passar.</p>
          <Link href="/contato" className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition inline-block text-lg">
            Quero uma análise gratuita do meu site
          </Link>
        </section>
      </main>
    </div>
  );
}

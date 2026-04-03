'use client';

import Link from 'next/link';
import { useState } from 'react';


export default function Design() {
  const [selectedTask, setSelectedTask] = useState(0);

  const subtasks = [
    {
      title: "Pesquisa e Discovery",
      description: "Entender o seu público",
      details: [
        "Pesquisa de usuário",
        "Personas e jornadas",
        "Análise de concorrentes",
        "Benchmarking"
      ]
    },
    {
      title: "Design UI",
      description: "Interfaces visuais incríveis",
      details: [
        "Wireframes e mockups",
        "Design system",
        "Component library",
        "Prototipagem interativa"
      ]
    },
    {
      title: "Design UX",
      description: "Experiências memoráveis",
      details: [
        "Arquitetura de informação",
        "Fluxos de usuário",
        "Testes de usabilidade",
        "Otimização de conversão"
      ]
    },
    {
      title: "Identidade Visual",
      description: "Marca coerente",
      details: [
        "Logo e logotipo",
        "Paleta de cores",
        "Tipografia",
        "Brand guidelines"
      ]
    },
    {
      title: "Implementação",
      description: "Design em código",
      details: [
        "Design tokens",
        "CSS modernas",
        "Animações suaves",
        "Responsividade perfeita"
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
      <header className="bg-fuchsia-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-sm hover:text-fuchsia-100 mb-4 inline-block">
            ← Voltar para Home
          </Link>
          <h1 className="text-4xl font-bold">Design e UX/UI</h1>
          <p className="text-lg mt-2 text-fuchsia-100">Interfaces que encantan e convertem</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Overview */}
        <section className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Sobre o Serviço</h2>
          <p className="text-gray-700 mb-4">
            Design profissional que combina beleza, funcionalidade e conversão. 
            Criamos experiências digitais que seus usuários amam.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-fuchsia-50 p-4 rounded">
              <p className="text-2xl font-bold text-fuchsia-600">+50%</p>
              <p className="text-sm text-gray-600">Aumento de Conversão</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-2xl font-bold text-blue-600">2-4</p>
              <p className="text-sm text-gray-600">Semanas de Projeto</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-2xl font-bold text-green-600">A/B</p>
              <p className="text-sm text-gray-600">Testes Inclusos</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-2xl font-bold text-purple-600">∞</p>
              <p className="text-sm text-gray-600">Revisões</p>
            </div>
          </div>
        </section>

        {/* Subtasks */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Processo de Design</h2>
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
                        ? 'bg-fuchsia-600 text-white'
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
                <h4 className="font-semibold text-lg mb-4">Atividades:</h4>
                <ul className="space-y-3">
                  {subtasks[selectedTask].details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-fuchsia-600 font-bold mr-3">✓</span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 bg-gradient-to-r from-fuchsia-600 to-fuchsia-800 text-white p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Transforme Seu Digital</h3>
          <p className="mb-6">Crie experiências memoráveis com nosso design</p>
          <a href="/contato" className="bg-white text-fuchsia-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Começar Design
          </a>
        </section>
      </main>
    </div>
  );
}

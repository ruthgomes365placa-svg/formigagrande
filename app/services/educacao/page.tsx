'use client';

import Link from 'next/link';
import { useState } from 'react';


export default function Educacao() {
  const [selectedTask, setSelectedTask] = useState(0);

  const subtasks = [
    {
      title: "Cursos Online",
      description: "Aprenda no seu ritmo",
      details: [
        "Plaforma com certificado",
        "Videoaulas em HD",
        "Material de estudo",
        "Acesso vitalício"
      ]
    },
    {
      title: "Workshops ao Vivo",
      description: "Aprendizado interativo",
      details: [
        "Sessões semanais",
        "Q&A ao vivo",
        "Projetos práticos",
        "Networking"
      ]
    },
    {
      title: "Documentação Técnica",
      description: "Referência completa",
      details: [
        "Guias passo a passo",
        "Exemplos de código",
        "Melhores práticas",
        "Troubleshooting"
      ]
    },
    {
      title: "Blog e Newsletter",
      description: "Conteúdo atualizado",
      details: [
        "Artigos técnicos",
        "Análises de mercado",
        "Dicas de produtividade",
        "Lançamentos new tech"
      ]
    },
    {
      title: "Comunidade",
      description: "Aprenda com outros",
      details: [
        "Discord privado",
        "Fórum de discussão",
        "Código compartilhado",
        "Networking profissional"
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
      <header className="bg-violet-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-sm hover:text-violet-100 mb-4 inline-block">
            ← Voltar para Home
          </Link>
          <h1 className="text-4xl font-bold">Educação e Conhecimento</h1>
          <p className="text-lg mt-2 text-violet-100">Capacitate sua equipe com aprendizado contínuo</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Overview */}
        <section className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Sobre o Serviço</h2>
          <p className="text-gray-700 mb-4">
            Educação profissional continuada com conteúdo atualizado, comunidade ativa e suporte direto. 
            Invista no desenvolvimento da sua equipe.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-violet-50 p-4 rounded">
              <p className="text-2xl font-bold text-violet-600">500+</p>
              <p className="text-sm text-gray-600">Horas de Conteúdo</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-2xl font-bold text-blue-600">2K+</p>
              <p className="text-sm text-gray-600">Alunos Ativos</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-2xl font-bold text-green-600">95%</p>
              <p className="text-sm text-gray-600">Taxa Aprovação</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-2xl font-bold text-purple-600">∞</p>
              <p className="text-sm text-gray-600">Aprendizado</p>
            </div>
          </div>
        </section>

        {/* Subtasks */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Recursos de Aprendizado</h2>
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
                        ? 'bg-violet-600 text-white'
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
                <h4 className="font-semibold text-lg mb-4">O que você terá:</h4>
                <ul className="space-y-3">
                  {subtasks[selectedTask].details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-violet-600 font-bold mr-3">✓</span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 bg-gradient-to-r from-violet-600 to-violet-800 text-white p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Comece a Aprender Hoje!</h3>
          <p className="mb-6">Acesso a todos os recursos e comunidade</p>
          <a href="/contato" className="bg-white text-violet-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Inscrever-se Agora
          </a>
        </section>
      </main>
    </div>
  );
}

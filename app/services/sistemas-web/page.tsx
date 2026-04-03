'use client';

import Link from 'next/link';
import { useState } from 'react';


export default function SistemasWeb() {
  const [selectedTask, setSelectedTask] = useState(0);

  const subtasks = [
    {
      title: "Especificação e Design",
      description: "Defina exatamente o que você precisa",
      details: [
        "Análise de requisitos",
        "Arquitetura do sistema",
        "Banco de dados design",
        "Prototipagem"
      ]
    },
    {
      title: "Desenvolvimento Backend",
      description: "Servidor robusto e seguro",
      details: [
        "API REST/GraphQL",
        "Autenticação segura",
        "Integração com serviços",
        "Otimização de performance"
      ]
    },
    {
      title: "Desenvolvimento Frontend",
      description: "Interface moderna e responsiva",
      details: [
        "React/Vue/Angular",
        "Design responsivo",
        "Estado management",
        "Testes automatizados"
      ]
    },
    {
      title: "Testes e QA",
      description: "Sistema confiável",
      details: [
        "Testes unitários",
        "Testes de integração",
        "Testes end-to-end",
        "Cobertura de código"
      ]
    },
    {
      title: "Deploy e Manutenção",
      description: "Sempre funcionando",
      details: [
        "CI/CD pipeline",
        "Deploy automático",
        "Monitoramento 24/7",
        "Suporte técnico"
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
      <header className="bg-cyan-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-sm hover:text-cyan-100 mb-4 inline-block">
            ← Voltar para Home
          </Link>
          <h1 className="text-4xl font-bold">Desenvolvimento de Sistemas Web</h1>
          <p className="text-lg mt-2 text-cyan-100">Aplicações web robustas e escaláveis</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Overview */}
        <section className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Sobre o Serviço</h2>
          <p className="text-gray-700 mb-4">
            Desenvolvemos sistemas web complexos com as tecnologias mais modernas. 
            Desde MVPs até grandes aplicações, com escalabilidade garantida.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-cyan-50 p-4 rounded">
              <p className="text-2xl font-bold text-cyan-600">100+</p>
              <p className="text-sm text-gray-600">Projetos Entregues</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-2xl font-bold text-blue-600">100K+</p>
              <p className="text-sm text-gray-600">Usuários Ativos</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-2xl font-bold text-green-600">99.99%</p>
              <p className="text-sm text-gray-600">Disponibilidade</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-2xl font-bold text-purple-600">0</p>
              <p className="text-sm text-gray-600">Downtime</p>
            </div>
          </div>
        </section>

        {/* Subtasks */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Etapas de Desenvolvimento</h2>
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
                        ? 'bg-cyan-600 text-white'
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
                      <span className="text-cyan-600 font-bold mr-3">✓</span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 bg-gradient-to-r from-cyan-600 to-cyan-800 text-white p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Realize seu Projeto Digital!</h3>
          <p className="mb-6">Transforme sua ideia em uma aplicação web profissional</p>
          <a href="/contato" className="bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Começar Projeto
          </a>
        </section>
      </main>
    </div>
  );
}

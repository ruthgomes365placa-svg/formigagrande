'use client';

import Link from 'next/link';
import { useState } from 'react';


export default function Mentorias() {
  const [selectedLevel, setSelectedLevel] = useState(0);

  const levels = [
    {
      title: "Iniciante (0-1 ano)",
      description: "Estou começando do zero",
      details: [
        "Fundamentos de programação e lógica",
        "HTML, CSS e JavaScript essencial",
        "Planejamento de carreira",
        "Como conseguir seu primeiro projeto",
        "Portfolio e presença online"
      ]
    },
    {
      title: "Intermediário (1-3 anos)",
      description: "Tenho experiência básica",
      details: [
        "Aprofundar em React/Vue/Angular",
        "Backend com Node.js/Python",
        "Banco de dados e APIs",
        "como conseguir clientes (freelancing)",
        "Negociação de salários e contratos"
      ]
    },
    {
      title: "Avançado (3+ anos)",
      description: "Tenho experiência, quero crescer",
      details: [
        "Arquitetura de sistemas escaláveis",
        "Liderar e mentoring outras pessoas",
        "Como criar seu próprio produto",
        "Estratégia de negócios para tech",
        "Otimização de performance extrema"
      ]
    },
    {
      title: "Foco em Negócios",
      description: "Tenho expertise técnica, quero lucrar",
      details: [
        "Como prosperar clientes e vender",
        "Precificação de serviços técnicos",
        "Business model canvas e lean startup",
        "Marketing para desenvolvedores",
        "Escalando de freelancer para agência"
      ]
    }
  ];

  const stacks = [
    {
      name: "Frontend",
      techs: ["HTML/CSS", "JavaScript", "React", "Vue", "Tailwind CSS", "TypeScript"]
    },
    {
      name: "Backend",
      techs: ["Node.js", "Express", "Python", "Django", "PostgreSQL", "MongoDB"]
    },
    {
      name: "Mobile",
      techs: ["React Native", "Flutter", "Swift", "Kotlin"]
    },
    {
      name: "DevOps",
      techs: ["Docker", "AWS", "Vercel", "GitHub Actions", "CI/CD"]
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
      <header className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-sm hover:text-indigo-100 mb-4 inline-block">
            ← Voltar para Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Mentorias Individuais</h1>
          <h2 className="text-2xl mb-6 font-light text-indigo-100">
            Aprende com quem faz no dia a dia.
          </h2>
          <p className="text-lg text-indigo-100 max-w-2xl">
            Mentoria personalizada para o teu nível atual (Iniciante ao Avançado). 
            Foco em stack técnica (HTML, CSS, React, etc.) ou em Negócios (Como conseguir clientes).
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Overview */}
        <section className="bg-white p-8 rounded-lg shadow-md mb-12">
          <h2 className="text-3xl font-bold mb-6">Por que Mentoria?</h2>
          <p className="text-gray-700 text-lg mb-8">
            Aprender a programar sozinho é difícil. Você comete erros, perde tempo em coisas irrelevantes, 
            e pode vir a desenvolver hábitos ruins. Com mentoria, você anda 10x mais rápido.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-indigo-50 p-6 rounded-lg">
              <p className="text-3xl font-bold text-indigo-600 mb-2">10x</p>
              <p className="text-gray-700 font-semibold">Mais rápido do que sozinho</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <p className="text-3xl font-bold text-green-600 mb-2">1:1</p>
              <p className="text-gray-700 font-semibold">Personalizado para você</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-3xl font-bold text-blue-600 mb-2">100%</p>
              <p className="text-gray-700 font-semibold">Prático e aplicável</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <p className="text-3xl font-bold text-purple-600 mb-2">∞</p>
              <p className="text-gray-700 font-semibold">Suporte ilimitado</p>
            </div>
          </div>
        </section>

        {/* Levels Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-12">Escolha seu Nível</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Task List */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {levels.map((level, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedLevel(index)}
                    className={`w-full text-left p-4 border-b transition-colors ${
                      selectedLevel === index
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-semibold text-sm">{level.title}</p>
                    <p className="text-xs opacity-75">{level.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Task Details */}
            <div className="md:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4 text-indigo-600">{levels[selectedLevel].title}</h3>
                <p className="text-gray-600 mb-6 text-lg">{levels[selectedLevel].description}</p>
                <h4 className="font-semibold text-lg mb-4 text-gray-800">O que você aprenderá:</h4>
                <ul className="space-y-3">
                  {levels[selectedLevel].details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-indigo-600 font-bold mr-3 text-xl">✓</span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stacks */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-12">Tecnologias que Ensinamos</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stacks.map((stack, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-indigo-600">{stack.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {stack.techs.map((tech) => (
                    <span key={tech} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Transformação */}
        <section className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-8 rounded-lg mb-12 border-l-4 border-indigo-600">
          <h3 className="text-2xl font-bold text-indigo-800 mb-4">🚀 Foco em Transformação</h3>
          <p className="text-gray-700 text-lg">
            Não ensinamos apenas "como programar". Transformamos você em um profissional procurado, 
            que consegue clientes, que ganha bem, e que sabe não apenas escrever código, mas construir soluções que geram lucro.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-8 rounded-lg text-center">
          <h3 className="text-3xl font-bold mb-4">Pronto para se Transformar?</h3>
          <p className="text-lg mb-8 text-indigo-100">Agende uma sessão de diagnóstico gratuita e conheça seu mentor personalizado.</p>
          <Link href="/contato" className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition inline-block text-lg">
            Solicitar Mentoria Gratuita
          </Link>
        </section>
      </main>
    </div>
  );
}

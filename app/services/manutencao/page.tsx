'use client';

import Link from 'next/link';
import { useState } from 'react';


export default function Manutencao() {
  const [selectedTask, setSelectedTask] = useState(0);

  const subtasks = [
    {
      title: "Atualizações de Segurança",
      description: "Proteção contra invasões",
      details: [
        "Patches de segurança aplicados automaticamente",
        "Proteção contra ataques de hackers",
        "Remoção de malware em tempo real",
        "Certificados SSL mantidos atualizados",
        "Testes de vulnerabilidade regulares"
      ]
    },
    {
      title: "Backups Diários/Semanais",
      description: "Garantia de que nada se perde",
      details: [
        "Backups automáticos diários de todos os dados",
        "Retenção de 30 dias de backups",
        "Testes de restauração regulares",
        "Backup geograficamente distribuído",
        "Recuperação em caso de desastres"
      ]
    },
    {
      title: "Otimização de Performance",
      description: "Site rápido e responsivo",
      details: [
        "Limpeza e otimização de base de dados",
        "Compressão de imagens e assets",
        "Implementação de caching avançado",
        "Monitoramento de velocidade 24/7",
        "Atualizações de dependências"
      ]
    },
    {
      title: "Correção de Erros (Bugs)",
      description: "Tudo funcionando perfeitamente",
      details: [
        "Ajustes visuais e de layout",
        "Correção de funcionalidades quebradas",
        "Testes regressivos automáticos",
        "Suporte técnico prioritário",
        "Implementação de melhorias de UX"
      ]
    },
    {
      title: "Suporte Prioritário",
      description: "Sempre disponível quando precisa",
      details: [
        "Canal direto de comunicação",
        "Dúvidas respondidas em até 4 horas",
        "Alterações rápidas de conteúdo",
        "Suporte 24/7 para emergências",
        "Reuniões mensais de estratégia"
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
      <header className="bg-amber-600 text-white py-16">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-sm hover:text-amber-100 mb-4 inline-block">
            ← Voltar para Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Manutenção de Sites</h1>
          <h2 className="text-2xl mb-6 font-light text-amber-100">
            O teu site seguro, rápido e sempre online. Nós cuidamos de tudo.
          </h2>
          <p className="text-lg text-amber-100 max-w-2xl">
            Um site parado é um site que perde dinheiro. Oferecemos tranquilidade total 
            em gerenciamento, segurança e performance. Você foca no seu negócio, nós cuidamos da tecnologia.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Overview */}
        <section className="bg-white p-8 rounded-lg shadow-md mb-12">
          <h2 className="text-3xl font-bold mb-6">Por que Manutenção?</h2>
          <p className="text-gray-700 text-lg mb-8">
            Muitos clientes não sabem que um site precisa de cuidados constantes. 
            É como um carro: sem manutenção, quebra no pior momento.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-600">
              <p className="text-2xl font-bold text-red-600 mb-2">❌ Problema</p>
              <p className="text-gray-700 text-sm">Site fora do ar custa milhares</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-600">
              <p className="text-2xl font-bold text-yellow-600 mb-2">⚠️ Risco</p>
              <p className="text-gray-700 text-sm">Hackers exploram vulnerabilidades</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <p className="text-2xl font-bold text-blue-600 mb-2">🐢 Impacto</p>
              <p className="text-gray-700 text-sm">Site lento perde clientes</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
              <p className="text-2xl font-bold text-green-600 mb-2">✓ Solução</p>
              <p className="text-gray-700 text-sm">Prevenção é mais barata</p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-12">Plano de Manutenção</h2>
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
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-semibold text-sm">{task.title}</p>
                    <p className="text-xs opacity-75">{task.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Task Details */}
            <div className="md:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4 text-amber-600">{subtasks[selectedTask].title}</h3>
                <p className="text-gray-600 mb-6 text-lg">{subtasks[selectedTask].description}</p>
                <h4 className="font-semibold text-lg mb-4 text-gray-800">Incluído neste serviço:</h4>
                <ul className="space-y-3">
                  {subtasks[selectedTask].details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-amber-600 font-bold mr-3 text-xl">✓</span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Diferencial */}
        <section className="bg-gradient-to-r from-amber-50 to-amber-100 p-8 rounded-lg mb-12 border-l-4 border-amber-600">
          <h3 className="text-2xl font-bold text-amber-800 mb-4">💡 Nosso Diferencial</h3>
          <p className="text-gray-700 text-lg mb-3 font-semibold">
            "Prevenção é mais barata do que a recuperação de um site fora do ar"
          </p>
          <p className="text-gray-700">
            Enquanto outros esperam os problemas aparecerem, nós prevenimos. 
            Seu site recebe cuidados 24/7. Se algo der errado, você saberá em segundos, 
            e nós estaremos resolvendo automaticamente.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-amber-600 to-amber-800 text-white p-8 rounded-lg text-center">
          <h3 className="text-3xl font-bold mb-4">Tranquilidade Total para Seu Site</h3>
          <p className="text-lg mb-8 text-amber-100">Contrate manutenção profissional e durma tranquilo sabendo que seu site está protegido.</p>
          <Link href="/contato" className="bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition inline-block text-lg">
            Ver planos de manutenção
          </Link>
        </section>
      </main>
    </div>
  );
}

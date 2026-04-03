'use client';

import Link from 'next/link';
import { useState } from 'react';


export default function Hospedagem() {
  const [selectedTask, setSelectedTask] = useState(0);

  const subtasks = [
    {
      title: "Infraestrutura em Nuvem",
      description: "Servidores poderosos e confiáveis",
      details: [
        "AWS/Google Cloud/Azure",
        "Load balancing",
        "Auto-scaling",
        "CDN global"
      ]
    },
    {
      title: "Banco de Dados",
      description: "Armazenamento seguro",
      details: [
        "PostgreSQL/MySQL",
        "Backups automáticos",
        "Replicação",
        "Disaster recovery"
      ]
    },
    {
      title: "CI/CD Pipeline",
      description: "Deploy automático e seguro",
      details: [
        "GitHub Actions",
        "Testes automáticos",
        "Deploy zero-downtime",
        "Rollback instantâneo"
      ]
    },
    {
      title: "Segurança",
      description: "Proteção contra ameaças",
      details: [
        "Firewall avançado",
        "DDoS protection",
        "SSL/TLS certificates",
        "Penetration testing"
      ]
    },
    {
      title: "Monitoramento e Suporte",
      description: "24/7 de vigilância",
      details: [
        "Uptime monitoring",
        "Performance tracking",
        "Alertas em tempo real",
        "Suporte técnico 24/7"
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
      <header className="bg-orange-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-sm hover:text-orange-100 mb-4 inline-block">
            ← Voltar para Home
          </Link>
          <h1 className="text-4xl font-bold">Hospedagem e Deploy</h1>
          <p className="text-lg mt-2 text-orange-100">Sua aplicação sempre online</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Overview */}
        <section className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Sobre o Serviço</h2>
          <p className="text-gray-700 mb-4">
            Hospedagem profissional em infraestrutura em nuvem de topo. 
            Deploy automatizado, segurança garantida e suporte 24/7.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-50 p-4 rounded">
              <p className="text-2xl font-bold text-orange-600">99.99%</p>
              <p className="text-sm text-gray-600">Uptime SLA</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-2xl font-bold text-blue-600">⚡</p>
              <p className="text-sm text-gray-600">Super Rápido</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-2xl font-bold text-green-600">∞</p>
              <p className="text-sm text-gray-600">Escalável</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-2xl font-bold text-purple-600">$49</p>
              <p className="text-sm text-gray-600">Por Mês</p>
            </div>
          </div>
        </section>

        {/* Subtasks */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Infraestrutura Completa</h2>
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
                        ? 'bg-orange-600 text-white'
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
                <h4 className="font-semibold text-lg mb-4">Incluso:</h4>
                <ul className="space-y-3">
                  {subtasks[selectedTask].details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-600 font-bold mr-3">✓</span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 bg-gradient-to-r from-orange-600 to-orange-800 text-white p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Deploy em 5 Minutos!</h3>
          <p className="mb-6">Sua aplicação na nuvem com segurança e performance</p>
          <a href="/contato" className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Fazer Deploy Agora
          </a>
        </section>
      </main>
    </div>
  );
}

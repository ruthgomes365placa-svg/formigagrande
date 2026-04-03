'use client';

import Link from 'next/link';
import { useState } from 'react';


export default function Ecommerce() {
  const [selectedTask, setSelectedTask] = useState(0);

  const subtasks = [
    {
      title: "Planejamento e Estratégia",
      description: "Define a base do seu negócio online",
      details: [
        "Análise de viabilidade",
        "Definição de modelo de negócio",
        "Seleção de plataforma",
        "Estudo de mercado"
      ]
    },
    {
      title: "Design do Catálogo",
      description: "Interface intuitiva e atrativa",
      details: [
        "Design responsivo",
        "Organização de categorias",
        "Fichas de produto otimizadas",
        "Sistema de busca"
      ]
    },
    {
      title: "Integração de Pagamento",
      description: "Múltiplas opções seguras",
      details: [
        "Integração com PayPal",
        "Stripe e outras gateways",
        "Cartão de crédito seguro",
        "Boleto e PIX"
      ]
    },
    {
      title: "Configuração Logística",
      description: "Entrega segura dos produtos",
      details: [
        "Integração com correios",
        "Cálculo de frete automático",
        "Gestão de estoque",
        "Rastreamento de pedidos"
      ]
    },
    {
      title: "Marketing e SEO",
      description: "Atraia clientes para sua loja",
      details: [
        "Otimização SEO e-commerce",
        "Integração com redes sociais",
        "Email marketing automático",
        "Análise de conversão"
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
      <header className="bg-red-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-sm hover:text-red-100 mb-4 inline-block">
            ← Voltar para Home
          </Link>
          <h1 className="text-4xl font-bold">Criação de E-commerce</h1>
          <p className="text-lg mt-2 text-red-100">Sua loja virtual profissional e segura</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Overview */}
        <section className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Sobre o Serviço</h2>
          <p className="text-gray-700 mb-4">
            Criamos lojas virtuais completas, seguras e prontas para vender. 
            Desde o design até a integração de pagamentos, cuidamos de tudo.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded">
              <p className="text-2xl font-bold text-red-600">1-2M</p>
              <p className="text-sm text-gray-600">Primeiras Vendas</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-2xl font-bold text-blue-600">6-8</p>
              <p className="text-sm text-gray-600">Semanas de Dev</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-2xl font-bold text-green-600">99.9%</p>
              <p className="text-sm text-gray-600">Taxa de Uptime</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-2xl font-bold text-purple-600">SSL</p>
              <p className="text-sm text-gray-600">Segurança Total</p>
            </div>
          </div>
        </section>

        {/* Subtasks */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Etapas de Implementação</h2>
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
                        ? 'bg-red-600 text-white'
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
                      <span className="text-red-600 font-bold mr-3">✓</span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 bg-gradient-to-r from-red-600 to-red-800 text-white p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Comece a Vender Online!</h3>
          <p className="mb-6">Sua loja virtual nos próximos 30 dias</p>
          <a href="/contato" className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Iniciar Projeto
          </a>
        </section>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ServicesMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const services = [
    {
      id: 'agendamento',
      title: '📅 Agendamento e Consultas',
      description: 'Ideal para médicos, advogados, consultores ou esteticistas',
      items: [
        { name: 'SimplyBook.me', desc: 'Permite criar subcontas para cada profissional. Eles gerem os horários e os clientes marcam diretamente.' },
        { name: 'Trafft', desc: 'Excelente para múltiplos funcionários e empresas gerirem marcações de serviços.' },
        { name: 'Bookly (WordPress)', desc: 'Se o site for WordPress, permite que cada empresário tenha o seu próprio calendário e serviços.' },
      ]
    },
    {
      id: 'videoconferencia',
      title: '🎥 Salas de Reunião e Videoconferência',
      description: 'Para consultorias, aulas ao vivo sem sair do domínio',
      items: [
        { name: 'Daily.co', desc: 'Uma API que permite embutir chamadas de vídeo customizadas dentro do site (em vez de Zoom).' },
        { name: 'Whereby Embedded', desc: 'Cria salas de reunião profissionais com a sua marca e marca do cliente.' },
      ]
    },
    {
      id: 'elearning',
      title: '🎓 Plataformas de E-learning e Cursos',
      description: 'Para venda e entrega de conhecimento',
      items: [
        { name: 'Tutor LMS', desc: 'Transforma o site numa espécie de "Udemy", onde cada empresário é um instrutor com painel, cursos e alunos.' },
        { name: 'LearnDash', desc: 'Robusto para gerir grandes volumes de empresários que fornecem formação.' },
      ]
    },
    {
      id: 'helpdesk',
      title: '💬 Sistemas de Helpdesk e Atendimento',
      description: 'Para que empresários prestem suporte aos clientes',
      items: [
        { name: 'Crisp', desc: 'Pode configurar sub-espaços de trabalho.' },
        { name: 'Chatwoot', desc: 'Uma alternativa open-source que permite criar uma plataforma de atendimento completa para múltiplos negócios (multi-tenant).' },
      ]
    },
    {
      id: 'documentos',
      title: '📄 Partilha e Entrega de Documentos',
      description: 'Para contabilistas, designers ou engenheiros entregar o serviço final',
      items: [
        { name: 'Clinked', desc: 'Cria portais de cliente "White Label". Cada empresário tem uma área privada para trocar ficheiros e aprovar documentos.' },
        { name: 'SuiteDash', desc: 'Uma solução "tudo-em-um" com CRM, faturação e portal de ficheiros, tudo sob a marca do empresário.' },
      ]
    }
  ];

  return (
    <div className="relative">
      {/* Menu Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col gap-1.5 p-2 hover:bg-gray-200 rounded-lg transition"
        title="Menu de Serviços"
      >
        <div className="w-6 h-0.5 bg-gray-800"></div>
        <div className="w-6 h-0.5 bg-gray-800"></div>
        <div className="w-6 h-0.5 bg-gray-800"></div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-50 w-96 overflow-y-auto transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 sticky top-0">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl">🏪 Marketplace</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 p-2 rounded-lg transition"
            >
              ✕
            </button>
          </div>
          <p className="text-blue-100 text-xs mt-2">Estrutura White Label para seus usuários</p>
        </div>

        {/* Services List */}
        <div className="p-4 space-y-3">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/marketplace/${service.id}`}
              onClick={() => setIsOpen(false)}
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 px-4 py-4 rounded-lg border border-gray-200 hover:border-blue-400 transition cursor-pointer group">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 group-hover:text-blue-600 transition">{service.title}</span>
                  <span className="text-xl group-hover:translate-x-2 transition">→</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{service.description}</p>
              </div>
            </Link>
          ))}

          {/* View All Button */}
          <Link href="/marketplace" onClick={() => setIsOpen(false)}>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition cursor-pointer text-center font-bold">
              📊 Ver Todos os Sistemas
            </div>
          </Link>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h6 className="font-bold text-blue-900 mb-2">💡 Como Funciona?</h6>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>✓ <strong>Multi-Tenancy:</strong> Isola dados de cada empresário</li>
              <li>✓ <strong>API Integration:</strong> Usa serviços externos na sua interface</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

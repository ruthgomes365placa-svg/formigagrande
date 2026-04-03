'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SystemDetail() {
  const params = useParams();
  const sistemId = params.sistema as string;

  const systems: Record<string, any> = {
    agendamento: {
      title: '📅 Agendamento e Consultas',
      color: 'from-blue-500 to-blue-600',
      description: 'Ideal para médicos, advogados, consultores ou esteticistas que usam o seu site para gerir a agenda deles.',
      benefits: [
        'Calendários sincronizados em tempo real',
        'Notificações automáticas aos clientes',
        'Integração com SMS e email',
        'Gerenciamento de cancelamentos e remarcações',
        'Relatórios de ocupação'
      ],
      systems: [
        {
          name: 'SimplyBook.me',
          desc: 'Permite criar subcontas para cada profissional. Eles gerem os horários e os clientes deles marcam diretamente.',
          features: ['Multi-profissional', 'API robusta', 'Dashboard intuitivo', 'Relatórios automáticos']
        },
        {
          name: 'Trafft',
          desc: 'Excelente para múltiplos funcionários e empresas gerirem marcações de serviços.',
          features: ['Suporte multi-locação', 'Agendamento avançado', 'Pagamentos integrados', 'App mobile']
        },
        {
          name: 'Bookly (WordPress)',
          desc: 'Se o seu site for WordPress, permite que cada empresário tenha o seu próprio calendário e serviços.',
          features: ['Plugin WordPress', 'Customizável', 'Low-cost', 'Comunidade ativa']
        }
      ]
    },
    videoconferencia: {
      title: '🎥 Salas de Reunião e Videoconferência',
      color: 'from-purple-500 to-purple-600',
      description: 'Para que o empresário dê uma consultoria ou aula ao vivo sem sair do seu domínio.',
      benefits: [
        'Salas de vídeo profissionais',
        'Controle total sobre a marca',
        'Sem redirecionamentos para plataformas externas',
        'Streaming de alta qualidade',
        'Gravação de sessões'
      ],
      systems: [
        {
          name: 'Daily.co',
          desc: 'Uma API que permite embutir chamadas de vídeo customizadas dentro do seu site (em vez de mandar o cliente para o Zoom).',
          features: ['Sem brandagem de terceiros', 'API simples', 'Suporte 24/7', 'HIPAA compliant']
        },
        {
          name: 'Whereby Embedded',
          desc: 'Cria salas de reunião profissionais com a sua marca e a do seu cliente.',
          features: ['Customização total', 'Reuniões de até 100 participantes', 'Recording automático', 'Chat integrado']
        }
      ]
    },
    elearning: {
      title: '🎓 Plataformas de E-learning e Cursos',
      color: 'from-green-500 to-green-600',
      description: 'Se o objetivo é que eles vendam e entreguem conhecimento.',
      benefits: [
        'Múltiplos formatos de conteúdo',
        'Rastreamento de progresso dos alunos',
        'Certificados automáticos',
        'Fórum de discussão',
        'Analytics detalhados'
      ],
      systems: [
        {
          name: 'Tutor LMS',
          desc: 'Transforma o seu site numa espécie de "Udemy", onde cada empresário é um instrutor com o seu próprio painel, cursos e alunos.',
          features: ['Dashboard instrutor', 'Vendas integradas', 'Certificados', 'Estatísticas']
        },
        {
          name: 'LearnDash',
          desc: 'Robusto para gerir grandes volumes de empresários que fornecem formação.',
          features: ['Escalável', 'Drip content', 'Quizzes avançados', 'Integrações múltiplas']
        }
      ]
    },
    helpdesk: {
      title: '💬 Sistemas de Helpdesk e Atendimento',
      color: 'from-orange-500 to-orange-600',
      description: 'Para que os empresários prestem suporte aos clientes deles através do seu site.',
      benefits: [
        'Chat em tempo real',
        'Tickets de suporte',
        'Base de conhecimento',
        'Automação de respostas',
        'Multi-canal (email, chat, telefone)'
      ],
      systems: [
        {
          name: 'Crisp',
          desc: 'Pode configurar sub-espaços de trabalho.',
          features: ['Sub-contas', 'Chat em vivo', 'Email', 'Analytics']
        },
        {
          name: 'Chatwoot',
          desc: 'Uma alternativa open-source que permite criar uma plataforma de atendimento completa para múltiplos negócios (multi-tenant).',
          features: ['Open-source', 'Multi-tenant', 'Auto-hospedagem', 'Integração Whatsapp']
        }
      ]
    },
    documentos: {
      title: '📄 Partilha e Entrega de Documentos',
      color: 'from-red-500 to-red-600',
      description: 'Essencial para contabilistas, designers ou engenheiros entregarem o serviço final.',
      benefits: [
        'Portais de cliente White Label',
        'Controle de acesso granular',
        'Histórico de versões',
        'Assinaturas eletrônicas',
        'Conformidade GDPR'
      ],
      systems: [
        {
          name: 'Clinked',
          desc: 'Cria portais de cliente "White Label". Cada empresário tem uma área privada para trocar ficheiros e aprovar documentos com o cliente dele.',
          features: ['White Label', 'Portais privados', 'Aprovações', 'Comentários']
        },
        {
          name: 'SuiteDash',
          desc: 'Uma solução "tudo-em-um" onde o empresário tem CRM, faturação e portal de ficheiros para o cliente dele, tudo sob a sua marca.',
          features: ['CRM integrado', 'Faturação', 'Propostas', 'Portal cliente']
        }
      ]
    }
  };

  const system = systems[sistemId];

  if (!system) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Sistema não encontrado</h1>
          <Link href="/marketplace" className="text-blue-600 hover:text-blue-700 font-semibold text-lg">
            ← Voltar ao Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/marketplace" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{system.title}</h1>
          <div className="w-24"></div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`bg-gradient-to-r ${system.color} text-white py-16`}>
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">{system.title}</h1>
          <p className="text-xl text-white/90 max-w-2xl">{system.description}</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">✨ Benefícios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {system.benefits.map((benefit: string, idx: number) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-blue-500">
              <p className="text-gray-700 text-lg flex items-start">
                <span className="text-2xl mr-4">✓</span>
                <span>{benefit}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">🛠️ Soluções Recomendadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {system.systems.map((sol: any, idx: number) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-lg border border-gray-200 hover:border-blue-400 transition">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{sol.name}</h3>
                <p className="text-gray-700 mb-6">{sol.desc}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Características:</h4>
                  <ul className="space-y-2">
                    {sol.features.map((feature: string, fidx: number) => (
                      <li key={fidx} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition">
                  Saber Mais →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">💡 Próximos Passos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">1</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Escolha a solução</h3>
                <p className="text-gray-700">Selecione a plataforma que melhor se adequa às necessidades dos seus usuários.</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">2</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Integre com a sua API</h3>
                <p className="text-gray-700">Use a documentação da plataforma para integrar com o seu site.</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">3</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Lançar para usuários</h3>
                <p className="text-gray-700">Ative a funcionalidade e comece a gerar receita com marketplace.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`bg-gradient-to-r ${system.color} text-white py-16`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Quer implementar este sistema?</h2>
          <p className="text-lg text-white/90 mb-8">Entre em contacto com a nossa equipa</p>
          <Link href="/contato" className="bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition inline-block">
            Contacta-nos →
          </Link>
        </div>
      </section>
    </div>
  );
}

import Link from 'next/link';

export default function Marketplace() {
  const systems = [
    {
      id: 'agendamento',
      title: '📅 Agendamento e Consultas',
      icon: '📅',
      color: 'from-blue-500 to-blue-600',
      description: 'Ideal para médicos, advogados, consultores ou esteticistas'
    },
    {
      id: 'videoconferencia',
      title: '🎥 Salas de Reunião e Videoconferência',
      icon: '🎥',
      color: 'from-purple-500 to-purple-600',
      description: 'Para consultorias, aulas ao vivo sem sair do domínio'
    },
    {
      id: 'elearning',
      title: '🎓 Plataformas de E-learning e Cursos',
      icon: '🎓',
      color: 'from-green-500 to-green-600',
      description: 'Para venda e entrega de conhecimento'
    },
    {
      id: 'helpdesk',
      title: '💬 Sistemas de Helpdesk e Atendimento',
      icon: '💬',
      color: 'from-orange-500 to-orange-600',
      description: 'Para que empresários prestem suporte aos clientes'
    },
    {
      id: 'documentos',
      title: '📄 Partilha e Entrega de Documentos',
      icon: '📄',
      color: 'from-red-500 to-red-600',
      description: 'Para contabilistas, designers ou engenheiros entregar o serviço final'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            ← Formiga Grande
          </Link>
          <h1 className="text-xl font-bold text-gray-800">🏪 Marketplace & White Label</h1>
          <div className="w-40"></div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Estrutura Completa de Marketplace</h1>
          <p className="text-xl text-blue-100">Para que seus usuários (empresários e empreendedores) prestem serviços aos clientes deles dentro da sua plataforma</p>
        </div>
      </section>

      {/* Systems Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((system) => (
            <Link key={system.id} href={`/marketplace/${system.id}`}>
              <div className={`bg-gradient-to-br ${system.color} rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden h-full`}>
                <div className="p-8 text-white h-full flex flex-col justify-between">
                  <div>
                    <div className="text-6xl mb-4">{system.icon}</div>
                    <h2 className="text-2xl font-bold mb-2">{system.title}</h2>
                    <p className="text-white/90 text-sm">{system.description}</p>
                  </div>
                  <div className="mt-6 inline-flex items-center text-white font-semibold hover:translate-x-2 transition">
                    Ver Detalhes →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">💡 Como Funciona?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-3">🏗️ Multi-Tenancy</h3>
                <p className="text-gray-700">
                  O sistema isola os dados de cada empresário para que um não veja o cliente do outro. Segurança e privacidade garantidas.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">🔗 API Integration</h3>
                <p className="text-gray-700">
                  Você usa um serviço (como o Daily.co para vídeo) e cria a interface visual no seu site. Flexibilidade máxima.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para transformar sua plataforma?</h2>
          <p className="text-lg text-blue-100 mb-6">Clique em qualquer sistema acima para explorar as melhores soluções</p>
        </div>
      </section>
    </div>
  );
}

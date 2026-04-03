'use client';

import Link from 'next/link';

export default function Privacidade() {
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

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Política de Privacidade (LGPD)</h1>
          <p className="text-gray-600 mb-8">Última actualização: Março de 2026</p>

          <div className="bg-white p-8 rounded-lg shadow-lg space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introdução</h2>
              <p className="text-gray-700">
                A Formiga Grande respeita sua privacidade e está comprometida em proteger seus dados pessoais. 
                Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos suas informações, 
                em conformidade com a Lei Geral de Proteção de Dados (LGPD) e outras regulamentações aplicáveis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Dados que Coletamos</h2>
              <p className="text-gray-700 mb-4">Coletamos os seguintes tipos de dados:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Dados de Contacto:</strong> Nome, email, telefone, endereço</li>
                <li>• <strong>Dados de Navegação:</strong> Cookies, endereço IP, tipo de navegador</li>
                <li>• <strong>Dados de Transação:</strong> Histórico de pedidos, faturas, comprovantes de pagamento</li>
                <li>• <strong>Dados Profissionais:</strong> Empresa, cargo, setor de atuação</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Como Usamos Seus Dados</h2>
              <p className="text-gray-700 mb-4">Seus dados são utilizados para:</p>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Prestar nossos serviços de forma eficiente</li>
                <li>✓ Processar suas transações e pagamentos</li>
                <li>✓ Enviar atualizações sobre seus pedidos</li>
                <li>✓ Melhorar nossa plataforma e serviços</li>
                <li>✓ Cumprir obrigações legais</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Segurança dos Dados</h2>
              <p className="text-gray-700">
                Implementamos medidas rigorosas de segurança, incluindo encriptação SSL, firewalls, 
                e acesso restrito aos dados. Todos os seus dados são armazenados em servidores seguros 
                com backups automáticos diários.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Seus Direitos</h2>
              <p className="text-gray-700 mb-4">De acordo com a LGPD, você tem direito a:</p>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Acessar seus dados pessoais</li>
                <li>✓ Corrigir dados imprecisos</li>
                <li>✓ Solicitar a exclusão de seus dados</li>
                <li>✓ Portar seus dados para outro serviço</li>
                <li>✓ Revogar seu consentimento a qualquer momento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Contacto</h2>
              <p className="text-gray-700 mb-4">
                Para exercer seus direitos ou para relatar preocupações sobre privacidade:
              </p>
              <p className="text-gray-700">
                📧 privacidade@formigagrande.com<br/>
                📱 +244 925250510
              </p>
            </section>
          </div>

          <Link href="/" className="inline-block mt-8 text-blue-600 font-semibold hover:underline">
            ← Voltar à página inicial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 Formiga Grande. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

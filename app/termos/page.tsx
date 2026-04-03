'use client';

import Link from 'next/link';

export default function Termos() {
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
          <h1 className="text-4xl font-bold mb-8">Termos de Uso</h1>
          <p className="text-gray-600 mb-8">Última actualização: Março de 2026</p>

          <div className="bg-white p-8 rounded-lg shadow-lg space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-700">
                Ao usar os serviços da Formiga Grande, você concorda integralmente com estes Termos de Uso. 
                Se não concordar com qualquer parte destes termos, por favor, não utilize nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Descrição dos Serviços</h2>
              <p className="text-gray-700">
                A Formiga Grande oferece serviços de desenvolvimento web, design, consultoria em SEO, 
                manutenção de sites, hospedagem e outras soluções digitais conforme descrito em nosso site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Licença de Uso</h2>
              <p className="text-gray-700">
                Você recebe uma licença limitada, não-exclusiva e revogável para usar nossos serviços 
                apenas para fins comerciais legítimos. É proibido vender, copiar, reproduzir ou transmitir 
                qualquer conteúdo sem autorização escrita.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Responsabilidades do Cliente</h2>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Fornecer informações precisas e atualizadas</li>
                <li>✓ Manter a confidencialidade de, sua conta</li>
                <li>✓ Usar os serviços legalmente</li>
                <li>✓ Respeitar direitos autorais e propriedade intelectual</li>
                <li>✓ Não contornar medidas de segurança</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Propriedade Intelectual</h2>
              <p className="text-gray-700">
                Todo o conteúdo, código e designs desenvolvidos pela Formiga Grande são propriedade 
                exclusiva da empresa, até que o cliente tenha realizado o pagamento total. Após o pagamento, 
                o cliente recebe direitos de uso exclusivo do trabalho.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Limitação de Responsabilidade</h2>
              <p className="text-gray-700">
                A Formiga Grande não será responsável por danos indiretos, especiais ou consequentes 
                resultantes do uso ou impossibilidade de usar nossos serviços, mesmo que tenhamos sido 
                informados da possibilidade de tais danos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Rescisão</h2>
              <p className="text-gray-700">
                A Formiga Grande reserva-se o direito de rescindir sua conta se você violar estes termos. 
                Você pode solicitar a rescisão a qualquer momento entrando em contacto conosco.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Mudanças nos Termos</h2>
              <p className="text-gray-700">
                Podemos atualizar estes Termos de Uso a qualquer momento. Você será notificado das 
                mudanças significativas. O uso contínuo dos serviços indica aceitação dos termos atualizados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Lei Aplicável</h2>
              <p className="text-gray-700">
                Estes termos serão regidos pelas leis de Angola e você concorda em submeter-se 
                à jurisdição exclusiva dos tribunais angolanos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Contacto</h2>
              <p className="text-gray-700 mb-4">
                Para dúvidas sobre estes Termos de Uso:
              </p>
              <p className="text-gray-700">
                📧 legal@formigagrande.com<br/>
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

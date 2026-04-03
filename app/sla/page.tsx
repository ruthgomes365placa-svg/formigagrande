'use client';

import Link from 'next/link';

export default function SLA() {
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
          <h1 className="text-4xl font-bold mb-8">Contrato de Manutenção (SLA)</h1>
          <p className="text-gray-600 mb-8">Última actualização: Março de 2026</p>

          <div className="bg-white p-8 rounded-lg shadow-lg space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Escopo do Serviço</h2>
              <p className="text-gray-700">
                Este Acordo de Nível de Serviço (SLA) define os compromissos da Formiga Grande 
                para manutenção contínua de sites, segurança, performance e disponibilidade.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Garantia de Uptime</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>99.9% de tempo de atividade</strong> - Seu site estará disponível 24/7, 
                  com máximo de 43 minutos de inatividade por mês.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Serviços Inclusos</h2>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Monitoramento 24/7 da disponibilidade</li>
                <li>✓ Atualizações de segurança automáticas</li>
                <li>✓ Backups diários com retenção de 30 dias</li>
                <li>✓ Limpeza e otimização de banco de dados</li>
                <li>✓ Correção de bugs e erros críticos</li>
                <li>✓ Suporte técnico prioritário</li>
                <li>✓ Relatórios mensais de performance</li>
                <li>✓ Atualizações de plugins e componentes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Planos de Suporte</h2>
              
              <div className="mb-6 border-l-4 border-blue-600 p-4 bg-blue-50">
                <h3 className="font-bold text-lg text-blue-600">Plano Básico - EURO 50/mês</h3>
                <ul className="mt-3 space-y-1 text-gray-700">
                  <li>• 4 horas de suporte técnico</li>
                  <li>• Resposta em até 24 horas</li>
                  <li>• Atualizações de segurança</li>
                  <li>• Uma revisão de performance/mês</li>
                </ul>
              </div>

              <div className="mb-6 border-l-4 border-green-600 p-4 bg-green-50">
                <h3 className="font-bold text-lg text-green-600">Plano Profissional - EURO 100/mês</h3>
                <ul className="mt-3 space-y-1 text-gray-700">
                  <li>• 8 horas de suporte técnico</li>
                  <li>• Resposta em até 12 horas</li>
                  <li>• Tudo do plano básico</li>
                  <li>• Duas revisões de performance/mês</li>
                  <li>• Correção de bugs</li>
                </ul>
              </div>

              <div className="mb-6 border-l-4 border-purple-600 p-4 bg-purple-50">
                <h3 className="font-bold text-lg text-purple-600">Plano Premium - EURO 200/mês</h3>
                <ul className="mt-3 space-y-1 text-gray-700">
                  <li>• 16 horas de suporte técnico</li>
                  <li>• Resposta em até 4 horas</li>
                  <li>• Tudo do plano profissional</li>
                  <li>• Otimizações semanais</li>
                  <li>• Prioridade máxima</li>
                  <li>• Reunião mensal com especialista</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Tempos de Resposta</h2>
              <table className="w-full border-collapse mb-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2 text-left">Severidade</th>
                    <th className="border p-2 text-left">Descrição</th>
                    <th className="border p-2 text-left">Resposta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2 font-semibold text-red-600">Crítica</td>
                    <td className="border p-2">Site inativo ou com erro grave</td>
                    <td className="border p-2">15 minutos</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2 font-semibold text-orange-600">Alta</td>
                    <td className="border p-2">Funcionalidade importante não funciona</td>
                    <td className="border p-2">1 hora</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-semibold text-yellow-600">Média</td>
                    <td className="border p-2">Performance lenta ou bug menor</td>
                    <td className="border p-2">4 horas</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2 font-semibold text-blue-600">Baixa</td>
                    <td className="border p-2">Dúvidas ou solicitações gerais</td>
                    <td className="border p-2">24 horas</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Créditos por Violação do SLA</h2>
              <p className="text-gray-700">
                Se não atingirmos o uptime de 99.9%, você receberá crédito automático:
              </p>
              <ul className="mt-4 space-y-2 text-gray-700">
                <li>• 98%-99.9%: 5% do valor mensal</li>
                <li>• 95%-98%: 10% do valor mensal</li>
                <li>• Abaixo de 95%: 20% do valor mensal ou rescisão sem penalidade</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Horário de Suporte</h2>
              <p className="text-gray-700">
                <strong>Monitoragem:</strong> 24/7<br/>
                <strong>Suporte Reativo:</strong> 24/7<br/>
                <strong>Suporte Proativo:</strong> Segunda a Sexta, 09:00-18:00
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Exclusões</h2>
              <p className="text-gray-700">
                O SLA não cobre:
              </p>
              <ul className="mt-4 space-y-2 text-gray-700">
                <li>• Problemas causados por força maior</li>
                <li>• Inatividade planejada para manutenção</li>
                <li>• Problemas causados por cliente (ataque DDoS, código malicioso, etc)</li>
                <li>• Inatividade de terceiros (provedor de internet, Stripe, etc)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Rescisão</h2>
              <p className="text-gray-700">
                Você pode rescindir este contrato a qualquer momento com 30 dias de aviso prévio. 
                Não haverá penalidades por rescisão, apenas o reembolso da parte paga e não utilizada.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Contacto</h2>
              <p className="text-gray-700 mb-4">
                Para relatar problemas ou dúvidas sobre este SLA:
              </p>
              <p className="text-gray-700">
                📧 suporte@formigagrande.com<br/>
                📱 +244 925250510 (24/7 para emergências)
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

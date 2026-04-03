'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Suporte() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('');

  const faqs = [
    {
      question: "O que é incluído no serviço de hospedagem?",
      answer: "Nosso serviço de hospedagem inclui: domínio grátis, certificado SSL, emails profissionais, backup diário, suporte 24/7, e garantia de 99.9% de uptime."
    },
    {
      question: "Qual é o tempo de resposta do suporte técnico?",
      answer: "Respondemos a todas as solicitações em no máximo 1 hora durante horário comercial. Para emergências, temos suporte 24/7 com resposta em 15 minutos."
    },
    {
      question: "Como funciona a manutenção mensal do site?",
      answer: "Incluímos atualizações de segurança, backups, otimização de performance, monitoramento 24/7 e até 5 horas de suporte técnico por mês."
    },
    {
      question: "É possível integrar sistema de pagamento?",
      answer: "Sim! Integramos com Stripe, PayPal, Multicaixa, transferência bancária e outras formas de pagamento que você precisar."
    },
    {
      question: "Quanto tempo leva para um projeto ficar pronto?",
      answer: "Depende da complexidade. Landing pages levam 2-3 semanas, sites simples 4-6 semanas, e sistemas completos 8-12 semanas. Fornecemos estimativas precisas no início."
    },
    {
      question: "Como posso acompanhar o progresso do meu projeto?",
      answer: "Você tem acesso a um painel de controle em tempo real, reuniões semanais com o time, e relatórios de progresso detalhados."
    },
    {
      question: "Oferecem garantia de satisfação?",
      answer: "Sim! Oferecemos garantia de satisfação de 30 dias. Se não ficar satisfeito, devolvemos seu dinheiro sem perguntas."
    },
    {
      question: "Qual é a política de cancelamento?",
      answer: "Você pode cancelar a qualquer momento. Se pagar adiantado, reembolsamos a parte não utilizada proporcionalmente."
    }
  ];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormStatus('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus('Mensagem enviada com sucesso! Entraremos em contacto em breve.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setFormStatus(''), 5000);
      } else {
        setFormStatus('Erro ao enviar mensagem. Tente novamente.');
      }
    } catch (error) {
      setFormStatus('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Formiga Grande
          </Link>
          <div className="flex gap-6">
            <Link href="/sobre" className="text-gray-700 hover:text-blue-600 transition font-semibold">Sobre</Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition font-semibold">Blog</Link>
            <Link href="/suporte" className="text-blue-600 font-semibold">Suporte</Link>
            <Link href="/contato" className="text-gray-700 hover:text-blue-600 transition font-semibold">Contacto</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Central de Suporte</h1>
          <p className="text-xl text-blue-100">Encontre respostas às suas perguntas ou contacte nosso time de suporte</p>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-2xl font-bold mb-2">Email</h3>
              <p>formigagrande.oficial@gmail.com</p>
              <p className="text-sm text-blue-100 mt-2">Resposta em até 1 hora</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-2xl font-bold mb-2">Telefone</h3>
              <p>+244 925250510</p>
              <p className="text-sm text-green-100 mt-2">Suporte 24/7</p>
            </div>
            <Link href="/suporte/chat" className="block">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition cursor-pointer h-full">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-2xl font-bold mb-2">Chat Comunitário</h3>
                <p>Deixe sua mensagem</p>
                <p className="text-sm text-purple-100 mt-2">Comunidade sempre ativa</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Perguntas Frequentes</h2>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4 border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-left hover:from-blue-600 hover:to-blue-700 transition flex justify-between items-center"
                >
                  <span>{faq.question}</span>
                  <span className="text-xl">{activeFAQ === index ? '−' : '+'}</span>
                </button>
                {activeFAQ === index && (
                  <div className="px-6 py-4 bg-gray-50 text-gray-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Base Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Base de Conhecimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">🏠 Hospedagem</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Como fazer upload de arquivos</li>
                <li>• Configurar email profissional</li>
                <li>• Gerenciar domínios</li>
                <li>• Visualizar estatísticas</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-green-600">🔧 Manutenção</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Atualizações de segurança</li>
                <li>• Como fazer backup</li>
                <li>• Restaurar versão anterior</li>
                <li>• Limpar cache</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-purple-600">💳 Pagamentos</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Integrar Stripe</li>
                <li>• Configurar Multicaixa</li>
                <li>• Visualizar transações</li>
                <li>• Emitir faturas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Ainda tem dúvidas?</h2>
          <div className="max-w-2xl mx-auto bg-white bg-opacity-10 p-8 rounded-lg">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input 
                type="text" 
                name="name"
                placeholder="Seu nome" 
                value={formData.name}
                onChange={handleFormChange}
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none"
              />
              <input 
                type="email" 
                name="email"
                placeholder="Seu email" 
                value={formData.email}
                onChange={handleFormChange}
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none"
              />
              <select name="subject" value={formData.subject} onChange={handleFormChange} className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none">
                <option value="">Selecione o assunto</option>
                <option value="Hospedagem">Hospedagem</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Pagamentos">Pagamentos</option>
                <option value="Desenvolvimento">Desenvolvimento</option>
                <option value="Outro">Outro</option>
              </select>
              <textarea 
                name="message"
                placeholder="Descreva sua dúvida" 
                rows={5}
                value={formData.message}
                onChange={handleFormChange}
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none"
              />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
                Enviar Mensagem
              </button>
              {formStatus && (
                <p className={`text-center ${formStatus.includes('sucesso') ? 'text-green-200' : 'text-red-200'}`}>
                  {formStatus}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 Formiga Grande. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

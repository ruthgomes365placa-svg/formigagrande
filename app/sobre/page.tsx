'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Sobre() {
  const [activeTeamMember, setActiveTeamMember] = useState(0);

  const teamMembers = [
    {
      name: "Antonio Alberto Lombo Gomes",
      role: "Fundador & Lead Developer",
      bio: "10+ anos de experiência em desenvolvimento web. Apaixonado por criar soluções escaláveis e inovadoras."
    },
    {
      name: "Maria Costa",
      role: "SEO Specialist & Content Manager",
      bio: "Especialista em posicionamento orgânico e estratégia de conteúdo. Ajuda empresas a crescer com marketing digital."
    },
    {
      name: "Pedro Oliveira",
      role: "Designer & UX Specialist",
      bio: "Focado em criar experiências visuais incríveis que convertem visitantes em clientes."
    },
    {
      name: "Ana Santos",
      role: "Project Manager & Support",
      bio: "Garante que cada projeto seja entregue no prazo e com qualidade excepcional."
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
          <div className="flex gap-6">
            <Link href="/sobre" className="text-blue-600 font-semibold">Sobre</Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition font-semibold">Blog</Link>
            <Link href="/suporte" className="text-gray-700 hover:text-blue-600 transition font-semibold">Suporte</Link>
            <Link href="/contato" className="text-gray-700 hover:text-blue-600 transition font-semibold">Contacto</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Sobre a Formiga Grande</h1>
          <p className="text-xl text-blue-100">Conheça a história, missão e equipa por trás dos nossos serviços</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Nossa História</h2>
            <p className="text-xl text-gray-700 mb-6">
              A Formiga Grande nasceu de uma visão simples: criar uma empresa que não apenas "programa código", 
              mas que cria produtos que realmente geram lucro para seus clientes.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Fundada em 2015, começamos em uma pequena sala com dois desenvolvedores e um grande sonho. 
              Hoje, somos uma equipa multidisciplinar de profissionais dedicados a transformar negócios através 
              da tecnologia e inovação digital.
            </p>
            <p className="text-lg text-gray-600">
              Cada projeto que assumimos é encarado com paixão, cada cliente é um parceiro, e cada desafio é 
              uma oportunidade de demonstrar a qualidade do nosso trabalho.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">🎯 Missão</h3>
              <p className="text-gray-700">
                Capacitar pequenas e médias empresas através de soluções digitais inovadoras, 
                acessíveis e de qualidade excepcional que geram resultados mensuráveis.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-green-600">💡 Visão</h3>
              <p className="text-gray-700">
                Ser a empresa de referência em serviços digitais em Angola, reconhecida pela qualidade, 
                inovação e foco absoluto na satisfação do cliente.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-purple-600">⭐ Valores</h3>
              <ul className="text-gray-700 space-y-2">
                <li>✓ Excelência em cada projeto</li>
                <li>✓ Transparência total</li>
                <li>✓ Inovação contínua</li>
                <li>✓ Compromisso com resultados</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">A Nossa Equipa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-1 flex flex-col gap-4">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  onClick={() => setActiveTeamMember(index)}
                  className={`p-6 rounded-lg cursor-pointer transition-all ${
                    activeTeamMember === index
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-sm opacity-90">{member.role}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8 rounded-lg shadow-lg flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-4">{teamMembers[activeTeamMember].name}</h3>
              <p className="text-lg text-blue-100 mb-4">{teamMembers[activeTeamMember].role}</p>
              <p className="text-lg">{teamMembers[activeTeamMember].bio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Por que nos escolher?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">✓ Experiência Comprovada</h3>
              <p className="text-blue-100">10+ anos entregando projetos de qualidade excepcionais para dezenas de clientes.</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">✓ Foco em Resultados</h3>
              <p className="text-blue-100">Não medimos sucesso por linhas de código, mas pelo lucro que geramos para você.</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">✓ Suporte Total</h3>
              <p className="text-blue-100">Disponível 24/7 para suportar seu negócio com soluções rápidas e eficazes.</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">✓ Inovação Contínua</h3>
              <p className="text-blue-100">Sempre atualizados com as últimas tecnologias e tendências do mercado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Vamos crescer juntos?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Entre em contacto conosco para uma consulta gratuita e descubra como podemos transformar seu negócio.
          </p>
          <Link href="/contato" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 inline-block text-lg">
            Fale Conosco Agora
          </Link>
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

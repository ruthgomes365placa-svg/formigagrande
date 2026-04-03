'use client';

import Link from 'next/link';
import { useState } from 'react';
import { articles } from '@/lib/articles-data';

export default function Blog() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      if (response.ok) {
        setNewsletterStatus('Inscrição realizada com sucesso!');
        setNewsletterEmail('');
        setTimeout(() => setNewsletterStatus(''), 3000);
      } else {
        setNewsletterStatus('Erro ao inscrever-se. Tente novamente.');
      }
    } catch (error) {
      setNewsletterStatus('Erro ao inscrever-se. Tente novamente.');
    }
  };

  // Filtrar artigos baseado na pesquisa
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            <Link href="/blog" className="text-blue-600 font-semibold">Blog</Link>
            <Link href="/suporte" className="text-gray-700 hover:text-blue-600 transition font-semibold">Suporte</Link>
            <Link href="/contato" className="text-gray-700 hover:text-blue-600 transition font-semibold">Contacto</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Blog da Formiga Grande</h1>
          <p className="text-xl text-blue-100">Artigos sobre tendências, tecnologia, SEO, design e dicas para crescer seu negócio digital</p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="bg-white py-8 sticky top-20 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input 
              type="text" 
              placeholder="🔍 Procure por título, categoria ou tag..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
            <span className="text-gray-600 font-semibold">
              {filteredArticles.length} articulo{filteredArticles.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Nenhum artigo encontrado para "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Limpar pesquisa
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">{article.category}</span>
                      <span className="text-gray-500 text-sm">{article.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{article.date}</p>
                    <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link 
                      href={`/blog/${article.id}`}
                      className="inline-block text-blue-600 font-semibold hover:text-blue-700 transition"
                    >
                      Ler artigo + IA →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscreva nossa Newsletter</h2>
          <p className="text-blue-100 mb-8">Receba os melhores artigos sobre tecnologia e marketing digital diretamente no seu email</p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input 
              type="email" 
              placeholder="Seu email..." 
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-lg text-gray-800"
            />
            <button type="submit" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Subscrever
            </button>
          </form>
          {newsletterStatus && (
            <p className={`mt-4 ${newsletterStatus.includes('sucesso') ? 'text-green-200' : 'text-red-200'}`}>
              {newsletterStatus}
            </p>
          )}
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

'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { articles } from '@/lib/articles-data';

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  
  const article = articles.find(a => a.id === articleId);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Formiga Grande
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600">
              ← Voltar aos Artigos
            </Link>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Artigo não encontrado</h1>
          <p className="text-gray-600 mb-8">O artigo que procura não existe.</p>
          <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-semibold">
            Voltar aos Artigos
          </Link>
        </div>
      </div>
    );
  }

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setLoading(true);
    setAiResponse('');

    try {
      const response = await fetch('/api/article-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: aiQuestion,
          articleContent: article.content,
          articleTitle: article.title,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponse(data.answer);
      } else {
        setAiResponse('Desculpe, não consegui responder nesse momento. Tente novamente.');
      }
    } catch (error) {
      setAiResponse('Erro ao processar sua pergunta. Tente novamente.');
    } finally {
      setLoading(false);
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
          <div className="flex gap-4">
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-semibold">
              ← Todos os Artigos
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero with Image */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="container mx-auto px-4 pb-8 text-white">
            <div className="flex gap-3 mb-4">
              <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                {article.category}
              </span>
              <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                {article.readTime}
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-2">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm">
              <span>Por {article.author}</span>
              <span>•</span>
              <span>{article.date}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article Content */}
          <article className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="prose prose-lg max-w-none">
                {article.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 mb-6 leading-relaxed whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-4">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Read Original */}
              {article.link && (
                <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-3">Quer ler o artigo completo no site original?</p>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Ler Artigo Original →
                  </a>
                </div>
              )}
            </div>
          </article>

          {/* AI Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 sticky top-24 text-white">
              <h3 className="text-2xl font-bold mb-2">🤖 IA Assistente</h3>
              <p className="text-purple-100 text-sm mb-6">
                Faça perguntas sobre este artigo e receba respostas instantâneas
              </p>

              <form onSubmit={handleAskAI} className="space-y-4">
                <textarea
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="Exemplo: Qual é a principal tendência em 2026?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-50 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Pensando...' : 'Enviar Pergunta'}
                </button>
              </form>

              {aiResponse && (
                <div className="mt-6 bg-white/20 rounded-lg p-4">
                  <p className="text-sm text-purple-100 mb-2">💭 Resposta da IA:</p>
                  <p className="text-white leading-relaxed">{aiResponse}</p>
                </div>
              )}

              {/* Suggested Questions */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-xs font-semibold text-purple-100 mb-3">Perguntas Sugeridas:</p>
                <div className="space-y-2">
                  {[
                    'Quais são os principais pontos?',
                    'Como isso me ajuda?',
                    'Qual é a ação recomendada?',
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setAiQuestion(suggestion)}
                      className="w-full text-left text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded transition"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Related Articles */}
      <section className="bg-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Artigos Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles
              .filter(a => a.category === article.category && a.id !== article.id)
              .slice(0, 3)
              .map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/blog/${relatedArticle.id}`}
                  className="bg-gray-50 hover:shadow-lg transition rounded-lg overflow-hidden cursor-pointer"
                >
                  <img
                    src={relatedArticle.image}
                    alt={relatedArticle.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-sm text-blue-600 font-semibold mb-2">
                      {relatedArticle.category}
                    </p>
                    <h3 className="font-bold text-gray-800 line-clamp-2 mb-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedArticle.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
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

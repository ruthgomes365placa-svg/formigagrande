'use client';

import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-red-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-start items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Formiga Grande
          </Link>
        </div>
      </nav>

      {/* Cancel Message */}
      <div className="flex items-center justify-center p-8 min-h-[calc(100vh-100px)]">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-lg">
          <h1 className="text-3xl font-bold mb-4 text-red-700">Pagamento Cancelado</h1>
          <p className="text-gray-700 mb-6">Seu pagamento foi cancelado. Você pode tentar novamente ou entrar em contato para ajuda.</p>
          <Link href="/" className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg">
            Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  );
}

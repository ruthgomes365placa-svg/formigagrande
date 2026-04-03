'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface VIPCheckoutButtonProps {
  memberId: string;
  email: string;
  className?: string;
}

export default function VIPCheckoutButton({ memberId, email, className = '' }: VIPCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/stripe-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-checkout',
          memberId,
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao iniciar checkout');
        return;
      }

      // Redirecionar para Stripe Checkout
      if (data.url) {
        router.push(data.url);
      } else {
        setError('URL de checkout não retornada');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`${className} ${
          loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-yellow-300 hover:to-orange-400'
        } bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg disabled:transform-none`}
      >
        {loading ? '⏳ Processando...' : '💳 Assinar VIP - €99.90/mês'}
      </button>
      {error && (
        <div className="mt-3 bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

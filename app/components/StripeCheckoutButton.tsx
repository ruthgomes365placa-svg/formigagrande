'use client';

import { useState } from 'react';

export default function StripeCheckoutButton({ serviceId, label }: { serviceId: string; label: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.sessionId) throw new Error(data.error || 'Falha no checkout');

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
    } catch (e) {
      setError(`Não foi possível iniciar o checkout: ${e instanceof Error ? e.message : 'erro desconhecido'}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full font-semibold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
      >
        {loading ? 'Redirecionando...' : label}
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}

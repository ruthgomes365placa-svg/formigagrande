import Link from 'next/link';
import { readdir } from 'fs/promises';

export default async function VIPVideoDebug() {
  try {
    const files = await readdir('./public');
    const videos = files.filter(f => f.endsWith('.mp4'));

    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-2xl mx-auto text-white">
          <h1 className="text-4xl font-bold mb-8">🎬 Debug: Vídeos Disponíveis</h1>
          
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <p className="text-green-400 text-lg font-bold mb-4">
              ✅ Total de vídeos encontrados: {videos.length}
            </p>
            
            <div className="space-y-3">
              {videos.map(video => (
                <div key={video} className="bg-gray-700 p-4 rounded">
                  <p className="text-blue-300 font-mono text-sm">/public/{video}</p>
                  <div className="mt-2 flex gap-2">
                    <a href={`/${video}`} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                      📹 Assistir
                    </a>
                    <a href={`/${video}`} download className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">
                      ⬇️ Baixar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-900/50 border border-blue-600 p-6 rounded-lg">
            <p className="text-blue-200 mb-4">
              Se não vê os vídeos no dashboard VIP, verifique:
            </p>
            <ul className="text-blue-100 space-y-2 ml-4 list-disc">
              <li>Limpe o cache do navegador (Ctrl+Shift+Delete)</li>
              <li>Faça logout e login novamente</li>
              <li>Teste em modo anônimo (Ctrl+Shift+P)</li>
              <li>Verifique se os vídeos aparecem aqui</li>
            </ul>
          </div>

          <div className="mt-8">
            <Link href="/" className="text-purple-400 hover:text-purple-300">
              ← Voltar à Home
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-red-900 flex items-center justify-center p-8">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">❌ Erro ao ler arquivos</h1>
          <p className="text-red-200">{error instanceof Error ? error.message : 'Erro desconhecido'}</p>
        </div>
      </div>
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

/**
 * API para responder perguntas sobre artigos usando IA (simulada).
 * Em produção, integrar com um serviço real como OpenAI GPT-4, Claude, etc.
 */

interface AIRequest {
  question: string;
  articleContent: string;
  articleTitle: string;
}

// Simulação de respostas inteligentes baseadas em palavras-chave
function generateAIResponse(question: string, content: string, title: string): string {
  const questionLower = question.toLowerCase();
  
  // Extrair informações-chave do conteúdo
  const sections = content.split('**').filter(s => s.trim());
  
  // Se a pergunta é genérica, dar visão geral
  if (questionLower.includes('principal') || questionLower.includes('ponto') || questionLower.includes('resumo')) {
    const firstSection = sections.find(s => s.includes(':'));
    if (firstSection) {
      return `Sobre "${title}": O artigo destaca principalmente ${firstSection.split(':')[0].toLowerCase()}. As principais mensagens incluem informações sobre como isso afeta o seu negócio e as melhores práticas para implementação.`;
    }
    return `Este artigo sobre ${title} cobre as principais tendências e melhores práticas para 2026, com foco em implementação prática e benefícios mensuráveis.`;
  }

  // Se pergunta sobre como implementar
  if (questionLower.includes('como') || questionLower.includes('implementar') || questionLower.includes('fazer')) {
    const recommendations = content.match(/(?:- |•|).+/g) || [];
    if (recommendations.length > 0) {
      return `Para implementar o que é descrito neste artigo: 1) ${recommendations[0]?.replace(/^[-•] /, '')} 2) Comece com a parte mais crítica para seu negócio 3) Meça os resultados através de analytics. O artigo fornece detalhes específicos sobre cada passo.`;
    }
    return `O artigo fornece uma abordagem estruturada. Recomenda começar pela análise de seu estado atual, depois implementar as mudanças gradualmente e monitorar o progresso.`;
  }

  // Se pergunta sobre benefícios
  if (questionLower.includes('beneficio') || questionLower.includes('vantagem') || questionLower.includes('ganho')) {
    const percentages = content.match(/(\d+)%/g) || [];
    if (percentages.length > 0) {
      return `Os benefícios mencionados no artigo incluem melhorias de até ${percentages[0]} em métricas-chave. As organizações que implementam essas práticas relatam aumentos significativos em conversão, satisfação do utilizador e eficiência operacional.`;
    }
    return `Os principais benefícios incluem melhor experiência do utilizador, maior visibilidade online, melhor performance e competitividade aumentada no mercado.`;
  }

  // Se pergunta sobre números/estatísticas
  if (questionLower.includes('estatistica') || questionLower.includes('número') || questionLower.includes('percentual')) {
    const stats = content.match(/(\d+)\s*(%|ms|day|dias|horas|min)/gi) || [];
    if (stats.length > 0) {
      return `O artigo menciona várias estatísticas importantes: ${stats.slice(0, 3).join(', ')}. Esses números demonstram o impacto significativo de implementar as práticas recomendadas.`;
    }
    return `O artigo provide dados baseados em pesquisa e estudos de caso reais que demonstram o valor prático dessas recomendações.`;
  }

  // Se pergunta sobre tendências
  if (questionLower.includes('tendencia') || questionLower.includes('futuro') || questionLower.includes('2026')) {
    return `${title} destaca as tendências mais importantes para 2026. O artigo identifica mudanças no comportamento do consumidor, avanços tecnológicos e novas oportunidades que surgem. As organizações que se adaptarem a essas tendências terão vantagem competitiva.`;
  }

  // Resposta padrão inteligente
  return `Na verdade, ${title.toLowerCase()} discute isso em detalhe. O artigo sugere que a abordagem mais eficaz é equilibrar automação com envolvimento humano, medir resultados continuamente e adaptar a estratégia conforme necessário. Recomenda-se começar com uma análise de seu estado atual para identificar as prioridades.`;
}

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json();
    const { question, articleContent, articleTitle } = body;

    if (!question?.trim() || !articleContent?.trim()) {
      return NextResponse.json(
        { error: 'Question and article content are required' },
        { status: 400 }
      );
    }

    // Gerar resposta
    const answer = generateAIResponse(question, articleContent, articleTitle);

    // Simular latência de IA para melhor UX
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      answer,
      source: articleTitle,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error processing AI request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

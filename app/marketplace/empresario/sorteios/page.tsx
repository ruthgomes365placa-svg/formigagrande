'use client';

import { useEffect, useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AdminCode = {
  id?: string;
  code: string;
  created_at: string;
  used_at: string | null;
  used_by: string | null;
};

type HistoryItem = {
  id: string;
  businessId: string;
  createdAt: string;
  adminCode: string;
  quantity: number;
  maxNumber: number;
  luckyNumbers: number[];
  generatedNumbers: number[];
  mode: 'simples' | 'multipla';
  repeatLimit: number;
  attemptIndex: number;
  result: 'ganhou' | 'perdeu';
  expired: boolean;
  matchedCount: number;
};

type CodeSession = {
  code: string;
  repeatLimit: number;
  runsSoFar: number;
};

type CodeUsageStat = {
  adminCode: string;
  totalPlays: number;
  wins: number;
  losses: number;
  uniqueUsers: number;
};

type NotificationItem = {
  id: string;
  target: 'all' | 'user';
  business_id?: string;
  message: string;
  created_by?: string;
  created_at: string;
};

const ADMIN_SECRET = '123AntonioGomes7@070707';

const toNumberList = (value: string) => {
  return value
    .split(',')
    .map(v => v.trim())
    .filter(Boolean)
    .map(v => Number(v))
    .filter(v => !Number.isNaN(v));
};

const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 10; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

const isExpired = (createdAt: string, usedAt: string | null) => {
  const now = Date.now();
  const ref = new Date(usedAt || createdAt).getTime();
  return now - ref > 24 * 60 * 60 * 1000;
};

export default function Sorteios() {
  const [activeTab, setActiveTab] = useState<'jogo' | 'historico' | 'notificacoes' | 'admin'>('jogo');
  const [business, setBusiness] = useState<any>(null);
  const [todayString, setTodayString] = useState('');
  const [adminSecretInput, setAdminSecretInput] = useState('');
  const [authInput, setAuthInput] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);

  const [adminCodes, setAdminCodes] = useState<AdminCode[]>([]);
  const [selectedAdminCode, setSelectedAdminCode] = useState('');

  const [quantity, setQuantity] = useState(5);
  const [maxNumber, setMaxNumber] = useState(60);
  const [luckyInput, setLuckyInput] = useState('');
  const [mode, setMode] = useState<'simples' | 'multipla'>('simples');
  const [repeatLimit, setRepeatLimit] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCode, setLockCode] = useState('');

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [message, setMessage] = useState('');
  const [userSearchId, setUserSearchId] = useState('');

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [subscribedUsers, setSubscribedUsers] = useState(0);
  const [codeStats, setCodeStats] = useState<CodeUsageStat[]>([]);

  const [notificationTarget, setNotificationTarget] = useState<'all' | 'user'>('all');
  const [notificationUserId, setNotificationUserId] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Estados para contagem regressiva
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [generatedResult, setGeneratedResult] = useState<{
    numbers: number[];
    result: 'ganhou' | 'perdeu';
    luckyNumbers: number[];
    matchedCount: number;
  } | null>(null);

  const localStorageKeyHistory = useMemo(() => {
    if (!business?.id) return 'random_lottery_history';
    return `random_lottery_history_${business.id}`;
  }, [business?.id]);

  const loadAdminCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_admin_codes')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const existing: any[] = data || [];
      // Filtrar apenas códigos não usados E não expirados
      const availableCodes = existing.filter(code =>
        !code.used_at && !isExpired(code.created_at, code.used_at)
      );

      setAdminCodes(availableCodes);
    } catch (err) {
      console.error('Erro ao carregar códigos admin:', err);
      setMessage('Erro ao carregar códigos admin.');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('marketplace_business');
    if (!saved) {
      window.location.href = '/marketplace/empresario/login';
      return;
    }
    const parsed = JSON.parse(saved);
    setBusiness(parsed);

    const now = new Date();
    setTodayString(now.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }));

    const savedHistory = localStorage.getItem(`random_lottery_history_${parsed.id}`);
    if (savedHistory) {
      const parsedHistory: HistoryItem[] = JSON.parse(savedHistory);
      const filtered = parsedHistory.filter(item => {
        const diff = Date.now() - new Date(item.createdAt).getTime();
        return diff <= 14 * 24 * 60 * 60 * 1000;
      });
      setHistory(filtered);
      localStorage.setItem(`random_lottery_history_${parsed.id}`, JSON.stringify(filtered));
    }

    setAuthCode(String(Math.floor(100000 + Math.random() * 900000)));
  }, []);

  useEffect(() => {
    if (business?.id) {
      (async () => {
        await loadAdminCodes();
      })();
    }
  }, [business?.id]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminSecretInput !== ADMIN_SECRET) {
      setMessage('Código secreto inválido.');
      return;
    }
    if (authInput !== authCode) {
      setMessage('Auth code inválido. Atualize a página e tente novamente.');
      return;
    }
    setIsAdminAuthorized(true);
    setMessage('Acesso de administrador concedido.');
    setAdminSecretInput('');
    setAuthInput('');
    setAuthCode(String(Math.floor(100000 + Math.random() * 900000)));
    refreshAdminDashboard();
  };

  const selectAdminCode = (code: string) => {
    const item = adminCodes.find(c => c.code === code);
    if (!item || isExpired(item.created_at, item.used_at)) {
      setMessage('Código inválido ou expirado. Atualize a página do administrador.');
      return;
    }
    setSelectedAdminCode(code);
    setMessage(`Código selecionado: ${code}`);
  };

  const pushHistory = (entry: HistoryItem) => {
    const next = [...history, entry];
    setHistory(next);
    if (business?.id) {
      localStorage.setItem(`random_lottery_history_${business.id}`, JSON.stringify(next));
    }
  };

  const filteredHistory = useMemo(() => {
    if (!userSearchId.trim()) {
      return history;
    }
    return history.filter(item => item.businessId.toLowerCase().includes(userSearchId.trim().toLowerCase()));
  }, [history, userSearchId]);

  const activeUserIds = useMemo(() => {
    const threshold = Date.now() - 14 * 24 * 60 * 60 * 1000;
    return Array.from(new Set(history
      .filter(item => new Date(item.createdAt).getTime() >= threshold)
      .map(item => item.businessId)));
  }, [history]);

  const totals = useMemo(() => ({
    totalPlays: history.length,
    totalWins: history.filter(item => item.result === 'ganhou').length,
    totalLosses: history.filter(item => item.result === 'perdeu').length,
    distinctUsers: Array.from(new Set(history.map(item => item.businessId))).length,
    activeUsers: activeUserIds.length,
  }), [history, activeUserIds]);

  const dailyCounts = useMemo(() => {
    const counted = history.reduce((acc, item) => {
      const day = new Date(item.createdAt).toLocaleDateString('pt-BR');
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const parseDatePtBr = (value: string) => {
      const parts = value.split('/');
      if (parts.length !== 3) return new Date(value);
      const [d, m, y] = parts;
      return new Date(`${y}-${m}-${d}`);
    };

    return Object.entries(counted).sort(([a], [b]) => parseDatePtBr(a).getTime() - parseDatePtBr(b).getTime());
  }, [history]);

  const maxDailyPlays = useMemo(() => {
    if (!dailyCounts.length) return 1;
    return Math.max(...dailyCounts.map(([, count]) => count));
  }, [dailyCounts]);

  useEffect(() => {
    const map = new Map<string, CodeUsageStat>();

    history.forEach(item => {
      const existing = map.get(item.adminCode) || {
        adminCode: item.adminCode,
        totalPlays: 0,
        wins: 0,
        losses: 0,
        uniqueUsers: 0,
      };
      existing.totalPlays += 1;
      existing.wins += item.result === 'ganhou' ? 1 : 0;
      existing.losses += item.result === 'perdeu' ? 1 : 0;
      map.set(item.adminCode, existing);
    });

    map.forEach((stat, code) => {
      stat.uniqueUsers = new Set(history.filter(item => item.adminCode === code).map(item => item.businessId)).size;
    });

    setCodeStats(Array.from(map.values()));
  }, [history]);

  useEffect(() => {
    setActiveUsers(totals.activeUsers);
    setSubscribedUsers(allUsers.filter(user => user.subscription_status === 'active').length);
  }, [totals, allUsers]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_businesses')
        .select('id,name,email,subscription_status');
      if (error) throw error;
      if (data) {
        setAllUsers(data);
        setActiveUsers(data.filter((user: any) => user.subscription_status === 'active').length);
        setSubscribedUsers(data.filter((user: any) => user.subscription_status === 'active').length);
      }
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setMessage('Erro ao carregar dados dos usuários.');
    }
  };

  const generateNewAdminCodes = async () => {
    try {
      console.log('Iniciando geração de novos códigos...');

      // Primeiro, remover códigos expirados (mais de 24 horas após uso)
      const { data: allCodes, error: fetchError } = await supabase
        .from('marketplace_admin_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      console.log(`Encontrados ${allCodes?.length || 0} códigos no total`);

      const expiredCodes = (allCodes || []).filter(code =>
        code.used_at && isExpired(code.created_at, code.used_at)
      );

      console.log(`Removendo ${expiredCodes.length} códigos expirados`);

      if (expiredCodes.length > 0) {
        const { error: deleteError } = await supabase
          .from('marketplace_admin_codes')
          .delete()
          .in('id', expiredCodes.map(c => c.id));

        if (deleteError) {
          console.error('Erro ao remover códigos expirados:', deleteError);
        }
      }

      // Contar códigos ativos (não usados ou não expirados)
      const activeCodes = (allCodes || []).filter(code =>
        !code.used_at || !isExpired(code.created_at, code.used_at)
      );

      console.log(`${activeCodes.length} códigos ativos encontrados`);

      // Sempre gerar pelo menos 5 novos códigos, independente da quantidade atual
      const codesToGenerate = Math.max(5, 20 - activeCodes.length);

      console.log(`Gerando ${codesToGenerate} novos códigos`);

      if (codesToGenerate > 0) {
        const newCodes: { code: string; created_at: string; used_at: null; used_by: null }[] = [];

        for (let i = 0; i < codesToGenerate; i++) {
          let newCode: string;
          let attempts = 0;
          do {
            newCode = generateCode();
            attempts++;
            if (attempts > 100) break; // Evitar loop infinito
          } while (
            activeCodes.some(c => c.code === newCode) ||
            newCodes.some(c => c.code === newCode)
          );

          if (newCode) {
            // Adicionar um pequeno delay para garantir timestamps diferentes
            const timestamp = new Date(Date.now() + (i * 100)).toISOString();
            newCodes.push({
              code: newCode,
              created_at: timestamp,
              used_at: null,
              used_by: null
            });
          }
        }

        console.log(`Criados ${newCodes.length} novos códigos`);

        if (newCodes.length > 0) {
          const { error: insertError } = await supabase
            .from('marketplace_admin_codes')
            .insert(newCodes);

          if (insertError) {
            console.error('Erro ao inserir novos códigos:', insertError);
            throw insertError;
          }

          console.log('Novos códigos inseridos com sucesso');
        }
      }
    } catch (err) {
      console.error('Erro ao gerar novos códigos:', err);
      throw err;
    }
  };

  const refreshAdminDashboard = async () => {
    try {
      setMessage('Atualizando dashboard e gerando novos códigos...');

      // Gerar novos códigos para usuários
      await generateNewAdminCodes();

      // Pequena pausa para garantir que os dados sejam persistidos
      await new Promise(resolve => setTimeout(resolve, 500));

      // Carregar dados atualizados
      await Promise.all([
        loadAdminCodes(),
        loadUsers()
      ]);

      setMessage('Dashboard atualizado com sucesso! Novos códigos gerados.');
      // Limpar mensagem após 3 segundos
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao atualizar dashboard:', err);
      setMessage('Erro ao atualizar dashboard.');
    }
  };

  const sendNotification = async () => {
    if (!notificationMessage.trim()) {
      setMessage('Informe a mensagem de notificação.');
      return;
    }

    let targetDescription = 'todos os usuários';
    let payload: any;

    if (notificationTarget === 'user') {
      if (!notificationUserId.trim()) {
        setMessage('Informe o ID do usuário.');
        return;
      }
      const userExists = allUsers.some(user => user.id === notificationUserId);
      if (!userExists) {
        setMessage('Usuário não encontrado. Verifique o ID.');
        return;
      }
      targetDescription = `usuário ${notificationUserId}`;
      payload = {
        target: 'user',
        business_id: notificationUserId,
        message: notificationMessage.trim(),
        created_by: business?.id
      };
    } else {
      payload = {
        target: 'all',
        message: notificationMessage.trim(),
        created_by: business?.id
      };
    }

    try {
      // Garantir created_by válido extraído do business logado
      const ownerId = business?.id;
      if (!ownerId) {
        throw new Error('Usuário não autenticado ou sem ID. Faça login novamente.');
      }

      payload.created_by = ownerId;
      if (!payload.business_id && notificationTarget === 'all') {
        payload.business_id = ownerId;
      }

      console.log('Enviar notificação payload', payload);

      const { error } = await supabase
        .from('marketplace_notifications')
        .insert(payload);

      if (error) {
        console.error('Erro detalhado ao enviar notificação:', error);
        throw new Error(error.message || 'Erro desconhecido ao enviar notificação');
      }

      setMessage(`Notificação enviada para ${targetDescription}.`);
      setNotificationMessage('');
      setNotificationUserId('');

      // Recarregar notificações
      await loadNotifications();
    } catch (err) {
      console.error('Erro ao enviar notificação:', err);
      const errorMsg = err instanceof Error ? err.message : 'Erro ao enviar notificação';
      setMessage(`Erro ao enviar notificação: ${errorMsg}`);
    }
  };

  const loadNotifications = async () => {
    try {
      console.log('Carregando notificações para usuário:', business?.id);
      // Tentar carregar notificações - se der erro de permissão, é normal para usuários não-admin
      const { data, error } = await supabase
        .from('marketplace_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Erro ao carregar notificações:', error);
        // Se for erro de permissão, não mostrar erro para o usuário
        if (error.message?.includes('permission denied') ||
            error.message?.includes('insufficient_privilege') ||
            error.code === 'PGRST116') {
          console.log('Usuário não tem permissão para ver notificações - isso é esperado para usuários não-admin');
          setNotifications([]);
          return;
        }
        // Para outros erros, mostrar mensagem
        setMessage('Erro ao carregar notificações');
        return;
      }

      console.log('Notificações carregadas com sucesso:', data?.length || 0);
      setNotifications(data || []);
    } catch (err) {
      console.error('Erro inesperado ao carregar notificações:', err);
      // Não mostrar erro para usuário se for problema de permissão
      setNotifications([]);
    }
  };

  useEffect(() => {
    if (business?.id) {
      loadNotifications();
    }
  }, [business?.id]);

  const downloadHistoryPdf = (data: HistoryItem[], mode: 'admin' | 'user') => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Histórico de Sorteios - ${mode === 'admin' ? 'Admin' : 'Usuário'}`, 10, 12);
    doc.setFontSize(11);

    if (data.length === 0) {
      doc.text('Nenhum registro disponível.', 10, 24);
      doc.save(`history_${mode}_${Date.now()}.pdf`);
      return;
    }

    let y = 24;
    data.forEach((item, index) => {
      const line = `${index + 1}. ID: ${item.businessId} | Código: ${item.adminCode} | ${new Date(item.createdAt).toLocaleString('pt-BR')} | Resultado: ${item.result.toUpperCase()} | Acertos: ${item.matchedCount} | Números: ${item.generatedNumbers.join(', ')} | Seus: ${item.luckyNumbers.join(', ')}`;
      const lines = doc.splitTextToSize(line, 190);
      doc.text(lines, 10, y);
      y += lines.length * 6 + 2;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`history_${mode}_${Date.now()}.pdf`);
  };

  const downloadHistoryCsv = (data: HistoryItem[], mode: 'admin' | 'user') => {
    if (data.length === 0) {
      const csv = 'Nenhum registro disponível.';
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `history_${mode}_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const headers = ['ID', 'Código Admin', 'Data/Hora', 'Resultado', 'Acertos', 'Números Gerados', 'Números da Sorte', 'Quantidade', 'Máximo', 'Modo', 'Limite Repetições', 'Tentativa'];
    const csvRows = [headers.join(',')];

    data.forEach(item => {
      const row = [
        item.businessId,
        item.adminCode,
        new Date(item.createdAt).toLocaleString('pt-BR'),
        item.result,
        item.matchedCount,
        item.generatedNumbers.join(';'),
        item.luckyNumbers.join(';'),
        item.quantity,
        item.maxNumber,
        item.mode,
        item.repeatLimit,
        item.attemptIndex
      ];
      csvRows.push(row.map(field => `"${field}"`).join(','));
    });

    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `history_${mode}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printAdminHistory = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const historyHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Histórico de Sorteios - Pesquisa Admin</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            .header { margin-bottom: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px; }
            .entry { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .entry.win { border-color: #4CAF50; background: #f8fff8; }
            .entry.lose { border-color: #f44336; background: #fff8f8; }
            .code { font-weight: bold; color: #2196F3; }
            .result { font-weight: bold; }
            .result.win { color: #4CAF50; }
            .result.lose { color: #f44336; }
            .numbers { margin: 5px 0; }
            .date { color: #666; font-size: 0.9em; }
            @media print {
              body { margin: 0; }
              .entry { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>Histórico de Sorteios - Pesquisa Admin</h1>
          <div class="header">
            <p><strong>Filtro aplicado:</strong> ${userSearchId || 'Todos os usuários'}</p>
            <p><strong>Data de geração:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <p><strong>Total de registros:</strong> ${filteredHistory.length}</p>
            <p><strong>Acertos:</strong> ${filteredHistory.filter(item => item.result === 'ganhou').length}</p>
            <p><strong>Erros:</strong> ${filteredHistory.filter(item => item.result === 'perdeu').length}</p>
          </div>

          ${filteredHistory.length === 0 ? '<p>Nenhum histórico encontrado.</p>' :
            filteredHistory.map(entry => `
              <div class="entry ${entry.result === 'ganhou' ? 'win' : 'lose'}">
                <div class="date">${new Date(entry.createdAt).toLocaleString('pt-BR')}</div>
                <div><strong>ID Usuário:</strong> ${entry.businessId}</div>
                <div><strong>Código:</strong> <span class="code">${entry.adminCode}</span></div>
                <div><strong>Modo:</strong> ${entry.mode} | <strong>Tentativa:</strong> ${entry.attemptIndex}/${entry.repeatLimit}</div>
                <div class="numbers"><strong>Números sorteados:</strong> ${entry.generatedNumbers.join(', ')}</div>
                <div class="numbers"><strong>Seus números:</strong> ${entry.luckyNumbers.join(', ')}</div>
                <div><strong>Acertos:</strong> ${entry.matchedCount || 0} números</div>
                <div><strong>Resultado:</strong> <span class="result ${entry.result === 'ganhou' ? 'win' : 'lose'}">${entry.result === 'ganhou' ? 'GANHOU' : 'PERDEU'}</span></div>
              </div>
            `).join('')
          }
        </body>
      </html>
    `;

    printWindow.document.write(historyHtml);
    printWindow.document.close();
    printWindow.focus();

    // Aguardar carregamento e imprimir
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  const printUserHistory = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const historyHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Histórico de Sorteios - ${business?.name || 'Usuário'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            .header { margin-bottom: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px; }
            .entry { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .entry.win { border-color: #4CAF50; background: #f8fff8; }
            .entry.lose { border-color: #f44336; background: #fff8f8; }
            .code { font-weight: bold; color: #2196F3; }
            .result { font-weight: bold; }
            .result.win { color: #4CAF50; }
            .result.lose { color: #f44336; }
            .numbers { margin: 5px 0; }
            .date { color: #666; font-size: 0.9em; }
            @media print {
              body { margin: 0; }
              .entry { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>Histórico de Sorteios</h1>
          <div class="header">
            <p><strong>Usuário:</strong> ${business?.name || 'N/A'}</p>
            <p><strong>ID:</strong> ${business?.id || 'N/A'}</p>
            <p><strong>Data de geração:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <p><strong>Total de jogadas:</strong> ${filteredHistory.length}</p>
            <p><strong>Acertos:</strong> ${filteredHistory.filter(item => item.result === 'ganhou').length}</p>
            <p><strong>Erros:</strong> ${filteredHistory.filter(item => item.result === 'perdeu').length}</p>
          </div>

          ${filteredHistory.length === 0 ? '<p>Nenhum histórico encontrado.</p>' :
            filteredHistory.map(entry => `
              <div class="entry ${entry.result === 'ganhou' ? 'win' : 'lose'}">
                <div class="date">${new Date(entry.createdAt).toLocaleString('pt-BR')}</div>
                <div><strong>Código:</strong> <span class="code">${entry.adminCode}</span></div>
                <div><strong>Modo:</strong> ${entry.mode} | <strong>Tentativa:</strong> ${entry.attemptIndex}/${entry.repeatLimit}</div>
                <div class="numbers"><strong>Números sorteados:</strong> ${entry.generatedNumbers.join(', ')}</div>
                <div class="numbers"><strong>Seus números:</strong> ${entry.luckyNumbers.join(', ')}</div>
                <div><strong>Acertos:</strong> ${entry.matchedCount || 0} números</div>
                <div><strong>Resultado:</strong> <span class="result ${entry.result === 'ganhou' ? 'win' : 'lose'}">${entry.result === 'ganhou' ? 'GANHOU' : 'PERDEU'}</span></div>
              </div>
            `).join('')
          }
        </body>
      </html>
    `;

    printWindow.document.write(historyHtml);
    printWindow.document.close();
    printWindow.focus();

    // Aguardar carregamento e imprimir
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  // useEffect para controlar a contagem regressiva
  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isCountingDown && countdown === 0) {
      // Quando a contagem chega a 0, gera os números
      generateNumbers();
    }
  }, [isCountingDown, countdown]);

  const generateNumbers = async () => {
    const chosenCode = adminCodes.find(c => c.code === selectedAdminCode);
    if (!chosenCode) {
      setMessage('Código não encontrado ou já foi usado por outro usuário.');
      setIsCountingDown(false);
      setCountdown(10);
      return;
    }

    // Verificar se o código ainda está válido (não usado e não expirado)
    if (chosenCode.used_at || isExpired(chosenCode.created_at, chosenCode.used_at)) {
      setMessage('Código expirado ou já foi usado. Solicite um novo código ao administrador.');
      setIsCountingDown(false);
      setCountdown(10);
      // Recarregar códigos disponíveis
      await loadAdminCodes();
      return;
    }

    const allowedLimit = repeatLimit;
    const attemptsForCode = history.filter(item => item.adminCode === selectedAdminCode).length;
    const attemptIndex = attemptsForCode + 1;

    if (!isLocked) {
      setIsLocked(true);
      setLockCode(selectedAdminCode);
    }

    const luckyNumbers = toNumberList(luckyInput);
    const uniqueLucky = Array.from(new Set(luckyNumbers));

    const generates = new Set<number>();
    while (generates.size < quantity) {
      const num = Math.floor(Math.random() * maxNumber) + 1;
      generates.add(num);
    }
    const generatedNumbers = Array.from(generates).sort((a, b) => a - b);

    const sortedLucky = uniqueLucky.sort((a, b) => a - b);
    const sortedGenerated = generatedNumbers;
    const exactMatch =
      sortedGenerated.length === sortedLucky.length &&
      sortedGenerated.every((num, idx) => num === sortedLucky[idx]);

    const matchedCount = sortedGenerated.filter(num => sortedLucky.includes(num)).length;

    // Probabilidade completamente aleatória: 5% de chance de ganhar independente dos acertos
    const randomWin = Math.random() < 0.05; // 5% chance aleatória

    const won = exactMatch || randomWin;
    const result = won ? 'ganhou' : 'perdeu';

    const now = new Date();
    setTodayString(now.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }));

    // Salva o resultado para exibir
    setGeneratedResult({
      numbers: generatedNumbers,
      result,
      luckyNumbers: uniqueLucky.sort((a, b) => a - b),
      matchedCount
    });

    const entry: HistoryItem = {
      id: `${Date.now()}-${Math.random()}`,
      businessId: business.id,
      createdAt: new Date().toISOString(),
      adminCode: selectedAdminCode,
      quantity,
      maxNumber,
      luckyNumbers: uniqueLucky.sort((a, b) => a - b),
      generatedNumbers,
      mode,
      repeatLimit: allowedLimit,
      attemptIndex,
      result,
      expired: false,
      matchedCount
    };

    pushHistory(entry);

    // Atualiza o código no banco - marcar como usado
    const { error: updateError } = await supabase
      .from('marketplace_admin_codes')
      .update({
        used_at: new Date().toISOString(),
        used_by: business.id
      })
      .eq('code', selectedAdminCode);

    if (updateError) {
      console.error('Erro ao atualizar código admin no DB:', updateError);
      setMessage('Erro ao marcar código como usado.');
    } else {
      // Atualizar estado local - remover código da lista disponível
      setAdminCodes(adminCodes.filter(c => c.code !== selectedAdminCode));

      // Agendar remoção automática após 24 horas
      setTimeout(async () => {
        try {
          const { error: deleteError } = await supabase
            .from('marketplace_admin_codes')
            .delete()
            .eq('code', selectedAdminCode);

          if (deleteError) {
            console.error('Erro ao remover código expirado:', deleteError);
          }
        } catch (err) {
          console.error('Erro ao remover código expirado:', err);
        }
      }, 24 * 60 * 60 * 1000); // 24 horas em milissegundos
    }

    if (won) {
      const winMessage = exactMatch
        ? `Parabéns! Você ganhou com o código ${selectedAdminCode} acertando todos os números!`
        : `Incrível! Você ganhou com o código ${selectedAdminCode} por sorte! Este código agora é válido por 24 horas.`;
      setMessage(winMessage);
    } else {
      setMessage(`Você perdeu! Tente de novo com o código ${selectedAdminCode}. Este código agora é válido por 24 horas.`);
    }

    if (attemptIndex > allowedLimit) {
      setMessage(`Você já ultrapassou as tentativas definidas (${allowedLimit}). Este registro aparece em destaque.`);
    }

    if (!lockCode) {
      setLockCode(selectedAdminCode);
    }

    // Reseta a contagem regressiva
    setIsCountingDown(false);
    setCountdown(10);
  };

  const handleGenerate = async () => {
    setMessage('');
    if (!business || !business.id) {
      setMessage('Erro interno: faça login novamente.');
      return;
    }
    if (!selectedAdminCode) {
      setMessage('Selecione um código de administrador antes de gerar.');
      return;
    }

    const chosenCode = adminCodes.find(c => c.code === selectedAdminCode);
    if (!chosenCode || isExpired(chosenCode.created_at, chosenCode.used_at)) {
      setMessage('Código expirado. Volte ao admin e selecione outro.');
      return;
    }

    if (quantity <= 0 || maxNumber <= 0 || quantity > maxNumber) {
      setMessage('Quantidade e Máximo devem ser válidos (1 ≤ quantidade ≤ máximo).');
      return;
    }

    if (!luckyInput.trim()) {
      setMessage('Insira os números da sorte, separados por vírgula.');
      return;
    }

    const luckyNumbers = toNumberList(luckyInput);
    const uniqueLucky = Array.from(new Set(luckyNumbers));
    if (uniqueLucky.length !== quantity) {
      setMessage(`Você deve fornecer exatamente ${quantity} números distintos.`);
      return;
    }
    if (uniqueLucky.some(num => num < 1 || num > maxNumber)) {
      setMessage('Os números da sorte devem estar entre 1 e o máximo definido.');
      return;
    }

    if (isLocked && lockCode !== selectedAdminCode) {
      setMessage('Configurações bloqueadas para outro código. Use o mesmo código ou peça desbloqueio no Admin.');
      return;
    }

    // Inicia a contagem regressiva
    setIsCountingDown(true);
    setCountdown(10);
    setGeneratedResult(null);
  };

  const handleUnlock = () => {
    if (!selectedAdminCode) {
      setMessage('Selecione um código válido para desbloquear.');
      return;
    }
    setIsLocked(false);
    setLockCode('');
    setMessage('Sistema desbloqueado. Faça login no Admin para gerar novo código e reiniciar.');
  };

  const attemptsTotal = history.length;
  const errorsTotal = history.filter(item => item.result === 'perdeu').length;
  const codesUsed = Array.from(new Set(history.map(item => item.adminCode)));

  const entriesAtividade = filteredHistory
    .map(item => ({ ...item, isExceed: item.attemptIndex > item.repeatLimit }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🎲 Sistema de Números Aleatórios</h1>
            <p className="text-sm text-gray-600 mt-1">ID do usuário: <strong>{business?.id || '---'}</strong></p>
            <p className="text-sm text-gray-600">Data/hora atual: <strong>{todayString}</strong></p>
          </div>
          <div className="flex gap-2">
            <Link href="/marketplace/empresario/dashboard" className="text-blue-600 hover:text-blue-800 font-semibold">← Voltar ao Dashboard</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <button
            className={`py-2 rounded-lg font-semibold ${activeTab === 'jogo' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('jogo')}
          >Jogo</button>
          <button
            className={`py-2 rounded-lg font-semibold ${activeTab === 'historico' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('historico')}
          >Histórico</button>
          <button
            className={`py-2 rounded-lg font-semibold ${activeTab === 'notificacoes' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('notificacoes')}
          >Notificações</button>
          <button
            className={`py-2 rounded-lg font-semibold ${activeTab === 'admin' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('admin')}
          >Admin</button>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-200">{message}</div>
        )}

        {activeTab === 'jogo' && (
          <div className="grid gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-3">Configuração de Jogada</h2>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Quantidade</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    disabled={isLocked}
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Máximo</label>
                  <input
                    type="number"
                    min={quantity}
                    value={maxNumber}
                    onChange={e => setMaxNumber(Number(e.target.value))}
                    disabled={isLocked}
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Modo</label>
                  <div className="mt-1 space-x-2">
                    <button
                      type="button"
                      className={`px-3 py-2 rounded ${mode === 'simples' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      onClick={() => !isLocked && setMode('simples')}
                    >Simples</button>
                    <button
                      type="button"
                      className={`px-3 py-2 rounded ${mode === 'multipla' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      onClick={() => !isLocked && setMode('multipla')}
                    >Multipla</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Repetições</label>
                  <input
                    type="number"
                    min={1}
                    value={repeatLimit}
                    onChange={e => setRepeatLimit(Number(e.target.value))}
                    disabled={isLocked}
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700">Números da sorte (vírgula)</label>
                <textarea
                  placeholder="ex: 1, 3, 9, 21, 45"
                  value={luckyInput}
                  onChange={e => setLuckyInput(e.target.value)}
                  disabled={isLocked}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 min-h-[80px]"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700">Código do administrador selecionado</label>
                <input
                  type="text"
                  value={selectedAdminCode}
                  onChange={e => setSelectedAdminCode(e.target.value)}
                  placeholder="Selecione no Admin ou cole aqui"
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleGenerate}
                  className="bg-green-600 text-white py-2 px-5 rounded hover:bg-green-700 transition"
                >Gerar</button>
                <button
                  onClick={handleUnlock}
                  className="bg-red-600 text-white py-2 px-5 rounded hover:bg-red-700 transition"
                >Desbloquear</button>
              </div>

              <p className="text-xs text-gray-500 mt-2">Após gerar, os campos ficam bloqueados. Para editar, autentique no Admin e clique em Desbloquear.</p>
            </div>

            {/* Tela de Contagem Regressiva */}
            {isCountingDown && (
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 rounded-lg shadow-lg text-center text-white">
                <div className="mb-4">
                  <div className="text-6xl font-bold mb-2 animate-pulse">
                    {countdown}
                  </div>
                  <p className="text-xl">Gerando números...</p>
                </div>
                <div className="flex justify-center space-x-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}

            {/* Resultado dos Números Sorteados */}
            {generatedResult && !isCountingDown && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-lg shadow-lg text-center text-white">
                <h3 className="text-2xl font-bold mb-4">🎉 Números Sorteados! 🎉</h3>
                <div className="text-4xl font-bold mb-4">
                  {generatedResult.numbers.join(' - ')}
                </div>
                <div className="mb-4">
                  <p className="text-lg">Seus números: <span className="font-bold">{generatedResult.luckyNumbers.join(' - ')}</span></p>
                  <p className="text-lg mt-2">Você acertou: <span className="font-bold text-blue-300">{generatedResult.matchedCount} número{generatedResult.matchedCount !== 1 ? 's' : ''}</span></p>
                </div>
                <div className={`text-xl font-bold ${generatedResult.result === 'ganhou' ? 'text-green-300' : 'text-red-300'}`}>
                  {generatedResult.result === 'ganhou' ? '🎊 PARABÉNS! Você GANHOU! 🎊' : '😔 Que pena! Você perdeu...'}
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-3">Rodada atual</h2>
              <p>ID do usuário: <strong>{business?.id}</strong></p>
              <p>Data da jogada: <strong>{todayString}</strong></p>
            </div>
          </div>
        )}

        {activeTab === 'historico' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Histórico de jogadas</h2>

            <div className="flex flex-wrap gap-2 mb-4">
              <input
                type="text"
                value={userSearchId}
                onChange={e => setUserSearchId(e.target.value)}
                placeholder="Buscar por ID do usuário..."
                className="flex-1 border border-gray-300 rounded px-3 py-2"
              />
              <button
                onClick={() => setUserSearchId('')}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >Limpar filtro</button>
              <button
                onClick={() => downloadHistoryPdf(filteredHistory, 'user')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >Baixar PDF (Usuário)</button>
              <button
                onClick={() => downloadHistoryCsv(filteredHistory, 'user')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >Baixar CSV (Usuário)</button>
              <button
                onClick={printUserHistory}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >Imprimir Histórico</button>
            </div>

            <p className="text-gray-700">Tentativas totais: <strong>{filteredHistory.length}</strong></p>
            <p className="text-gray-700">Erros: <strong>{filteredHistory.filter(item => item.result === 'perdeu').length}</strong></p>
            <p className="text-gray-700 mb-4">Códigos usados: <strong>{Array.from(new Set(filteredHistory.map(item => item.adminCode))).join(', ') || 'Nenhum'}</strong></p>

            {filteredHistory.length === 0 ? (
              <p className="text-gray-500">Nenhuma jogada ainda. Gere seus números no aba Jogo.</p>
            ) : (
              <div className="space-y-3">
                {entriesAtividade.map(entry => (
                  <div
                    key={entry.id}
                    className={`p-3 rounded border ${entry.isExceed ? 'bg-red-100 border-red-300' : 'bg-green-50 border-green-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span><strong>Código:</strong> {entry.adminCode}</span>
                      <span className="text-xs text-gray-600">{new Date(entry.createdAt).toLocaleString('pt-BR')}</span>
                    </div>
                    <p><strong>Modo:</strong> {entry.mode} | <strong>Tentativa:</strong> {entry.attemptIndex}/{entry.repeatLimit}</p>
                    <p><strong>Números sorteados:</strong> {entry.generatedNumbers.join(', ')}</p>
                    <p><strong>Seus números:</strong> {entry.luckyNumbers.join(', ')}</p>
                    <p><strong>Acertos:</strong> {entry.matchedCount} número{entry.matchedCount !== 1 ? 's' : ''}</p>
                    <p><strong>Status:</strong> {entry.result === 'ganhou' ? 'Parabéns você ganhou' : 'Você perdeu'}</p>
                    <div className="mt-2">
                      <button
                        onClick={() => selectAdminCode(entry.adminCode)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                      >Selecionar este código</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notificacoes' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">📬 Notificações</h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhuma notificação recebida ainda.</p>
              ) : (
                notifications.map(note => (
                  <div key={note.id} className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-gray-600">
                        {new Date(note.created_at).toLocaleString('pt-BR')}
                      </span>
                      <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                        {note.target === 'all' ? 'Para todos' : 'Pessoal'}
                      </span>
                    </div>
                    <p className="text-gray-800">{note.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Administração de Códigos</h2>

            {!isAdminAuthorized ? (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Código Secreto</label>
                  <input
                    type="text"
                    value={adminSecretInput}
                    onChange={e => setAdminSecretInput(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Informe o código secreto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Authenticator</label>
                  <input
                    type="text"
                    value={authInput}
                    onChange={e => setAuthInput(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                    placeholder={`Use o código: ${authCode}`}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >Entrar como Administrador</button>
                <p className="text-xs text-gray-500">Código gerado de autenticação: <strong>{authCode}</strong></p>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-green-700">Acesso ok. Códigos expiram em 24h.</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  <button
                    type="button"
                    onClick={refreshAdminDashboard}
                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
                  >Atualizar Dashboard</button>
                  <button
                    type="button"
                    onClick={() => downloadHistoryPdf(filteredHistory, 'admin')}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                  >Baixar PDF (Admin)</button>
                  <button
                    type="button"
                    onClick={() => downloadHistoryCsv(filteredHistory, 'admin')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >Baixar CSV (Admin)</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className="p-3 border rounded bg-slate-50">
                    <h4 className="text-sm font-semibold">Usuários cadastrados</h4>
                    <p className="text-2xl font-bold">{allUsers.length}</p>
                  </div>
                  <div className="p-3 border rounded bg-slate-50">
                    <h4 className="text-sm font-semibold">Usuários ativos (14d)</h4>
                    <p className="text-2xl font-bold">{activeUsers}</p>
                  </div>
                  <div className="p-3 border rounded bg-slate-50">
                    <h4 className="text-sm font-semibold">Inscritos ativos</h4>
                    <p className="text-2xl font-bold">{subscribedUsers}</p>
                  </div>
                </div>

                <div className="mb-5 p-4 border rounded bg-white">
                  <h3 className="text-lg font-semibold mb-2">Relatório de performance</h3>
                  <p>Total de jogadas: <strong>{totals.totalPlays}</strong></p>
                  <p>Acertos: <strong>{totals.totalWins}</strong> | Erros: <strong>{totals.totalLosses}</strong></p>
                  <p>Taxa de acerto: <strong>{totals.totalPlays > 0 ? ((totals.totalWins / totals.totalPlays) * 100).toFixed(2) : '0.00'}%</strong></p>
                  <p>Usuários distintos: <strong>{totals.distinctUsers}</strong></p>
                </div>

                <div className="mb-5 p-4 border rounded bg-white">
                  <h3 className="text-lg font-semibold mb-2">Distribuição diária de jogadas</h3>
                  <div className="space-y-1">
                    {dailyCounts.length === 0 ? (
                      <p className="text-gray-500">Nenhum dado de histórico para exibir.</p>
                    ) : (
                      dailyCounts.map(([day, count]) => {
                        const width = Math.min(100, Math.round((count / maxDailyPlays) * 100));
                        return (
                          <div key={day} className="text-xs">
                            <div className="flex justify-between mb-1">
                              <span>{day}</span>
                              <span className="text-gray-600">{count} jogadas</span>
                            </div>
                            <div className="bg-gray-200 rounded h-3">
                              <div className="bg-blue-500 h-3 rounded" style={{ width: `${width}%` }}></div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="mb-5 p-4 border rounded bg-white">
                  <h3 className="text-lg font-semibold mb-2">Ranking códigos admin</h3>
                  <div className="space-y-2">
                    {codeStats.length === 0 ? (
                      <p className="text-gray-500">Nenhum código usado ainda</p>
                    ) : (
                      codeStats.sort((a, b) => b.totalPlays - a.totalPlays).map(stat => (
                        <div key={stat.adminCode} className="p-2 border rounded bg-slate-50">
                          <div className="flex justify-between items-center">
                            <strong>{stat.adminCode}</strong>
                            <span className="text-xs text-gray-500">Usuários {stat.uniqueUsers}</span>
                          </div>
                          <p className="text-xs">Jogadas: {stat.totalPlays} | Ganhou: {stat.wins} | Perdeu: {stat.losses}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mb-5 p-4 border rounded bg-white">
                  <h3 className="text-lg font-semibold mb-2">Enviar notificação</h3>
                  <div className="grid md:grid-cols-3 gap-2 mb-3">
                    <select
                      value={notificationTarget}
                      onChange={e => setNotificationTarget(e.target.value as 'all' | 'user')}
                      className="border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="all">Todos usuários</option>
                      <option value="user">Usuário específico</option>
                    </select>
                    {notificationTarget === 'user' && (
                      <input
                        type="text"
                        value={notificationUserId}
                        onChange={e => setNotificationUserId(e.target.value)}
                        placeholder="ID do usuário"
                        className="border border-gray-300 rounded px-3 py-2"
                      />
                    )}
                    <input
                      type="text"
                      value={notificationMessage}
                      onChange={e => setNotificationMessage(e.target.value)}
                      placeholder="Mensagem de notificação"
                      className="border border-gray-300 rounded px-3 py-2 md:col-span-2"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={sendNotification}
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                  >Enviar</button>
                  <div className="mt-3 max-h-40 overflow-y-auto border rounded p-2 bg-slate-50">
                    {notifications.length === 0 ? (
                      <p className="text-gray-500">Nenhuma notificação enviada ainda.</p>
                    ) : notifications.map(note => (
                      <div key={note.id} className="mb-1 p-1 border rounded bg-white">
                        <p className="text-xs text-gray-500">{new Date(note.created_at).toLocaleString('pt-BR')} - {note.target === 'all' ? 'Todos' : note.business_id}</p>
                        <p className="text-sm">{note.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {adminCodes.length === 0 && <p>Nenhum código disponível.</p>}
                  {adminCodes.map(code => {
                    const expired = isExpired(code.created_at, code.used_at);
                    const status = expired ? 'Expirado' : code.used_at ? 'Usado' : 'Disponível';
                    return (
                      <div key={code.code} className="border rounded p-3 bg-white">
                        <div className="flex justify-between items-center mb-2">
                          <strong>{code.code}</strong>
                          <span className="text-xs text-gray-500">{status}</span>
                        </div>
                        <p className="text-xs text-gray-600">Gerado: {new Date(code.created_at).toLocaleString('pt-BR')}</p>
                        {code.used_at && <p className="text-xs text-gray-600">Usado: {new Date(code.used_at).toLocaleString('pt-BR')}</p>}
                        <button
                          type="button"
                          onClick={() => selectAdminCode(code.code)}
                          disabled={expired}
                          className="mt-2 w-full bg-indigo-600 text-white py-1 rounded hover:bg-indigo-700 transition disabled:opacity-50"
                        >Selecionar</button>
                      </div>
                    );
                  })}
                </div>

                {/* Busca de histórico por ID do usuário no Admin */}
                <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-2">Pesquisar histórico por ID do usuário</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <input
                      type="text"
                      value={userSearchId}
                      onChange={e => setUserSearchId(e.target.value)}
                      placeholder="Ex: 123e4567-e89b-12d3-a456-426614174000"
                      className="flex-1 border border-gray-300 rounded px-3 py-2"
                    />
                    <button
                      onClick={() => setUserSearchId('')}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                    >Limpar</button>
                    <button
                      onClick={() => downloadHistoryPdf(filteredHistory, 'admin')}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >Baixar PDF (filtrado)</button>
                    <button
                      onClick={() => downloadHistoryCsv(filteredHistory, 'admin')}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >Baixar CSV (filtrado)</button>
                    <button
                      onClick={printAdminHistory}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >Imprimir (filtrado)</button>
                  </div>

                  {filteredHistory.length === 0 ? (
                    <p className="text-gray-600">Nenhum histórico encontrado para este ID.</p>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {filteredHistory.map(entry => (
                        <div key={entry.id} className="p-2 bg-white border rounded">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>ID Usuário: {entry.businessId}</span>
                            <span>{new Date(entry.createdAt).toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="text-sm mt-1">
                            <p><strong>Código:</strong> {entry.adminCode}</p>
                            <p><strong>Resultado:</strong> {entry.result}</p>
                            <p><strong>Números:</strong> {entry.generatedNumbers.join(', ')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

'use client'

import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { CustomerRepository } from '@/lib/customerRepository';
import { ResumoAtraso } from '@/types/customer';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Brain,
  Calendar,
  CalendarCheck,
  CalendarDays,
  Clock,
  FileText,
  Lightbulb,
  Loader2,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function TitlesPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const username = user?.name || 'User';

  const [resumo, setResumo] = useState<ResumoAtraso | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  const customerRepository = new CustomerRepository();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const fetchResumo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerRepository.fetchResumo();
      setResumo(data);
    } catch (err) {
      setError('Falha ao carregar o resumo. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchResumo();
    }
  }, [fetchResumo, isAuthenticated]);

  const getInsights = useCallback(async () => {
    if (!resumo) return;

    setLoadingInsights(true);
    try {
      // Simulate AI insights generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const prompt = `Com base nos dados de títulos: ${Object.entries(resumo).map(([title, value]) => `${title}: ${value}`).join(', ')}`;

      // Mock insights response
      const mockInsights = `**Análise dos Títulos Financeiros:**

📊 **Situação Geral:** Você possui ${resumo.total} títulos no total.

⚠️ **Atenção Prioritária:** ${resumo.atraso_30_60} títulos com atraso entre 30-60 dias requerem ação imediata.

📈 **Gestão de Fluxo:** ${resumo.vence_ate_30} títulos vencem nos próximos 30 dias - prepare o fluxo de caixa.

✅ **Oportunidade:** ${resumo.vencimento_hoje} títulos vencem hoje - contate os clientes para agilizar o pagamento.`;

      setInsights(mockInsights);
    } catch (error) {
      console.error('Erro ao obter insights:', error);
      setInsights('Não foi possível obter insights no momento. Tente novamente mais tarde.');
    } finally {
      setLoadingInsights(false);
    }
  }, [resumo]);

  const resumoItems: {
    key: keyof ResumoAtraso,
    title: string,
    icon: React.ComponentType<{ size?: number; className?: string }>,
    color: string,
    order: number
  }[] = [
    { key: 'vencimento_hoje', title: 'Vencimento Hoje', icon: Calendar, color: '#4CAF50', order: 3 },
    { key: 'vence_ate_30', title: 'Vence em até 30 dias', icon: CalendarCheck, color: '#2196F3', order: 4 },
    { key: 'vencimento_superior_30', title: 'Vencimento superior a 30 dias', icon: CalendarDays, color: '#9C27B0', order: 5 },
    { key: 'atraso_ate_30', title: 'Atraso até 30 dias', icon: Clock, color: '#FFC107', order: 2 },
    { key: 'atraso_30_60', title: 'Atraso entre 30 e 60 dias', icon: AlertTriangle, color: '#FF5722', order: 1 },
    { key: 'outro', title: 'Atraso superior a 60 dias', icon: MoreHorizontal, color: '#607D8B', order: 6 },
  ];

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Carregando resumo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header username={username} />
        <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Erro ao carregar dados</h2>
            <p className="text-red-500 text-center mb-6">{error}</p>
            <button
              onClick={fetchResumo}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors inline-flex items-center"
            >
              <RefreshCw size={20} className="mr-2" />
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header username={username} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center">
            <FileText size={32} className="text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Resumo de Títulos</h1>
          </div>
        </div>

        <p className="text-gray-500 mb-8 text-lg">
          Visão geral dos seus títulos e prazos
        </p>

        {/* Insights Button */}
        <div className="mb-8">
          <button
            onClick={getInsights}
            disabled={loadingInsights}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-6 py-4 text-white font-semibold inline-flex items-center transition-colors"
          >
            {loadingInsights ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Gerando Insights...
              </>
            ) : (
              <>
                <Brain size={20} className="mr-2" />
                Obter Insights do Dinho
              </>
            )}
          </button>
        </div>

        {/* Insights Display */}
        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center mb-4">
                <Lightbulb size={24} className="mr-3" />
                <h3 className="text-xl font-bold">Insights do Dinho</h3>
              </div>
              <div className="prose prose-invert max-w-none">
                <div
                  className="text-white space-y-2"
                  dangerouslySetInnerHTML={{
                    __html: insights.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Resumo Cards */}
        {resumo && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumoItems.sort((a, b) => a.order - b.order).map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border-l-4"
                  style={{ borderLeftColor: item.color }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                                                 <div style={{ color: item.color }}>
                           <IconComponent
                             size={24}
                             className="mr-3"
                           />
                         </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {((Number(resumo[item.key]) / Number(resumo.total)) * 100).toFixed(1)}% do total
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-3xl font-bold mb-1"
                        style={{ color: item.color }}
                      >
                        {resumo[item.key]}
                      </p>
                      <p className="text-sm text-gray-500">títulos</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

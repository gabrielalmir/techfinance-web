'use client'

import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Send, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AIAnalysis {
  query: string;
  response: string;
  timestamp: Date;
}

export default function AIAnalysisReport() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const username = user?.name || 'User';
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const predefinedQueries = [
    'Analise o desempenho de vendas dos últimos 3 meses',
    'Quais são os produtos com maior margem de lucro?',
    'Identifique tendências de vendas por região',
    'Analise o comportamento dos clientes top 10',
    'Sugira estratégias para aumentar as vendas',
    'Identifique produtos com baixo giro de estoque'
  ];

  const handleSubmit = async (customQuery?: string) => {
    const queryToUse = customQuery || query;
    if (!queryToUse.trim()) return;

    setLoading(true);
    try {
      // Simular chamada para endpoint de IA - ajustar conforme API real
      const response = await api.post('/ai/analysis', {
        prompt: queryToUse,
        context: 'financial_analysis'
      });

      const newAnalysis: AIAnalysis = {
        query: queryToUse,
        response: response.data.response || 'Análise processada com sucesso.',
        timestamp: new Date()
      };

      setAnalyses(prev => [newAnalysis, ...prev]);
      setQuery('');
    } catch (err: any) {
      console.error('Erro ao processar análise:', err);

      // Fallback com resposta simulada em caso de erro
      const fallbackAnalysis: AIAnalysis = {
        query: queryToUse,
        response: `Análise para: "${queryToUse}"\n\nEsta é uma resposta simulada. A funcionalidade de IA está em desenvolvimento e em breve estará totalmente integrada com dados reais do sistema.\n\nPara uma análise completa, recomendamos:\n• Verificar os relatórios específicos disponíveis\n• Consultar os dados históricos\n• Analisar as tendências de vendas\n• Revisar o desempenho por período`,
        timestamp: new Date()
      };

      setAnalyses(prev => [fallbackAnalysis, ...prev]);
      setQuery('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header username={username} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push('/reports')}
            className="mr-4 p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center">
            <Brain size={32} className="text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Análises IA</h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Sparkles size={20} className="text-blue-600 mr-2" />
            Faça sua consulta
          </h2>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite sua pergunta sobre análises financeiras..."
            />
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !query.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send size={16} />
              )}
              {loading ? 'Analisando...' : 'Enviar'}
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-3">Consultas sugeridas:</p>
            <div className="flex flex-wrap gap-2">
              {predefinedQueries.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubmit(suggestion)}
                  disabled={loading}
                  className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full transition-colors disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Histórico de Análises */}
        <div className="space-y-6">
          {analyses.map((analysis, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Brain size={20} className="text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">Consulta</h3>
                  </div>
                  <span className="text-xs text-gray-500">
                    {analysis.timestamp.toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-gray-700 mt-2 font-medium">{analysis.query}</p>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-3">
                  <Sparkles size={16} className="text-green-600 mr-2" />
                  <h4 className="font-semibold text-gray-800">Análise</h4>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {analysis.response}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {analyses.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Brain size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Nenhuma análise realizada ainda
            </h3>
            <p className="text-gray-500">
              Faça sua primeira consulta usando o campo acima ou clique em uma das sugestões.
            </p>
          </div>
        )}

        {/* Aviso sobre desenvolvimento */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mt-8">
          <div className="flex items-center mb-2">
            <Sparkles size={20} className="text-yellow-600 mr-2" />
            <h3 className="font-semibold text-yellow-800">Funcionalidade em Desenvolvimento</h3>
          </div>
          <p className="text-yellow-700">
            O módulo de Análises IA está sendo aprimorado para fornecer insights mais precisos e integrados
            com os dados reais do sistema. Em breve, você terá acesso a análises avançadas com machine learning
            e processamento de linguagem natural.
          </p>
        </div>
      </div>
    </div>
  );
}

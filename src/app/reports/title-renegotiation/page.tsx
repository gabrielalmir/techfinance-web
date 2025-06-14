'use client'

import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { ArrowLeft, Calculator, FileBarChart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RenegotiatedTitle {
  title: string;
  value: string;
  renegotiation_date: string;
  original_due_date: string;
  new_due_date: string;
}

interface CashFlowSummary {
  month_year: string;
  total_renegotiated: string;
}

interface ApiResponse {
  renegotiated_titles: RenegotiatedTitle[];
  cash_flow_summary: CashFlowSummary[];
  notes: string;
}

export default function TitleRenegotiationReport() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const username = user?.name || 'User';
  const [loading, setLoading] = useState(false);
  const [assignment, setAssignment] = useState('');
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const validateAssignmentInput = (value: string): boolean => {
    const num = parseInt(value);
    return !isNaN(num) && num > 0 && num <= 100 && Number.isInteger(parseFloat(value));
  };

  const handleAssignmentChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setAssignment(numericValue);
  };

  const parseValueSafely = (valueStr: string | number): number => {
    if (!valueStr && valueStr !== 0) return 0;
    if (typeof valueStr === 'number') {
      return isNaN(valueStr) ? 0 : valueStr;
    }
    const str = String(valueStr);
    const cleanValue = str.replace(/[^\d.,\-]/g, '');
    if (!/\d/.test(cleanValue)) return 0;
    if (cleanValue.includes(',') && cleanValue.includes('.')) {
      return parseFloat(cleanValue.replace(/\./g, '').replace(',', '.')) || 0;
    }
    if (cleanValue.includes(',') && !cleanValue.includes('.')) {
      const parts = cleanValue.split(',');
      if (parts.length === 2 && parts[1].length <= 2) {
        return parseFloat(cleanValue.replace(',', '.')) || 0;
      } else {
        return parseFloat(cleanValue.replace(/,/g, '')) || 0;
      }
    }
    return parseFloat(cleanValue) || 0;
  };

  const onReportSubmit = async () => {
    if (!assignment || !validateAssignmentInput(assignment)) {
      setError('Por favor, insira um número válido entre 1 e 100.');
      return;
    }

    setLoading(true);
    setError('');
    const assignmentCount = Number(assignment);

    try {
      const response = await api.get<ApiResponse>('/contas_receber/ai', {
        params: {
          prompt: `Realize a renegociação de todos os títulos vencidos, considere a renegociação de ${assignmentCount} título${assignmentCount > 1 ? 's' : ''} por dia, somente os títulos vencidos e o inicio da renegociação a data de hoje. Considerar que a nova data de vencimento será de 20 dias a contar da data de cada renegociação. Crie uma tabela e projete um fluxo de caixa com base nas novas datas de vencimento, exibir as seguintes colunas: título, valor, dt de renegociação, dt original vencto, nova dt vencto. Exiba também o novo fluxo de caixa resumido por mês. Apresente apenas a tabela de título de renegociação e o fluxo de caixa.`,
        },
      });

      if (response.status === 200) {
        const data = response.data;
        if (data && typeof data === 'object') {
          const apiResponse: ApiResponse = {
            renegotiated_titles: Array.isArray(data.renegotiated_titles) ? data.renegotiated_titles : [],
            cash_flow_summary: Array.isArray(data.cash_flow_summary) ? data.cash_flow_summary : [],
            notes: typeof data.notes === 'string' ? data.notes : 'Processamento concluído.'
          };
          setApiResponse(apiResponse);
        } else {
          throw new Error('Dados inválidos recebidos da API');
        }
      } else {
        throw new Error(`Erro na resposta da API: ${response.status}`);
      }
    } catch (err: any) {
      console.error('Erro ao buscar dados:', err);
      if (err.response) {
        setError(`Erro do servidor: ${err.response.status}. Por favor, tente novamente.`);
      } else if (err.request) {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        setError(err.message || 'Ocorreu um erro inesperado. Por favor, tente novamente.');
      }
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
            <FileBarChart size={32} className="text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Renegociação de Títulos</h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Configuração da Renegociação</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de títulos por dia (1-100)
              </label>
              <input
                type="text"
                value={assignment}
                onChange={(e) => handleAssignmentChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: 10"
              />
            </div>
            <button
              onClick={onReportSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Calculator size={16} />
              )}
              {loading ? 'Processando...' : 'Gerar Renegociação'}
            </button>
          </div>
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </div>

        {apiResponse && (
          <>
            {/* Títulos Renegociados */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Títulos Renegociados</h3>
                <p className="text-sm text-gray-600">Total: {apiResponse.renegotiated_titles.length} títulos</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {apiResponse.renegotiated_titles.map((title, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-gray-100 last:border-b-0 p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{title.title}</p>
                        <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-gray-500">Vencimento Original</p>
                            <p className="font-medium">{new Date(title.original_due_date).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Data Renegociação</p>
                            <p className="font-medium">{new Date(title.renegotiation_date).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Novo Vencimento</p>
                            <p className="font-medium">{new Date(title.new_due_date).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                          R$ {parseValueSafely(title.value).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Fluxo de Caixa */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Fluxo de Caixa Resumido</h3>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                  {apiResponse.cash_flow_summary.map((flow, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-800">{flow.month_year}</span>
                      <span className="text-lg font-bold text-green-600">
                        R$ {parseValueSafely(flow.total_renegotiated).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notas */}
            {apiResponse.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Observações</h3>
                <p className="text-blue-700">{apiResponse.notes}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

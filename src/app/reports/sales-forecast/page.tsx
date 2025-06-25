'use client'

import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { apiForecast } from '@/lib/apiForecast';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Calendar, LineChart as ChartIcon, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ForecastData {
    ds: string;
    yhat: number;
    yhat_lower: number;
    yhat_upper: number;
}

export default function SalesForecastPage() {
    const { user } = useAuth();
    const router = useRouter();
    const username = user?.name || 'User';

    const [days, setDays] = useState('30');
    const [forecast, setForecast] = useState<ForecastData[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value === '' || (parseInt(value) > 0 && parseInt(value) <= 365)) {
            setDays(value);
        }
    };

    const fetchForecast = async () => {
        if (!days || parseInt(days) <= 0) {
            setError("Por favor, insira um número de dias válido.");
            return;
        }
        if (parseInt(days) > 365) {
            setError("A previsão não pode exceder 365 dias.");
            return;
        }
        setLoading(true);
        setError(null);
        setForecast(null);
        setCurrentPage(1);

        try {
            const response = await apiForecast.post(`/previsao/vendas?dias_previsao=${days}`);
            if (response.status !== 200) {
                throw new Error('Falha ao buscar a previsão de vendas. Tente novamente mais tarde.');
            }
            const data: ForecastData[] = response.data.map((item: any) => ({
                ...item,
                ds: new Date(item.ds).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            }));
            setForecast(data);
        } catch (e: any) {
            if (e.code === 'ERR_NETWORK') {
                setError('Erro de conexão. Verifique sua internet e tente novamente.');
            } else {
                setError(e.response?.data?.detail || e.message || 'Ocorreu um erro desconhecido.');
            }
        } finally {
            setLoading(false);
        }
    };

    const paginatedData = useMemo(() => {
        if (!forecast) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        return forecast.slice(startIndex, startIndex + itemsPerPage);
    }, [forecast, currentPage, itemsPerPage]);

    const totalPages = forecast ? Math.ceil(forecast.length / itemsPerPage) : 0;

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header username={username} />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => router.push('/reports')}
                        className="mr-4 p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div className="flex items-center">
                        <ChartIcon size={32} className="text-blue-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-800">Previsão de Vendas</h1>
                    </div>
                </div>

                {/* Input Section */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-full sm:w-auto flex-grow">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="number"
                                value={days}
                                onChange={handleDaysChange}
                                placeholder="Ex: 30"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            />
                        </div>
                        <button
                            onClick={fetchForecast}
                            disabled={loading || !days}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors font-semibold"
                        >
                            {loading ? (
                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                'Gerar Previsão'
                            )}
                        </button>
                    </div>
                </motion.div>

                {loading && (
                    <div className="text-center p-10">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
                        <p className="mt-4 text-gray-600">Calculando previsão... Isso pode levar um momento.</p>
                    </div>
                )}

                {error && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md mb-8 flex items-center">
                        <AlertCircle className="mr-3" size={24} />
                        <div>
                            <p className="font-bold">Erro na Previsão</p>
                            <p>{error}</p>
                        </div>
                    </motion.div>
                )}

                {forecast && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        {/* Chart */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gráfico de Previsão para {days} dias</h2>
                            <div style={{ width: '100%', height: 400 }}>
                                <ResponsiveContainer>
                                    <LineChart data={forecast} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="ds" />
                                        <YAxis tickFormatter={(value) => `R$${Number(value) / 1000}k`} />
                                        <Tooltip formatter={(value:number) => formatCurrency(value)} />
                                        <Legend />
                                        <Line type="monotone" dataKey="yhat" stroke="#3b82f6" strokeWidth={2} name="Vendas Previstas" dot={{ r: 4 }} activeDot={{ r: 8 }}/>
                                        <Line type="monotone" dataKey="yhat_lower" stroke="#a5b4fc" strokeDasharray="5 5" name="Margem Inferior" />
                                        <Line type="monotone" dataKey="yhat_upper" stroke="#a5b4fc" strokeDasharray="5 5" name="Margem Superior" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Dados da Previsão</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="p-4 font-semibold text-gray-600">Data</th>
                                            <th className="p-4 font-semibold text-gray-600 text-right">Previsão de Vendas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.map((item, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="p-4 flex items-center text-black">
                                                    <Calendar size={16} className="text-gray-500 mr-2" />
                                                    {item.ds}
                                                </td>
                                                <td className="p-4 text-right font-medium text-blue-600">
                                                    <div className="flex items-center justify-end">
                                                        <DollarSign size={16} className="text-green-500 mr-1" />
                                                        {formatCurrency(item.yhat)}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {totalPages > 1 && (
                                <div className="flex justify-between items-center mt-6">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-300 disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    <span className="text-gray-700">Página {currentPage} de {totalPages}</span>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-300 disabled:opacity-50"
                                    >
                                        Próximo
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}

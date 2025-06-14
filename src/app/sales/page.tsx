'use client'

import ErrorMessage from '@/components/ErrorMessage';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { SalesRepository } from '@/lib/salesRepository';
import { Sales } from '@/types/sales';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  DollarSign,
  Loader2,
  MapPin,
  Receipt,
  Search,
  ShoppingCart,
  Tag,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function SalesPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const username = user?.name || 'User';

  const [sales, setSales] = useState<Sales[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const salesRepository = new SalesRepository();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const loadSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const salesData = await salesRepository.getSales({ limite: 50 });
      setSales(Array.isArray(salesData) ? salesData : []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError('Falha ao carregar vendas. Tente novamente.');
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadSales();
    }
  }, [loadSales, isAuthenticated]);

  const filteredSales = Array.isArray(sales) ? sales.filter(
    (sale) =>
      sale.descricao_produto?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.nome_fantasia?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  if (!isAuthenticated) {
    return null;
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
            <DollarSign size={32} className="text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Vendas</h1>
          </div>
        </div>

        <p className="text-gray-500 mb-8 text-lg">
          Visualize e busque vendas realizadas
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-8"
        >
          <div className="flex items-center">
            <div className="flex-1 flex items-center">
              <Search size={20} className="text-gray-400 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 py-2 px-2 text-gray-700 placeholder-gray-400 focus:outline-none"
                placeholder="Buscar cliente ou produto"
              />
            </div>
            {searchQuery.length > 0 && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </motion.div>

        <div className="space-y-4">
          {error ? (
            <ErrorMessage message={error} onRetry={loadSales} />
          ) : loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-12"
            >
              <Loader2 size={40} className="animate-spin text-blue-600 mr-3" />
              <span className="text-lg text-gray-600">Carregando vendas...</span>
            </motion.div>
          ) : (searchQuery ? filteredSales : sales).length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="bg-gray-200 p-8 rounded-full mb-6">
                {searchQuery ? (
                  <Search size={48} className="text-gray-400" />
                ) : (
                  <Receipt size={48} className="text-gray-400" />
                )}
              </div>
              <h3 className="text-2xl font-medium text-gray-600 mb-2">
                {searchQuery
                  ? `Nenhuma venda encontrada para "${searchQuery}"`
                  : 'Nenhuma venda registrada'
                }
              </h3>
              {searchQuery && (
                <p className="text-gray-500">
                  Tente uma nova busca com termos diferentes
                </p>
              )}
            </motion.div>
          ) : (
            (searchQuery ? filteredSales : sales).map((sale, index) => (
              <motion.div
                key={`${sale.id_venda}-${sale.codigo_produto}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 mr-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {sale.descricao_produto}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {sale.nome_fantasia}
                    </p>
                  </div>
                  <div className="bg-blue-50 px-4 py-2 rounded-full">
                    <span className="text-blue-600 font-medium text-lg">
                      R$ {sale.total}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Tag size={16} className="mr-2" />
                    <span className="text-sm">ID Venda: {sale.id_venda}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Building2 size={16} className="mr-2" />
                    <span className="text-sm">{sale.razao_cliente}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-2" />
                    <span className="text-sm">{sale.cidade}, {sale.uf}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <ShoppingCart size={16} className="mr-2" />
                    <span className="text-sm">Qtde: {sale.qtde}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-600">
                    Valor Unit.: R$ {sale.valor_unitario}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(sale.data_emissao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

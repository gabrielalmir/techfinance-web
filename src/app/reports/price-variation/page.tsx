'use client'

import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PriceVariation {
  codigo_produto: string;
  descricao_produto: string;
  valor_minimo: number;
  valor_maximo: number;
  percentual_diferenca: number;
}

export default function PriceVariationReport() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const username = user?.name || 'User';
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<PriceVariation[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else {
      fetchPriceVariation();
    }
  }, [isAuthenticated, router]);

  const fetchPriceVariation = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/produtos/variacao-preco');
      const mapped: PriceVariation[] = data.map((item: any) => ({
        codigo_produto: item.codigo_produto,
        descricao_produto: item.descricao_produto,
        valor_minimo: parseFloat(item.valor_minimo),
        valor_maximo: parseFloat(item.valor_maximo),
        percentual_diferenca: parseFloat(item.percentual_diferenca),
      }));
      setProducts(mapped);
    } catch (err) {
      console.error('Erro ao buscar variação de preços:', err);
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
            <Activity size={32} className="text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Variação de Preços</h1>
          </div>
        </div>

        <p className="text-gray-600 mb-6">Top 10 produtos com maior variação de preços</p>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumo</h2>
          <p className="text-sm text-blue-600 font-medium">Total de Produtos</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{products.length}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {loading ? (
            <div className="p-6 flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            products.map((product, idx) => (
              <motion.div
                key={product.codigo_produto}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-gray-100 last:border-b-0 p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <p className="font-medium text-gray-800">{product.descricao_produto}</p>
                    <p className="text-sm text-gray-500 mb-2">Código: {product.codigo_produto}</p>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Mínimo</p>
                        <p className="text-sm font-semibold text-green-600">
                          R$ {product.valor_minimo.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Máximo</p>
                        <p className="text-sm font-semibold text-red-600">
                          R$ {product.valor_maximo.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      {product.percentual_diferenca.toFixed(1)}%
                    </p>
                    <p className="text-xs text-blue-500">Variação</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

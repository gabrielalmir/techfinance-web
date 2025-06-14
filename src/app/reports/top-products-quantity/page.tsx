'use client'

import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Interface para os dados de produtos
interface Product {
  codigo_produto: string;
  descricao_produto: string;
  quantidade_total: number;
  total: number;
  percentage: number;
}

export default function TopProductsQuantityReport() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const username = user?.name || 'User';
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else {
      fetchProducts();
    }
  }, [isAuthenticated, router]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/produtos/mais-vendidos');
      const data: Product[] = response.data.map((item: any) => ({
        codigo_produto: item.codigo_produto,
        descricao_produto: item.descricao_produto,
        quantidade_total: parseFloat(item.quantidade_total),
        total: parseFloat(item.total),
        percentage: (parseFloat(item.quantidade_total) / parseFloat(item.total)) * 100,
      }));
      setProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const totalQuantity = products.reduce((sum, item) => sum + item.quantidade_total, 0);
  const totalHistorico = products.length > 0 ? products[0].total : 0;

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
            <BarChart3 size={32} className="text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Top 10 Produtos em Qtde</h1>
          </div>
        </div>

        <button
          onClick={() => router.push('/reports/top-products-value')}
          className="mb-6 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <TrendingUp size={20} className="mr-2" />
          Ver por Valor
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumo de Vendas</h2>
          <div className="bg-blue-50 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-600 font-medium">Quantidade Total Top 10</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalQuantity.toLocaleString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Quantidade Total Histórico</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalHistorico.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {loading ? (
            <div className="p-6 flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            products.map((item, index) => (
              <motion.div
                key={item.codigo_produto}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-100 last:border-b-0 p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <div className="flex-1 pr-4">
                  <p className="font-medium text-gray-800">{item.descricao_produto}</p>
                  <p className="text-sm text-gray-500">Código: {item.codigo_produto}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-600">{item.quantidade_total.toLocaleString('pt-BR')}</p>
                  <p className="text-sm text-blue-500">{item.percentage.toFixed(1)}%</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

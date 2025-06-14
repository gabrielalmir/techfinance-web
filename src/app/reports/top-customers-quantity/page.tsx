'use client'

import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Customer {
  nome_fantasia: string;
  qtde: number;
  percentual: number;
}

export default function TopCustomersQuantity() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const username = user?.name || 'User';
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else {
      fetchCustomers();
    }
  }, [isAuthenticated, router]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/empresas/participacao');
      const mapped: Customer[] = data.map((c: any) => ({
        nome_fantasia: c.nome_fantasia,
        qtde: parseFloat(c.qtde ?? c.quantidade_total ?? 0),
        percentual: parseFloat(c.percentual),
      }));
      setCustomers(mapped);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalQty = customers.reduce((s, c) => s + c.qtde, 0);

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
            <Users size={32} className="text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Top 10 Clientes em Qtde</h1>
          </div>
        </div>

        <button
          onClick={() => router.push('/reports/top-customers-value')}
          className="mb-6 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <TrendingUp size={20} className="mr-2" />
          Ver por Valor
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumo</h2>
          <p className="text-sm text-blue-600 font-medium">Quantidade Total Top 10</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalQty.toLocaleString('pt-BR')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {loading ? (
            <div className="p-6 flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            customers.map((c, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-gray-100 last:border-b-0 p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <div className="flex-1 pr-4">
                  <p className="font-medium text-gray-800">{c.nome_fantasia}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-600">{c.qtde.toLocaleString('pt-BR')}</p>
                  <p className="text-sm text-blue-500">{c.percentual.toFixed(1)}%</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

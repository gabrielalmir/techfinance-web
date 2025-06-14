'use client'

import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Brain,
  FileBarChart,
  PieChart,
  TrendingUp,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ReportItem {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onPress: () => void;
  description: string;
}

export default function ReportsPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const username = user?.name || 'User';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleNavigation = (route: string) => {
    // Para agora, mostrar uma mensagem que o relatório específico está em desenvolvimento
    alert(`Relatório "${route}" em desenvolvimento. Em breve estará disponível!`);
  };

  const reports: ReportItem[] = [
    {
      title: 'Top 10 Produtos em $',
      icon: TrendingUp,
      onPress: () => router.push('/reports/top-products-value'),
      description: 'Produtos mais vendidos por valor monetário'
    },
    {
      title: 'Top 10 Produtos em Qtde.',
      icon: BarChart3,
      onPress: () => router.push('/reports/top-products-quantity'),
      description: 'Produtos mais vendidos por quantidade'
    },
    {
      title: 'Top 10 Clientes em $',
      icon: Users,
      onPress: () => router.push('/reports/top-customers-value'),
      description: 'Clientes com maior valor de compras'
    },
    {
      title: 'Top 10 Clientes em Qtde.',
      icon: PieChart,
      onPress: () => router.push('/reports/top-customers-quantity'),
      description: 'Clientes com maior quantidade de compras'
    },
    {
      title: 'Variação preços min-max',
      icon: Activity,
      onPress: () => router.push('/reports/price-variation'),
      description: 'Análise de variação de preços dos produtos'
    },
    {
      title: 'Renegociação de Títulos',
      icon: FileBarChart,
      onPress: () => router.push('/reports/title-renegotiation'),
      description: 'Relatório de renegociação de títulos'
    },
    {
      title: 'Análises IA',
      icon: Brain,
      onPress: () => router.push('/reports/ai-analysis'),
      description: 'Insights e análises gerados por inteligência artificial'
    },
  ];

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
            <BarChart3 size={32} className="text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Relatórios, Insights & IA</h1>
          </div>
        </div>

        <p className="text-gray-500 mb-8 text-lg">
          Escolha um relatório para visualizar
        </p>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reports.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <button
                  onClick={item.onPress}
                  className="w-full bg-blue-500 hover:bg-blue-600 rounded-2xl p-6 text-white transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-105 text-left"
                >
                  <div className="aspect-square flex flex-col justify-between min-h-[140px]">
                    <div className="flex-1 flex justify-center items-center">
                      <IconComponent
                        size={40}
                        className="group-hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-center leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-blue-100 text-sm text-center leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Development Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6"
        >
          <div className="flex items-center mb-4">
            <Brain size={24} className="text-blue-600 mr-3" />
            <h3 className="text-xl font-bold text-blue-800">Módulo de Relatórios Avançados</h3>
          </div>
          <p className="text-blue-700 mb-4">
            Estamos desenvolvendo relatórios interativos e dashboards avançados com visualizações em tempo real.
            Os relatórios incluirão:
          </p>
          <ul className="list-disc list-inside text-blue-700 space-y-1 ml-4">
            <li>Gráficos interativos com drill-down</li>
            <li>Filtros avançados por período, região e categoria</li>
            <li>Exportação para Excel e PDF</li>
            <li>Análises preditivas com IA</li>
            <li>Comparativos históricos</li>
          </ul>
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mt-6">
            <p className="text-yellow-800 font-medium text-center">
              🚧 Em desenvolvimento - Todos os relatórios estarão disponíveis em breve
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

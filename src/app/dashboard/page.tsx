'use client'

import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import {
    BarChart3,
    DollarSign,
    FileText,
    MessageCircle,
    ShoppingBag,
    Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface MenuItem {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  route?: string;
  description: string;
}

interface GridItemProps extends MenuItem {
  onPress?: () => void;
  index: number;
}

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const username = user?.name || 'User';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const menuItems: MenuItem[] = [
    {
      title: 'Produtos',
      icon: ShoppingBag,
      route: '/products',
      description: 'Gerencie seu inventário'
    },
    {
      title: 'Vendas',
      icon: DollarSign,
      route: '/sales',
      description: 'Acompanhe suas vendas'
    },
    {
      title: 'Clientes',
      icon: Users,
      route: '/customers',
      description: 'Gerencie seus clientes'
    },
    {
      title: 'Títulos',
      icon: FileText,
      route: '/titles',
      description: 'Controle financeiro'
    },
    {
      title: 'Relatórios & Insights',
      icon: BarChart3,
      route: '/reports',
      description: 'Análise de dados'
    },
    {
      title: 'Dinho Bot',
      icon: MessageCircle,
      route: '/chat',
      description: 'Assistente virtual'
    },
  ];

  const GridItem = ({ title, icon: Icon, description, onPress, index }: GridItemProps) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full sm:w-1/2 lg:w-1/3 p-3"
    >
      <motion.button
        onClick={onPress}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-blue-500 hover:bg-blue-600 rounded-2xl p-6 text-white transition-all duration-200 shadow-lg hover:shadow-xl group"
      >
        <div className="aspect-square flex flex-col justify-between min-h-[140px]">
          <div className="flex-1 flex justify-center items-center">
            <Icon size={40} className="group-hover:scale-110 transition-transform duration-200" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-center leading-tight">
              {title}
            </h3>
            <p className="text-blue-100 text-sm text-center leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header username={username} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Bem-vindo, {username}
          </h1>
          <p className="text-xl text-gray-500">
            O que você gostaria de fazer hoje?
          </p>
        </motion.div>

        <div className="flex flex-wrap -mx-3 justify-center lg:justify-start">
          {menuItems.map((item, index) => (
            <GridItem
              key={index}
              index={index}
              title={item.title}
              icon={item.icon}
              description={item.description}
              route={item.route}
              onPress={item.route ? () => router.push(item.route!) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

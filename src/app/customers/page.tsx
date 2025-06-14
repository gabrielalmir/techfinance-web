'use client'

import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { CustomerRepository } from '@/lib/customerRepository';
import { Customer } from '@/types/customer';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Building2,
    ChevronRight,
    Loader2,
    MapPin,
    Search,
    UserCheck,
    Users,
    UserSearch,
    X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function CustomersPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const username = user?.name || 'User';

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const customerRepository = new CustomerRepository();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const searchCustomers = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      let searchParams: { nome?: string; id_cliente?: string; limite?: number } = { limite: 10 };
      if (!query) {
        searchParams = { limite: 10 };
      } else if (/^\d+$/.test(query.trim())) {
        searchParams.id_cliente = query.trim();
      } else {
        searchParams.nome = query.trim();
      }
      const results = await customerRepository.search(searchParams);
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setError('Falha ao carregar clientes. Tente novamente.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      searchCustomers('');
    }
  }, [searchCustomers, isAuthenticated]);

  const handleSearch = useCallback(() => {
    searchCustomers(searchQuery);
  }, [searchQuery, searchCustomers]);

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedCustomer(null);
    setModalVisible(false);
  };

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
            <Users size={32} className="text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Buscar Clientes</h1>
          </div>
        </div>

        <p className="text-gray-500 mb-8 text-lg">
          Digite o nome ou código do cliente para começar
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
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 py-2 px-2 text-gray-700 placeholder-gray-400 focus:outline-none"
                placeholder="Digite o nome ou código do cliente"
              />
            </div>
            {searchQuery.length > 0 && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-2"
              >
                <X size={20} />
              </button>
            )}
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 rounded-2xl p-3 text-white transition-colors"
            >
              <Search size={20} />
            </button>
          </div>
        </motion.div>

        <div className="space-y-4">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-12"
            >
              <Loader2 size={40} className="animate-spin text-blue-600 mr-3" />
              <span className="text-lg text-gray-600">Buscando clientes...</span>
            </motion.div>
          ) : searchResults.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="bg-gray-200 p-8 rounded-full mb-6">
                {searchQuery.length > 0 ? (
                  <UserSearch size={48} className="text-gray-400" />
                ) : (
                  <Users size={48} className="text-gray-400" />
                )}
              </div>
              <h3 className="text-2xl font-medium text-gray-600 mb-2">
                {searchQuery.length > 0
                  ? `Nenhum cliente encontrado para "${searchQuery}"`
                  : 'Digite algo para começar a busca'
                }
              </h3>
              {searchQuery.length > 0 && (
                <p className="text-gray-500">
                  Tente uma nova busca com termos diferentes
                </p>
              )}
            </motion.div>
          ) : (
            Array.isArray(searchResults) && searchResults.map((customer, index) => (
              <motion.div
                key={customer.id_cliente}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {customer.razao_cliente}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center text-gray-600">
                        <UserCheck size={16} className="mr-2" />
                        <span className="text-sm">Código: {customer.id_cliente}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Building2 size={16} className="mr-2" />
                        <span className="text-sm">Grupo: {customer.descricao_grupo}</span>
                      </div>
                      <div className="flex items-center text-gray-600 md:col-span-2">
                        <MapPin size={16} className="mr-2" />
                        <span className="text-sm">{customer.cidade}, {customer.uf}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCustomerClick(customer)}
                    className="bg-blue-100 hover:bg-blue-200 p-3 rounded-full transition-colors"
                  >
                    <ChevronRight size={20} className="text-blue-600" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Modal */}
        {isModalVisible && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {selectedCustomer.razao_cliente}
                </h2>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-center bg-gray-100 px-4 py-3 rounded-full">
                    <UserCheck size={20} className="text-gray-600 mr-3" />
                    <span className="font-medium text-gray-700">
                      Código: {selectedCustomer.id_cliente}
                    </span>
                  </div>
                  <div className="flex items-center justify-center bg-blue-100 px-4 py-3 rounded-full">
                    <Building2 size={20} className="text-blue-700 mr-3" />
                    <span className="font-medium text-blue-700">
                      Grupo: {selectedCustomer.descricao_grupo}
                    </span>
                  </div>
                  <div className="flex items-center justify-center bg-green-100 px-4 py-3 rounded-full">
                    <MapPin size={20} className="text-green-700 mr-3" />
                    <span className="font-medium text-green-700">
                      {selectedCustomer.cidade}, {selectedCustomer.uf}
                    </span>
                  </div>
                  {selectedCustomer.nome_fantasia && (
                    <div className="flex items-center justify-center bg-purple-100 px-4 py-3 rounded-full">
                      <Building2 size={20} className="text-purple-700 mr-3" />
                      <span className="font-medium text-purple-700">
                        {selectedCustomer.nome_fantasia}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

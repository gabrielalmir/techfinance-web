'use client'

import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { ProductRepository } from '@/lib/productRepository';
import { Product } from '@/types/product';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Loader2,
  QrCode,
  Search,
  SearchX,
  Tag,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function ProductsPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const username = user?.name || 'User';

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const productRepository = new ProductRepository();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const searchProducts = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      let searchParams: { nome?: string; codigo?: string; limite?: number } = { limite: 10 };

      if (!query) {
        searchParams = { limite: 10 };
      } else if (/^\d+$/.test(query.trim())) {
        searchParams.codigo = query.trim();
      } else {
        searchParams.nome = query.trim();
      }

      const results = await productRepository.search(searchParams);
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setError('Falha ao carregar produtos. Tente novamente.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    searchProducts(searchQuery);
  }, [searchQuery, searchProducts]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalVisible(false);
  };

  useEffect(() => {
    searchProducts('');
  }, [searchProducts]);

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
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Buscar Produtos
          </h1>
          <p className="text-xl text-gray-500">
            Digite o nome ou código do produto para começar
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-4">
            <div className="flex items-center">
              <div className="flex-1 flex items-center">
                <div className="p-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 py-4 px-4 text-lg text-gray-800 placeholder-gray-500 focus:outline-none"
                  placeholder="Digite o nome ou código do produto"
                />
              </div>

              <div className="flex items-center space-x-3">
                {searchQuery.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSearchQuery('')}
                    className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} className="text-gray-400" />
                  </motion.button>
                )}
                <motion.button
                  onClick={handleSearch}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 rounded-2xl p-4 text-white shadow-md transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <Search size={24} />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(!Array.isArray(searchResults) || searchResults.length === 0) && !loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-20"
            >
              <div className="bg-gray-200 p-8 rounded-full mb-6">
                <SearchX size={48} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-medium text-gray-600 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-500">
                Tente uma nova busca com termos diferentes
              </p>
            </motion.div>
          ) : (
            Array.isArray(searchResults) && searchResults.map((product, index) => (
              <motion.div
                key={product.codigo || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100"
              >
                <button
                  onClick={() => handleProductClick(product)}
                  className="w-full text-left focus:outline-none group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 mr-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                        {product.descricao_produto}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-full">
                          <QrCode size={16} className="text-gray-600 mr-2" />
                          <span className="text-sm font-medium text-gray-600">
                            {product.codigo}
                          </span>
                        </div>
                        <div className="flex items-center bg-blue-100 px-3 py-2 rounded-full">
                          <Tag size={16} className="text-blue-700 mr-2" />
                          <span className="text-sm font-medium text-blue-700">
                            {product.descricao_grupo}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                      <ChevronRight size={20} className="text-blue-600" />
                    </div>
                  </div>
                </button>
              </motion.div>
            ))
          )}
        </div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <Loader2 size={40} className="animate-spin text-blue-600 mr-3" />
            <span className="text-lg text-gray-600">Buscando produtos...</span>
          </motion.div>
        )}
      </div>

      {/* Product Modal */}
      {isModalVisible && selectedProduct && (
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedProduct.descricao_produto}
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center bg-gray-100 px-4 py-3 rounded-full">
                  <QrCode size={20} className="text-gray-600 mr-3" />
                  <span className="font-medium text-gray-700">
                    Código: {selectedProduct.codigo}
                  </span>
                </div>
                <div className="flex items-center justify-center bg-blue-100 px-4 py-3 rounded-full">
                  <Tag size={20} className="text-blue-700 mr-3" />
                  <span className="font-medium text-blue-700">
                    Grupo: {selectedProduct.descricao_grupo}
                  </span>
                </div>
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
  );
}

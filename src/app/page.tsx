'use client'

import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Credenciais inválidas. Tente admin/admin.');
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setUsername('admin');
    setPassword('admin');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
            <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md mx-4 bg-white rounded-t-3xl shadow-2xl relative z-20 mt-32 p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-gray-800 mb-2">
            Bem-vindo
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-b border-gray-300 py-3 px-4 text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Digite seu usuário"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-300 py-3 px-4 text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Digite sua senha"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Forgot Password */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              Esqueceu a senha?
            </button>
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

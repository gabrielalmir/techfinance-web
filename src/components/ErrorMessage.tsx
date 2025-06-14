import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorMessage({ message, onRetry, className = '' }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <div className="bg-red-100 p-6 rounded-full mb-6">
        <AlertCircle size={48} className="text-red-500" />
      </div>
      <h3 className="text-2xl font-medium text-gray-800 mb-2">
        Erro ao carregar dados
      </h3>
      <p className="text-red-600 text-center mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors inline-flex items-center"
        >
          <RefreshCw size={20} className="mr-2" />
          Tentar Novamente
        </button>
      )}
    </motion.div>
  );
}

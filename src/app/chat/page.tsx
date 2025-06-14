'use client'

import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Bot,
    Loader2,
    Send,
    User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const username = user?.name || 'User';

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Send initial message
  useEffect(() => {
    if (isAuthenticated && messages.length === 0) {
      const initialMessage: Message = {
        id: '1',
        content: 'Olá! Eu sou o Dinho Bot, seu assistente virtual para o TechFinance. Como posso ajudar você hoje?',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    }
  }, [isAuthenticated, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = useCallback(async (userMessage: string): Promise<string> => {
    // Simulate AI response with delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple response logic based on keywords
    const message = userMessage.toLowerCase();

    if (message.includes('vendas') || message.includes('venda')) {
      return 'Posso ajudar você com informações sobre vendas! No módulo de vendas você pode visualizar todas as transações, buscar por cliente ou produto, e acompanhar o desempenho das vendas. Gostaria de saber algo específico sobre vendas?';
    }

    if (message.includes('cliente') || message.includes('clientes')) {
      return 'No módulo de clientes você pode buscar informações detalhadas sobre cada cliente, incluindo dados de contato, histórico de compras e grupo de classificação. Posso ajudar você a encontrar informações específicas sobre algum cliente?';
    }

    if (message.includes('produto') || message.includes('produtos')) {
      return 'O módulo de produtos permite buscar por código ou descrição, visualizar detalhes dos produtos e gerenciar o inventário. Você pode encontrar todos os copos de requeijão disponíveis e suas especificações. Precisa de ajuda com algum produto específico?';
    }

    if (message.includes('título') || message.includes('títulos') || message.includes('financeiro')) {
      return 'No módulo de títulos você pode acompanhar todos os pagamentos, desde vencimentos de hoje até atrasos superiores a 60 dias. Posso gerar insights sobre sua situação financeira atual. Gostaria de uma análise dos seus títulos?';
    }

    if (message.includes('relatório') || message.includes('relatórios') || message.includes('análise')) {
      return 'Os relatórios oferecem insights valiosos sobre seu negócio, incluindo top produtos, análise de clientes, variação de preços e muito mais. Posso ajudar você a interpretar os dados ou sugerir relatórios específicos. Que tipo de análise você precisa?';
    }

    if (message.includes('ajuda') || message.includes('help')) {
      return 'Estou aqui para ajudar! Posso fornecer informações sobre:\n\n📊 **Vendas** - Consultar transações e desempenho\n👥 **Clientes** - Buscar dados e histórico\n📦 **Produtos** - Verificar inventário e detalhes\n💰 **Títulos** - Acompanhar pagamentos e atrasos\n📈 **Relatórios** - Análises e insights\n\nSobre o que você gostaria de saber mais?';
    }

    if (message.includes('obrigado') || message.includes('obrigada') || message.includes('valeu')) {
      return 'De nada! Fico feliz em ajudar. Se precisar de mais alguma coisa sobre o TechFinance, estarei sempre aqui. 😊';
    }

    // Default response
    return 'Entendi sua pergunta! Sou especializado em ajudar com o sistema TechFinance. Posso fornecer informações sobre vendas, clientes, produtos, títulos e relatórios. Poderia ser mais específico sobre o que você precisa? Assim posso ajudar melhor!';
  }, []);

  const onSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await generateResponse(inputText.trim());

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente em alguns instantes.',
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 relative">
        <div className="absolute left-4 top-6 z-10">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
        </div>

        <div className="px-4 py-6 flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl font-bold text-blue-600">TF</span>
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">Dinho Bot</h1>
            <p className="text-gray-400">Seu assistente financeiro</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] p-4 rounded-2xl
                  ${message.role === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white'
                  }
                `}
              >
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <Bot size={20} className="mt-1 flex-shrink-0" />
                  )}
                  {message.role === 'user' && (
                    <User size={20} className="mt-1 flex-shrink-0 order-2" />
                  )}
                  <div className={message.role === 'user' ? 'order-1' : ''}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-blue-600 text-white p-4 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Bot size={20} />
                  <Loader2 size={20} className="animate-spin" />
                  <span>Dinho está pensando...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="w-full p-4 bg-gray-800 text-white border border-gray-600 rounded-2xl focus:outline-none focus:border-blue-500 resize-none"
                rows={1}
                style={{ minHeight: '56px', maxHeight: '120px' }}
              />
            </div>

            <button
              onClick={onSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed p-4 rounded-2xl transition-colors"
            >
              <Send size={20} className="text-white" />
            </button>
          </div>

          <div className="flex justify-center mt-4">
            <p className="text-gray-500 text-sm">
              Dinho Bot pode ajudar com vendas, clientes, produtos, títulos e relatórios
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

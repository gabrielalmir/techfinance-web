'use client'

import { useAuth } from '@/hooks/useAuth';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  username?: string;
}

export default function Header({ username }: HeaderProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-blue-600 text-white px-4 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <User size={20} />
          </div>
          <span className="font-semibold text-lg">
            {username || 'User'}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}

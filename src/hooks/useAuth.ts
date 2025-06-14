import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
    isAuthenticated: boolean;
    user: {
        username: string;
        name: string;
    } | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            login: async (username: string, password: string) => {
                // Simple authentication logic - in production, this would be a real API call
                if (username === 'admin' && password === 'admin') {
                    set({
                        isAuthenticated: true,
                        user: {
                            username,
                            name: 'Admin'
                        }
                    });
                    return true;
                }
                return false;
            },
            logout: async () => {
                set({
                    isAuthenticated: false,
                    user: null
                });
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

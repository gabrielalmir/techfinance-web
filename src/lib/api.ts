import axios from 'axios';

// Base URL da API real
const API_BASE_URL = 'https://techfinance-api.fly.dev';

// Criar instância do axios com configurações padrão
export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        Authorization: 'Bearer ronaldo',
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token de autenticação se necessário
api.interceptors.request.use(
    (config) => {
        // Aqui você pode adicionar token de autenticação se necessário
        // const token = localStorage.getItem('authToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error);

        // Tratar diferentes tipos de erro
        if (error.response?.status === 401) {
            // Token expirado ou não autorizado
            console.error('Unauthorized access');
        } else if (error.response?.status === 404) {
            console.error('Resource not found');
        } else if (error.response?.status >= 500) {
            console.error('Server error');
        }

        return Promise.reject(error);
    }
);

export default api;

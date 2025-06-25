import axios from 'axios';

const API_BASE_URL = 'https://techfinance-previsao.fly.dev';

export const apiForecast = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // Aumentado para 30s pois a previsão pode demorar
    headers: {
        Authorization: 'Bearer ronaldo',
        'Content-Type': 'application/json',
    },
});

apiForecast.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Forecast Error:', error);
        return Promise.reject(error);
    }
);

import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: `${API}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (err) => Promise.reject(err)
);

export default api;
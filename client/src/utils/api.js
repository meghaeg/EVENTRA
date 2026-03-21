import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5050/api',
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

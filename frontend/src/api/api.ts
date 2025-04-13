import axios from 'axios';
import {triggerOpenAuthModal} from "../utils";
export const api = axios.create({baseURL:""})

api.interceptors.request.use(config => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            triggerOpenAuthModal("login");
        }

        return Promise.reject(error);
    }
);
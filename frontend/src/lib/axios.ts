import axios from "axios";
import { getToken } from "./auth";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = getToken();

        console.log("BASE URL:", process.env.NEXT_PUBLIC_API_URL);
        console.log("TOKEN IN AXIOS:", token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);
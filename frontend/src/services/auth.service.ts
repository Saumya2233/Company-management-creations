import { api } from "@/lib/axios";

export const sendOtp = async (payload: {
    country_code: string;
    phone_number: string;
}) => {
    const response = await api.post("/auth/send-otp", payload);
    return response.data;
};

export const verifyOtp = async (payload: {
    country_code: string;
    phone_number: string;
    otp: string;
}) => {
    const response = await api.post("/auth/verify-otp", payload);
    return response.data;
};

export const logoutUser = async () => {
    const response = await api.post("/auth/logout");
    return response.data;
};
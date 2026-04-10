import { api } from "@/lib/axios";

export const getCompanies = async () => {
    const response = await api.get("/companies");
    return response.data;
};

export const createCompany = async (payload: { name: string }) => {
    const response = await api.post("/companies", payload);
    return response.data;
};
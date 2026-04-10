import * as yup from "yup";

export const companySchema = yup.object({
    name: yup
        .string()
        .trim()
        .required("Company name is required"),
});
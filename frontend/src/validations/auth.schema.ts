import * as yup from "yup";

export const phoneSchema = yup.object({
    phone: yup
        .string()
        .required("Phone number is required")
        .test("valid-phone", "Enter valid phone number", (value) => {
            if (!value) return false;
            const digits = value.replace(/\D/g, "");
            return digits.length >= 8 && digits.length <= 15;
        }),
});

export const otpSchema = yup.object({
    otp: yup
        .string()
        .required("OTP is required")
        .matches(/^\d{6}$/, "OTP must be 6 digits"),
});
import * as yup from "yup";

export const phoneSchema = yup.object({
    phone: yup
        .string()
        .required("Phone number is required")
        .test("valid-indian-phone", "Enter valid 10 digit phone number", (value) => {
            if (!value) return false;

            const digits = value.replace(/\D/g, "");

            // must be exactly 12 digits (91 + 10)
            if (digits.length !== 12) return false;

            if (!digits.startsWith("91")) return false;

            return true;
        }),
});

export const otpSchema = yup.object({
    otp: yup
        .string()
        .required("OTP is required")
        .matches(/^\d{6}$/, "OTP must be 6 digits"),
});
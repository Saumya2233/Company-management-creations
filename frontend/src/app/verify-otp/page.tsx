"use client";


import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { verifyOtp } from "@/services/auth.service";
import { setToken } from "@/lib/auth";
import { otpSchema } from "@/validations/auth.schema";
import { useState } from "react";

type OtpFormValues = {
  otp: string;
};

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: yupResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

const verifyOtpMutation = useMutation({
  mutationFn: verifyOtp,
  onSuccess: (response) => {
    const token = response?.data?.token;

    if (!token) {
      setErrorMessage("Something went wrong. Please try again.");
      return;
    }

    setErrorMessage(""); // clear error
    setToken(token);
    router.push("/company");
  },
  onError: (error: any) => {
    console.log("Verify OTP error:", error);

    const message =
      error?.response?.data?.message || "Invalid OTP. Please try again.";

    setErrorMessage(message);
  },
});

const onSubmit = (data: OtpFormValues) => {
  setErrorMessage(""); // clear previous error

  if (!phone) {
    setErrorMessage("Phone number missing");
    return;
  }

  verifyOtpMutation.mutate({
    country_code: "+91",
    phone_number: phone,
    otp: data.otp,
  });
};

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-sm">
        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-slate-900">
              Verify OTP
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter the 6-digit code sent to {phone || "your phone number"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <input
                {...register("otp")}
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />
              {errors.otp && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.otp.message}
                </p>
              )}
            </div>

            <Button
              className="w-full"
              type="submit"
              disabled={verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Login"}
            </Button>
            {errorMessage && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}
            <p className="text-center text-sm text-slate-500">
              Use OTP: 123456
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

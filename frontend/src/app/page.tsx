"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sendOtp } from "@/services/auth.service";
import { phoneSchema } from "@/validations/auth.schema";

type LoginFormValues = {
  phone: string;
};

export default function Home() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: (_, variables) => {
      router.push(
        `/verify-otp?phone=${encodeURIComponent(variables.phone_number)}`
      );
    },
    onError: (error) => {
      console.log("Send OTP error:", error);
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    const digits = (data.phone || "").replace(/\D/g, "");
    const phoneNumber = digits.slice(2);

    sendOtpMutation.mutate({
      country_code: "+91",
      phone_number: phoneNumber,
    });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="grid w-full overflow-hidden rounded-3xl border bg-white shadow-xl md:grid-cols-2">
          <div className="hidden bg-slate-900 p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-white/20 px-3 py-1 text-xs tracking-wide text-white/80">
                Company Portal
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-tight">
                Manage companies with a simple and secure flow
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
                Login with your phone number, verify OTP, and access your
                company dashboard in a clean and simple interface.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-semibold">Fast</p>
                <p className="mt-1 text-sm text-white/70">Quick OTP access</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-semibold">Secure</p>
                <p className="mt-1 text-sm text-white/70">Protected login</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-10">
            <Card className="w-full max-w-md border-0 p-8 shadow-none">
              <CardContent className="p-0">
                <div className="mb-8">
                  <p className="text-sm font-medium text-slate-500">
                    Welcome back
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                    Sign in to continue
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Enter your phone number to receive a one-time password.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <div className="rounded-xl border border-slate-300 bg-white px-3 py-2 focus-within:border-slate-500">
                          <PhoneInput
                            international
                            defaultCountry="IN"
                            countryCallingCodeEditable={false}
                            maxLength={15}
                            placeholder="Enter phone number"
                            value={field.value}
                            
                            onChange={(value) => {
                              const inputValue = value || "";
                              let digits = inputValue.replace(/\D/g, "");

                              // Force India code
                              if (!digits.startsWith("91")) {
                                digits = "91" + digits.replace(/^91/, "");
                              }

                              // limit 91 + 10 digits
                              digits = digits.slice(0, 12);

                              field.onChange(digits ? `+${digits}` : "");
                            }}
                            className="phone-input"
                          />
                        </div>
                      )}
                    />

                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <Button
                    className="h-11 w-full"
                    type="submit"
                    disabled={sendOtpMutation.isPending}
                  >
                    {sendOtpMutation.isPending ? "Sending..." : "Send OTP"}
                  </Button>
                </form>

                <p className="mt-6 text-center text-xs leading-5 text-slate-500">
                  By continuing, you agree to access the company management
                  platform securely.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
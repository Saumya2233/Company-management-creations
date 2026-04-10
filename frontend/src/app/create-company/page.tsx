"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createCompany } from "@/services/company.service";
import { getToken, removeToken } from "@/lib/auth";
import { companySchema } from "@/validations/company.schema";

type CompanyFormValues = {
  name: string;
};

export default function CreateCompanyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/");
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: yupResolver(companySchema),
    defaultValues: {
      name: "",
    },
  });

  const createCompanyMutation = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      router.push("/company");
    },
    onError: (error: any) => {
      console.log("Create company error:", error);

      if (error?.response?.status === 401) {
        removeToken();
        router.push("/");
      }
    },
  });

  const onSubmit = (values: CompanyFormValues) => {
    createCompanyMutation.mutate({
      name: values.name,
    });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <Card className="w-full max-w-lg rounded-2xl shadow-sm">
          <CardContent className="p-8">
            <div className="mb-8">
              <p className="text-sm font-medium text-slate-500">
                Company Management
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Create Company
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Add a new company to your portal.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Enter company name"
                  maxLength={50}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

             <div className="flex gap-4">
  <Button
    type="button"
    variant="outline"
    className="flex-1"
    onClick={() => router.push("/company")}
  >
    Cancel
  </Button>

  <Button
    type="submit"
    className="flex-1"
    disabled={createCompanyMutation.isPending}
  >
    {createCompanyMutation.isPending
      ? "Creating..."
      : "Create Company"}
  </Button>
</div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

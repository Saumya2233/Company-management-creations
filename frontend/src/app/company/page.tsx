"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCompanies } from "@/services/company.service";
import { logoutUser } from "@/services/auth.service";
import { getToken, removeToken } from "@/lib/auth";

type Company = {
  id: string;
  name: string;
  created_by?: string;
  created_at?: string;
};

export default function CompaniesPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/");
    }
  }, [router]);

  const { data, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
    retry: false,
    throwOnError: false,
  });

const logoutMutation = useMutation({
  mutationFn: logoutUser,
  onSuccess: () => {
    removeToken();
    router.replace("/"); 
  },
});

  const companies: Company[] = data?.data || [];

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold text-slate-900">
            Company Portal
          </h1>

          <div className="flex gap-3">
            <Button onClick={() => router.push("/create-company")}>
              Create Company
            </Button>

            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-slate-900">Companies</h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage your companies here.
          </p>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <p className="p-6 text-center text-sm text-slate-500">
                Loading...
              </p>
            ) : companies.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-500">
                No companies found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-sm font-medium text-slate-600">
                        Company Name
                      </th>
                      <th className="px-6 py-4 text-sm font-medium text-slate-600">
                        Created By
                      </th>
                      <th className="px-6 py-4 text-sm font-medium text-slate-600">
                        Created At
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {companies.map((company) => (
                      <tr key={company.id} className="border-b last:border-0">
                        <td className="px-6 py-4 text-sm text-slate-900 max-w-[10] truncate">
                          {company.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {company.created_by ?? "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {company.created_at ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

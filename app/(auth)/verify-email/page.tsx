"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/i18n-client";
export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setError(t.auth.verifyEmail.noToken);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: "GET",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || t.auth.verifyEmail.failed);
        }

        setStatus("success");
        // Wait 3 seconds before redirecting to login
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (error) {
        setStatus("error");
        setError(error instanceof Error ? error.message : t.auth.verifyEmail.failed);
      }
    };

    verifyEmail();
  }, [searchParams, router, t.auth.verifyEmail.failed, t.auth.verifyEmail.noToken]);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{t.auth.verifyEmail.title}</CardTitle>
          <CardDescription>
            {status === "loading" && t.auth.verifyEmail.verifying}
            {status === "success" && t.auth.verifyEmail.success}
            {status === "error" && t.auth.verifyEmail.failed}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === "loading" && <Loader2 className="h-8 w-8 animate-spin text-primary" />}

          {status === "success" && (
            <div className="text-center space-y-4">
              <p className="text-green-600">{t.auth.verifyEmail.success}</p>
              <p className="text-sm text-muted-foreground">{t.auth.verifyEmail.redirecting}</p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-4">
              <p className="text-red-600">{error}</p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/login">{t.auth.verifyEmail.goToLogin}</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/register">{t.auth.verifyEmail.createAccount}</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

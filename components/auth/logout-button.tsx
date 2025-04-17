"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IconLogout } from "@tabler/icons-react";
import { useTranslation } from "@/lib/i18n/i18n-client";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(t.auth.logout.error);
      }

      toast.success(t.auth.logout.success);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(t.auth.logout.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="ghost" onClick={handleLogout} disabled={isLoading} className="flex items-center gap-2">
      <IconLogout />
      {isLoading ? t.auth.logout.loading : t.auth.logout.button}
    </Button>
  );
}

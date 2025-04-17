import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/auth";
import { getApiTranslation } from "@/lib/i18n/api-i18n";
import { siteConfig } from "@/config/site";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || siteConfig.defaultLocale;
    const t = getApiTranslation(locale || undefined);

    const response = NextResponse.json({ message: t.auth.logout.success }, { status: 200 });

    // Clear the auth cookie
    await removeAuthCookie();

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    const t = getApiTranslation();
    return NextResponse.json({ error: t.auth.logout.error }, { status: 500 });
  }
}

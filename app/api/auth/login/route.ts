import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateToken } from "@/lib/auth";
import { getApiTranslation } from "@/lib/i18n/api-i18n";
import { siteConfig } from "@/config/site";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || siteConfig.defaultLocale;
    const t = getApiTranslation(locale || undefined);

    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: t.auth.login.invalidCredentials }, { status: 400 });
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json({ error: t.auth.login.emailNotVerified }, { status: 400 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password || "");

    if (!isValidPassword) {
      return NextResponse.json({ error: t.auth.login.invalidCredentials }, { status: 400 });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate JWT token
    const token = generateToken(user.id);

    // Set auth cookie
    const response = NextResponse.json(
      { message: t.auth.login.success, user: { id: user.id, email: user.email } },
      { status: 200 }
    );

    // Set the cookie in the response
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    const t = getApiTranslation();
    return NextResponse.json({ error: t.auth.login.error }, { status: 500 });
  }
}

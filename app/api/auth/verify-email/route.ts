import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiTranslation } from "@/lib/i18n/api-i18n";
import { siteConfig } from "@/config/site";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const locale = searchParams.get("locale") || siteConfig.defaultLocale;

    const t = getApiTranslation(locale || undefined);

    if (!token) {
      return NextResponse.json({ error: t.auth.verifyEmail.noToken }, { status: 400 });
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: t.auth.verifyEmail.invalidToken }, { status: 400 });
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      return NextResponse.json({ error: t.auth.verifyEmail.expiredToken }, { status: 400 });
    }

    // Update user's email verification status
    const user = await prisma.user.update({
      where: { id: verificationToken.userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    // Delete the used verification token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return NextResponse.json({
      message: t.auth.verifyEmail.success,
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    const t = getApiTranslation();
    return NextResponse.json({ error: t.auth.verifyEmail.failed }, { status: 500 });
  }
}

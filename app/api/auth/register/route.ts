import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/email";
import { v4 as uuidv4 } from "uuid";
import { getApiTranslation } from "@/lib/i18n/api-i18n";
import { siteConfig } from "@/config/site";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || siteConfig.defaultLocale;
    const t = getApiTranslation(locale || undefined);

    const body = await req.json();
    const { email, password, firstName, lastName } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: t.auth.register.userAlreadyExists }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    // Create verification token
    const token = uuidv4();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // Token expires in 24 hours

    await prisma.verificationToken.create({
      data: {
        token,
        expires,
        userId: user.id,
      },
    });

    // Send verification email
    await sendVerificationEmail(email, token);

    return NextResponse.json({ message: t.auth.register.success }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    const t = getApiTranslation();
    return NextResponse.json({ error: t.auth.register.error }, { status: 500 });
  }
}

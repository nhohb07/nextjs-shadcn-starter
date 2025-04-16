import { Manrope as FontManrope, Lexend as FontSans, Newsreader as FontSerif } from "next/font/google";

import { cn } from "@/lib/utils";
import { LoginForm } from "./login-form";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });
const fontSerif = FontSerif({ subsets: ["latin"], variable: "--font-serif" });
const fontManrope = FontManrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});
export default function LoginPage() {
  return (
    <div
      className={cn(
        "bg-muted dark:bg-background flex flex-1 flex-col items-center justify-center gap-16 p-6 md:p-10 min-h-svh",
        fontSans.variable,
        fontSerif.variable,
        fontManrope.variable
      )}
    >
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}

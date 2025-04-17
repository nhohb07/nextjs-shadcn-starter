import { siteConfig } from "@/config/site";
import { getTranslation, type Locale } from "./i18n";

export function getApiTranslation(locale?: string) {
  return getTranslation((locale as Locale) || siteConfig.defaultLocale);
}

export function getErrorMessage(error: unknown, t: { auth: { common: { error: string } } }) {
  if (error instanceof Error) {
    return error.message;
  }
  return t.auth.common.error;
}

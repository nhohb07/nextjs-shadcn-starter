import en from "@/messages/en.json";
import vi from "@/messages/vi.json";
import { siteConfig } from "@/config/site";

const translations = {
  en,
  vi,
};

export type Locale = keyof typeof translations;
export type TranslationKey = keyof typeof en;

export function getTranslation(locale: Locale = siteConfig.defaultLocale as Locale) {
  return translations[locale];
}

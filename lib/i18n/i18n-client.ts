"use client";

import { useParams } from "next/navigation";
import { getTranslation, type Locale } from "./i18n-server";
import { siteConfig } from "@/config/site";

export function useTranslation() {
  const params = useParams();
  const locale = (params?.locale as Locale) || siteConfig.defaultLocale;
  const t = getTranslation(locale);

  return {
    t,
    locale,
  };
}

import {
  resolveLocale,
  translate,
  type TranslationParams,
} from "@/constants/i18n/translations";
import { useLocaleStore } from "@/store/locale-store";

export function useTranslation() {
  const languageCode = useLocaleStore((state) => state.languageCode);
  const locale = resolveLocale(languageCode);

  const t = (key: string, params?: TranslationParams) =>
    translate(locale, key, params);

  return { t, locale, languageCode };
}

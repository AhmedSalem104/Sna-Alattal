import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['ar', 'en', 'tr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ar';

export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
  tr: 'Türkçe',
};

export const localeDirection: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
  tr: 'ltr',
};

export default getRequestConfig(async () => {
  // Read locale from cookie
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');

  let locale: Locale = defaultLocale;

  if (localeCookie && locales.includes(localeCookie.value as Locale)) {
    locale = localeCookie.value as Locale;
  }

  return {
    locale,
    messages: (await import(`./src/i18n/messages/${locale}.json`)).default,
  };
});

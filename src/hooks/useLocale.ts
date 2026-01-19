'use client';

import { useLocale as useNextIntlLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { locales, localeNames, localeDirection, type Locale } from '@/i18n/request';

export function useLocale() {
  const locale = useNextIntlLocale() as Locale;
  const t = useTranslations();
  const router = useRouter();

  const direction = localeDirection[locale];
  const isRTL = direction === 'rtl';

  const changeLocale = useCallback(
    (newLocale: Locale) => {
      // Set cookie for the new locale
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
      // Refresh the page to apply the new locale
      router.refresh();
    },
    [router]
  );

  return {
    locale,
    locales,
    localeNames,
    direction,
    isRTL,
    changeLocale,
    t,
  };
}

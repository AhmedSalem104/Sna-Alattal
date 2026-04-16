import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { locales, defaultLocale, type Locale } from './src/i18n/config';

export { locales, defaultLocale, localeNames, localeDirection } from './src/i18n/config';
export type { Locale } from './src/i18n/config';

export default getRequestConfig(async () => {
  const headerList = await headers();
  const headerLocale = headerList.get('x-next-intl-locale');
  const locale: Locale =
    headerLocale && (locales as readonly string[]).includes(headerLocale)
      ? (headerLocale as Locale)
      : defaultLocale;

  return {
    locale,
    messages: (await import(`./src/i18n/messages/${locale}.json`)).default,
  };
});

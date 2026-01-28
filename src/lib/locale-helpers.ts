/**
 * Helper functions for locale-aware field access
 */

type LocaleSuffix = 'Ar' | 'En' | 'Tr';

/**
 * Gets a localized field from an object based on the current locale.
 * Falls back to English if the localized field is empty.
 *
 * @param item - The object containing localized fields (e.g., { nameAr, nameEn, nameTr })
 * @param field - The base field name (e.g., 'name', 'description', 'title')
 * @param locale - The current locale ('ar', 'en', 'tr')
 * @returns The localized field value or empty string
 *
 * @example
 * const product = { nameAr: 'منتج', nameEn: 'Product', nameTr: 'Urun' };
 * getLocalizedField(product, 'name', 'ar') // Returns 'منتج'
 */
export function getLocalizedField<T extends Record<string, unknown>>(
  item: T,
  field: string,
  locale: string
): string {
  const suffixMap: Record<string, LocaleSuffix> = {
    ar: 'Ar',
    en: 'En',
    tr: 'Tr',
  };

  const suffix = suffixMap[locale] || 'En';
  const localizedKey = `${field}${suffix}` as keyof T;
  const fallbackKey = `${field}En` as keyof T;

  const value = item[localizedKey];
  const fallback = item[fallbackKey];

  if (typeof value === 'string' && value) {
    return value;
  }

  if (typeof fallback === 'string' && fallback) {
    return fallback;
  }

  return '';
}

/**
 * Creates a locale-aware getter function for a specific locale.
 * Useful for avoiding repeated locale parameter passing.
 *
 * @param locale - The locale to use for all subsequent calls
 * @returns A function that takes (item, field) and returns the localized value
 *
 * @example
 * const getName = createLocalizedGetter('ar');
 * products.map(p => getName(p, 'name'))
 */
export function createLocalizedGetter(locale: string) {
  return <T extends Record<string, unknown>>(item: T, field: string): string => {
    return getLocalizedField(item, field, locale);
  };
}

/**
 * Formats a date for display based on locale.
 *
 * @param date - Date string or Date object
 * @param locale - The locale for formatting
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatLocalizedDate(
  date: string | Date,
  locale: string,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const localeMap: Record<string, string> = {
    ar: 'ar-EG',
    en: 'en-US',
    tr: 'tr-TR',
  };

  return dateObj.toLocaleDateString(localeMap[locale] || 'en-US', options);
}

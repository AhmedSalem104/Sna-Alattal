import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { localeDirection, type Locale } from '@/i18n/request';
import { Providers } from '@/components/providers';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo',
});


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'العتال للصناعات الهندسية | S.N.A Al-Attal',
    template: '%s | S.N.A Al-Attal',
  },
  description: 'الشركة الرائدة في تصنيع خطوط إنتاج التعبئة السائلة في مصر وتركيا',
  keywords: [
    'خطوط تعبئة',
    'ماكينات تعبئة',
    'صناعات هندسية',
    'filling machines',
    'production lines',
    'packaging',
    'العتال',
    'SNA',
    'Al-Attal',
  ],
  authors: [{ name: 'S.N.A Al-Attal Engineering Industries' }],
  creator: 'S.N.A Al-Attal',
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    alternateLocale: ['en_US', 'tr_TR'],
    siteName: 'S.N.A Al-Attal Engineering Industries',
    images: [
      {
        url: '/images/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'S.N.A Al-Attal Engineering Industries',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'S.N.A Al-Attal Engineering Industries',
    description: 'Leading manufacturer of liquid filling production lines',
    images: ['/images/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale() as Locale;
  const messages = await getMessages();
  const dir = localeDirection[locale];

  return (
    <html lang={locale} dir={dir} className={cairo.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#D4AF37" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'S.N.A Al-Attal Engineering Industries',
              alternateName: 'العتال للصناعات الهندسية',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sna-alattal.com',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sna-alattal.com'}/images/logo.jpg`,
              description: 'Leading manufacturer of liquid filling production lines in Egypt and Turkey since 1994.',
              foundingDate: '1994',
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+20-103-222-1038',
                  contactType: 'sales',
                  areaServed: 'EG',
                  availableLanguage: ['Arabic', 'English'],
                },
                {
                  '@type': 'ContactPoint',
                  telephone: '+20-100-619-3661',
                  contactType: 'customer service',
                  areaServed: 'EG',
                  availableLanguage: ['Arabic', 'English'],
                },
              ],
              address: [
                {
                  '@type': 'PostalAddress',
                  addressCountry: 'EG',
                  addressLocality: '10th of Ramadan City',
                },
                {
                  '@type': 'PostalAddress',
                  addressCountry: 'TR',
                  addressLocality: 'Istanbul',
                },
              ],
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className="font-cairo antialiased" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

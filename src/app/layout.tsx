import type { Metadata } from 'next';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { localeDirection, type Locale } from '@/i18n/request';
import { Providers } from '@/components/providers';
import './globals.css';

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
        url: '/images/og-image.jpg',
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
    images: ['/images/og-image.jpg'],
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
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#D4AF37" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Cairo:wght@200..1000&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Cairo:wght@200..1000&display=swap"
          media="print"
          onLoad="this.media='all'"
        />
      </head>
      <body className={`${dir === 'rtl' ? 'font-cairo' : 'font-inter'} antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

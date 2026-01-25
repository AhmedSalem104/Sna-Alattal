'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  Facebook,
  Linkedin,
  Youtube,
  Instagram,
  MapPin,
  Phone,
  Mail,
  ArrowUp,
  Factory,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/snaalattal', label: 'Facebook' },
  { icon: Linkedin, href: 'https://linkedin.com/company/snaalattal', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com/@snaalattal', label: 'YouTube' },
  { icon: Instagram, href: 'https://instagram.com/snaalattal', label: 'Instagram' },
];

const quickLinks = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'products', href: '/products' },
  { key: 'solutions', href: '/solutions' },
  { key: 'clients', href: '/clients' },
  { key: 'contact', href: '/contact' },
];

export function Footer() {
  const t = useTranslations();
  const { isRTL } = useLocale();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-steel-900 to-steel-950 text-white relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Modern Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
      </div>

      {/* Main Footer */}
      <div className="container-custom py-10 sm:py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4 sm:space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/images/logo.jpg"
                  alt="S.N.A Al-Attal"
                  width={50}
                  height={50}
                  className="rounded-lg shadow-soft w-10 h-10 sm:w-[50px] sm:h-[50px]"
                />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-primary group-hover:text-primary/80 transition-colors">
                  S.N.A AL-ATTAL
                </h3>
                <p className="text-[10px] sm:text-xs text-neutral-400">
                  Engineering Industries
                </p>
              </div>
            </Link>

            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Factory Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-sm rounded-lg">
              <Factory size={14} className="text-primary" />
              <span className="text-xs text-neutral-400">
                {t('footer.since') || 'Since 1994'}
              </span>
            </div>

            {/* Social Links */}
            <div className="flex gap-2 sm:gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 backdrop-blur-sm flex items-center justify-center text-neutral-400 hover:bg-primary hover:text-steel-900 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 sm:mb-6 text-sm flex items-center gap-2">
              <div className="w-6 sm:w-8 h-0.5 bg-primary rounded-full" />
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-primary transition-colors text-xs sm:text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300 rounded-full" />
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Egypt */}
          <div>
            <h4 className="text-white font-semibold mb-4 sm:mb-6 text-sm flex items-center gap-2">
              <div className="w-6 sm:w-8 h-0.5 bg-primary rounded-full" />
              {t('contact.info.egypt.title')}
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3 text-neutral-400 text-xs sm:text-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin size={12} className="sm:w-[14px] sm:h-[14px] text-primary" />
                </div>
                <span className="pt-1">{t('contact.info.egypt.address')}</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3 text-neutral-400 text-xs sm:text-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Phone size={12} className="sm:w-[14px] sm:h-[14px] text-primary" />
                </div>
                <a
                  href="tel:+201032221038"
                  className="hover:text-primary transition-colors"
                >
                  {t('contact.info.egypt.phone')}
                </a>
              </li>
              <li className="flex items-center gap-2 sm:gap-3 text-neutral-400 text-xs sm:text-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Mail size={12} className="sm:w-[14px] sm:h-[14px] text-primary" />
                </div>
                <a
                  href="mailto:info@sna-attal.com"
                  className="hover:text-primary transition-colors"
                >
                  info@sna-attal.com
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info - Turkey & Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4 sm:mb-6 text-sm flex items-center gap-2">
              <div className="w-6 sm:w-8 h-0.5 bg-primary rounded-full" />
              {t('contact.info.turkey.title')}
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3 text-neutral-400 text-xs sm:text-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin size={12} className="sm:w-[14px] sm:h-[14px] text-primary" />
                </div>
                <span className="pt-1">{t('contact.info.turkey.address')}</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3 text-neutral-400 text-xs sm:text-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Phone size={12} className="sm:w-[14px] sm:h-[14px] text-primary" />
                </div>
                <a
                  href="tel:+90XXXXXXXXXX"
                  className="hover:text-primary transition-colors"
                >
                  {t('contact.info.turkey.phone')}
                </a>
              </li>
            </ul>

            {/* Newsletter Signup */}
            <div className="mt-6 sm:mt-8">
              <h5 className="text-white font-semibold mb-3 text-xs sm:text-sm">
                {t('footer.newsletter') || 'Newsletter'}
              </h5>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder={t('footer.email_placeholder') || 'Enter your email'}
                  className="flex-1 px-3 sm:px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg text-white placeholder:text-neutral-500 text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                />
                <button className="px-4 py-2 bg-primary text-steel-900 font-semibold text-xs sm:text-sm rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">
                  {t('footer.subscribe') || 'Subscribe'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="container-custom py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-neutral-500 text-xs sm:text-sm text-center sm:text-start">
            &copy; {new Date().getFullYear()} S.N.A Al-Attal.{' '}
            {t('footer.rights')}.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <Link
              href="/privacy"
              className="text-neutral-500 hover:text-primary text-xs sm:text-sm transition-colors"
            >
              {t('footer.privacy')}
            </Link>
            <Link
              href="/terms"
              className="text-neutral-500 hover:text-primary text-xs sm:text-sm transition-colors"
            >
              {t('footer.terms')}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollToTop}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 text-neutral-400 hover:bg-primary hover:text-steel-900 transition-all duration-300"
            >
              <ArrowUp size={16} className="sm:w-[18px] sm:h-[18px]" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  Facebook,
  Linkedin,
  Youtube,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
  ArrowUp,
  Factory,
  Cog,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';
import { IndustrialGear } from '@/components/decorative';
import settingsData from '@/data/settings.json';

// TikTok icon (not in lucide)
function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46v-7.03a8.19 8.19 0 004.77 1.53V10.7a4.83 4.83 0 01-.81.07 4.87 4.87 0 01-.38-4.08z" />
    </svg>
  );
}

const SOCIAL_ICON_MAP: Record<string, LucideIcon | typeof TikTokIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  tiktok: TikTokIcon,
};

const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  twitter: 'X / Twitter',
  tiktok: 'TikTok',
};

const quickLinks = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'products', href: '/products' },
  { key: 'solutions', href: '/solutions' },
  { key: 'clients', href: '/clients' },
  { key: 'contact', href: '/contact' },
];

const productLinks = [
  { key: 'filling_machines', href: '/products?category=filling' },
  { key: 'packaging_machines', href: '/products?category=packaging' },
  { key: 'labeling_machines', href: '/products?category=labeling' },
  { key: 'capping_machines', href: '/products?category=capping' },
];

export function Footer() {
  const t = useTranslations();
  const { isRTL, locale } = useLocale();
  const [socialLinks] = useState(() => {
    const data = settingsData || {};
    const links: { icon: LucideIcon | typeof TikTokIcon; href: string; label: string }[] = [];
    const platforms = ['facebook', 'instagram', 'youtube', 'linkedin', 'twitter', 'tiktok'];
    for (const platform of platforms) {
      const value = typeof data[platform] === 'string' ? data[platform] : '';
      if (value && SOCIAL_ICON_MAP[platform]) {
        links.push({
          icon: SOCIAL_ICON_MAP[platform],
          href: value,
          label: SOCIAL_LABELS[platform] || platform,
        });
      }
    }
    return links;
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="text-white relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Factory Image Background with parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 -top-20 -bottom-20" style={{ backgroundImage: 'url(/images/footer-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }} aria-hidden="true" />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-steel-950/80" />
        {/* Subtle gold tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/5" />
      </div>

      {/* Top Gold Border */}
      <div className="relative z-10 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/images/logo.jpg"
                  alt="S.N.A Al-Attal"
                  width={60}
                  height={60}
                  className="border-2 border-primary/50"
                  loading="lazy"
                  sizes="60px"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase group-hover:text-primary/80 transition-colors">
                  <span className="text-primary tracking-[0.2em]">S.N.A</span> <span className="text-white">AL-ATTAL</span>
                </h3>
                <p className="text-xs text-white/50 uppercase tracking-widest">
                  Engineering Industries
                </p>
              </div>
              {/* Decorative gear near footer logo */}
              <IndustrialGear
                size={28}
                teeth={10}
                className="text-primary opacity-40 shrink-0"
                strokeWidth={1.5}
                reverse
              />
            </Link>

            <p className="text-white/70 text-sm leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Factory Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-2 border border-white/10 bg-white/5">
              <Factory size={16} className="text-primary" />
              <span className="text-xs text-white/70 uppercase tracking-wider">
                {t('footer.since') || 'Since 1997'}
              </span>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border-2 border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:bg-primary hover:border-primary hover:text-steel-900 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <div className="w-8 h-0.5 bg-primary" />
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300" />
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Egypt */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <div className="w-8 h-0.5 bg-primary" />
              {t('contact.info.egypt.title')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/70 text-sm">
                <div className="w-8 h-8 border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-primary" />
                </div>
                <span className="pt-1">{t('contact.info.egypt.address')}</span>
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <div className="w-8 h-8 border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-primary" />
                </div>
                <a
                  href="tel:+201032221038"
                  className="hover:text-primary transition-colors"
                >
                  01032221038
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <div className="w-8 h-8 border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-primary" />
                </div>
                <a
                  href="tel:+201006193661"
                  className="hover:text-primary transition-colors"
                >
                  01006193661
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <div className="w-8 h-8 border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-primary" />
                </div>
                <a
                  href="mailto:snaalattal@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  snaalattal@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Branches */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <div className="w-8 h-0.5 bg-primary" />
              {locale === 'ar' ? 'فروعنا' : locale === 'tr' ? 'Şubelerimiz' : 'Our Branches'}
            </h4>
            <ul className="space-y-2 text-white/70 text-xs">
              <li className="flex items-center gap-2">
                <span>🇪🇬</span>
                <a href="tel:+201211459495" dir="ltr" className="hover:text-primary">+20 121 145 9495</a>
              </li>
              <li className="flex items-center gap-2">
                <span>🇪🇬</span>
                <a href="tel:+201032221038" dir="ltr" className="hover:text-primary">+20 103 222 1038</a>
              </li>
              <li className="flex items-center gap-2">
                <span>🇸🇾</span>
                <a href="tel:+963944971509" dir="ltr" className="hover:text-primary">+963 944 971 509</a>
              </li>
              <li className="flex items-center gap-2">
                <span>🇸🇦</span>
                <a href="tel:+966536471877" dir="ltr" className="hover:text-primary">+966 53 647 1877</a>
              </li>
              <li className="flex items-center gap-2">
                <span>🇹🇷</span>
                <a href="tel:+905516072123" dir="ltr" className="hover:text-primary">+90 551 607 2123</a>
              </li>
              <li className="flex items-center gap-2">
                <span>🇮🇶</span>
                <a href="tel:+9647714375620" dir="ltr" className="hover:text-primary">+964 771 437 5620</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10 relative z-10">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm text-center sm:text-start">
            &copy; {new Date().getFullYear()} <span className="text-primary tracking-[0.15em]">S.N.A</span> Al-Attal Engineering Industries.{' '}
            {t('footer.rights')}.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-white/60 hover:text-primary text-sm transition-colors uppercase tracking-wider"
            >
              {t('footer.privacy')}
            </Link>
            <Link
              href="/terms"
              className="text-white/60 hover:text-primary text-sm transition-colors uppercase tracking-wider"
            >
              {t('footer.terms')}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollToTop}
              className="w-10 h-10 border-2 border-white/10 bg-white/5 text-white/70 hover:bg-primary hover:border-primary hover:text-steel-900 rounded-none transition-all duration-300"
            >
              <ArrowUp size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Gold Accent */}
      <div className="relative z-10 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
    </footer>
  );
}

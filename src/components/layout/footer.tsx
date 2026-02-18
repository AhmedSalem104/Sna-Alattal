'use client';

import { useState, useEffect } from 'react';
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
  const { isRTL } = useLocale();
  const [socialLinks, setSocialLinks] = useState<{ icon: LucideIcon | typeof TikTokIcon; href: string; label: string }[]>([]);

  useEffect(() => {
    fetch('/api/public/settings?group=general')
      .then(res => res.json())
      .then(data => {
        const links: typeof socialLinks = [];
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
        setSocialLinks(links);
      })
      .catch(() => {});
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-steel-900 text-white relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Industrial Pattern Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 160, 10, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 160, 10, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Decorative Gear */}
        <div className="absolute -bottom-20 -right-20 text-primary/5">
          <Cog size={200} strokeWidth={0.5} />
        </div>
      </div>

      {/* Top Gold Border */}
      <div className="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary" />

      {/* Main Footer */}
      <div className="container-custom py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/images/logo.jpg"
                  alt="S.N.A Al-Attal"
                  width={60}
                  height={60}
                  className="border-2 border-primary"
                  loading="lazy"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary uppercase tracking-wider group-hover:text-primary/80 transition-colors">
                  S.N.A AL-ATTAL
                </h3>
                <p className="text-xs text-metal-400 uppercase tracking-widest">
                  Engineering Industries
                </p>
              </div>
            </Link>

            <p className="text-metal-300 text-sm leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Factory Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-2 border border-steel-700 bg-steel-800">
              <Factory size={16} className="text-primary" />
              <span className="text-xs text-metal-400 uppercase tracking-wider">
                {t('footer.since') || 'Since 1994'}
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
                  className="w-10 h-10 border-2 border-steel-700 bg-steel-800 flex items-center justify-center text-metal-400 hover:bg-primary hover:border-primary hover:text-steel-900 transition-all duration-300"
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
                    className="text-metal-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
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
              <li className="flex items-start gap-3 text-metal-400 text-sm">
                <div className="w-8 h-8 border border-steel-700 bg-steel-800 flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-primary" />
                </div>
                <span className="pt-1">{t('contact.info.egypt.address')}</span>
              </li>
              <li className="flex items-center gap-3 text-metal-400 text-sm">
                <div className="w-8 h-8 border border-steel-700 bg-steel-800 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-primary" />
                </div>
                <a
                  href="tel:+201032221038"
                  className="hover:text-primary transition-colors"
                >
                  01032221038
                </a>
              </li>
              <li className="flex items-center gap-3 text-metal-400 text-sm">
                <div className="w-8 h-8 border border-steel-700 bg-steel-800 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-primary" />
                </div>
                <a
                  href="tel:+201006193661"
                  className="hover:text-primary transition-colors"
                >
                  01006193661
                </a>
              </li>
              <li className="flex items-center gap-3 text-metal-400 text-sm">
                <div className="w-8 h-8 border border-steel-700 bg-steel-800 flex items-center justify-center shrink-0">
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

          {/* Contact Info - Turkey */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <div className="w-8 h-0.5 bg-primary" />
              {t('contact.info.turkey.title')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-metal-400 text-sm">
                <div className="w-8 h-8 border border-steel-700 bg-steel-800 flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-primary" />
                </div>
                <span className="pt-1">{t('contact.info.turkey.address')}</span>
              </li>
              <li className="flex items-center gap-3 text-metal-400 text-sm">
                <div className="w-8 h-8 border border-steel-700 bg-steel-800 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-primary" />
                </div>
                <a
                  href="tel:+90XXXXXXXXXX"
                  className="hover:text-primary transition-colors"
                >
                  {t('contact.info.turkey.phone')}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-steel-800">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-metal-500 text-sm text-center sm:text-start">
            &copy; {new Date().getFullYear()} S.N.A Al-Attal Engineering Industries.{' '}
            {t('footer.rights')}.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-metal-500 hover:text-primary text-sm transition-colors uppercase tracking-wider"
            >
              {t('footer.privacy')}
            </Link>
            <Link
              href="/terms"
              className="text-metal-500 hover:text-primary text-sm transition-colors uppercase tracking-wider"
            >
              {t('footer.terms')}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollToTop}
              className="w-10 h-10 border-2 border-steel-700 bg-steel-800 text-metal-400 hover:bg-primary hover:border-primary hover:text-steel-900 rounded-none transition-all duration-300"
            >
              <ArrowUp size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Gold Accent */}
      <div className="h-1 bg-primary" />
    </footer>
  );
}

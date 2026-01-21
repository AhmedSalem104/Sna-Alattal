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
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Main Footer */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.jpg"
                alt="S.N.A Al-Attal"
                width={60}
                height={60}
                className="rounded-md"
              />
              <div>
                <h3 className="text-lg font-bold text-primary">S.N.A AL-ATTAL</h3>
                <p className="text-xs text-gray-600">Engineering Industries</p>
              </div>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-primary transition-all"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-6">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-primary transition-colors text-sm"
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Egypt */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-6">
              {t('contact.info.egypt.title')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600 text-sm">
                <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                <span>{t('contact.info.egypt.address')}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 text-sm">
                <Phone size={18} className="text-primary shrink-0" />
                <a href="tel:+201032221038" className="hover:text-primary transition-colors">
                  {t('contact.info.egypt.phone')}
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-600 text-sm">
                <Mail size={18} className="text-primary shrink-0" />
                <a href="mailto:info@sna-attal.com" className="hover:text-primary transition-colors">
                  info@sna-attal.com
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info - Turkey */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-6">
              {t('contact.info.turkey.title')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600 text-sm">
                <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                <span>{t('contact.info.turkey.address')}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 text-sm">
                <Phone size={18} className="text-primary shrink-0" />
                <a href="tel:+90XXXXXXXXXX" className="hover:text-primary transition-colors">
                  {t('contact.info.turkey.phone')}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm text-center sm:text-start">
            &copy; {new Date().getFullYear()} S.N.A Al-Attal Engineering Industries.{' '}
            {t('footer.rights')}.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-gray-600 hover:text-primary text-sm transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-primary text-sm transition-colors">
              {t('footer.terms')}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollToTop}
              className="text-gray-600 hover:text-primary"
            >
              <ArrowUp size={18} />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}

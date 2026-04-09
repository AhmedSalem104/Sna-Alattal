'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Factory } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';

/* ─── SNA Logo - clean text ─── */
function GearLogo() {
  return (
    <span className="text-white font-black text-[28px] tracking-[0.25em] select-none shrink-0">
      S.N.A
    </span>
  );
}

const navItems = [
  { key: 'home', href: '/' },
  { key: 'products', href: '/products' },
  { key: 'compressors', href: '/compressors' },
  { key: 'exhibitions', href: '/exhibitions' },
  { key: 'clients', href: '/clients' },
  { key: 'about', href: '/about' },
];

export function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { isRTL } = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Prefetch all nav pages on mount for instant navigation
  useEffect(() => {
    navItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [router]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block bg-steel-900 text-white py-2.5 border-b border-steel-800">
        <div className="container-custom flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Factory size={16} className="text-primary" />
              <span className="text-white/70 font-medium">مصنع ماكينات التعبئة والتغليف</span>
            </div>
          </div>
          <div className="flex items-center gap-6" dir="ltr">
            <a href="tel:+201032221038" className="flex items-center gap-2 text-white/70 hover:text-primary transition-colors font-medium">
              <Phone size={14} className="text-primary" />
              <span dir="ltr">+20 103 222 1038</span>
            </a>
            <span className="text-white/20">|</span>
            <a href="tel:+201006193661" className="flex items-center gap-2 text-white/70 hover:text-primary transition-colors font-medium">
              <Phone size={14} className="text-primary" />
              <span dir="ltr">+20 100 619 3661</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={cn(
          'sticky top-0 left-0 right-0 z-50 transition-all duration-500',
          'bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 shadow-lg'
        )}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <nav className="container-custom">
          <div className="flex items-center justify-between h-[64px] md:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <GearLogo />
              <div className="hidden md:flex flex-col border-s-2 border-white/25 ps-3">
                <h1 className="text-[20px] lg:text-[24px] font-black leading-tight uppercase tracking-[0.1em] text-white group-hover:text-white/90 transition-colors">
                  AL-ATTAL
                </h1>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-semibold">
                  Engineering Industries
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className={cn("hidden xl:flex items-center", isRTL ? "gap-0.5" : "gap-0.5")}>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    prefetch={true}
                    className={cn(
                      "relative px-3 lg:px-4 py-2 text-[13px] lg:text-[14px] font-bold uppercase tracking-wide transition-all duration-200 whitespace-nowrap",
                      isActive
                        ? "text-white font-extrabold"
                        : "text-white/75 hover:text-white"
                    )}
                  >
                    {t(item.key)}
                    <span
                      className={cn(
                        "absolute bottom-0 left-1 right-1 h-[2px] bg-white transition-transform duration-300",
                        isRTL ? "origin-right" : "origin-left",
                        isActive ? "scale-x-100" : "scale-x-0 hover:scale-x-100"
                      )}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-1 right-1 h-[2px] bg-white"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />

              <Button
                variant="industrial"
                size="sm"
                className="hidden sm:inline-flex"
                asChild
              >
                <Link href="/contact" prefetch={true}>
                  <Phone size={16} />
                  {t('contact')}
                </Link>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "xl:hidden text-white hover:text-white/80 hover:bg-white/10"
                )}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isMobileMenuOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu - Industrial Style */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              id="mobile-navigation"
              role="navigation"
              aria-label="القائمة المحمولة"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="xl:hidden bg-gradient-to-b from-primary-600 to-primary-700 border-t-2 border-white/20 overflow-hidden"
            >
              <div className="container-custom py-4 space-y-1">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        prefetch={true}
                        className={cn(
                          "block px-4 py-3 text-base font-bold uppercase tracking-wider transition-all duration-200 border-r-2",
                          isActive
                            ? "text-white bg-white/15 border-white"
                            : "text-white/80 hover:text-white hover:bg-white/10 border-transparent hover:border-white/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>{t(item.key)}</span>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-white"
                            />
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="pt-4 mt-2 border-t border-white/20"
                >
                  <Button variant="industrial" className="w-full" asChild>
                    <Link href="/contact" onClick={closeMobileMenu} prefetch={true}>
                      <Phone size={16} />
                      {t('contact')}
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

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

/* ─── Gear Logo with SNA - uses CSS animation to avoid hydration mismatch ─── */
function GearLogo() {
  return (
    <div className="relative w-[80px] h-[80px] flex items-center justify-center shrink-0">
      {/* Big gear - CSS spin */}
      <svg
        className="absolute animate-spin-slow"
        style={{ animationDuration: '30s' }}
        width="70"
        height="70"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M50 8 L54 8 L56 2 L60 2 L62 8 L66 6 L70 1 L73 3 L71 9 L75 10 L80 6 L82 9 L78 13 L81 16 L87 14 L88 17 L83 20 L85 24 L91 23 L91 27 L85 28 L86 32 L92 34 L91 38 L85 37 L84 41 L90 44 L88 47 L82 45 L80 49 L85 53 L82 55 L77 51 L74 54 L77 60 L74 62 L70 57 L66 58 L68 64 L64 65 L62 59 L58 59 L58 66 L54 65 L53 59 L49 58 L47 65 L44 63 L44 57 L40 55 L37 60 L35 58 L37 52 L34 49 L29 53 L28 50 L32 46 L30 42 L24 43 L24 39 L30 38 L29 34 L23 33 L24 29 L30 29 L30 25 L24 23 L26 20 L31 22 L34 18 L29 14 L32 12 L36 16 L40 14 L37 8 L41 7 L43 13 L47 12 L47 6 L50 6 Z"
          fill="rgba(255,255,255,0.12)"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="35" r="14" fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx="50" cy="35" r="6" fill="none" stroke="white" strokeWidth="1" />
      </svg>

      {/* Small gear - CSS spin reverse */}
      <svg
        className="absolute animate-spin-slow"
        style={{ animationDuration: '20s', animationDirection: 'reverse', top: '36px', left: '42px' }}
        width="42"
        height="42"
        viewBox="0 0 60 60"
        fill="none"
      >
        <path
          d="M30 5 L33 5 L34 1 L37 1 L38 5 L41 4 L44 0 L46 2 L44 6 L47 7 L50 4 L51 7 L48 9 L50 12 L54 11 L54 14 L50 15 L51 18 L55 19 L54 22 L50 21 L49 24 L53 26 L51 29 L48 27 L46 30 L49 33 L47 35 L44 32 L41 34 L43 38 L40 39 L38 35 L35 36 L35 40 L32 39 L31 36 L28 35 L27 39 L24 38 L25 34 L22 32 L20 36 L18 34 L20 31 L18 28 L14 29 L14 26 L18 25 L17 22 L13 21 L14 18 L18 19 L19 16 L15 14 L17 12 L20 14 L22 11 L18 9 L20 7 L23 10 L26 8 L24 4 L27 4 L28 8 L30 7 Z"
          fill="rgba(255,255,255,0.08)"
          stroke="white"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle cx="30" cy="20" r="8" fill="none" stroke="white" strokeWidth="1.2" />
        <circle cx="30" cy="20" r="3.5" fill="none" stroke="white" strokeWidth="0.8" />
      </svg>

      {/* SNA Text */}
      <span
        className="relative z-10 text-white font-black text-[22px] tracking-[0.2em] select-none"
        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 0 20px rgba(232,134,42,0.3)' }}
      >
        SNA
      </span>
    </div>
  );
}

const navItems = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'products', href: '/products' },
  { key: 'solutions', href: '/solutions' },
  { key: 'clients', href: '/clients' },
  { key: 'exhibitions', href: '/exhibitions' },
  { key: 'news', href: '/news' },
  { key: 'contact', href: '/contact' },
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
          <div className="flex items-center justify-between h-[110px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-4 group">
              <GearLogo />
              <div className="hidden sm:flex flex-col border-s-2 border-white/25 ps-4">
                <h1 className="text-[26px] font-black leading-tight uppercase tracking-[0.12em] text-white group-hover:text-white/90 transition-colors">
                  AL-ATTAL
                </h1>
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60 font-semibold mt-0.5">
                  Engineering Industries
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className={cn("hidden lg:flex items-center", isRTL ? "gap-1" : "gap-1")}>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    prefetch={true}
                    className={cn(
                      "relative px-4 py-2.5 text-[15px] font-bold uppercase tracking-wide transition-all duration-200",
                      isActive
                        ? "text-white font-extrabold"
                        : "text-white/80 hover:text-white"
                    )}
                  >
                    {t(item.key)}
                    {/* Industrial underline indicator */}
                    <span
                      className={cn(
                        "absolute bottom-0 left-1 right-1 h-[3px] bg-white transition-transform duration-300",
                        isRTL ? "origin-right" : "origin-left",
                        isActive ? "scale-x-100" : "scale-x-0 hover:scale-x-100"
                      )}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-1 right-1 h-[3px] bg-white"
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
                  "lg:hidden text-white hover:text-white/80 hover:bg-white/10"
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
              className="lg:hidden bg-gradient-to-b from-primary-600 to-primary-700 border-t-2 border-white/20 overflow-hidden"
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
                          "block px-4 py-3.5 text-base font-bold uppercase tracking-wider transition-all duration-200 border-r-2",
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

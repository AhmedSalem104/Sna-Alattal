'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Factory } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Throttled scroll handler for better performance
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      {/* Top Bar - Industrial Style with entrance animation */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:block bg-steel-900 text-white py-2.5 border-b border-steel-700"
      >
        <div className="container-custom flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Factory size={16} className="text-primary" />
              <span className="text-metal-200 font-medium">مصنع ماكينات التعبئة والتغليف</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="tel:+201032221038" className="flex items-center gap-2 text-metal-200 hover:text-primary transition-colors font-medium">
              <Phone size={14} className="text-primary" />
              <span>+20 103 222 1038</span>
            </a>
            <span className="text-steel-700">|</span>
            <a href="tel:+201006193661" className="flex items-center gap-2 text-metal-200 hover:text-primary transition-colors font-medium">
              <Phone size={14} className="text-primary" />
              <span>+20 100 619 3661</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* Main Navbar - Transparent on homepage, solid on scroll/other pages */}
      <header
        className={cn(
          'sticky top-0 left-0 right-0 z-50 transition-all duration-500',
          pathname === '/' && !isScrolled
            ? 'bg-steel-900/80 backdrop-blur-md border-b border-white/10'
            : isScrolled
              ? 'bg-white shadow-industrial border-b-2 border-primary'
              : 'bg-white/95 backdrop-blur-sm border-b border-metal-200'
        )}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <nav className="container-custom">
          <div className="flex items-center justify-between h-[80px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/images/logo.jpg"
                  alt="S.N.A Al-Attal"
                  width={56}
                  height={56}
                  className="rounded-none border-2 border-primary"
                  priority
                />
                {/* Industrial corner accent */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary" />
              </div>
              <div className="hidden sm:block">
                <h1 className={cn(
                  "text-xl font-bold leading-tight uppercase tracking-wider group-hover:text-primary transition-colors",
                  pathname === '/' && !isScrolled ? "text-white" : "text-steel-900"
                )}>
                  S.N.A AL-ATTAL
                </h1>
                <p className={cn(
                  "text-sm uppercase tracking-widest transition-colors font-medium",
                  pathname === '/' && !isScrolled ? "text-primary/80" : "text-metal-500"
                )}>Engineering Industries</p>
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
                        ? "text-primary"
                        : pathname === '/' && !isScrolled
                          ? "text-white hover:text-primary"
                          : "text-steel-900 hover:text-primary"
                    )}
                  >
                    {t(item.key)}
                    {/* Industrial underline indicator */}
                    <span
                      className={cn(
                        "absolute bottom-0 left-1 right-1 h-[3px] bg-primary transition-transform duration-300",
                        isRTL ? "origin-right" : "origin-left",
                        isActive ? "scale-x-100" : "scale-x-0 hover:scale-x-100"
                      )}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-1 right-1 h-[3px] bg-gradient-to-r from-primary to-primary/70"
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
                  "lg:hidden hover:text-primary hover:bg-metal-100",
                  pathname === '/' && !isScrolled ? "text-white" : "text-steel-900"
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
              className="lg:hidden bg-steel-900 border-t-2 border-primary overflow-hidden"
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
                            ? "text-primary bg-steel-800 border-primary"
                            : "text-white hover:text-primary hover:bg-steel-800 border-transparent hover:border-primary"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>{t(item.key)}</span>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-primary"
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
                  className="pt-4 mt-2 border-t border-steel-700"
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

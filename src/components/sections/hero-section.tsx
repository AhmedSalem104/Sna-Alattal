'use client';

import { useRef, memo, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, Factory, Cog, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Slide interface matching the database schema
interface Slide {
  id: string;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  subtitleAr: string | null;
  subtitleEn: string | null;
  subtitleTr: string | null;
  descriptionAr: string | null;
  descriptionEn: string | null;
  descriptionTr: string | null;
  image: string;
  buttonTextAr: string | null;
  buttonTextEn: string | null;
  buttonTextTr: string | null;
  buttonLink: string | null;
  isActive: boolean;
  order: number;
}

// Helper function to get localized field
function getLocalizedField(
  slide: Slide,
  field: 'title' | 'subtitle' | 'description' | 'buttonText',
  locale: string
): string {
  const localeKey = locale.charAt(0).toUpperCase() + locale.slice(1); // ar -> Ar, en -> En, tr -> Tr
  const fieldKey = `${field}${localeKey}` as keyof Slide;
  return (slide[fieldKey] as string) || '';
}

export const HeroSection = memo(function HeroSection() {
  const t = useTranslations();
  const { isRTL, locale } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Embla carousel setup with autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: isRTL ? 'rtl' : 'ltr' },
    [Autoplay({ delay: 6000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  // Update selected index when slide changes
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Fetch slides from API
  useEffect(() => {
    async function fetchSlides() {
      try {
        const response = await fetch('/api/public/slides');
        if (response.ok) {
          const data = await response.json();
          setSlides(data);
        }
      } catch (error) {
        console.error('Error fetching slides:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSlides();
  }, []);

  // Framer Motion variants
  const titleVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 1.5 + i * 0.15,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  const slideVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const stats = [
    { value: '30+', label: t('about.experience') },
    { value: '500+', label: t('about.projects') },
    { value: '300+', label: t('about.clients') },
    { value: '15+', label: t('about.countries') },
  ];

  // Show carousel if slides exist
  const hasSlides = slides.length > 0;

  // Render slide content
  const renderSlideContent = (slide: Slide) => {
    const title = getLocalizedField(slide, 'title', locale);
    const subtitle = getLocalizedField(slide, 'subtitle', locale);
    const description = getLocalizedField(slide, 'description', locale);
    const buttonText = getLocalizedField(slide, 'buttonText', locale);

    return (
      <div className="container-custom relative z-10 text-center pt-20 pb-32 min-h-screen flex flex-col items-center justify-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 uppercase tracking-wider"
        >
          {title}
        </motion.h1>

        {/* Subtitle with Industrial Divider */}
        {subtitle && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-primary" />
            <p className="text-lg sm:text-xl md:text-2xl text-primary font-semibold uppercase tracking-wider">
              {subtitle}
            </p>
            <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-primary" />
          </motion.div>
        )}

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base sm:text-lg text-metal-300 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            {description}
          </motion.p>
        )}

        {/* CTA Button */}
        {buttonText && slide.buttonLink && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button variant="industrial" size="xl" asChild className="group">
              <Link href={slide.buttonLink}>
                {buttonText}
                <ArrowRight
                  className={`${isRTL ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`}
                  size={20}
                />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    );
  };

  // Render default/fallback hero content
  const renderDefaultHero = () => (
    <motion.div
      style={{ opacity }}
      className="container-custom relative z-10 text-center pt-20 pb-32"
    >
      {/* Factory Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-2 mb-8 border-2 border-primary/30 bg-primary/10"
      >
        <Factory size={18} className="text-primary" />
        <span className="text-primary text-sm font-bold uppercase tracking-widest">
          {t('hero.badge') || '1994'}
        </span>
      </motion.div>

      {/* Logo with Industrial Frame */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-10 relative inline-block"
      >
        <div className="relative">
          <Image
            src="/images/logo.jpg"
            alt="S.N.A Al-Attal"
            width={140}
            height={140}
            className="mx-auto border-4 border-primary shadow-gold"
            priority
          />
          {/* Corner Accents */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-primary" />
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-primary" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-primary" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-primary" />
        </div>
      </motion.div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 uppercase tracking-wider">
        <motion.span
          custom={0}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="block"
        >
          {t('hero.title_line1') || 'S.N.A AL-ATTAL'}
        </motion.span>
        <motion.span
          custom={1}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="block text-primary mt-2"
        >
          {t('hero.title_line2') || 'For Engineering Industries'}
        </motion.span>
      </h1>

      {/* Subtitle with Industrial Divider */}
      <motion.div
        custom={0.8}
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-center gap-4 mb-6"
      >
        <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-primary" />
        <p className="text-lg sm:text-xl md:text-2xl text-primary font-semibold uppercase tracking-wider">
          {t('hero.subtitle')}
        </p>
        <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-primary" />
      </motion.div>

      {/* Description */}
      <motion.p
        custom={1.0}
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        className="text-base sm:text-lg text-metal-300 max-w-3xl mx-auto mb-12 leading-relaxed"
      >
        {t('hero.description')}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        custom={1.2}
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
      >
        <Button variant="industrial" size="xl" asChild className="group">
          <Link href="/products">
            {t('hero.cta')}
            <ArrowRight
              className={`${isRTL ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`}
              size={20}
            />
          </Link>
        </Button>
        <Button variant="industrialOutline" size="xl" asChild>
          <Link href="/contact">{t('hero.secondary_cta')}</Link>
        </Button>
      </motion.div>

      {/* Stats Grid - Industrial Style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={statVariants}
            initial="hidden"
            animate="visible"
            className="relative group"
          >
            <div className="bg-steel-800/80 border-2 border-steel-700 p-4 sm:p-6 transition-all duration-300 hover:border-primary hover:bg-steel-800">
              {/* Gold Accent Bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2 font-mono">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-metal-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-steel-900"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Industrial Background Pattern */}
      <div className="absolute inset-0 z-0">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 160, 10, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 160, 10, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Diagonal Lines */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              rgba(212, 160, 10, 0.1) 35px,
              rgba(212, 160, 10, 0.1) 70px
            )`,
          }}
        />
      </div>

      {/* Background Image with Parallax - for default hero or loading */}
      {(!hasSlides || isLoading) && (
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-steel-900/95 via-steel-900/80 to-steel-900 z-10" />
          <Image
            src="/images/factory-bg.jpg"
            alt="Factory Background"
            fill
            sizes="100vw"
            className="object-cover opacity-40"
            priority
          />
        </motion.div>
      )}

      {/* Animated Industrial Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Rotating Gear - Top Right */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-20 -right-20 text-primary/10"
        >
          <Cog size={300} strokeWidth={0.5} />
        </motion.div>

        {/* Rotating Gear - Bottom Left */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-32 -left-32 text-primary/5"
        >
          <Cog size={400} strokeWidth={0.5} />
        </motion.div>

        {/* Gold Accent Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      {/* Slides Carousel */}
      {hasSlides && !isLoading ? (
        <>
          <div className="absolute inset-0 z-0" ref={emblaRef}>
            <div className="flex h-full">
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="flex-[0_0_100%] min-w-0 relative"
                >
                  {/* Slide Background Image */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-steel-900/90 via-steel-900/70 to-steel-900 z-10" />
                    <Image
                      src={slide.image}
                      alt={getLocalizedField(slide, 'title', locale)}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  {/* Slide Content */}
                  {renderSlideContent(slide)}
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Navigation */}
          {slides.length > 1 && (
            <>
              {/* Arrow Navigation */}
              <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-steel-800/80 border-2 border-steel-700 text-white hover:border-primary hover:bg-steel-800 transition-all duration-300"
                aria-label="Previous slide"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-steel-800/80 border-2 border-steel-700 text-white hover:border-primary hover:bg-steel-800 transition-all duration-300"
                aria-label="Next slide"
              >
                <ChevronRight size={24} />
              </button>

              {/* Dot Navigation */}
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`w-3 h-3 border-2 transition-all duration-300 ${
                      index === selectedIndex
                        ? 'bg-primary border-primary scale-125'
                        : 'bg-transparent border-metal-500 hover:border-primary'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        /* Default Hero Content */
        renderDefaultHero()
      )}

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center"
        >
          <span className="text-xs text-metal-500 mb-2 uppercase tracking-wider">
            {t('hero.scroll') || 'Scroll'}
          </span>
          <div className="w-6 h-10 border-2 border-metal-600 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-primary"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Industrial Border */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-steel-800 z-20">
        <div className="absolute top-0 left-0 h-full w-1/4 bg-primary" />
      </div>
    </section>
  );
});

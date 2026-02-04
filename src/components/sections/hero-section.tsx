'use client';

import { useRef, memo, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Factory, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url: string | null): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Check if slide is a video slide (has YouTube link)
function isVideoSlide(slide: Slide): boolean {
  return getYouTubeVideoId(slide.buttonLink) !== null;
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
    [Autoplay({ delay: 60000, stopOnInteraction: false })]
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
          setSlides(data.filter((s: Slide) => !isVideoSlide(s)));
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

  const stats = [
    { value: '30+', label: t('about.experience') },
    { value: '500+', label: t('about.projects') },
    { value: '300+', label: t('about.clients') },
    { value: '15+', label: t('about.countries') },
  ];

  // Show carousel if slides exist
  const hasSlides = slides.length > 0;

  // Render slide content
  const renderSlideContent = (slide: Slide, isVideoSlide: boolean = false) => {
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
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg"
        >
          {title}
        </motion.h1>

        {/* Subtitle with Modern Divider */}
        {subtitle && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-primary" />
            <p className="text-lg sm:text-xl md:text-2xl text-primary font-medium drop-shadow-md">
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
            className="text-base sm:text-lg text-neutral-300 max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-md"
          >
            {description}
          </motion.p>
        )}

        {/* CTA Button - Hide for video slides since video is already playing */}
        {!isVideoSlide && buttonText && slide.buttonLink && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button size="lg" asChild className="group">
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
        className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-primary/10 backdrop-blur-sm rounded-full"
      >
        <Factory size={18} className="text-primary" />
        <span className="text-primary text-sm font-semibold">
          {t('hero.badge') || '1994'}
        </span>
      </motion.div>

      {/* Logo with Modern Frame */}
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
            className="mx-auto rounded-2xl shadow-soft-xl"
            priority
          />
          {/* Modern Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl -z-10" />
        </div>
      </motion.div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
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

      {/* Subtitle with Modern Divider */}
      <motion.div
        custom={0.8}
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-center gap-4 mb-6"
      >
        <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-primary" />
        <p className="text-lg sm:text-xl md:text-2xl text-primary font-medium">
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
        className="text-base sm:text-lg text-neutral-300 max-w-3xl mx-auto mb-12 leading-relaxed"
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
        <Button size="lg" asChild className="group">
          <Link href="/products">
            {t('hero.cta')}
            <ArrowRight
              className={`${isRTL ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`}
              size={20}
            />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild className="border-white/20 text-white hover:bg-white/10">
          <Link href="/contact">{t('hero.secondary_cta')}</Link>
        </Button>
      </motion.div>

      {/* Stats Grid - Modern Style */}
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
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:bg-white/10 border border-white/10">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-neutral-400">
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
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-steel-950 via-steel-900 to-steel-800" />
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-copper-500/10 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Slides Carousel - Always render, show loading state inside */}
      {isLoading ? (
        /* Loading state - minimal, no fallback hero */
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : hasSlides ? (
        <>
          <div className="absolute inset-0 z-0" ref={emblaRef}>
            <div className="flex h-full">
              {slides.map((slide, index) => {
                const videoId = getYouTubeVideoId(slide.buttonLink);
                const isVideo = videoId !== null;

                return (
                  <div
                    key={slide.id}
                    className="flex-[0_0_100%] min-w-0 relative"
                  >
                    {/* Slide Background - Video or Image */}
                    <div className="absolute inset-0">
                      {/* Less overlay for video slides to keep them clear */}
                      <div className={`absolute inset-0 z-10 ${isVideo ? 'bg-gradient-to-b from-steel-900/30 via-transparent to-steel-900/50' : 'bg-gradient-to-b from-steel-900/80 via-steel-900/50 to-steel-900'}`} />
                      {isVideo ? (
                        /* YouTube Video Background */
                        <div className="absolute inset-0 overflow-hidden">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=${selectedIndex === index ? 1 : 0}&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full pointer-events-none scale-150"
                            style={{ border: 'none' }}
                          />
                        </div>
                      ) : (
                        /* Image Background */
                        <Image
                          src={slide.image}
                          alt={getLocalizedField(slide, 'title', locale)}
                          fill
                          sizes="100vw"
                          className="object-cover"
                          priority
                        />
                      )}
                    </div>
                    {/* Slide Content */}
                    {renderSlideContent(slide, isVideo)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Carousel Navigation */}
          {slides.length > 1 && (
            <>
              {/* Arrow Navigation */}
              <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300"
                aria-label="Previous slide"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300"
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
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === selectedIndex
                        ? 'bg-primary w-8'
                        : 'bg-white/30 hover:bg-white/50'
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
          <span className="text-xs text-neutral-500 mb-2">
            {t('hero.scroll') || 'Scroll'}
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-neutral-600 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
});

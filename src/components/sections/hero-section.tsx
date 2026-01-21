'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ChevronDown, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title letters
      gsap.from('.hero-title span', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.05,
        ease: 'power4.out',
        delay: 0.5,
      });

      // Animate subtitle
      gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 1.2,
      });

      // Animate description
      gsap.from('.hero-description', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 1.4,
      });

      // Animate buttons
      gsap.from('.hero-buttons', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 1.6,
      });

      // Animate stats
      gsap.from('.hero-stat', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 1.8,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const titleText = t('hero.title');
  const titleWords = titleText.split(' ');

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white"
    >
      {/* Background Image with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white z-10" />
        <Image
          src="/images/logo.jpg"
          alt="Background"
          fill
          sizes="100vw"
          className="object-cover opacity-20"
          priority
        />
      </motion.div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <motion.div style={{ opacity }} className="container-custom relative z-10 text-center pt-20">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Image
            src="/images/logo.jpg"
            alt="S.N.A Al-Attal"
            width={150}
            height={150}
            className="mx-auto rounded-xl shadow-2xl shadow-primary/20"
            priority
          />
        </motion.div>

        {/* Title */}
        <h1 className="hero-title heading-1 text-gray-900 mb-6 overflow-hidden">
          {titleWords.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block mx-2 text-primary">
              {word}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle text-xl md:text-2xl text-primary/80 mb-4 font-medium">
          {t('hero.subtitle')}
        </p>

        {/* Description */}
        <p className="hero-description text-lg text-gray-700 max-w-2xl mx-auto mb-10">
          {t('hero.description')}
        </p>

        {/* CTA Buttons */}
        <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button variant="gold" size="xl" asChild className="group">
            <Link href="/products">
              {t('hero.cta')}
              <ChevronDown className="ml-2 group-hover:translate-y-1 transition-transform" size={20} />
            </Link>
          </Button>
          <Button variant="goldOutline" size="xl" asChild>
            <Link href="/contact">
              {t('hero.secondary_cta')}
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { value: '30+', label: t('about.experience') },
            { value: '500+', label: t('about.projects') },
            { value: '300+', label: t('about.clients') },
            { value: '15+', label: t('about.countries') },
          ].map((stat, index) => (
            <div key={index} className="hero-stat text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

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
          className="flex flex-col items-center text-gray-600"
        >
          <span className="text-xs mb-2">Scroll</span>
          <ChevronDown size={24} className="text-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}

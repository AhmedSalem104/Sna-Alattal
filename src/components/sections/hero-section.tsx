'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
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

  const titleText = t('hero.title');
  const titleWords = titleText.split(' ');

  // Framer Motion variants
  const titleVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5 + (i * 0.05),
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94] // power4.out equivalent
      }
    })
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.8,
        ease: 'easeOut'
      }
    })
  };

  const statVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.8 + (i * 0.1),
        duration: 0.8,
        ease: 'easeOut'
      }
    })
  };

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

        {/* Title with staggered animation */}
        <h1 className="heading-1 text-gray-900 mb-6 overflow-hidden">
          {titleWords.map((word, wordIndex) => (
            <motion.span
              key={wordIndex}
              custom={wordIndex}
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              className="inline-block mx-2 text-primary"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          custom={1.2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="text-xl md:text-2xl text-primary/80 mb-4 font-medium"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Description */}
        <motion.p
          custom={1.4}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="text-lg text-gray-700 max-w-2xl mx-auto mb-10"
        >
          {t('hero.description')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={1.6}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
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
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { value: '30+', label: t('about.experience') },
            { value: '500+', label: t('about.projects') },
            { value: '300+', label: t('about.clients') },
            { value: '15+', label: t('about.countries') },
          ].map((stat, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={statVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
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

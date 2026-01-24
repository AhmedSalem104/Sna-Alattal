'use client';

import { useRef, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Factory, Globe, Users, Award, Cog, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';

const features = [
  { icon: Factory, labelKey: 'about.features.manufacturing' },
  { icon: Globe, labelKey: 'about.features.global' },
  { icon: Users, labelKey: 'about.features.team' },
  { icon: Award, labelKey: 'about.features.quality' },
];

const highlights = [
  { icon: Target, value: '100%', labelKey: 'about.highlights.quality' },
  { icon: Cog, value: '50+', labelKey: 'about.highlights.machines' },
];

export const AboutSection = memo(function AboutSection() {
  const t = useTranslations();
  const { isRTL } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-white relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Industrial Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(26, 26, 46, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(26, 26, 46, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-1 h-32 bg-primary" />
      <div className="absolute bottom-0 right-0 w-1 h-32 bg-primary" />

      <div className="container-custom relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Image Side */}
          <motion.div variants={itemVariants} className="relative">
            {/* Main Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden border-4 border-steel-900">
                <Image
                  src="/images/factory-about.jpg"
                  alt="About S.N.A Al-Attal"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-steel-900/40 to-transparent" />
              </div>

              {/* Corner Accents */}
              <div className="absolute -top-3 -left-3 w-12 h-12 border-t-4 border-l-4 border-primary" />
              <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-4 border-r-4 border-primary" />

              {/* Floating Stats */}
              <div className="absolute -bottom-6 left-4 right-4 md:left-6 md:right-6 flex gap-4">
                {highlights.map((item, index) => (
                  <motion.div
                    key={item.labelKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex-1 bg-steel-900 border-2 border-steel-700 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary flex items-center justify-center">
                        <item.icon size={20} className="text-steel-900" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary font-mono">
                          {item.value}
                        </div>
                        <div className="text-xs text-metal-400 uppercase tracking-wider">
                          {t(item.labelKey) || item.labelKey.split('.').pop()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Experience Badge - Repositioned */}
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-primary p-4 md:p-6 shadow-offset z-10"
            >
              <div className="text-3xl md:text-4xl font-bold text-steel-900 font-mono">
                30+
              </div>
              <div className="text-xs md:text-sm font-bold text-steel-800 uppercase tracking-wider">
                {t('about.experience')}
              </div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div variants={itemVariants} className="space-y-6 lg:space-y-8">
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 border-2 border-primary/30 bg-primary/5 px-4 py-2">
              <Factory size={16} className="text-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                {t('about.title')}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 uppercase tracking-wide leading-tight">
              {t('about.subtitle')}
            </h2>

            {/* Gold Divider */}
            <div className="flex items-center gap-4">
              <div className="h-1 w-16 bg-primary" />
              <div className="h-1 w-8 bg-primary/50" />
              <div className="h-1 w-4 bg-primary/25" />
            </div>

            {/* Description */}
            <p className="text-metal-600 leading-relaxed text-base md:text-lg">
              {t('about.description')}
            </p>

            {/* Features Grid - Industrial Style */}
            <div className="grid grid-cols-2 gap-4 py-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.labelKey}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={
                    isInView
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: isRTL ? 20 : -20 }
                  }
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-metal-50 border-l-4 border-primary hover:bg-metal-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-steel-900 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <feature.icon
                      size={20}
                      className="text-primary group-hover:text-steel-900 transition-colors"
                    />
                  </div>
                  <span className="text-sm font-semibold text-steel-800 uppercase tracking-wider">
                    {t(feature.labelKey)}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="industrial" size="lg" asChild className="group">
                <Link href="/about">
                  {t('about.learnMore')}
                  <ArrowRight
                    className={`${isRTL ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`}
                    size={18}
                  />
                </Link>
              </Button>
              <Button variant="industrialOutline" size="lg" asChild>
                <Link href="/contact">{t('about.contactUs') || t('nav.contact')}</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

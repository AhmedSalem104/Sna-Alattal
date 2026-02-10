'use client';

import { useRef, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Factory, Globe, Users, Award, Settings, Target } from 'lucide-react';
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
  { icon: Settings, value: '50+', labelKey: 'about.highlights.machines' },
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
      {/* Modern Subtle Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-copper-500/5 rounded-full blur-3xl" />
      </div>

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
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft-xl">
                <Image
                  src="/images/about/factory.jpg"
                  alt="About S.N.A Al-Attal"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-steel-900/30 to-transparent" />
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-6 left-4 right-4 md:left-6 md:right-6 flex gap-4">
                {highlights.map((item, index) => (
                  <motion.div
                    key={item.labelKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex-1 bg-white rounded-xl shadow-soft-lg p-4 border border-neutral-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <item.icon size={20} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-steel-900">
                          {item.value}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {t(item.labelKey) || item.labelKey.split('.').pop()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Experience Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-gradient-to-br from-primary to-primary-600 rounded-2xl p-4 md:p-6 shadow-soft-xl z-10"
            >
              <div className="text-3xl md:text-4xl font-bold text-white">
                30+
              </div>
              <div className="text-xs md:text-sm font-medium text-white/90">
                {t('about.experience')}
              </div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div variants={itemVariants} className="space-y-6 lg:space-y-8">
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
              <Factory size={16} />
              <span className="text-sm font-semibold">
                {t('about.title')}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 tracking-tight leading-tight">
              {t('about.subtitle')}
            </h2>

            {/* Modern Divider */}
            <div className="flex items-center gap-2">
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
            </div>

            {/* Description */}
            <p className="text-neutral-600 leading-relaxed text-base md:text-lg">
              {t('about.description')}
            </p>

            {/* Features Grid - Modern Style */}
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
                  className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl hover:bg-primary/5 transition-colors group"
                >
                  <div className="w-10 h-10 bg-white rounded-lg shadow-soft flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <feature.icon
                      size={20}
                      className="text-primary"
                    />
                  </div>
                  <span className="text-sm font-medium text-steel-800">
                    {t(feature.labelKey)}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" asChild className="group">
                <Link href="/about">
                  {t('about.learnMore')}
                  <ArrowRight
                    className={`${isRTL ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`}
                    size={18}
                  />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">{t('about.contactUs') || t('nav.contact')}</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

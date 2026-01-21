'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle, Factory, Globe, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Factory, labelKey: 'about.features.manufacturing' },
  { icon: Globe, labelKey: 'about.features.global' },
  { icon: Users, labelKey: 'about.features.team' },
  { icon: Award, labelKey: 'about.features.quality' },
];

export function AboutSection() {
  const t = useTranslations();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section ref={ref} className="section-padding bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_#F9BF0F_0%,_transparent_50%)]" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Image Side */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/logo.jpg"
                alt="About S.N.A Al-Attal"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
            </div>

            {/* Experience Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute -bottom-6 -right-6 bg-primary text-gray-900 p-6 rounded-2xl shadow-xl"
            >
              <div className="text-4xl font-bold">30+</div>
              <div className="text-sm font-medium">{t('about.experience')}</div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-primary rounded-full" />
              {t('about.title')}
            </div>

            {/* Title */}
            <h2 className="heading-2 text-gray-900">
              {t('about.subtitle')}
            </h2>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {t('about.description')}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 py-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.labelKey}
                  variants={itemVariants}
                  className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon size={20} className="text-primary" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {t(feature.labelKey)}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <Button variant="gold" size="lg" asChild className="group">
              <Link href="/about">
                {t('about.learnMore')}
                <ArrowRight className="mr-2 rtl:rotate-180 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

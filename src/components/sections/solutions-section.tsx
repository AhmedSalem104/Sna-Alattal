'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Utensils, Pill, Sparkles, FlaskConical, Lightbulb, Cog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';

const solutions = [
  {
    id: 'food-beverages',
    icon: Utensils,
    titleAr: 'الأغذية والمشروبات',
    titleEn: 'Food & Beverages',
    descAr: 'حلول متكاملة لصناعة الأغذية والمشروبات',
    descEn: 'Complete solutions for food & beverage industry',
    accentColor: 'bg-orange-500',
  },
  {
    id: 'pharmaceuticals',
    icon: Pill,
    titleAr: 'الأدوية',
    titleEn: 'Pharmaceuticals',
    descAr: 'حلول متكاملة لصناعة الأدوية',
    descEn: 'Complete solutions for pharmaceutical industry',
    accentColor: 'bg-blue-500',
  },
  {
    id: 'cosmetics',
    icon: Sparkles,
    titleAr: 'مستحضرات التجميل',
    titleEn: 'Cosmetics',
    descAr: 'حلول متكاملة لصناعة مستحضرات التجميل',
    descEn: 'Complete solutions for cosmetics industry',
    accentColor: 'bg-pink-500',
  },
  {
    id: 'chemicals',
    icon: FlaskConical,
    titleAr: 'الكيماويات',
    titleEn: 'Chemicals',
    descAr: 'حلول متكاملة للصناعات الكيماوية',
    descEn: 'Complete solutions for chemical industry',
    accentColor: 'bg-green-500',
  },
];

export function SolutionsSection() {
  const t = useTranslations();
  const { isRTL } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-steel-900 relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Industrial Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 160, 10, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 160, 10, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Decorative Gear */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-32 -right-32 text-primary/5"
        >
          <Cog size={350} strokeWidth={0.5} />
        </motion.div>
      </div>

      {/* Top Gold Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          {/* Section Tag */}
          <div className="inline-flex items-center gap-2 border-2 border-primary/30 bg-primary/10 px-4 py-2 mb-6">
            <Lightbulb size={16} className="text-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              {t('solutions.title')}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wide mb-4">
            {t('solutions.subtitle')}
          </h2>

          {/* Gold Divider */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-1 w-8 bg-primary/25" />
            <div className="h-1 w-16 bg-primary/50" />
            <div className="h-1 w-24 bg-primary" />
            <div className="h-1 w-16 bg-primary/50" />
            <div className="h-1 w-8 bg-primary/25" />
          </div>

          <p className="text-metal-300 text-lg">{t('solutions.description')}</p>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/solutions/${solution.id}`}>
                <div className="group relative bg-steel-800 border-2 border-steel-700 p-6 h-full hover:border-primary transition-all duration-300 overflow-hidden">
                  {/* Accent Color Bar */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${solution.accentColor}`} />

                  {/* Gold Bar on Hover */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                  {/* Icon */}
                  <div className="w-16 h-16 bg-steel-700 border border-steel-600 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <solution.icon
                      size={32}
                      className="text-primary group-hover:text-steel-900 transition-colors duration-300"
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-3 group-hover:text-primary transition-colors">
                    {isRTL ? solution.titleAr : solution.titleEn}
                  </h3>
                  <p className="text-metal-400 text-sm mb-6">
                    {isRTL ? solution.descAr : solution.descEn}
                  </p>

                  {/* Link */}
                  <div className="flex items-center text-primary text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{t('solutions.learnMore') || 'Learn More'}</span>
                    <ArrowRight
                      className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`}
                      size={16}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Button variant="industrial" size="lg" asChild className="group">
            <Link href="/solutions">
              {t('solutions.viewAll') || 'View All Solutions'}
              <ArrowRight
                className={`${isRTL ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`}
                size={18}
              />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

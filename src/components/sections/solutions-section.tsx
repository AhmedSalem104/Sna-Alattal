'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Lightbulb, Loader2, Beaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';

interface Solution {
  id: string;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  slug: string;
  shortDescAr: string;
  shortDescEn: string;
  shortDescTr: string;
  icon: string;
  image: string | null;
  isFeatured: boolean;
}

export function SolutionsSection() {
  const t = useTranslations();
  const { locale, isRTL } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await fetch('/api/public/solutions?limit=4');
        if (response.ok) {
          const data = await response.json();
          setSolutions(Array.isArray(data) ? data : data.solutions || []);
        }
      } catch (error) {
        console.error('Error fetching solutions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  const getTitle = (solution: Solution) => {
    if (locale === 'ar') return solution.titleAr;
    if (locale === 'tr') return solution.titleTr;
    return solution.titleEn;
  };

  const getDescription = (solution: Solution) => {
    if (locale === 'ar') return solution.shortDescAr;
    if (locale === 'tr') return solution.shortDescTr;
    return solution.shortDescEn;
  };

  const accentColors = [
    'from-orange-500 to-orange-600',
    'from-blue-500 to-blue-600',
    'from-pink-500 to-pink-600',
    'from-green-500 to-green-600',
  ];

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-gradient-to-b from-steel-900 to-steel-950 relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl -translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-copper-500/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          {/* Section Tag */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Lightbulb size={16} />
            <span className="text-sm font-semibold">
              {t('solutions.title')}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            {t('solutions.subtitle')}
          </h2>

          {/* Modern Divider */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
          </div>

          <p className="text-neutral-300 text-lg">{t('solutions.description')}</p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!loading && solutions.length === 0 && (
          <div className="text-center py-20">
            <Beaker className="h-16 w-16 text-neutral-500 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg">
              {locale === 'ar' ? 'لا توجد حلول متاحة حالياً' : locale === 'tr' ? 'Şu anda mevcut çözüm yok' : 'No solutions available at the moment'}
            </p>
          </div>
        )}

        {/* Solutions Grid */}
        {!loading && solutions.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/solutions/${solution.slug}`}>
                  <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 h-full hover:bg-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                    {/* Gradient Accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentColors[index % accentColors.length]} rounded-t-2xl`} />

                    {/* Icon */}
                    <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300">
                      {solution.icon ? (
                        <span className="text-3xl">{solution.icon}</span>
                      ) : (
                        <Beaker
                          size={28}
                          className="text-primary"
                        />
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary transition-colors">
                      {getTitle(solution)}
                    </h3>
                    <p className="text-neutral-400 text-sm mb-6 line-clamp-3">
                      {getDescription(solution)}
                    </p>

                    {/* Link */}
                    <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>{t('solutions.learnMore') || 'Learn More'}</span>
                      <ArrowRight
                        className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} transition-transform group-hover:translate-x-1`}
                        size={16}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Button size="lg" asChild className="group">
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

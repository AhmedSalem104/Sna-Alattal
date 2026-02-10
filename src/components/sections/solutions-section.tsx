'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
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

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Subtle Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-copper-500/5 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Lightbulb size={16} />
            <span className="text-sm font-semibold">
              {t('solutions.title')}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 tracking-tight mb-4">
            {t('solutions.subtitle')}
          </h2>

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
          </div>

          <p className="text-neutral-600 text-lg">{t('solutions.description')}</p>
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
            <Beaker className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg">
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
                  <div className="group relative bg-white rounded-2xl border border-gray-200 h-full hover:border-primary/40 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    {/* Image */}
                    <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                      {solution.image ? (
                        <Image
                          src={solution.image}
                          alt={getTitle(solution)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-primary/5">
                          {solution.icon ? (
                            <span className="text-5xl">{solution.icon}</span>
                          ) : (
                            <Beaker size={48} className="text-primary/40" />
                          )}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {solution.icon && (
                        <span className="text-2xl mb-2 block">{solution.icon}</span>
                      )}
                      <h3 className="text-lg font-semibold text-steel-900 mb-2 group-hover:text-primary transition-colors">
                        {getTitle(solution)}
                      </h3>
                      <p className="text-neutral-500 text-sm mb-4 line-clamp-2">
                        {getDescription(solution)}
                      </p>

                      <div className="flex items-center text-primary text-sm font-medium">
                        <span>{t('solutions.learnMore') || 'Learn More'}</span>
                        <ArrowRight
                          className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} transition-transform group-hover:translate-x-1`}
                          size={16}
                        />
                      </div>
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

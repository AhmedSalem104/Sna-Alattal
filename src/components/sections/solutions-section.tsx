'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Lightbulb, Loader2, Beaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';

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
      className="py-20 lg:py-28 bg-white relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Industrial grid background */}
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

      {/* Top gold accent lines */}
      <div className="absolute top-0 left-0 w-24 h-1 bg-primary" />
      <div className="absolute top-0 right-0 w-24 h-1 bg-primary" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 border-2 border-primary/30 bg-primary/5 px-4 py-2 mb-6">
            <Lightbulb size={16} className="text-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              {t('solutions.title')}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 uppercase tracking-wide mb-4">
            {t('solutions.subtitle')}
          </h2>

          {/* Industrial divider */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-1 w-8 bg-primary/25" />
            <div className="h-1 w-16 bg-primary/50" />
            <div className="h-1 w-24 bg-primary" />
            <div className="h-1 w-16 bg-primary/50" />
            <div className="h-1 w-8 bg-primary/25" />
          </div>

          <p className="text-metal-600 text-lg">{t('solutions.description')}</p>
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
            <Beaker className="h-16 w-16 text-metal-400 mx-auto mb-4" />
            <p className="text-metal-500 text-lg">
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
                transition={{ duration: 0.6, delay: index * 0.12 }}
              >
                <Link href={`/solutions/${solution.slug}`}>
                  <div className="group relative bg-white border-2 border-metal-200 h-full hover:border-primary transition-all duration-300 overflow-hidden hover:-translate-y-1 shadow-industrial-sm hover:shadow-industrial">
                    {/* Top gold accent line */}
                    <div className="h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                    {/* Image */}
                    <div className="relative w-full h-48 bg-metal-50 overflow-hidden">
                      {solution.image ? (
                        <Image
                          src={solution.image}
                          alt={getTitle(solution)}
                          fill
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-metal-50">
                          {solution.icon ? (
                            <span className="text-5xl">{solution.icon}</span>
                          ) : (
                            <Beaker size={48} className="text-primary/40" />
                          )}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-steel-900/5 group-hover:bg-steel-900/0 transition-colors duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-5 border-t border-metal-200">
                      {solution.icon && (
                        <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-all duration-300">
                          <span className="text-xl">{solution.icon}</span>
                        </div>
                      )}
                      <h3 className="text-base font-bold text-steel-900 uppercase tracking-wide mb-2 group-hover:text-primary transition-colors">
                        {getTitle(solution)}
                      </h3>
                      <p className="text-metal-500 text-sm mb-4 line-clamp-2">
                        {getDescription(solution)}
                      </p>

                      <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                        <span>{t('solutions.learnMore') || 'Learn More'}</span>
                        <ArrowRight size={14} className={cn(isRTL && "rotate-180")} />
                      </div>
                    </div>

                    {/* Left gold accent bar on hover */}
                    <div className={cn(
                      "absolute top-0 w-1 h-full bg-primary z-10 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300",
                      isRTL ? "right-0" : "left-0"
                    )} />
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

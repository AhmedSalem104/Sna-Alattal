'use client';

import { useRef, useState, useEffect } from 'react';
import { ImageWithSkeleton } from '@/components/ui/image-with-skeleton';
import { TiltCard } from '@/components/ui/tilt-card';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView, type Variants } from 'framer-motion';
import { ArrowRight, Lightbulb, Beaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IndustrialSpinner } from '@/components/ui/industrial-spinner';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';
import { IndustrialGear } from '@/components/decorative';

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
      className="py-20 lg:py-28 bg-white/[0.93] relative overflow-hidden"
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
        <IndustrialGear size={400} teeth={16} className="absolute -top-12 -left-12 text-primary opacity-[0.20] hidden md:block" reverse strokeWidth={2} />
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
            <div className="h-1 w-32 bg-primary" />
            <div className="h-1 w-16 bg-primary/50" />
            <div className="h-1 w-8 bg-primary/25" />
          </div>

          <p className="text-metal-600 text-lg">{t('solutions.description')}</p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <IndustrialSpinner size="lg" />
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
          <div className="grid md:grid-cols-2 gap-6">
            {solutions.map((solution, index) => {
              const fromLeft = index % 2 === 0;
              return (
              <motion.div
                key={solution.id}
                initial={{ opacity: 0, x: fromLeft ? -40 : 40, y: 20 }}
                animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard className="h-full">
                <Link href={`/solutions/${solution.slug}`} className="block h-full">
                  <div className="group relative h-full min-h-[280px] overflow-hidden bg-steel-900">
                    {/* Full-bleed background image */}
                    {solution.image ? (
                      <ImageWithSkeleton
                        src={solution.image}
                        alt={getTitle(solution)}
                        fill
                        className="object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                        wrapperClassName="absolute inset-0"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-steel-800 to-steel-900" />
                    )}

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-steel-950 via-steel-900/60 to-transparent" />

                    {/* Gold top border that expands on hover */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10" />

                    {/* Icon badge - top corner */}
                    {solution.icon && (
                      <div className="absolute top-5 right-5 z-10">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-500">
                          <span className="text-2xl">{solution.icon}</span>
                        </div>
                      </div>
                    )}

                    {/* Content overlay - bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-wide mb-2 group-hover:text-primary transition-colors duration-300">
                        {getTitle(solution)}
                      </h3>
                      <p className="text-neutral-300 text-sm mb-4 line-clamp-2 group-hover:text-neutral-200 transition-colors">
                        {getDescription(solution)}
                      </p>

                      {/* CTA link */}
                      <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                        <span>{t('solutions.learnMore') || 'Learn More'}</span>
                        <ArrowRight size={14} className={cn(isRTL && "rotate-180", "group-hover:translate-x-1 transition-transform")} />
                      </div>
                    </div>

                    {/* Side accent bar */}
                    <div className={cn(
                      "absolute top-0 w-1 h-full bg-primary z-10 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500",
                      isRTL ? "right-0" : "left-0"
                    )} />
                  </div>
                </Link>
                </TiltCard>
              </motion.div>
              );
            })}
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

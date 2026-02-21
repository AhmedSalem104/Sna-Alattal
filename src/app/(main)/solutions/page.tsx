'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Factory, Beaker, Sparkles, FlaskConical, Loader2, Lightbulb, Cog, Zap, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';
import { getLocalizedField } from '@/lib/locale-helpers';


interface Solution {
  id: string;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  slug: string;
  descriptionAr?: string;
  descriptionEn?: string;
  descriptionTr?: string;
  shortDescAr?: string;
  shortDescEn?: string;
  shortDescTr?: string;
  icon?: string;
  image?: string;
  features?: string[];
  industries?: string[];
}

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  factory: Factory,
  beaker: Beaker,
  sparkles: Sparkles,
  flask: FlaskConical,
  'flask-conical': FlaskConical,
  lightbulb: Lightbulb,
  cog: Cog,
  zap: Zap,
};

const colorGradients = [
  'from-orange-500/20',
  'from-blue-500/20',
  'from-pink-500/20',
  'from-green-500/20',
  'from-purple-500/20',
  'from-cyan-500/20',
];

export default function SolutionsPage() {
  const t = useTranslations('solutionsPage');
  const { locale, isRTL } = useLocale();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSolutions() {
      try {
        const res = await fetch('/api/public/solutions');
        if (res.ok) {
          const data = await res.json();
          setSolutions(data);
        }
      } catch (error) {
        console.error('Error fetching solutions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSolutions();
  }, []);

  const getTitle = (item: Solution) => getLocalizedField(item, 'title', locale);
  const getDescription = (item: Solution) => getLocalizedField(item, 'description', locale);
  const getShortDesc = (item: Solution) => getLocalizedField(item, 'shortDesc', locale);

  const getSolutionImage = (solution: Solution) => {
    return solution.image || '/images/placeholders/solution.svg';
  };

  const getIconComponent = (iconName?: string): LucideIcon => {
    if (!iconName) return Factory;
    const normalizedName = iconName.toLowerCase().replace(/\s+/g, '-');
    return iconMap[normalizedName] || Factory;
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-b from-primary/20 via-white to-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1 bg-primary/20 text-primary rounded-full text-sm mb-4">
              {t('badge')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-neutral-700">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions List */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {solutions.length === 0 ? (
            <div className="text-center py-20">
              <Lightbulb size={48} className="mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-600 text-xl">{t('noSolutions') || 'No solutions available'}</p>
            </div>
          ) : (
            <div className="space-y-20">
              {solutions.map((solution, index) => {
                const IconComponent = getIconComponent(solution.icon);
                const colorGradient = colorGradients[index % colorGradients.length];

                return (
                  <motion.div
                    key={solution.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                      index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Image */}
                    <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${colorGradient} to-transparent rounded-3xl blur-3xl opacity-50`} />
                      <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
                        <Image
                          src={getSolutionImage(solution)}
                          alt={getTitle(solution)}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-4">
                        <IconComponent className="text-primary" size={20} />
                        <span className="text-primary font-medium">{t('industrySolution')}</span>
                      </div>

                      <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                        {getTitle(solution)}
                      </h2>

                      <p className="text-neutral-700 text-lg mb-6">
                        {getShortDesc(solution) || getDescription(solution)}
                      </p>

                      {/* Features */}
                      {solution.features && solution.features.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          {solution.features.slice(0, 4).map((feature, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="p-1 bg-primary/20 rounded-full">
                                <Check className="text-primary" size={14} />
                              </div>
                              <span className="text-neutral-700 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Industries */}
                      {solution.industries && solution.industries.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {solution.industries.map((industry, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-neutral-100 border border-neutral-200 rounded-full text-neutral-600 text-sm"
                            >
                              {industry}
                            </span>
                          ))}
                        </div>
                      )}

                      <Link href={`/solutions/${solution.slug}`}>
                        <Button variant="gold" size="lg">
                          {t('learnMore')}
                          <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} size={18} />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              {t('whyChoose.title')}
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              {t('whyChoose.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '30+', label: t('stats.years') },
              { number: '500+', label: t('stats.projects') },
              { number: '300+', label: t('stats.clients') },
              { number: '15+', label: t('stats.countries') },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-white rounded-2xl border border-neutral-200"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-neutral-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/20 via-white to-primary/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-neutral-700 mb-8 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <Link href="/contact">
              <Button variant="gold" size="xl">
                {t('cta.button')}
                <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronLeft, Phone, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';

interface SolutionDetailPageProps {
  params: Promise<{ slug: string }>;
}

interface Solution {
  id: string;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  slug: string;
  icon: string | null;
  image: string | null;
  features: string[] | null;
  products: {
    product: {
      id: string;
      nameAr: string;
      nameEn: string;
      nameTr: string;
      slug: string;
      image: string;
      descriptionAr: string;
      descriptionEn: string;
      descriptionTr: string;
    };
  }[];
  relatedSolutions: {
    id: string;
    titleAr: string;
    titleEn: string;
    titleTr: string;
    slug: string;
    icon: string | null;
  }[];
}

export default function SolutionDetailPage({ params }: SolutionDetailPageProps) {
  const { slug } = use(params);
  const t = useTranslations('solutionDetail');
  const { locale } = useLocale();
  const [solution, setSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/public/solutions/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('notFound');
          } else {
            setError('fetchError');
          }
          return;
        }
        const data = await response.json();
        setSolution(data);
      } catch (err) {
        console.error('Error fetching solution:', err);
        setError('fetchError');
      } finally {
        setLoading(false);
      }
    };

    fetchSolution();
  }, [slug]);

  const getTitle = (item: { titleAr: string; titleEn: string; titleTr: string }) => {
    switch (locale) {
      case 'ar': return item.titleAr;
      case 'tr': return item.titleTr;
      default: return item.titleEn;
    }
  };

  const getName = (item: { nameAr: string; nameEn: string; nameTr: string }) => {
    switch (locale) {
      case 'ar': return item.nameAr;
      case 'tr': return item.nameTr;
      default: return item.nameEn;
    }
  };

  const getDescription = (item: { descriptionAr: string; descriptionEn: string; descriptionTr: string }) => {
    switch (locale) {
      case 'ar': return item.descriptionAr;
      case 'tr': return item.descriptionTr;
      default: return item.descriptionEn;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-neutral-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !solution) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            {error === 'notFound' ? t('errors.notFound') : t('errors.fetchError')}
          </h1>
          <p className="text-neutral-600 mb-6">
            {error === 'notFound' ? t('errors.notFoundDesc') : t('errors.fetchErrorDesc')}
          </p>
          <Link href="/solutions">
            <Button variant="gold">{t('backToSolutions')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const features = solution.features || [];
  const products = solution.products || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-neutral-600 hover:text-primary transition-colors">
              {t('breadcrumb.home')}
            </Link>
            <ChevronLeft size={16} className="text-neutral-600 rtl:rotate-180" />
            <Link href="/solutions" className="text-neutral-600 hover:text-primary transition-colors">
              {t('breadcrumb.solutions')}
            </Link>
            <ChevronLeft size={16} className="text-neutral-600 rtl:rotate-180" />
            <span className="text-primary">{getTitle(solution)}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        {solution.image && (
          <div className="absolute inset-0">
            <Image
              src={solution.image}
              alt={getTitle(solution)}
              fill
              sizes="100vw"
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white" />
          </div>
        )}

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            {solution.icon && (
              <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">{solution.icon}</span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
              {getTitle(solution)}
            </h1>
            <p className="text-xl text-neutral-700 mb-8">
              {getDescription(solution)}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <Button variant="gold" size="lg">
                  <Phone size={18} className="ml-2" />
                  {t('getQuote')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      {features.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                {t('keyFeatures')}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-neutral-50 rounded-xl p-6 border border-neutral-200"
                >
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-primary font-bold">{index + 1}</span>
                  </div>
                  <p className="text-neutral-700">{feature}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {products.length > 0 && (
        <section className="py-20 bg-neutral-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                {t('relatedProducts')}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(({ product }, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/products/${product.slug}`}>
                    <div className="group bg-white rounded-xl overflow-hidden border border-neutral-200 hover:border-primary/50 hover:shadow-lg transition-all">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={product.image || '/images/placeholders/product.svg'}
                          alt={getName(product)}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary transition-colors">
                          {getName(product)}
                        </h3>
                        <p className="text-neutral-600 text-sm mt-2 line-clamp-2">
                          {getDescription(product)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Solutions */}
      {solution.relatedSolutions && solution.relatedSolutions.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">{t('otherSolutions')}</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {solution.relatedSolutions.map((related, index) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/solutions/${related.slug}`}>
                    <div className="group bg-neutral-50 rounded-xl p-6 border border-neutral-200 hover:border-primary/50 hover:shadow-lg transition-all text-center">
                      {related.icon && (
                        <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">{related.icon}</span>
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary transition-colors">
                        {getTitle(related)}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
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
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="gold" size="xl">
                  <Mail size={20} className="ml-2" />
                  {t('cta.contact')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

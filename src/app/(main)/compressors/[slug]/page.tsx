'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Check,
  Phone,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  Wind,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';
import { getLocalizedField } from '@/lib/locale-helpers';
import { getCompressorBySlug } from '@/lib/static-data';

interface CompressorDetailPageProps {
  params: Promise<{ slug: string }>;
}

interface Compressor {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  shortDescAr: string;
  shortDescEn: string;
  shortDescTr: string;
  image: string;
  features: string[];
  featuresAr: string[];
  featuresTr: string[];
  specifications: Record<string, string>;
  models: Array<Record<string, string>>;
  order: number;
  relatedCompressors?: Array<{
    id: string;
    slug: string;
    nameAr: string;
    nameEn: string;
    nameTr: string;
    shortDescAr: string;
    shortDescEn: string;
    shortDescTr: string;
    image: string;
  }>;
}

export default function CompressorDetailPage({ params }: CompressorDetailPageProps) {
  const { slug } = use(params);
  const t = useTranslations('compressors');
  const { locale, isRTL } = useLocale();
  const [compressor] = useState<Compressor | null>(() => getCompressorBySlug(slug) as unknown as Compressor | null);
  const error = compressor ? null : 'notFound';

  if (!compressor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            {error === 'notFound' ? t('errors.notFound') : t('errors.fetchError')}
          </h2>
          <p className="text-neutral-600 mb-6">
            {error === 'notFound' ? t('errors.notFoundDesc') : t('errors.fetchErrorDesc')}
          </p>
          <Link href="/compressors">
            <Button variant="gold">
              {isRTL ? <ChevronRight size={18} className="mr-1" /> : <ChevronLeft size={18} className="mr-1" />}
              {t('backToList')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getName = (item: Record<string, unknown>) => getLocalizedField(item, 'name', locale);
  const getDesc = (item: Record<string, unknown>) => getLocalizedField(item, 'description', locale);
  const getShortDesc = (item: Record<string, unknown>) => getLocalizedField(item, 'shortDesc', locale);

  const getFeatures = (): string[] => {
    if (locale === 'ar' && compressor.featuresAr?.length) return compressor.featuresAr;
    if (locale === 'tr' && compressor.featuresTr?.length) return compressor.featuresTr;
    return compressor.features || [];
  };

  const modelKeys = compressor.models.length > 0 ? Object.keys(compressor.models[0]) : [];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Link href="/" className="hover:text-primary transition-colors">
              {t('breadcrumb.home')}
            </Link>
            <span>/</span>
            <Link href="/compressors" className="hover:text-primary transition-colors">
              {t('title')}
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">{getName(compressor)}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] rounded-lg overflow-hidden border border-neutral-200"
            >
              <Image
                src={compressor.image}
                alt={getName(compressor)}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm mb-4">
                <Wind size={14} />
                {t('title')}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                {getName(compressor)}
              </h1>

              <p className="text-lg text-neutral-700 mb-8 leading-relaxed">
                {getDesc(compressor)}
              </p>

              {/* Key Specs */}
              {compressor.specifications && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {Object.entries(compressor.specifications).map(([key, value]) => (
                    <div key={key} className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{key}</p>
                      <p className="text-sm font-semibold text-neutral-900">{value}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button variant="gold" size="lg">
                    <Phone size={18} className={isRTL ? 'ml-2' : 'mr-2'} />
                    {t('requestQuote')}
                  </Button>
                </Link>
                <Link href="/compressors">
                  <Button variant="outline" size="lg">
                    {isRTL ? <ChevronRight size={18} className="ml-1" /> : <ChevronLeft size={18} className="mr-1" />}
                    {t('backToList')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 md:py-14 bg-neutral-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8">
              {t('features')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFeatures().map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-4 bg-white rounded-lg border border-neutral-200"
                >
                  <Check size={20} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-neutral-700">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Specifications Table */}
      {compressor.specifications && (
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8">
                {t('specifications')}
              </h2>
              <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {Object.entries(compressor.specifications).map(([key, value], index) => (
                      <tr key={key} className={index % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}>
                        <td className="px-6 py-4 text-sm font-semibold text-neutral-900 uppercase tracking-wider w-1/3 border-b border-neutral-100">
                          {key}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-700 border-b border-neutral-100">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Models Table */}
      {compressor.models.length > 0 && (
        <section className="py-10 md:py-14 bg-neutral-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8">
                {t('models')} ({compressor.models.length})
              </h2>
              <div className="bg-white rounded-lg border border-neutral-200 overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="bg-primary/5 border-b-2 border-primary/20">
                      {modelKeys.map((key) => (
                        <th
                          key={key}
                          className="px-4 py-3 text-xs font-bold text-neutral-900 uppercase tracking-wider text-start"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compressor.models.map((model, index) => (
                      <tr
                        key={index}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary/5 transition-colors`}
                      >
                        {modelKeys.map((key) => (
                          <td
                            key={key}
                            className="px-4 py-3 text-sm text-neutral-700 border-b border-neutral-100 whitespace-nowrap"
                          >
                            {key === 'model' ? (
                              <span className="font-semibold text-neutral-900">{model[key]}</span>
                            ) : (
                              model[key]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Related Compressors */}
      {compressor.relatedCompressors && compressor.relatedCompressors.length > 0 && (
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8">
              {t('relatedCompressors')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {compressor.relatedCompressors.map((related) => (
                <Link key={related.id} href={`/compressors/${related.slug}`}>
                  <div className="group border border-neutral-200 hover:border-primary/60 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={related.image}
                        alt={getLocalizedField(related, 'name', locale)}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-neutral-900 group-hover:text-primary transition-colors mb-1">
                        {getLocalizedField(related, 'name', locale)}
                      </h3>
                      <p className="text-sm text-neutral-600 line-clamp-2">
                        {getLocalizedField(related, 'shortDesc', locale)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
                {t('requestQuote')}
                <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

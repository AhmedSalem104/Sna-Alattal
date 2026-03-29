'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Wind, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';
import { getLocalizedField } from '@/lib/locale-helpers';

interface Compressor {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  shortDescAr: string;
  shortDescEn: string;
  shortDescTr: string;
  image: string;
  specifications: Record<string, string>;
  models: Array<Record<string, string>>;
  order: number;
}

export default function CompressorsPage() {
  const t = useTranslations('compressors');
  const { locale, isRTL } = useLocale();
  const [compressors, setCompressors] = useState<Compressor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/public/compressors');
        if (res.ok) {
          const data = await res.json();
          setCompressors(data);
        }
      } catch (error) {
        console.error('Error fetching compressors:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getName = (item: Compressor) => getLocalizedField(item, 'name', locale);
  const getShortDesc = (item: Compressor) => getLocalizedField(item, 'shortDesc', locale);

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
              <Wind size={16} className="inline-block mr-1 mb-0.5" />
              {t('title')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
              {t('subtitle')}
            </h1>
            <p className="text-xl text-neutral-700">
              {t('description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Compressors Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : compressors.length === 0 ? (
            <div className="text-center py-20">
              <Wind size={48} className="mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-600 text-xl">{t('noCompressors')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {compressors.map((compressor, index) => (
                <motion.div
                  key={compressor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/compressors/${compressor.slug}`}>
                    <div className="group relative overflow-hidden hover:shadow-elevation-3 transition-all duration-500 border border-primary/20 hover:border-primary/60">
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent z-10" />
                        <Image
                          src={compressor.image}
                          alt={getName(compressor)}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded mb-2">
                          {compressor.models.length} {t('models')}
                        </span>

                        <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary transition-colors">
                          {getName(compressor)}
                        </h3>

                        <p className="text-neutral-600 mb-4 line-clamp-2">
                          {getShortDesc(compressor)}
                        </p>

                        {/* Key specs */}
                        {compressor.specifications && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {Object.values(compressor.specifications).slice(0, 3).map((spec, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* CTA */}
                        <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                          <span>{t('viewDetails')}</span>
                          <ArrowRight size={18} className={`${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
                        </div>
                      </div>

                      {/* Side gold accent bar on hover */}
                      <div className={`absolute top-0 w-1 h-full bg-primary z-10 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ${isRTL ? 'right-0' : 'left-0'}`} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Download Catalog Section */}
      <section className="py-16 bg-steel-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-primary/20 flex items-center justify-center shrink-0">
                <FileText size={28} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {locale === 'ar' ? 'كتالوج الضواغط' : locale === 'tr' ? 'Kompresör Kataloğu' : 'Compressors Catalog'}
                </h3>
                <p className="text-white/60 text-sm">
                  {locale === 'ar' ? 'حمّل الكتالوج الكامل مع جميع المواصفات والموديلات' : locale === 'tr' ? 'Tüm özellikler ve modellerle tam kataloğu indirin' : 'Download the full catalog with all specifications and models'}
                </p>
              </div>
            </div>
            <a
              href="/downloads/compressors-catalog.pdf"
              download="SNA-Compressors-Catalog.pdf"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-steel-900 font-bold uppercase tracking-wider text-sm hover:bg-primary/90 transition-all duration-300 shrink-0"
            >
              <Download size={20} />
              {locale === 'ar' ? 'تحميل PDF' : locale === 'tr' ? 'PDF İndir' : 'Download PDF'}
              <span className="text-xs font-normal opacity-70">3.6 MB</span>
            </a>
          </motion.div>
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

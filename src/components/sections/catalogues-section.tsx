'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Download, FileText, Eye, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';

interface Catalogue {
  id: string;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  fileUrl: string;
  coverImage: string;
  fileSize: string;
}

export function CataloguesSection() {
  const t = useTranslations();
  const { isRTL, locale } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalogues = async () => {
      try {
        const response = await fetch('/api/public/catalogues');
        if (response.ok) {
          const data = await response.json();
          setCatalogues(data);
        }
      } catch (error) {
        console.error('Error fetching catalogues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogues();
  }, []);

  const getTitle = (catalogue: Catalogue) => {
    switch (locale) {
      case 'ar':
        return catalogue.titleAr;
      case 'tr':
        return catalogue.titleTr;
      default:
        return catalogue.titleEn;
    }
  };

  const getDescription = (catalogue: Catalogue) => {
    switch (locale) {
      case 'ar':
        return catalogue.descriptionAr;
      case 'tr':
        return catalogue.descriptionTr;
      default:
        return catalogue.descriptionEn;
    }
  };

  const handleDownload = (catalogue: Catalogue) => {
    if (catalogue.fileUrl) {
      window.open(catalogue.fileUrl, '_blank');
    }
  };

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-gradient-to-b from-steel-900 to-steel-950 relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl -translate-x-1/2 opacity-50" />
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
            <BookOpen size={16} />
            <span className="text-sm font-semibold">
              {t('catalogues.title')}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            {t('catalogues.heading')}
          </h2>

          {/* Modern Divider */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
          </div>

          <p className="text-neutral-300">{t('catalogues.description')}</p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && catalogues.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg">
              {t('catalogues.noCatalogues') || 'No catalogues available at the moment.'}
            </p>
          </div>
        )}

        {/* Catalogues Grid */}
        {!loading && catalogues.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {catalogues.map((catalogue, index) => (
              <motion.div
                key={catalogue.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-primary/30 transition-all duration-300 h-full">
                  {/* Thumbnail */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                    <Image
                      src={catalogue.coverImage || '/images/placeholders/catalogue.svg'}
                      alt={getTitle(catalogue)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-steel-900 via-steel-900/30 to-transparent" />

                    {/* Hover Actions */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        onClick={() => handleDownload(catalogue)}
                        className="w-12 h-12 rounded-full bg-primary hover:bg-primary-600"
                      >
                        <Download size={20} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-12 h-12 rounded-full border-white/20 text-white hover:bg-white/10"
                        onClick={() => handleDownload(catalogue)}
                      >
                        <Eye size={20} />
                      </Button>
                    </div>

                    {/* File Info Badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        PDF
                      </span>
                      {catalogue.fileSize && (
                        <span className="px-3 py-1.5 bg-primary text-steel-900 text-xs font-medium rounded-full">
                          {catalogue.fileSize}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                      {getTitle(catalogue)}
                    </h3>
                    <p className="text-sm text-neutral-400 mb-4">{getDescription(catalogue)}</p>
                  </div>

                  {/* Download Button */}
                  <div className="px-6 pb-6">
                    <Button
                      className="w-full group/btn"
                      onClick={() => handleDownload(catalogue)}
                    >
                      <Download size={18} className="group-hover/btn:animate-bounce" />
                      {t('catalogues.downloadButton')}
                    </Button>
                  </div>
                </div>
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
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary-600 px-6 py-3 rounded-full">
            <FileText size={20} className="text-steel-900" />
            <span className="text-steel-900 font-medium">
              {t('catalogues.request_custom') || 'Need a custom catalogue? Contact us'}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

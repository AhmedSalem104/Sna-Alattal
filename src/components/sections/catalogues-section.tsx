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
            backgroundSize: '50px 50px',
          }}
        />
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
            <BookOpen size={16} className="text-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              {t('catalogues.title')}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wide mb-4">
            {t('catalogues.heading')}
          </h2>

          {/* Gold Divider */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-1 w-8 bg-primary/25" />
            <div className="h-1 w-16 bg-primary/50" />
            <div className="h-1 w-24 bg-primary" />
            <div className="h-1 w-16 bg-primary/50" />
            <div className="h-1 w-8 bg-primary/25" />
          </div>

          <p className="text-metal-300">{t('catalogues.description')}</p>
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
            <BookOpen className="w-16 h-16 text-metal-500 mx-auto mb-4" />
            <p className="text-metal-400 text-lg">
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
                <div className="group relative bg-steel-800 border-2 border-steel-700 overflow-hidden hover:border-primary transition-all duration-300 h-full">
                  {/* Gold Accent Bar */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary z-10" />

                  {/* Thumbnail */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={catalogue.coverImage || '/images/catalogues/default-catalog.jpg'}
                      alt={getTitle(catalogue)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-steel-900 via-steel-900/50 to-transparent" />

                    {/* Hover Actions */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="industrial"
                        size="icon"
                        onClick={() => handleDownload(catalogue)}
                        className="w-12 h-12"
                      >
                        <Download size={20} />
                      </Button>
                      <Button
                        variant="industrialOutline"
                        size="icon"
                        className="w-12 h-12"
                        onClick={() => handleDownload(catalogue)}
                      >
                        <Eye size={20} />
                      </Button>
                    </div>

                    {/* File Info Badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 bg-steel-900/80 text-white text-xs font-bold uppercase tracking-wider">
                        PDF
                      </span>
                      {catalogue.fileSize && (
                        <span className="px-3 py-1 bg-primary text-steel-900 text-xs font-bold uppercase tracking-wider">
                          {catalogue.fileSize}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">
                      {getTitle(catalogue)}
                    </h3>
                    <p className="text-sm text-metal-400 mb-4">{getDescription(catalogue)}</p>
                  </div>

                  {/* Download Button */}
                  <div className="px-6 pb-6">
                    <Button
                      variant="industrial"
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
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-primary px-6 py-3">
            <FileText size={20} className="text-steel-900" />
            <span className="text-steel-900 font-bold uppercase tracking-wider">
              {t('catalogues.request_custom') || 'Need a custom catalogue? Contact us'}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

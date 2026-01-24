'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Download, FileText, Eye, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';

const catalogues = [
  {
    id: '1',
    nameKey: 'catalogues.items.products.name',
    descKey: 'catalogues.items.products.description',
    thumbnail: '/images/catalogues/products-catalog.jpg',
    fileSize: '15 MB',
    downloads: 1250,
    pages: 48,
  },
  {
    id: '2',
    nameKey: 'catalogues.items.filling.name',
    descKey: 'catalogues.items.filling.description',
    thumbnail: '/images/catalogues/filling-catalog.jpg',
    fileSize: '8 MB',
    downloads: 890,
    pages: 32,
  },
  {
    id: '3',
    nameKey: 'catalogues.items.production.name',
    descKey: 'catalogues.items.production.description',
    thumbnail: '/images/catalogues/production-catalog.jpg',
    fileSize: '12 MB',
    downloads: 650,
    pages: 40,
  },
];

export function CataloguesSection() {
  const t = useTranslations();
  const { isRTL } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const handleDownload = (id: string) => {
    // Download logic would go here
    console.log('Downloading catalogue:', id);
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

        {/* Catalogues Grid */}
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
                    src={catalogue.thumbnail}
                    alt={t(catalogue.nameKey)}
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
                      onClick={() => handleDownload(catalogue.id)}
                      className="w-12 h-12"
                    >
                      <Download size={20} />
                    </Button>
                    <Button
                      variant="industrialOutline"
                      size="icon"
                      className="w-12 h-12"
                    >
                      <Eye size={20} />
                    </Button>
                  </div>

                  {/* File Info Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-steel-900/80 text-white text-xs font-bold uppercase tracking-wider">
                      PDF
                    </span>
                    <span className="px-3 py-1 bg-primary text-steel-900 text-xs font-bold uppercase tracking-wider">
                      {catalogue.pages} {t('catalogues.pages') || 'Pages'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">
                    {t(catalogue.nameKey)}
                  </h3>
                  <p className="text-sm text-metal-400 mb-4">{t(catalogue.descKey)}</p>

                  <div className="flex items-center justify-between text-sm border-t border-steel-700 pt-4">
                    <span className="text-metal-500 font-mono">{catalogue.fileSize}</span>
                    <span className="text-primary font-bold">
                      {catalogue.downloads.toLocaleString()} {t('catalogues.downloads')}
                    </span>
                  </div>
                </div>

                {/* Download Button */}
                <div className="px-6 pb-6">
                  <Button
                    variant="industrial"
                    className="w-full group/btn"
                    onClick={() => handleDownload(catalogue.id)}
                  >
                    <Download size={18} className="group-hover/btn:animate-bounce" />
                    {t('catalogues.downloadButton')}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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

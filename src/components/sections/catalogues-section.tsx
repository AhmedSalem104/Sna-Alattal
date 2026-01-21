'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Download, FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const catalogues = [
  {
    id: '1',
    nameKey: 'catalogues.items.products.name',
    descKey: 'catalogues.items.products.description',
    thumbnail: '/images/logo.jpg',
    fileSize: '15 MB',
    downloads: 1250,
  },
  {
    id: '2',
    nameKey: 'catalogues.items.filling.name',
    descKey: 'catalogues.items.filling.description',
    thumbnail: '/images/logo.jpg',
    fileSize: '8 MB',
    downloads: 890,
  },
  {
    id: '3',
    nameKey: 'catalogues.items.production.name',
    descKey: 'catalogues.items.production.description',
    thumbnail: '/images/logo.jpg',
    fileSize: '12 MB',
    downloads: 650,
  },
];

export function CataloguesSection() {
  const t = useTranslations();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const handleDownload = (id: string) => {
    // Download logic would go here
    console.log('Downloading catalogue:', id);
  };

  return (
    <section ref={ref} className="section-padding bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary rounded-full" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FileText size={16} />
            {t('catalogues.title')}
          </div>
          <h2 className="heading-2 text-gray-900 mb-4">{t('catalogues.heading')}</h2>
          <p className="text-gray-600">
            {t('catalogues.description')}
          </p>
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
              <div className="group relative bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 hover:border-primary/50 transition-all duration-300 h-full">
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={catalogue.thumbnail}
                    alt={t(catalogue.nameKey)}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />

                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="gold"
                      size="icon"
                      onClick={() => handleDownload(catalogue.id)}
                    >
                      <Download size={20} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-white/30 text-gray-900 hover:bg-gray-100"
                    >
                      <Eye size={20} />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {t(catalogue.nameKey)}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{t(catalogue.descKey)}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{catalogue.fileSize}</span>
                    <span className="text-primary">{catalogue.downloads} {t('catalogues.downloads')}</span>
                  </div>
                </div>

                {/* Download Button */}
                <div className="px-6 pb-6">
                  <Button
                    variant="goldOutline"
                    className="w-full group/btn"
                    onClick={() => handleDownload(catalogue.id)}
                  >
                    <Download size={18} className="ml-2 group-hover/btn:animate-bounce" />
                    {t('catalogues.downloadButton')}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

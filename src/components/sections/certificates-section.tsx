'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Award, CheckCircle, Shield } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';

const certificates = [
  {
    id: '1',
    name: 'ISO 9001:2015',
    issuer: 'International Organization for Standardization',
    issuerAr: 'المنظمة الدولية للمعايير',
    descriptionKey: 'certificates.items.iso9001.description',
    image: '/images/certificates/iso-9001.png',
  },
  {
    id: '2',
    name: 'CE Marking',
    issuer: 'European Union',
    issuerAr: 'الاتحاد الأوروبي',
    descriptionKey: 'certificates.items.ce.description',
    image: '/images/certificates/ce-marking.png',
  },
  {
    id: '3',
    name: 'ISO 14001',
    issuer: 'International Organization for Standardization',
    issuerAr: 'المنظمة الدولية للمعايير',
    descriptionKey: 'certificates.items.iso14001.description',
    image: '/images/certificates/iso-14001.png',
  },
];

export function CertificatesSection() {
  const t = useTranslations();
  const { isRTL } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-white relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Industrial Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(26, 26, 46, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(26, 26, 46, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-px h-20 bg-primary" />
      <div className="absolute top-0 right-1/4 w-px h-20 bg-primary" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          {/* Section Tag */}
          <div className="inline-flex items-center gap-2 border-2 border-primary/30 bg-primary/5 px-4 py-2 mb-6">
            <Award size={16} className="text-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              {t('certificates.title')}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 uppercase tracking-wide mb-4">
            {t('certificates.subtitle')}
          </h2>

          {/* Gold Divider */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-1 w-8 bg-primary/25" />
            <div className="h-1 w-16 bg-primary/50" />
            <div className="h-1 w-24 bg-primary" />
            <div className="h-1 w-16 bg-primary/50" />
            <div className="h-1 w-8 bg-primary/25" />
          </div>

          <p className="text-metal-600">{t('certificates.description')}</p>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="relative bg-metal-50 border-2 border-metal-200 p-8 hover:border-primary transition-all duration-300 text-center h-full">
                {/* Gold Accent Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

                {/* Certificate Image */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
                  <div className="relative w-full h-full p-4 flex items-center justify-center border-2 border-metal-200 group-hover:border-primary transition-colors">
                    <Image
                      src={cert.image}
                      alt={cert.name}
                      width={80}
                      height={80}
                      className="object-contain"
                      loading="lazy"
                    />
                  </div>
                  {/* Corner Accents */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-primary" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-primary" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-primary uppercase tracking-wider mb-2">
                  {cert.name}
                </h3>
                <p className="text-sm text-metal-500 uppercase tracking-wider mb-4">
                  {isRTL ? cert.issuerAr : cert.issuer}
                </p>
                <p className="text-metal-600 text-sm">{t(cert.descriptionKey)}</p>

                {/* Verified Badge */}
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-green-700 text-sm font-semibold uppercase tracking-wider">
                    {t('certificates.verified')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 bg-steel-900 p-6 flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <Shield size={24} className="text-primary" />
          <p className="text-white text-center md:text-start">
            <span className="font-bold uppercase tracking-wider">
              {t('certificates.quality_assurance') || 'Quality Assurance'}:
            </span>{' '}
            <span className="text-metal-300">
              {t('certificates.quality_text') ||
                'جميع منتجاتنا تخضع لأعلى معايير الجودة العالمية'}
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

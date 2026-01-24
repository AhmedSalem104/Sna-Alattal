'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Award, CheckCircle, Shield, Loader2 } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';

interface Certificate {
  id: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  image: string;
  issuedBy: string;
  issuedDate: string;
}

export function CertificatesSection() {
  const t = useTranslations();
  const { isRTL, locale } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch('/api/public/certificates');
        if (response.ok) {
          const data = await response.json();
          setCertificates(data);
        }
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const getName = (cert: Certificate) => {
    switch (locale) {
      case 'ar':
        return cert.nameAr;
      case 'tr':
        return cert.nameTr;
      default:
        return cert.nameEn;
    }
  };

  const getDescription = (cert: Certificate) => {
    switch (locale) {
      case 'ar':
        return cert.descriptionAr;
      case 'tr':
        return cert.descriptionTr;
      default:
        return cert.descriptionEn;
    }
  };

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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!loading && certificates.length === 0 && (
          <div className="text-center py-20">
            <Award size={48} className="mx-auto text-metal-300 mb-4" />
            <p className="text-metal-500">{t('certificates.empty') || 'No certificates available'}</p>
          </div>
        )}

        {/* Certificates Grid */}
        {!loading && certificates.length > 0 && (
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
                        alt={getName(cert)}
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
                    {getName(cert)}
                  </h3>
                  <p className="text-sm text-metal-500 uppercase tracking-wider mb-4">
                    {cert.issuedBy}
                  </p>
                  <p className="text-metal-600 text-sm">{getDescription(cert)}</p>

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
        )}

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

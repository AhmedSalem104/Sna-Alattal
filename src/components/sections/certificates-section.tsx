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
  issuingBodyAr: string;
  issuingBodyEn: string;
  issuingBodyTr: string;
  image: string;
  issueDate: string;
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

  const getIssuingBody = (cert: Certificate) => {
    switch (locale) {
      case 'ar':
        return cert.issuingBodyAr;
      case 'tr':
        return cert.issuingBodyTr;
      default:
        return cert.issuingBodyEn;
    }
  };

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-white relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Subtle Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 w-[800px] h-[400px] bg-primary/5 blur-3xl -translate-x-1/2 opacity-50" />
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
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 mb-6">
            <Award size={16} />
            <span className="text-sm font-semibold">
              {t('certificates.title')}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 tracking-tight mb-4">
            {t('certificates.subtitle')}
          </h2>

          {/* Modern Divider */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>

          <p className="text-neutral-600">{t('certificates.description')}</p>
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
            <Award size={48} className="mx-auto text-neutral-400 mb-4" />
            <p className="text-neutral-500">{t('certificates.empty') || 'No certificates available'}</p>
          </div>
        )}

        {/* Certificates Grid */}
        {!loading && certificates.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative bg-white border border-gray-200 p-4 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center h-full">
                  {/* Certificate Image */}
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <div className="relative w-full h-full p-2 flex items-center justify-center bg-neutral-50 border border-gray-200 group-hover:border-primary/40 group-hover:animate-glow-pulse transition-colors">
                      <Image
                        src={cert.image}
                        alt={getName(cert)}
                        width={56}
                        height={56}
                        className="object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-1">
                    {getName(cert)}
                  </h3>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                    {getIssuingBody(cert)}
                  </p>
                  <p className="text-neutral-600 text-xs line-clamp-2">{getDescription(cert)}</p>

                  {/* Verified Badge */}
                  <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200">
                    <CheckCircle size={12} className="text-green-600" />
                    <span className="text-green-700 text-xs font-semibold uppercase tracking-wider">
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
          className="mt-12 bg-primary/10 p-6 flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <Shield size={24} className="text-primary" />
          <p className="text-steel-900 text-center md:text-start">
            <span className="font-bold">
              {t('certificates.quality_assurance') || 'Quality Assurance'}:
            </span>{' '}
            <span className="text-neutral-600">
              {t('certificates.quality_text') ||
                'جميع منتجاتنا تخضع لأعلى معايير الجودة العالمية'}
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Award, CheckCircle, Shield } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { IndustrialSpinner } from '@/components/ui/industrial-spinner';
import { IndustrialRing } from '@/components/decorative';

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
      className="py-20 lg:py-28 bg-white/[0.93] relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Subtle Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 w-[800px] h-[400px] bg-primary/5 blur-3xl -translate-x-1/2 opacity-50" />
        <IndustrialRing size={450} rings={4} dashed className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary opacity-[0.18] hidden md:block" strokeWidth={1.5} />
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
            <IndustrialSpinner size="lg" />
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
          <div className="grid md:grid-cols-2 gap-5">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <div className="relative flex gap-5 bg-white border border-neutral-200 p-5 h-full overflow-hidden hover:border-primary/40 hover:shadow-elevation-3 transition-all duration-400">
                  {/* Gold left accent bar */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />

                  {/* Certificate Image */}
                  <div className="relative shrink-0 w-24 h-24 bg-neutral-50 border border-neutral-200 group-hover:border-primary/30 group-hover:shadow-gold-sm transition-all duration-400">
                    <Image
                      src={cert.image}
                      alt={getName(cert)}
                      fill
                      sizes="96px"
                      className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Shimmer on hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-base font-bold text-steel-900 group-hover:text-primary transition-colors uppercase tracking-wide">
                        {getName(cert)}
                      </h3>
                      <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
                    </div>

                    <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">
                      {getIssuingBody(cert)}
                    </p>

                    <p className="text-neutral-500 text-sm line-clamp-2 mb-3">
                      {getDescription(cert)}
                    </p>

                    {/* Footer: date + verified */}
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold uppercase tracking-wider">
                        <Shield size={12} />
                        {t('certificates.verified')}
                      </span>
                      {cert.issueDate && (
                        <span className="text-xs text-neutral-400">
                          {new Date(cert.issueDate).getFullYear()}
                        </span>
                      )}
                    </div>
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
          className="mt-12 bg-primary/15 p-6 flex flex-col md:flex-row items-center justify-center gap-4"
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

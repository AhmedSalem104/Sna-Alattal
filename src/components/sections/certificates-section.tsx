'use client';

import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Award, CheckCircle, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useLocale } from '@/hooks/useLocale';
import { IndustrialSpinner } from '@/components/ui/industrial-spinner';
import { IndustrialRing } from '@/components/decorative';
import certificatesData from '@/data/certificates.json';

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

function CertCard({ cert, getName, getIssuingBody, verifiedText, grayscale }: {
  cert: Certificate; getName: (c: Certificate) => string; getIssuingBody: (c: Certificate) => string; verifiedText: string; grayscale?: boolean;
}) {
  return (
    <div className="flex-shrink-0 px-2.5">
      <div className={`group relative w-52 bg-white border border-primary/15 hover:border-primary/50 p-4 hover:shadow-elevation-3 transition-all duration-400 ${grayscale ? 'grayscale hover:grayscale-0 opacity-70 hover:opacity-100' : ''}`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        <div className="relative w-full h-44 bg-neutral-50 border border-neutral-100 mb-3 group-hover:border-primary/30 transition-all duration-400 overflow-hidden">
          <Image
            src={cert.image}
            alt={getName(cert)}
            fill
            sizes="208px"
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="text-center">
          <h3 className="text-xs font-bold text-steel-900 group-hover:text-primary transition-colors uppercase tracking-wide mb-1 line-clamp-2">
            {getName(cert)}
          </h3>
          <p className="text-[10px] text-primary/70 font-semibold mb-1.5 line-clamp-1">
            {getIssuingBody(cert)}
          </p>
          <div className="flex items-center justify-center gap-1">
            <CheckCircle size={12} className="text-green-600" />
            <span className="text-[10px] text-green-700 font-semibold uppercase">{verifiedText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CertificatesSection() {
  const t = useTranslations();
  const { isRTL, locale } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [certificates] = useState<Certificate[]>(() => (certificatesData as any[]).filter(c => c.isActive && !c.deletedAt).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) as Certificate[]);
  const loading = false;

  const getName = (cert: Certificate) => {
    switch (locale) {
      case 'ar': return cert.nameAr;
      case 'tr': return cert.nameTr;
      default: return cert.nameEn;
    }
  };

  const getIssuingBody = (cert: Certificate) => {
    switch (locale) {
      case 'ar': return cert.issuingBodyAr;
      case 'tr': return cert.issuingBodyTr;
      default: return cert.issuingBodyEn;
    }
  };

  // Show only specific certificates
  const ALLOWED = ['warranty certificate', 'exhibition certificate', 'excellence certificate', 'pcms certificate'];
  const uniqueCertificates = useMemo(() => {
    const seen = new Set<string>();
    return certificates.filter((cert) => {
      const name = cert.nameEn.toLowerCase().trim();
      if (!ALLOWED.some(a => name.includes(a))) return false;
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });
  }, [certificates]);

  return (
    <section
      ref={ref}
      className="py-12 lg:py-16 bg-white/80 relative overflow-hidden"
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
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 mb-6">
            <Award size={16} />
            <span className="text-sm font-semibold">
              {t('certificates.title')}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 tracking-tight mb-4 border-l-4 border-primary pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4">
            {t('certificates.subtitle')}
          </h2>

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
        {!loading && uniqueCertificates.length === 0 && (
          <div className="text-center py-20">
            <Award size={48} className="mx-auto text-neutral-400 mb-4" />
            <p className="text-neutral-500">{t('certificates.empty') || 'No certificates available'}</p>
          </div>
        )}

        {/* Certificates Carousel */}
        {!loading && uniqueCertificates.length > 0 && (
          <CertificatesCarousel
            certificates={uniqueCertificates}
            getName={getName}
            getIssuingBody={getIssuingBody}
            verifiedText={t('certificates.verified')}
            isInView={isInView}
            isRTL={isRTL}
          />
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

// ─── Certificates Carousel ─────────────────
function CertificatesCarousel({ certificates, getName, getIssuingBody, verifiedText, isInView, isRTL }: {
  certificates: Certificate[];
  getName: (c: Certificate) => string;
  getIssuingBody: (c: Certificate) => string;
  verifiedText: string;
  isInView: boolean;
  isRTL: boolean;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: isRTL ? 'rtl' : 'ltr', align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      {/* Nav buttons */}
      <button onClick={scrollPrev} className="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-neutral-200 hover:border-primary flex items-center justify-center shadow-md transition-colors">
        <ChevronLeft size={20} className="text-steel-900" />
      </button>
      <button onClick={scrollNext} className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-neutral-200 hover:border-primary flex items-center justify-center shadow-md transition-colors">
        <ChevronRight size={20} className="text-steel-900" />
      </button>

      {/* Carousel */}
      <div ref={emblaRef} className="overflow-hidden mx-8">
        <div className="flex">
          {certificates.map((cert) => (
            <div key={cert.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] min-w-0 px-2">
              <CertCard cert={cert} getName={getName} getIssuingBody={getIssuingBody} verifiedText={verifiedText} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-6">
        {certificates.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${selectedIndex === i ? 'w-6 bg-primary' : 'w-1.5 bg-neutral-300'}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

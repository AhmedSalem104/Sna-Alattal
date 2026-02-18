'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Globe, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/hooks/useLocale';

interface Exhibition {
  id: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  locationAr: string;
  locationEn: string;
  locationTr: string;
  images: string[] | string;
  startDate: string;
  endDate: string;
}

export function ExhibitionsSection() {
  const t = useTranslations();
  const { isRTL, locale } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await fetch('/api/public/exhibitions?limit=4');
        if (response.ok) {
          const data = await response.json();
          setExhibitions(Array.isArray(data) ? data : data.exhibitions || []);
        }
      } catch (error) {
        console.error('Error fetching exhibitions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getTitle = (exhibition: Exhibition) => {
    switch (locale) {
      case 'ar':
        return exhibition.nameAr;
      case 'tr':
        return exhibition.nameTr;
      default:
        return exhibition.nameEn;
    }
  };

  const getLocation = (exhibition: Exhibition) => {
    switch (locale) {
      case 'ar':
        return exhibition.locationAr;
      case 'tr':
        return exhibition.locationTr;
      default:
        return exhibition.locationEn;
    }
  };

  const getExhibitionImage = (exhibition: Exhibition) => {
    const imgs = exhibition.images;
    if (Array.isArray(imgs) && imgs.length > 0) return imgs[0];
    if (typeof imgs === 'string') {
      try {
        const parsed = JSON.parse(imgs);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      } catch { /* ignore */ }
    }
    return '/images/placeholders/exhibition.svg';
  };

  const isUpcoming = (exhibition: Exhibition) => {
    return new Date(exhibition.startDate) > new Date();
  };

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Subtle Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-primary/5 blur-3xl -translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-copper-500/5 blur-3xl opacity-30" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 mb-4">
              <Globe size={16} />
              <span className="text-sm font-semibold">
                {t('exhibitions.title')}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 tracking-tight">
              {t('exhibitions.subtitle')}
            </h2>

            {/* Modern Divider */}
            <div className="flex items-center gap-2 mt-4">
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/50" />
            </div>

            <p className="text-neutral-600 mt-4 max-w-xl">{t('exhibitions.description')}</p>
          </div>

          <Button asChild className="group shrink-0">
            <Link href="/exhibitions">
              {t('exhibitions.viewAll')}
              <ArrowRight
                className={`${isRTL ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`}
                size={18}
              />
            </Link>
          </Button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!loading && exhibitions.length === 0 && (
          <div className="text-center py-20">
            <Globe size={48} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-500 text-lg">{t('exhibitions.noExhibitions')}</p>
          </div>
        )}

        {/* Exhibitions Grid */}
        {!loading && exhibitions.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {exhibitions.map((exhibition, index) => (
              <motion.div
                key={exhibition.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="group relative bg-white border border-gray-200 overflow-hidden hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={getExhibitionImage(exhibition)}
                        alt={getTitle(exhibition)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Status Badge */}
                      {isUpcoming(exhibition) && (
                        <Badge variant="featured" className="absolute top-4 right-4">
                          {t('exhibitions.upcoming')}
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-steel-900 group-hover:text-primary transition-colors mb-4">
                        {getTitle(exhibition)}
                      </h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 flex items-center justify-center">
                            <MapPin size={14} className="text-primary" />
                          </div>
                          <span className="text-neutral-600">
                            {getLocation(exhibition)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 flex items-center justify-center">
                            <Calendar size={14} className="text-primary" />
                          </div>
                          <span className="text-neutral-600">{formatDate(exhibition.startDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

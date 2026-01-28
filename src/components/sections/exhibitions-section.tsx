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
  titleAr: string;
  titleEn: string;
  titleTr: string;
  locationAr: string;
  locationEn: string;
  locationTr: string;
  image: string;
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
          setExhibitions(data.exhibitions || []);
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
        return exhibition.titleAr;
      case 'tr':
        return exhibition.titleTr;
      default:
        return exhibition.titleEn;
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

  const isUpcoming = (exhibition: Exhibition) => {
    return new Date(exhibition.startDate) > new Date();
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
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 border-2 border-primary/30 bg-primary/10 px-4 py-2 mb-4">
              <Globe size={16} className="text-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                {t('exhibitions.title')}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wide">
              {t('exhibitions.subtitle')}
            </h2>

            {/* Gold Divider */}
            <div className="flex items-center gap-4 mt-4">
              <div className="h-1 w-16 bg-primary" />
              <div className="h-1 w-8 bg-primary/50" />
              <div className="h-1 w-4 bg-primary/25" />
            </div>

            <p className="text-metal-300 mt-4 max-w-xl">{t('exhibitions.description')}</p>
          </div>

          <Button variant="industrial" asChild className="group shrink-0">
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
            <Globe size={48} className="mx-auto text-steel-600 mb-4" />
            <p className="text-metal-400 text-lg">{t('exhibitions.noExhibitions')}</p>
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
                <Link href={`/exhibitions/${exhibition.id}`}>
                  <div className="group relative bg-steel-800 border-2 border-steel-700 overflow-hidden hover:border-primary transition-all duration-300 h-full">
                    {/* Gold Accent Bar */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary z-10" />

                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={exhibition.image || '/images/placeholders/exhibition.svg'}
                        alt={getTitle(exhibition)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-steel-900 via-steel-900/50 to-transparent" />

                      {/* Status Badge */}
                      {isUpcoming(exhibition) && (
                        <Badge variant="featured" className="absolute top-4 right-4">
                          {t('exhibitions.upcoming')}
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white uppercase tracking-wider group-hover:text-primary transition-colors mb-4">
                        {getTitle(exhibition)}
                      </h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 border border-steel-600 bg-steel-700 flex items-center justify-center">
                            <MapPin size={14} className="text-primary" />
                          </div>
                          <span className="text-metal-300">
                            {getLocation(exhibition)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 border border-steel-600 bg-steel-700 flex items-center justify-center">
                            <Calendar size={14} className="text-primary" />
                          </div>
                          <span className="text-metal-300">{formatDate(exhibition.startDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

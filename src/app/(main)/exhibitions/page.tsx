'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, ExternalLink, Loader2, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';
import { getLocalizedField, formatLocalizedDate } from '@/lib/locale-helpers';

interface Exhibition {
  id: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  locationAr: string;
  locationEn: string;
  locationTr: string;
  descriptionAr?: string;
  descriptionEn?: string;
  descriptionTr?: string;
  images: string[];
  startDate: string;
  endDate: string;
  booth?: string;
}

export default function ExhibitionsPage() {
  const t = useTranslations('exhibitionsPage');
  const { locale, isRTL } = useLocale();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExhibitions() {
      try {
        const res = await fetch('/api/public/exhibitions');
        if (res.ok) {
          const data = await res.json();
          setExhibitions(data);
        }
      } catch (error) {
        console.error('Error fetching exhibitions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchExhibitions();
  }, []);

  const getName = (item: Exhibition) => getLocalizedField(item, 'name', locale);
  const getLocation = (item: Exhibition) => getLocalizedField(item, 'location', locale);
  const getDescription = (item: Exhibition) => getLocalizedField(item, 'description', locale);

  const getExhibitionImage = (exhibition: Exhibition) => {
    if (exhibition.images && exhibition.images.length > 0) {
      return exhibition.images[0];
    }
    return '/images/placeholders/exhibition.svg';
  };

  const getStatus = (exhibition: Exhibition): 'upcoming' | 'ongoing' | 'past' => {
    const now = new Date();
    const startDate = new Date(exhibition.startDate);
    const endDate = new Date(exhibition.endDate);

    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'ongoing';
    return 'past';
  };

  const formatDateRange = (exhibition: Exhibition) => {
    const start = new Date(exhibition.startDate);
    const end = new Date(exhibition.endDate);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };

    const localeMap: Record<string, string> = {
      ar: 'ar-EG',
      en: 'en-US',
      tr: 'tr-TR',
    };

    const localeStr = localeMap[locale] || 'en-US';
    return `${start.toLocaleDateString(localeStr, options)} - ${end.toLocaleDateString(localeStr, options)}`;
  };

  const upcomingExhibitions = exhibitions.filter((e) => {
    const status = getStatus(e);
    return status === 'upcoming' || status === 'ongoing';
  });
  const pastExhibitions = exhibitions.filter((e) => getStatus(e) === 'past');

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-b from-primary/20 via-white to-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1 bg-primary/20 text-primary rounded-full text-sm mb-4">
              {t('badge')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-700">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Exhibitions */}
      {upcomingExhibitions.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('upcoming')}</h2>
              <p className="text-gray-600">{t('upcomingDesc')}</p>
            </motion.div>

            <div className="space-y-8">
              {upcomingExhibitions.map((exhibition, index) => (
                <motion.div
                  key={exhibition.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-gradient-to-r from-primary/10 to-transparent rounded-2xl overflow-hidden border border-primary/30"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Image */}
                    <div className="relative h-64 lg:h-auto">
                      <Image
                        src={getExhibitionImage(exhibition)}
                        alt={getName(exhibition)}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} px-3 py-1 bg-primary text-gray-900 rounded-full text-sm font-medium`}>
                        {getStatus(exhibition) === 'ongoing' ? t('ongoing') : t('comingSoon')}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-2 p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{getName(exhibition)}</h3>
                      {getDescription(exhibition) && (
                        <p className="text-gray-700 mb-6">{getDescription(exhibition)}</p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/20 rounded-lg">
                            <Calendar className="text-primary" size={20} />
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">{t('date')}</p>
                            <p className="text-gray-900">{formatDateRange(exhibition)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/20 rounded-lg">
                            <MapPin className="text-primary" size={20} />
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">{t('location')}</p>
                            <p className="text-gray-900">{getLocation(exhibition)}</p>
                          </div>
                        </div>
                        {exhibition.booth && (
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg">
                              <ExternalLink className="text-primary" size={20} />
                            </div>
                            <div>
                              <p className="text-gray-600 text-sm">{t('booth')}</p>
                              <p className="text-gray-900">{exhibition.booth}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <Link href="/contact">
                        <Button variant="gold" size="lg">
                          {t('scheduleVisit')}
                          <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} size={18} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Past Exhibitions */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('past')}</h2>
            <p className="text-gray-600">{t('pastDesc')}</p>
          </motion.div>

          {pastExhibitions.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">{t('noPastExhibitions') || 'No past exhibitions'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastExhibitions.map((exhibition, index) => (
                <motion.div
                  key={exhibition.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={getExhibitionImage(exhibition)}
                      alt={getName(exhibition)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{getName(exhibition)}</h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Calendar size={16} />
                        <span>{formatDateRange(exhibition)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin size={16} />
                        <span>{getLocation(exhibition)}</span>
                      </div>
                    </div>

                    {getDescription(exhibition) && (
                      <p className="text-gray-600 text-sm line-clamp-2">{getDescription(exhibition)}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/20 via-white to-primary/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <Link href="/contact">
              <Button variant="gold" size="xl">
                {t('cta.button')}
                <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

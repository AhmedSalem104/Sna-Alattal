'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const exhibitions = [
  {
    id: '1',
    name: 'معرض جلفود 2024',
    nameEn: 'Gulfood 2024',
    location: 'دبي، الإمارات',
    date: '2024-02-19',
    endDate: '2024-02-23',
    image: '/images/logo.jpg',
    isUpcoming: true,
  },
  {
    id: '2',
    name: 'معرض باك إكسبو',
    nameEn: 'Pack Expo',
    location: 'شيكاغو، أمريكا',
    date: '2024-11-03',
    endDate: '2024-11-06',
    image: '/images/logo.jpg',
    isUpcoming: true,
  },
  {
    id: '3',
    name: 'معرض بروباك آسيا',
    nameEn: 'ProPak Asia',
    location: 'بانكوك، تايلاند',
    date: '2024-06-12',
    endDate: '2024-06-15',
    image: '/images/logo.jpg',
    isUpcoming: false,
  },
];

export function ExhibitionsSection() {
  const t = useTranslations();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <section ref={ref} className="section-padding bg-gray-50 relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Calendar size={16} />
              {t('exhibitions.title')}
            </div>
            <h2 className="heading-2 text-gray-900">{t('exhibitions.subtitle')}</h2>
            <p className="text-gray-600 mt-2">{t('exhibitions.description')}</p>
          </div>

          <Button variant="goldOutline" asChild className="group shrink-0">
            <Link href="/exhibitions">
              جميع المعارض
              <ArrowRight className="mr-2 rtl:rotate-180 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </Button>
        </motion.div>

        {/* Exhibitions Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {exhibitions.map((exhibition, index) => (
            <motion.div
              key={exhibition.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/exhibitions/${exhibition.id}`}>
                <div className="group relative bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 hover:border-primary/50 transition-all duration-300 h-full">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={exhibition.image}
                      alt={exhibition.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />

                    {/* Status Badge */}
                    {exhibition.isUpcoming && (
                      <Badge variant="gold" className="absolute top-4 right-4">
                        قادم
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors mb-3">
                      {exhibition.name}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-primary" />
                        <span>{exhibition.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-primary" />
                        <span>{formatDate(exhibition.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

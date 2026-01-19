'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const exhibitions = [
  {
    id: 1,
    name: 'Gulfood Manufacturing 2024',
    location: 'دبي، الإمارات',
    locationEn: 'Dubai, UAE',
    date: '5-7 نوفمبر 2024',
    dateEn: 'Nov 5-7, 2024',
    image: '/images/exhibitions/gulfood.jpg',
    status: 'upcoming',
    booth: 'Hall 3, Stand B45',
    description: 'أكبر معرض لتكنولوجيا صناعة الأغذية في المنطقة',
  },
  {
    id: 2,
    name: 'Propak Asia 2024',
    location: 'بانكوك، تايلاند',
    locationEn: 'Bangkok, Thailand',
    date: '12-15 يونيو 2024',
    dateEn: 'Jun 12-15, 2024',
    image: '/images/exhibitions/propak.jpg',
    status: 'past',
    booth: 'Hall 1, Stand A23',
    description: 'المعرض الرائد لتكنولوجيا التعبئة والتغليف في آسيا',
  },
  {
    id: 3,
    name: 'Interpack 2023',
    location: 'دوسلدورف، ألمانيا',
    locationEn: 'Dusseldorf, Germany',
    date: '4-10 مايو 2023',
    dateEn: 'May 4-10, 2023',
    image: '/images/exhibitions/interpack.jpg',
    status: 'past',
    booth: 'Hall 6, Stand F12',
    description: 'المعرض العالمي الأكبر للتعبئة والتغليف',
  },
  {
    id: 4,
    name: 'EGYPT PLAST 2023',
    location: 'القاهرة، مصر',
    locationEn: 'Cairo, Egypt',
    date: '19-22 سبتمبر 2023',
    dateEn: 'Sep 19-22, 2023',
    image: '/images/exhibitions/egypt-plast.jpg',
    status: 'past',
    booth: 'Hall 2, Stand C15',
    description: 'المعرض الدولي للبلاستيك والبتروكيماويات',
  },
];

export default function ExhibitionsPage() {
  const t = useTranslations('exhibitionsPage');

  const upcomingExhibitions = exhibitions.filter((e) => e.status === 'upcoming');
  const pastExhibitions = exhibitions.filter((e) => e.status === 'past');

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-b from-primary/20 via-dark to-dark overflow-hidden">
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-300">
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
              <h2 className="text-3xl font-bold text-white mb-2">{t('upcoming')}</h2>
              <p className="text-gray-400">{t('upcomingDesc')}</p>
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
                        src={exhibition.image}
                        alt={exhibition.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-dark rounded-full text-sm font-medium">
                        {t('comingSoon')}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-2 p-8">
                      <h3 className="text-2xl font-bold text-white mb-4">{exhibition.name}</h3>
                      <p className="text-gray-300 mb-6">{exhibition.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/20 rounded-lg">
                            <Calendar className="text-primary" size={20} />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">{t('date')}</p>
                            <p className="text-white">{exhibition.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/20 rounded-lg">
                            <MapPin className="text-primary" size={20} />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">{t('location')}</p>
                            <p className="text-white">{exhibition.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/20 rounded-lg">
                            <ExternalLink className="text-primary" size={20} />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">{t('booth')}</p>
                            <p className="text-white">{exhibition.booth}</p>
                          </div>
                        </div>
                      </div>

                      <Link href="/contact">
                        <Button variant="gold" size="lg">
                          {t('scheduleVisit')}
                          <ArrowRight className="mr-2 rtl:rotate-180" size={18} />
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
      <section className="py-20 bg-dark-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-2">{t('past')}</h2>
            <p className="text-gray-400">{t('pastDesc')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastExhibitions.map((exhibition, index) => (
              <motion.div
                key={exhibition.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-dark rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={exhibition.image}
                    alt={exhibition.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{exhibition.name}</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar size={16} />
                      <span>{exhibition.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin size={16} />
                      <span>{exhibition.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm">{exhibition.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/20 via-dark to-primary/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <Link href="/contact">
              <Button variant="gold" size="xl">
                {t('cta.button')}
                <ArrowRight className="mr-2 rtl:rotate-180" size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

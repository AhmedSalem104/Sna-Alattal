'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Globe, Award, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';
import { getLocalizedField } from '@/lib/locale-helpers';

interface Client {
  id: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  logo?: string;
  website?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  descriptionTr?: string;
}

const stats = [
  { icon: Users, value: '300+', labelKey: 'stats.clients' },
  { icon: Building2, value: '500+', labelKey: 'stats.projects' },
  { icon: Globe, value: '15+', labelKey: 'stats.countries' },
  { icon: Award, value: '30+', labelKey: 'stats.experience' },
];

export default function ClientsPage() {
  const t = useTranslations('clientsPage');
  const { locale, isRTL } = useLocale();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch('/api/public/clients');
        if (res.ok) {
          const data = await res.json();
          setClients(data);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  const getName = (client: Client) => getLocalizedField(client, 'name', locale);

  const getClientLogo = (client: Client) => {
    return client.logo || '/images/placeholder-client.jpg';
  };

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

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-primary" size={32} />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{t(stat.labelKey)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('ourClients')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('ourClientsDesc')}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-20">
              <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-xl">{t('noClients') || 'No clients available'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {clients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group"
                >
                  {client.website ? (
                    <a
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="aspect-square bg-gray-100 rounded-xl p-6 flex items-center justify-center border border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-all duration-300">
                        <Image
                          src={getClientLogo(client)}
                          alt={getName(client)}
                          width={100}
                          height={100}
                          className="object-contain opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                        />
                      </div>
                    </a>
                  ) : (
                    <div className="aspect-square bg-gray-100 rounded-xl p-6 flex items-center justify-center border border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-all duration-300">
                      <Image
                        src={getClientLogo(client)}
                        alt={getName(client)}
                        width={100}
                        height={100}
                        className="object-contain opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('whyTrustUs')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('whyTrustUsDesc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl border border-gray-200"
            >
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Award className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('trust.quality.title')}</h3>
              <p className="text-gray-600">{t('trust.quality.desc')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-2xl border border-gray-200"
            >
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Users className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('trust.support.title')}</h3>
              <p className="text-gray-600">{t('trust.support.desc')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-2xl border border-gray-200"
            >
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Globe className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('trust.global.title')}</h3>
              <p className="text-gray-600">{t('trust.global.desc')}</p>
            </motion.div>
          </div>
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

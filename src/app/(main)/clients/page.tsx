'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Globe, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const clients = [
  { id: '1', name: 'Client 1', logo: '/images/logo.jpg', industry: 'food' },
  { id: '2', name: 'Client 2', logo: '/images/logo.jpg', industry: 'beverage' },
  { id: '3', name: 'Client 3', logo: '/images/logo.jpg', industry: 'pharmaceutical' },
  { id: '4', name: 'Client 4', logo: '/images/logo.jpg', industry: 'cosmetics' },
  { id: '5', name: 'Client 5', logo: '/images/logo.jpg', industry: 'chemicals' },
  { id: '6', name: 'Client 6', logo: '/images/logo.jpg', industry: 'food' },
  { id: '7', name: 'Client 7', logo: '/images/logo.jpg', industry: 'beverage' },
  { id: '8', name: 'Client 8', logo: '/images/logo.jpg', industry: 'pharmaceutical' },
  { id: '9', name: 'Client 9', logo: '/images/logo.jpg', industry: 'cosmetics' },
  { id: '10', name: 'Client 10', logo: '/images/logo.jpg', industry: 'chemicals' },
  { id: '11', name: 'Client 11', logo: '/images/logo.jpg', industry: 'food' },
  { id: '12', name: 'Client 12', logo: '/images/logo.jpg', industry: 'beverage' },
];

const stats = [
  { icon: Users, value: '300+', labelKey: 'stats.clients' },
  { icon: Building2, value: '500+', labelKey: 'stats.projects' },
  { icon: Globe, value: '15+', labelKey: 'stats.countries' },
  { icon: Award, value: '30+', labelKey: 'stats.experience' },
];

export default function ClientsPage() {
  const t = useTranslations('clientsPage');
  const tCommon = useTranslations('clients');

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

      {/* Stats Section */}
      <section className="py-16 bg-dark-50">
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
                <div className="text-gray-400">{t(stat.labelKey)}</div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('ourClients')}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('ourClientsDesc')}
            </p>
          </motion.div>

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
                <div className="aspect-square bg-white/5 rounded-xl p-6 flex items-center justify-center border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={100}
                    height={100}
                    className="object-contain opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-dark-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('whyTrustUs')}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('whyTrustUsDesc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-dark p-8 rounded-2xl border border-white/10"
            >
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Award className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('trust.quality.title')}</h3>
              <p className="text-gray-400">{t('trust.quality.desc')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-dark p-8 rounded-2xl border border-white/10"
            >
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Users className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('trust.support.title')}</h3>
              <p className="text-gray-400">{t('trust.support.desc')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-dark p-8 rounded-2xl border border-white/10"
            >
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Globe className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('trust.global.title')}</h3>
              <p className="text-gray-400">{t('trust.global.desc')}</p>
            </motion.div>
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

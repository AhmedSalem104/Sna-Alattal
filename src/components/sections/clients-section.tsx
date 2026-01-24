'use client';

import { useRef, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Users, ArrowRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';

// Sample clients data
const sampleClients = [
  { id: '1', name: 'Client 1', logo: '/images/clients/client-1.png' },
  { id: '2', name: 'Client 2', logo: '/images/clients/client-2.png' },
  { id: '3', name: 'Client 3', logo: '/images/clients/client-3.png' },
  { id: '4', name: 'Client 4', logo: '/images/clients/client-4.png' },
  { id: '5', name: 'Client 5', logo: '/images/clients/client-5.png' },
  { id: '6', name: 'Client 6', logo: '/images/clients/client-6.png' },
  { id: '7', name: 'Client 7', logo: '/images/clients/client-7.png' },
  { id: '8', name: 'Client 8', logo: '/images/clients/client-8.png' },
];

const stats = [
  { value: '300+', labelKey: 'clients.stats.clients' },
  { value: '15+', labelKey: 'clients.stats.countries' },
  { value: '98%', labelKey: 'clients.stats.satisfaction' },
];

export const ClientsSection = memo(function ClientsSection() {
  const t = useTranslations();
  const { isRTL } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-white relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Industrial Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(26, 26, 46, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(26, 26, 46, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-1 h-24 bg-primary" />
      <div className="absolute top-0 right-0 w-1 h-24 bg-primary" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          {/* Section Tag */}
          <div className="inline-flex items-center gap-2 border-2 border-primary/30 bg-primary/5 px-4 py-2 mb-6">
            <Users size={16} className="text-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              {t('clients.title')}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 uppercase tracking-wide mb-4">
            {t('clients.subtitle')}
          </h2>

          {/* Gold Divider */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-1 w-8 bg-primary/25" />
            <div className="h-1 w-16 bg-primary/50" />
            <div className="h-1 w-24 bg-primary" />
            <div className="h-1 w-16 bg-primary/50" />
            <div className="h-1 w-8 bg-primary/25" />
          </div>

          <p className="text-metal-600">{t('clients.description')}</p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-16"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.labelKey}
              className="text-center p-4 bg-metal-50 border-2 border-metal-100"
            >
              <div className="text-2xl md:text-3xl font-bold text-primary font-mono">
                {stat.value}
              </div>
              <div className="text-xs text-metal-600 uppercase tracking-wider mt-1">
                {t(stat.labelKey) || stat.labelKey.split('.').pop()}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Clients Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {sampleClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              <div className="aspect-square bg-metal-50 border-2 border-metal-200 p-4 flex items-center justify-center hover:border-primary hover:bg-white transition-all duration-300">
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={80}
                  height={80}
                  className="object-contain opacity-50 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                  loading="lazy"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicator & CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-3 bg-steel-900 px-6 py-3 mb-6">
            <Award size={20} className="text-primary" />
            <span className="text-white text-sm font-semibold uppercase tracking-wider">
              {t('clients.trustText')}
            </span>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="industrialOutline" size="lg" asChild className="group">
              <Link href="/clients">
                {t('clients.viewAll') || 'View All Clients'}
                <ArrowRight
                  className={`${isRTL ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`}
                  size={18}
                />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

'use client';

import { useRef, memo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Users, ArrowRight, Award, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';

interface Client {
  id: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  logo: string;
  isFeatured: boolean;
}

const stats = [
  { value: '300+', labelKey: 'clients.stats.clients' },
  { value: '15+', labelKey: 'clients.stats.countries' },
  { value: '98%', labelKey: 'clients.stats.satisfaction' },
];

export const ClientsSection = memo(function ClientsSection() {
  const t = useTranslations();
  const { isRTL, locale } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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

  const getName = (client: Client) => {
    if (locale === 'ar') return client.nameAr;
    if (locale === 'tr') return client.nameTr;
    return client.nameEn;
  };

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-white relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Modern Subtle Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
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
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Users size={16} />
            <span className="text-sm font-semibold">
              {t('clients.title')}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 tracking-tight mb-4">
            {t('clients.subtitle')}
          </h2>

          {/* Modern Divider */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
          </div>

          <p className="text-neutral-600 text-lg">{t('clients.description')}</p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-16"
        >
          {stats.map((stat) => (
            <div
              key={stat.labelKey}
              className="text-center p-6 bg-neutral-50 rounded-2xl"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-sm text-neutral-600 mt-2">
                {t(stat.labelKey) || stat.labelKey.split('.').pop()}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-500">{t('common.noData')}</p>
          </div>
        ) : (
          /* Clients Logo Grid */
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {clients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group"
              >
                <div className="aspect-square bg-white rounded-xl border border-neutral-200 p-4 flex items-center justify-center hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <Image
                    src={client.logo}
                    alt={getName(client)}
                    width={80}
                    height={80}
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Trust Indicator & CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-steel-900 to-steel-800 px-6 py-3 rounded-full mb-8">
            <Award size={20} className="text-primary" />
            <span className="text-white text-sm font-medium">
              {t('clients.trustText')}
            </span>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" asChild className="group">
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

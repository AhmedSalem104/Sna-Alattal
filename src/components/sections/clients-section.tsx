'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';

// Sample clients data
const sampleClients = [
  { id: '1', name: 'Client 1', logo: '/images/logo.jpg' },
  { id: '2', name: 'Client 2', logo: '/images/logo.jpg' },
  { id: '3', name: 'Client 3', logo: '/images/logo.jpg' },
  { id: '4', name: 'Client 4', logo: '/images/logo.jpg' },
  { id: '5', name: 'Client 5', logo: '/images/logo.jpg' },
  { id: '6', name: 'Client 6', logo: '/images/logo.jpg' },
  { id: '7', name: 'Client 7', logo: '/images/logo.jpg' },
  { id: '8', name: 'Client 8', logo: '/images/logo.jpg' },
];

export function ClientsSection() {
  const t = useTranslations();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-dark relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t('clients.title')}
          </div>
          <h2 className="heading-2 text-white mb-4">{t('clients.subtitle')}</h2>
          <p className="text-gray-400">{t('clients.description')}</p>
        </motion.div>

        {/* Clients Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {sampleClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              <div className="aspect-square bg-white/5 rounded-xl p-4 flex items-center justify-center border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300">
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={80}
                  height={80}
                  className="object-contain opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm">
            نفخر بثقة أكثر من <span className="text-primary font-bold">300+</span> عميل من كبرى الشركات
          </p>
        </motion.div>
      </div>
    </section>
  );
}

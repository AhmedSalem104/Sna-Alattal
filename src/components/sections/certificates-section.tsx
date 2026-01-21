'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Award, CheckCircle } from 'lucide-react';

const certificates = [
  {
    id: '1',
    name: 'ISO 9001:2015',
    issuer: 'International Organization for Standardization',
    description: 'شهادة نظام إدارة الجودة',
    image: '/images/logo.jpg',
  },
  {
    id: '2',
    name: 'CE Marking',
    issuer: 'European Union',
    description: 'علامة المطابقة الأوروبية',
    image: '/images/logo.jpg',
  },
  {
    id: '3',
    name: 'ISO 14001',
    issuer: 'International Organization for Standardization',
    description: 'شهادة نظام الإدارة البيئية',
    image: '/images/logo.jpg',
  },
];

export function CertificatesSection() {
  const t = useTranslations();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_30%,_#F9BF0F_0%,_transparent_50%)]" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Award size={16} />
            {t('certificates.title')}
          </div>
          <h2 className="heading-2 text-gray-900 mb-4">{t('certificates.subtitle')}</h2>
          <p className="text-gray-600">{t('certificates.description')}</p>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="relative p-8 bg-gradient-to-b from-white/10 to-white/5 rounded-2xl border border-gray-200 hover:border-primary/50 transition-all duration-300 text-center h-full">
                {/* Certificate Image */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative w-full h-full rounded-full bg-gray-100 p-4 flex items-center justify-center">
                    <Image
                      src={cert.image}
                      alt={cert.name}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-primary mb-2">{cert.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{cert.issuer}</p>
                <p className="text-gray-700">{cert.description}</p>

                {/* Verified Badge */}
                <div className="mt-6 inline-flex items-center gap-2 text-green-500 text-sm">
                  <CheckCircle size={16} />
                  <span>موثق ومعتمد</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

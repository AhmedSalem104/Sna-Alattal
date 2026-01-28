'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FileText, Scale, ShieldCheck, AlertTriangle, Gavel, RefreshCw, Mail } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';

export default function TermsPage() {
  const t = useTranslations('termsPage');
  const { isRTL } = useLocale();

  const sections = [
    {
      icon: FileText,
      titleKey: 'acceptance.title',
      contentKey: 'acceptance.content',
    },
    {
      icon: ShieldCheck,
      titleKey: 'services.title',
      contentKey: 'services.content',
    },
    {
      icon: Scale,
      titleKey: 'intellectualProperty.title',
      contentKey: 'intellectualProperty.content',
    },
    {
      icon: AlertTriangle,
      titleKey: 'limitations.title',
      contentKey: 'limitations.content',
    },
    {
      icon: Gavel,
      titleKey: 'governingLaw.title',
      contentKey: 'governingLaw.content',
    },
    {
      icon: RefreshCw,
      titleKey: 'changes.title',
      contentKey: 'changes.content',
    },
  ];

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
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gavel className="text-primary" size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-700">
              {t('subtitle')}
            </p>
            <p className="text-sm text-gray-500 mt-4">
              {t('lastUpdated')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-gray-700 leading-relaxed text-lg">
              {t('introduction')}
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                    <section.icon className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      {t(section.titleKey)}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {t(section.contentKey)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact for Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center bg-primary/10 rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {t('questions.title')}
            </h3>
            <p className="text-gray-700 mb-4">
              {t('questions.content')}
            </p>
            <a
              href="mailto:legal@sna-attal.com"
              className="text-primary font-semibold hover:underline"
            >
              legal@sna-attal.com
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

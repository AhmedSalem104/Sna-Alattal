'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Award, Shield, CheckCircle, Download, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';

interface Certificate {
  id: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  issuingBodyAr: string;
  issuingBodyEn: string;
  issuingBodyTr: string;
  image: string;
  issueDate: string;
  expiryDate: string | null;
}

const accreditations = [
  { name: 'TÜV SÜD', logo: '/images/placeholders/accreditation.svg' },
  { name: 'SGS', logo: '/images/placeholders/accreditation.svg' },
  { name: 'Bureau Veritas', logo: '/images/placeholders/accreditation.svg' },
  { name: 'Intertek', logo: '/images/placeholders/accreditation.svg' },
];

export default function CertificatesPage() {
  const t = useTranslations('certificatesPage');
  const { locale } = useLocale();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch('/api/public/certificates');
        if (response.ok) {
          const data = await response.json();
          setCertificates(data);
        }
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const getName = (cert: Certificate) => {
    switch (locale) {
      case 'ar': return cert.nameAr;
      case 'tr': return cert.nameTr;
      default: return cert.nameEn;
    }
  };

  const getDescription = (cert: Certificate) => {
    switch (locale) {
      case 'ar': return cert.descriptionAr;
      case 'tr': return cert.descriptionTr;
      default: return cert.descriptionEn;
    }
  };

  const getIssuingBody = (cert: Certificate) => {
    switch (locale) {
      case 'ar': return cert.issuingBodyAr;
      case 'tr': return cert.issuingBodyTr;
      default: return cert.issuingBodyEn;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  const colors = [
    'from-blue-500/20',
    'from-yellow-500/20',
    'from-green-500/20',
    'from-orange-500/20',
    'from-purple-500/20',
    'from-red-500/20',
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

      {/* Certificates Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-20">
              <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">{t('noCertificates')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group relative bg-gradient-to-br ${colors[index % colors.length]} to-white-50 rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all`}
                >
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="text-primary" size={24} />
                          <span className="text-xl font-bold text-primary">{getName(cert)}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{getIssuingBody(cert)}</h3>
                      </div>
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={cert.image || '/images/placeholders/certificate.svg'}
                          alt={getName(cert)}
                          fill
                          sizes="80px"
                          className="object-contain p-2"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-6">{getDescription(cert)}</p>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-100/50 rounded-xl p-4">
                        <p className="text-gray-600 text-sm">{t('issuedBy')}</p>
                        <p className="text-gray-900 font-medium">{getIssuingBody(cert)}</p>
                      </div>
                      <div className="bg-gray-100/50 rounded-xl p-4">
                        <p className="text-gray-600 text-sm">{t('validUntil')}</p>
                        <p className="text-gray-900 font-medium">{formatDate(cert.expiryDate)}</p>
                      </div>
                    </div>

                    {/* Download */}
                    <Button variant="outline" className="border-gray-300 text-gray-900 hover:bg-gray-100 w-full">
                      <Download size={18} className="ml-2" />
                      {t('downloadCertificate')}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('whyMatters.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('whyMatters.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: t('benefits.quality.title'),
                desc: t('benefits.quality.desc'),
              },
              {
                icon: CheckCircle,
                title: t('benefits.trust.title'),
                desc: t('benefits.trust.desc'),
              },
              {
                icon: Award,
                title: t('benefits.global.title'),
                desc: t('benefits.global.desc'),
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-white rounded-2xl border border-gray-200"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditation Partners */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('accreditation.title')}</h2>
            <p className="text-gray-600">{t('accreditation.subtitle')}</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8">
            {accreditations.map((acc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="w-32 h-32 bg-white rounded-xl flex items-center justify-center p-4"
              >
                <Image
                  src={acc.logo}
                  alt={acc.name}
                  width={80}
                  height={80}
                  className="object-contain transition-transform duration-300 hover:scale-110"
                />
              </motion.div>
            ))}
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
                <ArrowRight className="mr-2 rtl:rotate-180" size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

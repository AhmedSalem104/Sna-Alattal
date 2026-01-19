'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Check, ChevronLeft, Phone, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SolutionDetailPageProps {
  params: {
    slug: string;
  };
}

const solutionData = {
  'food-beverage': {
    titleKey: 'solutions.food.title',
    descKey: 'solutions.food.fullDesc',
    heroImage: '/images/solutions/food-beverage-hero.jpg',
    color: 'from-orange-500/20',
    sections: [
      {
        title: 'Complete Bottling Solutions',
        description: 'From water to complex beverages, we provide end-to-end bottling solutions designed for the food and beverage industry.',
        image: '/images/solutions/bottling.jpg',
      },
      {
        title: 'Aseptic Processing',
        description: 'State-of-the-art aseptic filling systems ensure product safety and extended shelf life without refrigeration.',
        image: '/images/solutions/aseptic.jpg',
      },
    ],
    products: [
      { name: 'Water Filling Lines', capacity: '2000-20000 BPH' },
      { name: 'Juice Processing Lines', capacity: '1000-10000 BPH' },
      { name: 'Oil Filling Systems', capacity: '500-6000 BPH' },
      { name: 'Sauce & Paste Fillers', capacity: '1000-8000 BPH' },
    ],
    certifications: ['FDA', 'HACCP', 'ISO 22000', 'CE'],
  },
};

export default function SolutionDetailPage({ params }: SolutionDetailPageProps) {
  const t = useTranslations('solutionDetail');
  const solution = solutionData[params.slug as keyof typeof solutionData] || solutionData['food-beverage'];

  return (
    <div className="min-h-screen bg-dark">
      {/* Breadcrumb */}
      <div className="bg-dark-50 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-primary transition-colors">
              {t('breadcrumb.home')}
            </Link>
            <ChevronLeft size={16} className="text-gray-600 rtl:rotate-180" />
            <Link href="/solutions" className="text-gray-400 hover:text-primary transition-colors">
              {t('breadcrumb.solutions')}
            </Link>
            <ChevronLeft size={16} className="text-gray-600 rtl:rotate-180" />
            <span className="text-primary">{t(solution.titleKey)}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={solution.heroImage}
            alt={t(solution.titleKey)}
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/80 to-dark" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {t(solution.titleKey)}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {t(solution.descKey)}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <Button variant="gold" size="lg">
                  <Phone size={18} className="ml-2" />
                  {t('getQuote')}
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <FileText size={18} className="ml-2" />
                {t('downloadCatalog')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {solution.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="relative h-80 rounded-2xl overflow-hidden">
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <h2 className="text-3xl font-bold text-white mb-4">{section.title}</h2>
                  <p className="text-gray-300 text-lg">{section.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Table */}
      <section className="py-20 bg-dark-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('availableProducts')}
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-dark rounded-2xl border border-white/10 overflow-hidden">
              <div className="grid grid-cols-2 gap-4 p-4 bg-primary/10 border-b border-white/10">
                <span className="text-primary font-semibold">{t('productName')}</span>
                <span className="text-primary font-semibold">{t('capacity')}</span>
              </div>
              {solution.products.map((product, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                >
                  <span className="text-white">{product.name}</span>
                  <span className="text-gray-400">{product.capacity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">{t('certifications')}</h2>
            <p className="text-gray-400">{t('certificationsDesc')}</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8">
            {solution.certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="w-32 h-32 flex items-center justify-center bg-dark-50 rounded-2xl border border-white/10"
              >
                <span className="text-2xl font-bold text-primary">{cert}</span>
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
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="gold" size="xl">
                  <Mail size={20} className="ml-2" />
                  {t('cta.contact')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

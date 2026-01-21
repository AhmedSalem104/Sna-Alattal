'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Utensils, Pill, Sparkles, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';

const solutions = [
  {
    id: 'food-beverages',
    icon: Utensils,
    titleAr: 'الأغذية والمشروبات',
    titleEn: 'Food & Beverages',
    descAr: 'حلول متكاملة لصناعة الأغذية والمشروبات',
    color: 'from-orange-500/20 to-orange-600/20',
    iconColor: 'text-orange-500',
  },
  {
    id: 'pharmaceuticals',
    icon: Pill,
    titleAr: 'الأدوية',
    titleEn: 'Pharmaceuticals',
    descAr: 'حلول متكاملة لصناعة الأدوية',
    color: 'from-blue-500/20 to-blue-600/20',
    iconColor: 'text-blue-500',
  },
  {
    id: 'cosmetics',
    icon: Sparkles,
    titleAr: 'مستحضرات التجميل',
    titleEn: 'Cosmetics',
    descAr: 'حلول متكاملة لصناعة مستحضرات التجميل',
    color: 'from-pink-500/20 to-pink-600/20',
    iconColor: 'text-pink-500',
  },
  {
    id: 'chemicals',
    icon: FlaskConical,
    titleAr: 'الكيماويات',
    titleEn: 'Chemicals',
    descAr: 'حلول متكاملة للصناعات الكيماوية',
    color: 'from-green-500/20 to-green-600/20',
    iconColor: 'text-green-500',
  },
];

export function SolutionsSection() {
  const t = useTranslations();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
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
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t('solutions.title')}
          </div>
          <h2 className="heading-2 text-gray-900 mb-4">{t('solutions.subtitle')}</h2>
          <p className="text-gray-600">{t('solutions.description')}</p>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/solutions/${solution.id}`}>
                <div className="group relative p-6 rounded-2xl bg-gray-100 border border-gray-200 hover:border-primary/50 transition-all duration-300 h-full">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-6 ${solution.iconColor} group-hover:scale-110 transition-transform`}>
                      <solution.icon size={28} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {solution.titleAr}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{solution.descAr}</p>

                    {/* Link */}
                    <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>اعرف المزيد</span>
                      <ArrowRight className="mr-2 rtl:rotate-180" size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useRef, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Linkedin, Mail, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';

const teamMembers = [
  {
    id: '1',
    nameAr: 'محمد العتال',
    nameEn: 'Mohamed Al-Attal',
    positionAr: 'المدير العام',
    positionEn: 'General Manager',
    image: '/images/team/member-1.jpg',
  },
  {
    id: '2',
    nameAr: 'أحمد محمود',
    nameEn: 'Ahmed Mahmoud',
    positionAr: 'مدير الإنتاج',
    positionEn: 'Production Manager',
    image: '/images/team/member-2.jpg',
  },
  {
    id: '3',
    nameAr: 'خالد إبراهيم',
    nameEn: 'Khaled Ibrahim',
    positionAr: 'مدير المبيعات',
    positionEn: 'Sales Manager',
    image: '/images/team/member-3.jpg',
  },
  {
    id: '4',
    nameAr: 'سارة أحمد',
    nameEn: 'Sara Ahmed',
    positionAr: 'مديرة التسويق',
    positionEn: 'Marketing Manager',
    image: '/images/team/member-4.jpg',
  },
];

export const TeamSection = memo(function TeamSection() {
  const t = useTranslations();
  const { isRTL } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-metal-50 relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Industrial Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 160, 10, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 160, 10, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-1 h-32 bg-primary" />
      <div className="absolute bottom-0 right-0 w-1 h-32 bg-primary" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 border-2 border-primary/30 bg-primary/5 px-4 py-2 mb-4">
              <Users size={16} className="text-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                {t('team.title')}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 uppercase tracking-wide">
              {t('team.subtitle')}
            </h2>

            {/* Gold Divider */}
            <div className="flex items-center gap-4 mt-4">
              <div className="h-1 w-16 bg-primary" />
              <div className="h-1 w-8 bg-primary/50" />
              <div className="h-1 w-4 bg-primary/25" />
            </div>

            <p className="text-metal-600 mt-4 max-w-xl">{t('team.description')}</p>
          </div>

          <Button variant="industrialOutline" asChild className="group shrink-0">
            <Link href="/team">
              {t('team.viewAll') || 'عرض الفريق'}
              <ArrowRight
                className={`${isRTL ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`}
                size={18}
              />
            </Link>
          </Button>
        </motion.div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative bg-white border-2 border-metal-200 overflow-hidden hover:border-primary transition-all duration-300">
                {/* Gold Accent Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-primary z-10" />

                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={member.image}
                    alt={isRTL ? member.nameAr : member.nameEn}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-steel-900 via-steel-900/30 to-transparent" />

                  {/* Social Links */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href="#"
                      className="w-10 h-10 bg-steel-900/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary hover:text-steel-900 transition-all"
                    >
                      <Linkedin size={18} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-steel-900/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary hover:text-steel-900 transition-all"
                    >
                      <Mail size={18} />
                    </a>
                  </div>

                  {/* Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider group-hover:text-primary transition-colors">
                      {isRTL ? member.nameAr : member.nameEn}
                    </h3>
                    <p className="text-sm text-primary font-semibold uppercase tracking-wider">
                      {isRTL ? member.positionAr : member.positionEn}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

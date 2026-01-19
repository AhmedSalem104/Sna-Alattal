'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Linkedin, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const teamMembers = [
  {
    id: '1',
    name: 'محمد العتال',
    nameEn: 'Mohamed Al-Attal',
    position: 'المدير العام',
    positionEn: 'General Manager',
    image: '/images/logo.jpg',
  },
  {
    id: '2',
    name: 'أحمد محمود',
    nameEn: 'Ahmed Mahmoud',
    position: 'مدير الإنتاج',
    positionEn: 'Production Manager',
    image: '/images/logo.jpg',
  },
  {
    id: '3',
    name: 'خالد إبراهيم',
    nameEn: 'Khaled Ibrahim',
    position: 'مدير المبيعات',
    positionEn: 'Sales Manager',
    image: '/images/logo.jpg',
  },
  {
    id: '4',
    name: 'سارة أحمد',
    nameEn: 'Sara Ahmed',
    position: 'مديرة التسويق',
    positionEn: 'Marketing Manager',
    image: '/images/logo.jpg',
  },
];

export function TeamSection() {
  const t = useTranslations();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-dark-50 relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-primary rounded-full" />
              {t('team.title')}
            </div>
            <h2 className="heading-2 text-white">{t('team.subtitle')}</h2>
            <p className="text-gray-400 mt-2 max-w-xl">{t('team.description')}</p>
          </div>

          <Button variant="goldOutline" asChild className="group shrink-0">
            <Link href="/team">
              عرض الفريق
              <ArrowRight className="mr-2 rtl:rotate-180 group-hover:translate-x-1 transition-transform" size={18} />
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
              <div className="relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />

                  {/* Social Links */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href="#"
                      className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary hover:text-dark transition-all"
                    >
                      <Linkedin size={18} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary hover:text-dark transition-all"
                    >
                      <Mail size={18} />
                    </a>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary/80">{member.position}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

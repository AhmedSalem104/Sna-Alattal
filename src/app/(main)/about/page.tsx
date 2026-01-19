'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Target,
  Eye,
  Award,
  Users,
  Globe,
  Factory,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const timeline = [
  { year: '1994', event: 'تأسيس شركة S.N.A العطال في مصر', eventEn: 'Founded S.N.A Al-Attal in Egypt' },
  { year: '2000', event: 'التوسع في خطوط الإنتاج', eventEn: 'Expanded production lines' },
  { year: '2010', event: 'افتتاح فرع تركيا', eventEn: 'Opened Turkey branch' },
  { year: '2015', event: 'الحصول على شهادة ISO 9001', eventEn: 'Achieved ISO 9001 certification' },
  { year: '2020', event: 'تصدير لأكثر من 15 دولة', eventEn: 'Exporting to 15+ countries' },
  { year: '2024', event: 'مشاريع جديدة في الخليج العربي', eventEn: 'New projects in Gulf region' },
];

const values = [
  {
    icon: Award,
    titleKey: 'values.quality.title',
    descKey: 'values.quality.desc',
  },
  {
    icon: Users,
    titleKey: 'values.team.title',
    descKey: 'values.team.desc',
  },
  {
    icon: Globe,
    titleKey: 'values.global.title',
    descKey: 'values.global.desc',
  },
  {
    icon: Factory,
    titleKey: 'values.innovation.title',
    descKey: 'values.innovation.desc',
  },
];

export default function AboutPage() {
  const t = useTranslations('aboutPage');

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-b from-primary/20 via-dark to-dark overflow-hidden">
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-300">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="relative h-96 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/about/factory.jpg"
                    alt="S.N.A Al-Attal Factory"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Experience Badge */}
                <div className="absolute -bottom-6 -left-6 bg-primary text-dark p-6 rounded-2xl shadow-xl">
                  <div className="text-4xl font-bold">30+</div>
                  <div className="text-sm font-medium">{t('yearsExperience')}</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t('story.title')}
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t('story.p1')}
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t('story.p2')}
              </p>
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-gray-400">{t('stats.projects')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">300+</div>
                  <div className="text-gray-400">{t('stats.clients')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">15+</div>
                  <div className="text-gray-400">{t('stats.countries')}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-dark-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-dark p-8 rounded-2xl border border-white/10"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Eye className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('vision.title')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('vision.content')}</p>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-dark p-8 rounded-2xl border border-white/10"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Target className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('mission.title')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('mission.content')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('values.title')}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('values.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-50 p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors group"
              >
                <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                  <value.icon className="text-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t(value.titleKey)}</h3>
                <p className="text-gray-400">{t(value.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-dark-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('timeline.title')}
            </h2>
            <p className="text-gray-400">{t('timeline.subtitle')}</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Line */}
              <div className="absolute top-0 bottom-0 right-1/2 w-px bg-primary/30 transform translate-x-1/2" />

              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-8 mb-8 ${
                    index % 2 === 0 ? 'flex-row-reverse text-right' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="bg-dark p-6 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="text-primary" size={18} />
                        <span className="text-primary font-bold">{item.year}</span>
                      </div>
                      <p className="text-gray-300">{item.event}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-primary rounded-full relative z-10 flex-shrink-0" />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
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

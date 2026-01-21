'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const newsArticles = [
  {
    id: '1',
    title: 'العتال تطلق خط إنتاج جديد متطور',
    excerpt: 'أعلنت شركة العتال للصناعات الهندسية عن إطلاق خط إنتاج جديد يعمل بأحدث التقنيات...',
    image: '/images/logo.jpg',
    date: '2024-01-20',
    category: 'أخبار الشركة',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'مشاركة متميزة في معرض جلفود 2024',
    excerpt: 'شاركت الشركة في معرض جلفود الدولي بدبي وحققت نجاحاً كبيراً...',
    image: '/images/logo.jpg',
    date: '2024-02-25',
    category: 'معارض',
    isFeatured: false,
  },
  {
    id: '3',
    title: 'شراكة استراتيجية جديدة مع كبرى الشركات',
    excerpt: 'وقعت الشركة اتفاقية شراكة استراتيجية مع عدد من الشركات العالمية...',
    image: '/images/logo.jpg',
    date: '2024-03-10',
    category: 'شراكات',
    isFeatured: false,
  },
];

export function NewsSection() {
  const t = useTranslations();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <section ref={ref} className="section-padding bg-gray-50 relative overflow-hidden">
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
              <Newspaper size={16} />
              {t('news.title')}
            </div>
            <h2 className="heading-2 text-gray-900">{t('news.subtitle')}</h2>
          </div>

          <Button variant="goldOutline" asChild className="group shrink-0">
            <Link href="/news">
              {t('news.viewAll')}
              <ArrowRight className="mr-2 rtl:rotate-180 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </Button>
        </motion.div>

        {/* News Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Featured Article */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Link href={`/news/${newsArticles[0].id}`}>
              <div className="group relative h-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 hover:border-primary/50 transition-all duration-300">
                <div className="relative aspect-[16/9] lg:aspect-auto lg:absolute lg:inset-0 overflow-hidden">
                  <Image
                    src={newsArticles[0].image}
                    alt={newsArticles[0].title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />
                </div>

                <div className="relative lg:absolute lg:bottom-0 lg:left-0 lg:right-0 p-6 lg:p-8">
                  <Badge variant="gold" className="mb-4">{newsArticles[0].category}</Badge>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-3">
                    {newsArticles[0].title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{newsArticles[0].excerpt}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} />
                    <span>{formatDate(newsArticles[0].date)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Other Articles */}
          <div className="space-y-6">
            {newsArticles.slice(1).map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
              >
                <Link href={`/news/${article.id}`}>
                  <div className="group flex gap-4 p-4 bg-gray-100 rounded-xl border border-gray-200 hover:border-primary/50 transition-all duration-300">
                    <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="96px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-primary mb-1">{article.category}</p>
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar size={12} />
                        <span>{formatDate(article.date)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

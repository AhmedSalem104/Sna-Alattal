'use client';

import { useRef, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/hooks/useLocale';

const newsArticles = [
  {
    id: '1',
    titleAr: 'العتال تطلق خط إنتاج جديد متطور',
    titleEn: 'Al-Attal Launches New Advanced Production Line',
    excerptAr: 'أعلنت شركة العتال للصناعات الهندسية عن إطلاق خط إنتاج جديد يعمل بأحدث التقنيات...',
    excerptEn: 'S.N.A Al-Attal Engineering Industries announces the launch of a new production line with the latest technologies...',
    image: '/images/news/news-1.jpg',
    date: '2024-01-20',
    categoryAr: 'أخبار الشركة',
    categoryEn: 'Company News',
    isFeatured: true,
  },
  {
    id: '2',
    titleAr: 'مشاركة متميزة في معرض جلفود 2024',
    titleEn: 'Distinguished Participation in Gulfood 2024',
    excerptAr: 'شاركت الشركة في معرض جلفود الدولي بدبي وحققت نجاحاً كبيراً...',
    excerptEn: 'The company participated in the Gulfood International Exhibition in Dubai and achieved great success...',
    image: '/images/news/news-2.jpg',
    date: '2024-02-25',
    categoryAr: 'معارض',
    categoryEn: 'Exhibitions',
    isFeatured: false,
  },
  {
    id: '3',
    titleAr: 'شراكة استراتيجية جديدة مع كبرى الشركات',
    titleEn: 'New Strategic Partnership with Major Companies',
    excerptAr: 'وقعت الشركة اتفاقية شراكة استراتيجية مع عدد من الشركات العالمية...',
    excerptEn: 'The company signed a strategic partnership agreement with several global companies...',
    image: '/images/news/news-3.jpg',
    date: '2024-03-10',
    categoryAr: 'شراكات',
    categoryEn: 'Partnerships',
    isFeatured: false,
  },
];

export const NewsSection = memo(function NewsSection() {
  const t = useTranslations();
  const { isRTL, locale } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

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
      <div className="absolute bottom-0 left-0 w-32 h-1 bg-primary" />
      <div className="absolute bottom-0 right-0 w-32 h-1 bg-primary" />

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
              <Newspaper size={16} className="text-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                {t('news.title')}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 uppercase tracking-wide">
              {t('news.subtitle')}
            </h2>

            {/* Gold Divider */}
            <div className="flex items-center gap-4 mt-4">
              <div className="h-1 w-16 bg-primary" />
              <div className="h-1 w-8 bg-primary/50" />
              <div className="h-1 w-4 bg-primary/25" />
            </div>
          </div>

          <Button variant="industrial" asChild className="group shrink-0">
            <Link href="/news">
              {t('news.viewAll')}
              <ArrowRight
                className={`${isRTL ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`}
                size={18}
              />
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
              <div className="group relative h-full bg-white border-2 border-metal-200 overflow-hidden hover:border-primary transition-all duration-300">
                {/* Gold Accent Bar */}
                <div className="absolute top-0 left-0 w-1 h-full bg-primary z-10" />

                <div className="relative aspect-[16/9] sm:aspect-[16/10] md:aspect-[2/1] overflow-hidden">
                  <Image
                    src={newsArticles[0].image}
                    alt={isRTL ? newsArticles[0].titleAr : newsArticles[0].titleEn}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-steel-900/80 via-steel-900/40 to-transparent" />

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <Badge variant="featured" className="mb-4">
                      {isRTL ? newsArticles[0].categoryAr : newsArticles[0].categoryEn}
                    </Badge>
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-primary transition-colors mb-3 uppercase tracking-wide">
                      {isRTL ? newsArticles[0].titleAr : newsArticles[0].titleEn}
                    </h3>
                    <p className="text-metal-300 mb-4 line-clamp-2">
                      {isRTL ? newsArticles[0].excerptAr : newsArticles[0].excerptEn}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-metal-400">
                      <Calendar size={14} />
                      <span>{formatDate(newsArticles[0].date)}</span>
                    </div>
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
                  <div className="group flex gap-4 p-4 bg-white border-2 border-metal-200 hover:border-primary transition-all duration-300">
                    {/* Gold Accent Bar */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative w-28 h-28 shrink-0 overflow-hidden border border-metal-200">
                      <Image
                        src={article.image}
                        alt={isRTL ? article.titleAr : article.titleEn}
                        fill
                        sizes="112px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-primary font-bold uppercase tracking-wider">
                        {isRTL ? article.categoryAr : article.categoryEn}
                      </span>
                      <h4 className="font-bold text-steel-900 group-hover:text-primary transition-colors line-clamp-2 mt-1 mb-2 uppercase tracking-wide text-sm">
                        {isRTL ? article.titleAr : article.titleEn}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-metal-500">
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
});

'use client';

import { useRef, memo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Calendar, ArrowRight, Newspaper, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/hooks/useLocale';

interface News {
  id: string;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  slug: string;
  excerptAr: string;
  excerptEn: string;
  excerptTr: string;
  image: string;
  publishedAt: string;
}

export const NewsSection = memo(function NewsSection() {
  const t = useTranslations();
  const { isRTL, locale } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/public/news?limit=3');
        if (response.ok) {
          const data = await response.json();
          setNews(Array.isArray(data) ? data : data.news || []);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getTitle = (article: News) => {
    if (locale === 'ar') return article.titleAr;
    if (locale === 'tr') return article.titleTr;
    return article.titleEn;
  };

  const getExcerpt = (article: News) => {
    if (locale === 'ar') return article.excerptAr;
    if (locale === 'tr') return article.excerptTr;
    return article.excerptEn;
  };

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Modern Subtle Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-3xl" />
        <div className="absolute top-0 left-0 w-80 h-80 bg-copper-500/5 blur-3xl" />
      </div>

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
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 mb-4">
              <Newspaper size={16} />
              <span className="text-sm font-semibold">
                {t('news.title')}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 tracking-tight">
              {t('news.subtitle')}
            </h2>

            {/* Modern Divider */}
            <div className="flex items-center gap-2 mt-4">
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/50" />
            </div>
          </div>

          <Button asChild className="group shrink-0">
            <Link href="/news">
              {t('news.viewAll')}
              <ArrowRight
                className={`${isRTL ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`}
                size={18}
              />
            </Link>
          </Button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!loading && news.length === 0 && (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-500 text-lg">{t('news.noNews')}</p>
          </div>
        )}

        {/* News Grid */}
        {!loading && news.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Featured Article */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <Link href={`/news/${news[0].slug}`}>
                <div className="group relative h-full bg-white border border-neutral-200 overflow-hidden hover:border-primary/30 hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300">
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                    <div className="relative aspect-[16/9] sm:aspect-[16/10] md:aspect-[2/1] overflow-hidden">
                      <Image
                        src={news[0].image || '/images/placeholders/news.svg'}
                        alt={getTitle(news[0])}
                        fill
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-steel-900/70 via-steel-900/30 to-transparent" />

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <Badge variant="gold" className="mb-4">
                          {t('news.title')}
                        </Badge>
                        <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-primary transition-colors mb-3">
                          {getTitle(news[0])}
                        </h3>
                        <p className="text-neutral-200 mb-4 line-clamp-2">
                          {getExcerpt(news[0])}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-neutral-300">
                          <Calendar size={14} />
                          <span>{formatDate(news[0].publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </Link>
            </motion.div>

            {/* Other Articles */}
            <div className="space-y-6">
              {news.slice(1).map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                >
                  <Link href={`/news/${article.slug}`}>
                    <div className="group flex gap-4 p-4 bg-white border border-neutral-200 hover:border-primary/30 hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300">
                      <div className="relative w-28 h-28 shrink-0 overflow-hidden">
                        <Image
                          src={article.image || '/images/placeholders/news.svg'}
                          alt={getTitle(article)}
                          fill
                          sizes="112px"
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-primary font-semibold">
                          {t('news.title')}
                        </span>
                        <h4 className="font-semibold text-steel-900 group-hover:text-primary transition-colors line-clamp-2 mt-1 mb-2 text-sm">
                          {getTitle(article)}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <Calendar size={12} />
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

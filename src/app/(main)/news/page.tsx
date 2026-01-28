'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Search, Loader2, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocale } from '@/hooks/useLocale';
import { getLocalizedField } from '@/lib/locale-helpers';

interface NewsArticle {
  id: string;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  slug: string;
  excerptAr?: string;
  excerptEn?: string;
  excerptTr?: string;
  contentAr?: string;
  contentEn?: string;
  contentTr?: string;
  image?: string;
  publishedAt: string;
  isFeatured: boolean;
  tags?: string[];
}

export default function NewsPage() {
  const t = useTranslations('newsPage');
  const { locale, isRTL } = useLocale();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/public/news');
        if (res.ok) {
          const data = await res.json();
          setArticles(data);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  const getTitle = (item: NewsArticle) => getLocalizedField(item, 'title', locale);
  const getExcerpt = (item: NewsArticle) => getLocalizedField(item, 'excerpt', locale);
  const getContent = (item: NewsArticle) => getLocalizedField(item, 'content', locale);

  const getArticleImage = (article: NewsArticle) => {
    return article.image || '/images/placeholders/news.svg';
  };

  const formatDate = (dateStr: string) => {
    const localeMap: Record<string, string> = {
      ar: 'ar-EG',
      en: 'en-US',
      tr: 'tr-TR',
    };
    return new Date(dateStr).toLocaleDateString(localeMap[locale] || 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateReadTime = (article: NewsArticle): string => {
    const content = getContent(article) || '';
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return locale === 'ar' ? `${minutes} دقائق` : locale === 'tr' ? `${minutes} dakika` : `${minutes} min`;
  };

  // Extract unique categories from tags
  const categories = useMemo(() => {
    const tagSet = new Set<string>();
    articles.forEach((article) => {
      if (article.tags) {
        article.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return [
      { id: 'all', labelAr: 'الكل', labelEn: 'All', labelTr: 'Tümü' },
      ...Array.from(tagSet).map((tag) => ({
        id: tag,
        labelAr: tag,
        labelEn: tag,
        labelTr: tag,
      })),
    ];
  }, [articles]);

  const getCategoryLabel = (category: { labelAr: string; labelEn: string; labelTr: string }) => {
    if (locale === 'ar') return category.labelAr;
    if (locale === 'tr') return category.labelTr;
    return category.labelEn;
  };

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === 'all' || (article.tags && article.tags.includes(selectedCategory));
    const title = getTitle(article).toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = articles.find((a) => a.isFeatured);
  const regularArticles = filteredArticles.filter((a) => !a.isFeatured);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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

      {/* Filters */}
      <section className="py-8 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-600`} size={20} />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${isRTL ? 'pl-10' : 'pr-10'} bg-gray-50 border-gray-200 text-gray-900`}
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'gold' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory !== category.id ? 'border-gray-300 text-gray-700 hover:text-primary' : ''}
                >
                  {getCategoryLabel(category)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && selectedCategory === 'all' && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href={`/news/${featuredArticle.slug}`}>
                <div className="group relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 hover:border-primary/50 transition-all">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Image */}
                    <div className="relative h-64 lg:h-96">
                      <Image
                        src={getArticleImage(featuredArticle)}
                        alt={getTitle(featuredArticle)}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} px-3 py-1 bg-primary text-gray-900 rounded-full text-sm font-medium`}>
                        {t('featured')}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-4 flex-wrap">
                        {featuredArticle.tags && featuredArticle.tags[0] && (
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600 text-sm">
                            {featuredArticle.tags[0]}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-gray-600 text-sm">
                          <Calendar size={14} />
                          {formatDate(featuredArticle.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600 text-sm">
                          <Clock size={14} />
                          {calculateReadTime(featuredArticle)}
                        </span>
                      </div>

                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                        {getTitle(featuredArticle)}
                      </h2>

                      {getExcerpt(featuredArticle) && (
                        <p className="text-gray-600 mb-6 line-clamp-3">
                          {getExcerpt(featuredArticle)}
                        </p>
                      )}

                      <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                        <span>{t('readMore')}</span>
                        <ArrowRight size={18} className={`${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {regularArticles.length === 0 && !featuredArticle ? (
            <div className="text-center py-20">
              <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-xl">{t('noArticles') || 'No articles found'}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={`/news/${article.slug}`}>
                      <div className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:border-primary/50 transition-all h-full">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={getArticleImage(article)}
                            alt={getTitle(article)}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {article.tags && article.tags[0] && (
                            <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} px-3 py-1 bg-white/80 backdrop-blur rounded-full text-gray-700 text-xs`}>
                              {article.tags[0]}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-center gap-4 mb-3">
                            <span className="flex items-center gap-1 text-gray-600 text-sm">
                              <Calendar size={14} />
                              {formatDate(article.publishedAt)}
                            </span>
                            <span className="flex items-center gap-1 text-gray-600 text-sm">
                              <Clock size={14} />
                              {calculateReadTime(article)}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {getTitle(article)}
                          </h3>

                          {getExcerpt(article) && (
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {getExcerpt(article)}
                            </p>
                          )}

                          <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                            <span>{t('readMore')}</span>
                            <ArrowRight size={16} className={`${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-primary/20 via-white to-primary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('newsletter.title')}</h2>
            <p className="text-gray-700 mb-8">{t('newsletter.subtitle')}</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder={t('newsletter.placeholder')}
                className="flex-1 bg-white border-gray-200 text-gray-900"
              />
              <Button variant="gold" size="lg">
                {t('newsletter.subscribe')}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

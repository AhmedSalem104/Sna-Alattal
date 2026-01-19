'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const categories = [
  { id: 'all', label: 'الكل', labelEn: 'All' },
  { id: 'news', label: 'أخبار', labelEn: 'News' },
  { id: 'events', label: 'فعاليات', labelEn: 'Events' },
  { id: 'press', label: 'صحافة', labelEn: 'Press' },
];

const articles = [
  {
    id: 1,
    slug: 'new-production-line-2024',
    titleKey: 'articles.1.title',
    excerptKey: 'articles.1.excerpt',
    image: '/images/news/article-1.jpg',
    category: 'news',
    date: '2024-01-15',
    readTime: '5 min',
    featured: true,
  },
  {
    id: 2,
    slug: 'gulfood-exhibition-2024',
    titleKey: 'articles.2.title',
    excerptKey: 'articles.2.excerpt',
    image: '/images/news/article-2.jpg',
    category: 'events',
    date: '2024-02-20',
    readTime: '3 min',
    featured: false,
  },
  {
    id: 3,
    slug: 'iso-certification-renewal',
    titleKey: 'articles.3.title',
    excerptKey: 'articles.3.excerpt',
    image: '/images/news/article-3.jpg',
    category: 'press',
    date: '2024-03-10',
    readTime: '4 min',
    featured: false,
  },
  {
    id: 4,
    slug: 'expansion-turkey-operations',
    titleKey: 'articles.4.title',
    excerptKey: 'articles.4.excerpt',
    image: '/images/news/article-4.jpg',
    category: 'news',
    date: '2024-04-05',
    readTime: '6 min',
    featured: false,
  },
  {
    id: 5,
    slug: 'partnership-announcement',
    titleKey: 'articles.5.title',
    excerptKey: 'articles.5.excerpt',
    image: '/images/news/article-5.jpg',
    category: 'press',
    date: '2024-05-12',
    readTime: '4 min',
    featured: false,
  },
  {
    id: 6,
    slug: 'industry-40-implementation',
    titleKey: 'articles.6.title',
    excerptKey: 'articles.6.excerpt',
    image: '/images/news/article-6.jpg',
    category: 'news',
    date: '2024-06-01',
    readTime: '7 min',
    featured: false,
  },
];

export default function NewsPage() {
  const t = useTranslations('newsPage');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesCategory;
  });

  const featuredArticle = articles.find((a) => a.featured);
  const regularArticles = filteredArticles.filter((a) => !a.featured);

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

      {/* Filters */}
      <section className="py-8 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-dark-50 border-white/10 text-white"
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
                  className={selectedCategory !== category.id ? 'border-white/20 text-gray-300 hover:text-white' : ''}
                >
                  {category.label}
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
                <div className="group relative rounded-2xl overflow-hidden bg-dark-50 border border-white/10 hover:border-primary/50 transition-all">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Image */}
                    <div className="relative h-64 lg:h-96">
                      <Image
                        src={featuredArticle.image}
                        alt={t(featuredArticle.titleKey)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-dark rounded-full text-sm font-medium">
                        {t('featured')}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 bg-white/10 rounded-full text-gray-400 text-sm">
                          {t(`categories.${featuredArticle.category}`)}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400 text-sm">
                          <Calendar size={14} />
                          {new Date(featuredArticle.date).toLocaleDateString('ar-EG')}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400 text-sm">
                          <Clock size={14} />
                          {featuredArticle.readTime}
                        </span>
                      </div>

                      <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                        {t(featuredArticle.titleKey)}
                      </h2>

                      <p className="text-gray-400 mb-6 line-clamp-3">
                        {t(featuredArticle.excerptKey)}
                      </p>

                      <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                        <span>{t('readMore')}</span>
                        <ArrowRight size={18} className="mr-1 rtl:rotate-180" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/news/${article.slug}`}>
                  <div className="group bg-dark-50 rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all h-full">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.image}
                        alt={t(article.titleKey)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-dark/80 backdrop-blur rounded-full text-gray-300 text-xs">
                        {t(`categories.${article.category}`)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="flex items-center gap-1 text-gray-400 text-sm">
                          <Calendar size={14} />
                          {new Date(article.date).toLocaleDateString('ar-EG')}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400 text-sm">
                          <Clock size={14} />
                          {article.readTime}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {t(article.titleKey)}
                      </h3>

                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {t(article.excerptKey)}
                      </p>

                      <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                        <span>{t('readMore')}</span>
                        <ArrowRight size={16} className="mr-1 rtl:rotate-180" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-white/20 text-gray-300 hover:text-white">
              {t('loadMore')}
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-primary/20 via-dark to-primary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">{t('newsletter.title')}</h2>
            <p className="text-gray-300 mb-8">{t('newsletter.subtitle')}</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder={t('newsletter.placeholder')}
                className="flex-1 bg-dark border-white/10 text-white"
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

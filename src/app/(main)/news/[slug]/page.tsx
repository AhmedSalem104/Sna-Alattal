'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, Share2, Facebook, Twitter, Linkedin, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

interface NewsArticle {
  id: string;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  contentAr: string;
  contentEn: string;
  contentTr: string;
  excerptAr: string;
  excerptEn: string;
  excerptTr: string;
  slug: string;
  image: string;
  publishedAt: string;
  relatedNews: {
    id: string;
    titleAr: string;
    titleEn: string;
    titleTr: string;
    slug: string;
    image: string;
    publishedAt: string;
  }[];
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = use(params);
  const t = useTranslations('newsDetail');
  const { locale } = useLocale();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/public/news/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('notFound');
          } else {
            setError('fetchError');
          }
          return;
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('fetchError');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const getTitle = (item: { titleAr: string; titleEn: string; titleTr: string }) => {
    switch (locale) {
      case 'ar': return item.titleAr;
      case 'tr': return item.titleTr;
      default: return item.titleEn;
    }
  };

  const getContent = (item: { contentAr: string; contentEn: string; contentTr: string }) => {
    switch (locale) {
      case 'ar': return item.contentAr;
      case 'tr': return item.contentTr;
      default: return item.contentEn;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeMap = { ar: 'ar-EG', tr: 'tr-TR', en: 'en-US' };
    return date.toLocaleDateString(localeMap[locale as keyof typeof localeMap] || 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} ${locale === 'ar' ? 'دقيقة' : locale === 'tr' ? 'dakika' : 'min'}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-neutral-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            {error === 'notFound' ? t('errors.notFound') : t('errors.fetchError')}
          </h1>
          <p className="text-neutral-600 mb-6">
            {error === 'notFound' ? t('errors.notFoundDesc') : t('errors.fetchErrorDesc')}
          </p>
          <Link href="/news">
            <Button variant="gold">{t('backToNews')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const content = getContent(article);
  const title = getTitle(article);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-neutral-600 hover:text-primary transition-colors">
              {t('breadcrumb.home')}
            </Link>
            <ChevronLeft size={16} className="text-neutral-600 rtl:rotate-180" />
            <Link href="/news" className="text-neutral-600 hover:text-primary transition-colors">
              {t('breadcrumb.news')}
            </Link>
            <ChevronLeft size={16} className="text-neutral-600 rtl:rotate-180" />
            <span className="text-primary truncate max-w-xs">{title}</span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <section className="relative h-64 md:h-96 lg:h-[500px]">
        <Image
          src={article.image || '/images/placeholders/news.svg'}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-4 mb-6"
            >
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                {t('categories.news')}
              </span>
              <span className="flex items-center gap-1 text-neutral-600 text-sm">
                <Calendar size={14} />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1 text-neutral-600 text-sm">
                <Clock size={14} />
                {calculateReadTime(content)}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-8"
            >
              {title}
            </motion.h1>

            {/* Author */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 mb-8 pb-8 border-b border-neutral-200"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">S</span>
              </div>
              <div>
                <p className="text-neutral-900 font-medium">
                  {locale === 'ar' ? 'فريق S.N.A العطال' : locale === 'tr' ? 'S.N.A Al-Attal Ekibi' : 'S.N.A Al-Attal Team'}
                </p>
                <p className="text-neutral-600 text-sm">{t('writtenBy')}</p>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="prose prose-lg max-w-none"
            >
              <div
                className="text-neutral-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
              />
            </motion.div>

            {/* Share */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 mt-12 pt-8 border-t border-neutral-200"
            >
              <span className="text-neutral-600">{t('share')}:</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="hover:bg-neutral-100">
                  <Facebook size={20} className="text-neutral-600" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-neutral-100">
                  <Twitter size={20} className="text-neutral-600" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-neutral-100">
                  <Linkedin size={20} className="text-neutral-600" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-neutral-100">
                  <Share2 size={20} className="text-neutral-600" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {article.relatedNews && article.relatedNews.length > 0 && (
        <section className="py-20 bg-neutral-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">{t('relatedArticles')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {article.relatedNews.map((related, index) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/news/${related.slug}`}>
                    <div className="group bg-white rounded-xl overflow-hidden border border-neutral-200 hover:border-primary/50 hover:shadow-lg transition-all">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={related.image || '/images/placeholders/news.svg'}
                          alt={getTitle(related)}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <span className="text-neutral-600 text-sm">
                          {formatDate(related.publishedAt)}
                        </span>
                        <h3 className="text-neutral-900 font-medium mt-2 group-hover:text-primary transition-colors line-clamp-2">
                          {getTitle(related)}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to News */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <Link href="/news">
            <Button variant="outline" size="lg" className="border-neutral-300 text-neutral-700 hover:text-primary">
              <ArrowRight className="ml-2 rtl:rotate-180" size={18} />
              {t('backToNews')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

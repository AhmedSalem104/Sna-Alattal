'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, Share2, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsDetailPageProps {
  params: {
    slug: string;
  };
}

const articleData = {
  'new-production-line-2024': {
    titleKey: 'articles.1.title',
    contentKey: 'articles.1.content',
    image: '/images/news/article-1.jpg',
    category: 'news',
    date: '2024-01-15',
    readTime: '5 min',
    author: 'فريق S.N.A العطال',
    authorImage: '/images/team/member-1.jpg',
  },
};

const relatedArticles = [
  {
    id: 2,
    slug: 'gulfood-exhibition-2024',
    titleKey: 'articles.2.title',
    image: '/images/news/article-2.jpg',
    date: '2024-02-20',
  },
  {
    id: 3,
    slug: 'iso-certification-renewal',
    titleKey: 'articles.3.title',
    image: '/images/news/article-3.jpg',
    date: '2024-03-10',
  },
];

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const t = useTranslations('newsDetail');
  const article = articleData[params.slug as keyof typeof articleData] || articleData['new-production-line-2024'];

  return (
    <div className="min-h-screen bg-dark">
      {/* Breadcrumb */}
      <div className="bg-dark-50 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-primary transition-colors">
              {t('breadcrumb.home')}
            </Link>
            <ChevronLeft size={16} className="text-gray-600 rtl:rotate-180" />
            <Link href="/news" className="text-gray-400 hover:text-primary transition-colors">
              {t('breadcrumb.news')}
            </Link>
            <ChevronLeft size={16} className="text-gray-600 rtl:rotate-180" />
            <span className="text-primary truncate max-w-xs">{t(article.titleKey)}</span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <section className="relative h-64 md:h-96 lg:h-[500px]">
        <Image
          src={article.image}
          alt={t(article.titleKey)}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
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
                {t(`categories.${article.category}`)}
              </span>
              <span className="flex items-center gap-1 text-gray-400 text-sm">
                <Calendar size={14} />
                {new Date(article.date).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1 text-gray-400 text-sm">
                <Clock size={14} />
                {article.readTime}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8"
            >
              {t(article.titleKey)}
            </motion.h1>

            {/* Author */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={article.authorImage}
                  alt={article.author}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-white font-medium">{article.author}</p>
                <p className="text-gray-400 text-sm">{t('writtenBy')}</p>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="prose prose-lg prose-invert max-w-none"
            >
              <p className="text-gray-300 leading-relaxed mb-6">
                {t(article.contentKey)}
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                نحن في S.N.A العطال ملتزمون بتقديم أحدث التقنيات في مجال خطوط التعبئة والتغليف.
                خط الإنتاج الجديد يمثل نقلة نوعية في قدراتنا التصنيعية ويعكس التزامنا بالتطوير المستمر.
              </p>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">مميزات خط الإنتاج الجديد</h2>
              <ul className="space-y-3 text-gray-300">
                <li>سرعة إنتاج تصل إلى 6000 زجاجة في الساعة</li>
                <li>دقة تعبئة عالية تصل إلى ±0.5%</li>
                <li>نظام تحكم ذكي متكامل</li>
                <li>توافق مع معايير ISO و CE</li>
                <li>كفاءة طاقة محسنة بنسبة 30%</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-6 mb-6">
                هذا التطوير يأتي في إطار خطتنا الاستراتيجية للتوسع وتلبية الطلب المتزايد من عملائنا
                في منطقة الشرق الأوسط وشمال أفريقيا. نحن فخورون بأن نكون الرائدين في هذا المجال.
              </p>
            </motion.div>

            {/* Share */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 mt-12 pt-8 border-t border-white/10"
            >
              <span className="text-gray-400">{t('share')}:</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <Facebook size={20} className="text-gray-400" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <Twitter size={20} className="text-gray-400" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <Linkedin size={20} className="text-gray-400" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <Share2 size={20} className="text-gray-400" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-20 bg-dark-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">{t('relatedArticles')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedArticles.map((related, index) => (
              <motion.div
                key={related.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/news/${related.slug}`}>
                  <div className="group flex gap-4 bg-dark rounded-xl p-4 border border-white/10 hover:border-primary/50 transition-all">
                    <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={related.image}
                        alt={t(related.titleKey)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-400 text-sm">
                        {new Date(related.date).toLocaleDateString('ar-EG')}
                      </span>
                      <h3 className="text-white font-medium mt-1 group-hover:text-primary transition-colors line-clamp-2">
                        {t(related.titleKey)}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Back to News */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <Link href="/news">
            <Button variant="outline" size="lg" className="border-white/20 text-gray-300 hover:text-white">
              <ArrowRight className="ml-2 rtl:rotate-180" size={18} />
              {t('backToNews')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Download, FileText, Eye, ArrowRight, Search, Book, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocale } from '@/hooks/useLocale';

interface Catalogue {
  id: string;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  image: string | null;
  fileUrl: string;
  fileSize: string | null;
  pages: number | null;
  isFeatured: boolean;
  category: {
    id: string;
    nameAr: string;
    nameEn: string;
    nameTr: string;
    slug: string;
  } | null;
}

export default function CataloguesPage() {
  const t = useTranslations('cataloguesPage');
  const { locale } = useLocale();
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCatalogues = async () => {
      try {
        const response = await fetch('/api/public/catalogues');
        if (response.ok) {
          const data = await response.json();
          setCatalogues(data);
        }
      } catch (error) {
        console.error('Error fetching catalogues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogues();
  }, []);

  const getTitle = (cat: Catalogue) => {
    switch (locale) {
      case 'ar': return cat.titleAr;
      case 'tr': return cat.titleTr;
      default: return cat.titleEn;
    }
  };

  const getDescription = (cat: Catalogue) => {
    switch (locale) {
      case 'ar': return cat.descriptionAr;
      case 'tr': return cat.descriptionTr;
      default: return cat.descriptionEn;
    }
  };

  const getCategoryName = (cat: Catalogue) => {
    if (!cat.category) return '';
    switch (locale) {
      case 'ar': return cat.category.nameAr;
      case 'tr': return cat.category.nameTr;
      default: return cat.category.nameEn;
    }
  };

  const filteredCatalogues = catalogues.filter((cat) => {
    if (!searchQuery) return true;
    const title = getTitle(cat).toLowerCase();
    const description = getDescription(cat).toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || description.includes(query);
  });

  const featuredCatalogue = filteredCatalogues.find((c) => c.isFeatured);
  const regularCatalogues = filteredCatalogues.filter((c) => !c.isFeatured);

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

      {/* Search */}
      <section className="py-8 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-gray-50 border-gray-200 text-gray-900"
              />
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : catalogues.length === 0 ? (
        <div className="text-center py-20">
          <Book className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">{t('noCatalogues')}</p>
        </div>
      ) : (
        <>
          {/* Featured Catalogue */}
          {featuredCatalogue && (
            <section className="py-12">
              <div className="container mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative bg-gradient-to-r from-primary/20 to-white-50 rounded-2xl overflow-hidden border border-primary/30"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image */}
                    <div className="relative h-64 lg:h-96">
                      <Image
                        src={featuredCatalogue.image || '/images/placeholders/catalogue.svg'}
                        alt={getTitle(featuredCatalogue)}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-gray-900 rounded-full text-sm font-medium flex items-center gap-1">
                        <Book size={14} />
                        {t('featured')}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">{getTitle(featuredCatalogue)}</h2>
                      <p className="text-gray-700 mb-6">{getDescription(featuredCatalogue)}</p>

                      <div className="flex flex-wrap gap-4 mb-8">
                        {featuredCatalogue.pages && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100/50 rounded-lg">
                            <FileText className="text-primary" size={18} />
                            <span className="text-gray-700">{featuredCatalogue.pages} {t('pages')}</span>
                          </div>
                        )}
                        {featuredCatalogue.fileSize && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100/50 rounded-lg">
                            <Download className="text-primary" size={18} />
                            <span className="text-gray-700">{featuredCatalogue.fileSize}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <a href={featuredCatalogue.fileUrl} download target="_blank" rel="noopener noreferrer">
                          <Button variant="gold" size="lg">
                            <Download size={18} className="ml-2" />
                            {t('download')}
                          </Button>
                        </a>
                        <a href={featuredCatalogue.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="lg" className="border-gray-300 text-gray-900 hover:bg-gray-100">
                            <Eye size={18} className="ml-2" />
                            {t('preview')}
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          {/* Catalogues Grid */}
          {regularCatalogues.length > 0 && (
            <section className="py-12">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularCatalogues.map((catalogue, index) => (
                    <motion.div
                      key={catalogue.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:border-primary/50 transition-all"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={catalogue.image || '/images/placeholders/catalogue.svg'}
                          alt={getTitle(catalogue)}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white-50 to-transparent" />
                        {catalogue.category && (
                          <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 rounded text-xs text-gray-700">
                            {getCategoryName(catalogue)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{getTitle(catalogue)}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{getDescription(catalogue)}</p>

                        <div className="flex items-center gap-4 mb-4 text-sm">
                          {catalogue.pages && (
                            <span className="flex items-center gap-1 text-gray-600">
                              <FileText size={14} />
                              {catalogue.pages} {t('pages')}
                            </span>
                          )}
                          {catalogue.fileSize && (
                            <span className="flex items-center gap-1 text-gray-600">
                              <Download size={14} />
                              {catalogue.fileSize}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <a href={catalogue.fileUrl} download target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button variant="gold" size="sm" className="w-full">
                              <Download size={16} className="ml-1" />
                              {t('download')}
                            </Button>
                          </a>
                          <a href={catalogue.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:text-primary">
                              <Eye size={16} />
                            </Button>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Request Custom Catalogue */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="text-primary" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('custom.title')}</h2>
            <p className="text-gray-700 mb-8">{t('custom.subtitle')}</p>
            <Link href="/contact">
              <Button variant="gold" size="xl">
                {t('custom.button')}
                <ArrowRight className="mr-2 rtl:rotate-180" size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/20 via-white to-primary/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
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

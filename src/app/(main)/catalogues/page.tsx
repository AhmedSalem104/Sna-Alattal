'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Download, FileText, Eye, ArrowRight, Filter, Search, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const categories = [
  { id: 'all', label: 'الكل', labelEn: 'All' },
  { id: 'filling', label: 'آلات التعبئة', labelEn: 'Filling Machines' },
  { id: 'capping', label: 'آلات الغلق', labelEn: 'Capping Machines' },
  { id: 'labeling', label: 'آلات الملصقات', labelEn: 'Labeling Machines' },
  { id: 'complete', label: 'خطوط كاملة', labelEn: 'Complete Lines' },
];

const catalogues = [
  {
    id: 1,
    title: 'الكتالوج الرئيسي 2024',
    titleEn: 'Main Catalogue 2024',
    description: 'كتالوج شامل لجميع منتجاتنا وخدماتنا',
    descriptionEn: 'Comprehensive catalogue of all our products and services',
    image: '/images/catalogues/main-catalogue.jpg',
    category: 'all',
    pages: 120,
    size: '15.2 MB',
    downloadUrl: '/catalogues/main-catalogue-2024.pdf',
    featured: true,
  },
  {
    id: 2,
    title: 'آلات التعبئة',
    titleEn: 'Filling Machines',
    description: 'جميع آلات التعبئة السائلة واللزجة',
    descriptionEn: 'All liquid and viscous filling machines',
    image: '/images/catalogues/filling-catalogue.jpg',
    category: 'filling',
    pages: 45,
    size: '8.5 MB',
    downloadUrl: '/catalogues/filling-machines.pdf',
    featured: false,
  },
  {
    id: 3,
    title: 'آلات الغلق والسدادات',
    titleEn: 'Capping & Sealing Machines',
    description: 'حلول الغلق والسدادات لجميع أنواع العبوات',
    descriptionEn: 'Capping and sealing solutions for all container types',
    image: '/images/catalogues/capping-catalogue.jpg',
    category: 'capping',
    pages: 32,
    size: '6.2 MB',
    downloadUrl: '/catalogues/capping-machines.pdf',
    featured: false,
  },
  {
    id: 4,
    title: 'آلات الملصقات',
    titleEn: 'Labeling Machines',
    description: 'آلات وضع الملصقات الأوتوماتيكية ونصف الأوتوماتيكية',
    descriptionEn: 'Automatic and semi-automatic labeling machines',
    image: '/images/catalogues/labeling-catalogue.jpg',
    category: 'labeling',
    pages: 28,
    size: '5.8 MB',
    downloadUrl: '/catalogues/labeling-machines.pdf',
    featured: false,
  },
  {
    id: 5,
    title: 'خطوط الإنتاج المتكاملة',
    titleEn: 'Complete Production Lines',
    description: 'خطوط إنتاج متكاملة لمختلف الصناعات',
    descriptionEn: 'Complete production lines for various industries',
    image: '/images/catalogues/complete-lines.jpg',
    category: 'complete',
    pages: 56,
    size: '12.4 MB',
    downloadUrl: '/catalogues/complete-lines.pdf',
    featured: false,
  },
  {
    id: 6,
    title: 'قطع الغيار والصيانة',
    titleEn: 'Spare Parts & Maintenance',
    description: 'دليل قطع الغيار وجداول الصيانة',
    descriptionEn: 'Spare parts guide and maintenance schedules',
    image: '/images/catalogues/spare-parts.jpg',
    category: 'all',
    pages: 64,
    size: '9.1 MB',
    downloadUrl: '/catalogues/spare-parts.pdf',
    featured: false,
  },
];

export default function CataloguesPage() {
  const t = useTranslations('cataloguesPage');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCatalogues = catalogues.filter((cat) => {
    const matchesCategory = selectedCategory === 'all' || cat.category === selectedCategory || cat.category === 'all';
    return matchesCategory;
  });

  const featuredCatalogue = catalogues.find((c) => c.featured);
  const regularCatalogues = filteredCatalogues.filter((c) => !c.featured);

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
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-gray-50 border-gray-200 text-gray-900"
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
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Catalogue */}
      {featuredCatalogue && selectedCategory === 'all' && (
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
                    src={featuredCatalogue.image}
                    alt={featuredCatalogue.title}
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{featuredCatalogue.title}</h2>
                  <p className="text-gray-700 mb-6">{featuredCatalogue.description}</p>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100/50 rounded-lg">
                      <FileText className="text-primary" size={18} />
                      <span className="text-gray-700">{featuredCatalogue.pages} {t('pages')}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100/50 rounded-lg">
                      <Download className="text-primary" size={18} />
                      <span className="text-gray-700">{featuredCatalogue.size}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <a href={featuredCatalogue.downloadUrl} download>
                      <Button variant="gold" size="lg">
                        <Download size={18} className="ml-2" />
                        {t('download')}
                      </Button>
                    </a>
                    <Button variant="outline" size="lg" className="border-gray-300 text-gray-900 hover:bg-gray-100">
                      <Eye size={18} className="ml-2" />
                      {t('preview')}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Catalogues Grid */}
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
                    src={catalogue.image}
                    alt={catalogue.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white-50 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{catalogue.title}</h3>
                  <p className="text-gray-600 mb-4">{catalogue.description}</p>

                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-600">
                      <FileText size={14} />
                      {catalogue.pages} {t('pages')}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Download size={14} />
                      {catalogue.size}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <a href={catalogue.downloadUrl} download className="flex-1">
                      <Button variant="gold" size="sm" className="w-full">
                        <Download size={16} className="ml-1" />
                        {t('download')}
                      </Button>
                    </a>
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:text-primary">
                      <Eye size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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

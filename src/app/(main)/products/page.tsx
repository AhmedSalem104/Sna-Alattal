'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowRight, Star, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const categories = [
  { id: 'all', nameKey: 'categories.all' },
  { id: 'filling', nameKey: 'categories.filling' },
  { id: 'capping', nameKey: 'categories.capping' },
  { id: 'labeling', nameKey: 'categories.labeling' },
  { id: 'packaging', nameKey: 'categories.packaging' },
  { id: 'complete', nameKey: 'categories.complete' },
];

const products = [
  {
    id: 1,
    slug: 'automatic-filling-machine',
    nameKey: 'products.filling1.name',
    descKey: 'products.filling1.desc',
    image: '/images/products/filling-machine.jpg',
    category: 'filling',
    featured: true,
    specs: ['2000-6000 BPH', 'Servo Motor', 'Touch Screen'],
  },
  {
    id: 2,
    slug: 'semi-automatic-filling',
    nameKey: 'products.filling2.name',
    descKey: 'products.filling2.desc',
    image: '/images/products/semi-filling.jpg',
    category: 'filling',
    featured: false,
    specs: ['500-2000 BPH', 'PLC Control', 'Easy Operation'],
  },
  {
    id: 3,
    slug: 'automatic-capping-machine',
    nameKey: 'products.capping1.name',
    descKey: 'products.capping1.desc',
    image: '/images/products/capping-machine.jpg',
    category: 'capping',
    featured: true,
    specs: ['3000-8000 BPH', 'Multi-head', 'Auto Adjustment'],
  },
  {
    id: 4,
    slug: 'labeling-machine',
    nameKey: 'products.labeling1.name',
    descKey: 'products.labeling1.desc',
    image: '/images/products/labeling-machine.jpg',
    category: 'labeling',
    featured: false,
    specs: ['4000-10000 BPH', 'Precision Labeling', 'Dual Heads'],
  },
  {
    id: 5,
    slug: 'shrink-wrapper',
    nameKey: 'products.packaging1.name',
    descKey: 'products.packaging1.desc',
    image: '/images/products/shrink-wrapper.jpg',
    category: 'packaging',
    featured: false,
    specs: ['20-30 packs/min', 'Auto Film Feeding', 'Touch Panel'],
  },
  {
    id: 6,
    slug: 'complete-production-line',
    nameKey: 'products.complete1.name',
    descKey: 'products.complete1.desc',
    image: '/images/products/complete-line.jpg',
    category: 'complete',
    featured: true,
    specs: ['Fully Automated', 'Customizable', 'High Efficiency'],
  },
];

export default function ProductsPage() {
  const t = useTranslations('productsPage');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.nameKey.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

      {/* Filters Section */}
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

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'gold' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory !== category.id ? 'border-white/20 text-gray-300 hover:text-white' : ''}
                >
                  {t(category.nameKey)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">{t('noProducts')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/products/${product.slug}`}>
                    <div className="group relative bg-dark-50 rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300">
                      {/* Featured Badge */}
                      {product.featured && (
                        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-3 py-1 bg-primary text-dark rounded-full text-sm font-medium">
                          <Star size={14} fill="currentColor" />
                          {t('featured')}
                        </div>
                      )}

                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-50 via-transparent to-transparent z-10" />
                        <Image
                          src={product.image}
                          alt={t(product.nameKey)}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                          {t(product.nameKey)}
                        </h3>
                        <p className="text-gray-400 mb-4 line-clamp-2">
                          {t(product.descKey)}
                        </p>

                        {/* Specs */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.specs.map((spec, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                          <span>{t('viewDetails')}</span>
                          <ArrowRight size={18} className="mr-1 rtl:rotate-180" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
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

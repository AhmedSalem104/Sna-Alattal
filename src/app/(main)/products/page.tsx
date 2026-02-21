'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Star, Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocale } from '@/hooks/useLocale';
import { getLocalizedField } from '@/lib/locale-helpers';


interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  slug: string;
  _count?: { products: number };
}

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  slug: string;
  shortDescAr?: string;
  shortDescEn?: string;
  shortDescTr?: string;
  images: string[];
  categoryId: string;
  isFeatured: boolean;
  specifications?: Record<string, string>;
  category?: {
    id: string;
    nameAr: string;
    nameEn: string;
    nameTr: string;
    slug: string;
  };
}

export default function ProductsPage() {
  const t = useTranslations('productsPage');
  const { locale, isRTL } = useLocale();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/public/products'),
          fetch('/api/public/categories'),
        ]);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getName = (item: Product | Category) => getLocalizedField(item, 'name', locale);
  const getShortDesc = (item: Product) => getLocalizedField(item, 'shortDesc', locale);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    const productName = getName(product).toLowerCase();
    const matchesSearch = productName.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return '/images/placeholders/product.svg';
  };

  const getSpecifications = (product: Product): string[] => {
    if (!product.specifications) return [];
    return Object.values(product.specifications).slice(0, 3);
  };

  return (
    <>
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-neutral-700">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-neutral-600`} size={20} />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${isRTL ? 'pl-10' : 'pr-10'} bg-neutral-50 border-neutral-200 text-neutral-900`}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'gold' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory !== 'all' ? 'border-neutral-300 text-neutral-700 hover:text-primary' : ''}
              >
                {t('categories.all')}
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'gold' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory !== category.id ? 'border-neutral-300 text-neutral-700 hover:text-primary' : ''}
                >
                  {getName(category)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Package size={48} className="mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-600 text-xl">{t('noProducts')}</p>
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
                    <div className="group relative overflow-hidden hover:shadow-elevation-3 transition-all duration-500">
                      {/* Featured Badge */}
                      {product.isFeatured && (
                        <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-10 flex items-center gap-1 px-3 py-1 bg-primary text-neutral-900 rounded-full text-sm font-medium`}>
                          <Star size={14} fill="currentColor" />
                          {t('featured')}
                        </div>
                      )}

                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-white-50 via-transparent to-transparent z-10" />
                        <Image
                          src={getProductImage(product)}
                          alt={getName(product)}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Category Tag */}
                        {product.category && (
                          <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded mb-2">
                            {getLocalizedField(product.category, 'name', locale)}
                          </span>
                        )}

                        <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary transition-colors">
                          {getName(product)}
                        </h3>

                        {getShortDesc(product) && (
                          <p className="text-neutral-600 mb-4 line-clamp-2">
                            {getShortDesc(product)}
                          </p>
                        )}

                        {/* Specs */}
                        {getSpecifications(product).length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {getSpecifications(product).map((spec, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* CTA */}
                        <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                          <span>{t('viewDetails')}</span>
                          <ArrowRight size={18} className={`${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
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
      <section className="py-20 bg-gradient-to-r from-primary/20 via-white to-primary/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-neutral-700 mb-8 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <Link href="/contact">
              <Button variant="gold" size="xl">
                {t('cta.button')}
                <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

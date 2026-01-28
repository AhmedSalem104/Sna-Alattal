'use client';

import { useRef, memo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/hooks/useLocale';

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  slug: string;
  images: string[];
  isFeatured: boolean;
  category?: {
    id: string;
    nameAr: string;
    nameEn: string;
    nameTr: string;
    slug: string;
  };
}

export const ProductsSection = memo(function ProductsSection() {
  const t = useTranslations();
  const { isRTL, locale } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/public/products?limit=4');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const getName = (product: Product) => {
    if (locale === 'ar') return product.nameAr;
    if (locale === 'tr') return product.nameTr;
    return product.nameEn;
  };

  const getCategoryName = (category?: Product['category']) => {
    if (!category) return '';
    if (locale === 'ar') return category.nameAr;
    if (locale === 'tr') return category.nameTr;
    return category.nameEn;
  };

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return '/images/placeholders/product.svg';
  };

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Modern Subtle Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-copper-500/5 rounded-full blur-3xl" />
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
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Package size={16} />
              <span className="text-sm font-semibold">
                {t('products.title')}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 tracking-tight">
              {t('products.subtitle')}
            </h2>

            {/* Modern Divider */}
            <div className="flex items-center gap-2 mt-4">
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
            </div>
          </div>

          <Button asChild className="group shrink-0">
            <Link href="/products">
              {t('products.viewAll')}
              <ArrowRight
                className={`${isRTL ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`}
                size={18}
              />
            </Link>
          </Button>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto text-metal-300 mb-4" />
            <p className="text-metal-500">{t('common.noData')}</p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/products/${product.slug}`} className="block h-full">
                  <div className="group bg-white rounded-2xl border border-neutral-200 hover:border-primary/30 hover:shadow-soft-lg transition-all duration-300 overflow-hidden h-full">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                      <Image
                        src={getProductImage(product)}
                        alt={getName(product)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={index < 2}
                        loading={index < 2 ? undefined : 'lazy'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-steel-900/40 via-transparent to-transparent" />

                      {/* Featured Badge */}
                      {product.isFeatured && (
                        <Badge
                          variant="gold"
                          className="absolute top-4 right-4 z-10"
                        >
                          {t('products.featured') || 'مميز'}
                        </Badge>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-soft">
                          <ArrowUpRight size={24} className="text-primary" />
                        </div>
                      </div>

                      {/* Category Tag on Image */}
                      {product.category && (
                        <div className="absolute bottom-4 left-4 z-10">
                          <span className="inline-block px-3 py-1.5 bg-white/90 backdrop-blur-sm text-steel-800 text-xs font-medium rounded-full">
                            {getCategoryName(product.category)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-steel-900 font-semibold group-hover:text-primary transition-colors line-clamp-2 text-base">
                        {getName(product)}
                      </h3>

                      {/* View Details Link */}
                      <div className="mt-3 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>{t('products.viewDetails') || 'عرض التفاصيل'}</span>
                        <ArrowRight
                          size={16}
                          className={`${isRTL ? 'mr-1 rotate-180' : 'ml-1'} transition-transform group-hover:translate-x-1`}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-neutral-600 mb-8 text-lg">
            {t('products.cta_text') ||
              'اكتشف مجموعتنا الكاملة من ماكينات التعبئة والتغليف'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/products">
                {t('products.browseAll') || 'تصفح جميع المنتجات'}
              </Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/contact">
                {t('products.requestQuote') || 'طلب عرض سعر'}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

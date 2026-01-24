'use client';

import { useRef, memo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Package, Cog, Loader2 } from 'lucide-react';
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
    return '/images/placeholder-product.jpg';
  };

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-metal-50 relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Industrial Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 160, 10, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 160, 10, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        {/* Decorative Gear */}
        <div className="absolute -top-20 -left-20 text-primary/5">
          <Cog size={200} strokeWidth={0.5} />
        </div>
      </div>

      {/* Top Industrial Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-primary" />

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
            <div className="inline-flex items-center gap-2 border-2 border-primary/30 bg-primary/5 px-4 py-2 mb-4">
              <Package size={16} className="text-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                {t('products.title')}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 uppercase tracking-wide">
              {t('products.subtitle')}
            </h2>

            {/* Gold Divider */}
            <div className="flex items-center gap-4 mt-4">
              <div className="h-1 w-16 bg-primary" />
              <div className="h-1 w-8 bg-primary/50" />
              <div className="h-1 w-4 bg-primary/25" />
            </div>
          </div>

          <Button variant="industrial" asChild className="group shrink-0">
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
                  <div className="group bg-white border-2 border-metal-200 hover:border-primary transition-all duration-300 overflow-hidden h-full relative">
                    {/* Gold Accent Bar */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary z-10 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={getProductImage(product)}
                        alt={getName(product)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        priority={index < 2}
                        loading={index < 2 ? undefined : 'lazy'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-steel-900/60 to-transparent" />

                      {/* Featured Badge */}
                      {product.isFeatured && (
                        <Badge
                          variant="featured"
                          className="absolute top-4 right-4 z-10"
                        >
                          {t('products.featured') || 'مميز'}
                        </Badge>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-14 h-14 bg-primary flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <ArrowUpRight size={28} className="text-steel-900" />
                        </div>
                      </div>

                      {/* Category Tag on Image */}
                      {product.category && (
                        <div className="absolute bottom-4 left-4 z-10">
                          <span className="inline-block px-3 py-1 bg-steel-900/80 text-white text-xs font-bold uppercase tracking-wider">
                            {getCategoryName(product.category)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 border-t-2 border-metal-100">
                      <h3 className="text-steel-900 font-bold group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-wide text-sm">
                        {getName(product)}
                      </h3>

                      {/* View Details Link */}
                      <div className="mt-3 flex items-center text-primary text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>{t('products.viewDetails') || 'عرض التفاصيل'}</span>
                        <ArrowRight
                          size={14}
                          className={`${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`}
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
          className="mt-12 text-center"
        >
          <p className="text-metal-600 mb-6">
            {t('products.cta_text') ||
              'اكتشف مجموعتنا الكاملة من ماكينات التعبئة والتغليف'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="industrialOutline" size="lg" asChild>
              <Link href="/products">
                {t('products.browseAll') || 'تصفح جميع المنتجات'}
              </Link>
            </Button>
            <Button variant="industrialDark" size="lg" asChild>
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

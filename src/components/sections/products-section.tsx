'use client';

import { useRef, memo, useState, useEffect } from 'react';
import { ImageWithSkeleton } from '@/components/ui/image-with-skeleton';
import { TiltCard } from '@/components/ui/tilt-card';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView, type Variants } from 'framer-motion';
import { ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IndustrialSpinner } from '@/components/ui/industrial-spinner';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';
import { IndustrialGear } from '@/components/decorative';

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

  const gridContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 60, scale: 0.88 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-white/[0.93] relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Industrial grid background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(26, 26, 46, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(26, 26, 46, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <IndustrialGear size={450} teeth={18} className="absolute -bottom-20 -right-20 text-primary opacity-[0.20] hidden md:block" strokeWidth={2} />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
        >
          <div>
            <div className="inline-flex items-center gap-2 border-2 border-primary/30 bg-primary/5 px-4 py-2 mb-4">
              <Package size={16} className="text-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                {t('products.title')}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 uppercase tracking-wide">
              {t('products.subtitle')}
            </h2>

            {/* Industrial divider */}
            <div className="flex items-center gap-4 mt-4">
              <div className="h-1 w-8 bg-primary/25" />
              <div className="h-1 w-16 bg-primary/50" />
              <div className="h-1 w-24 bg-primary" />
            </div>
          </div>

          <Button asChild variant="industrial" className="group shrink-0">
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
            <IndustrialSpinner size="md" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto text-metal-300 mb-4" />
            <p className="text-metal-500">{t('common.noData')}</p>
          </div>
        ) : (
          /* Products Grid */
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={gridContainerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={cardVariants}
              >
                <TiltCard className="h-full">
                <Link href={`/products/${product.slug}`} className="block h-full">
                  <div className="group relative overflow-hidden h-full hover:shadow-elevation-3 transition-all duration-500">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <ImageWithSkeleton
                        src={getProductImage(product)}
                        alt={getName(product)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                        wrapperClassName="absolute inset-0"
                        loading="lazy"
                      />

                      {/* Featured indicator */}
                      {product.isFeatured && (
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-primary border-l-[40px] border-l-transparent z-10" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 pt-4">
                      {product.category && (
                        <span className="text-xs text-primary font-bold uppercase tracking-wider">
                          {getCategoryName(product.category)}
                        </span>
                      )}

                      <h3 className="text-steel-900 font-bold text-base uppercase tracking-wide mt-1 group-hover:text-primary transition-colors line-clamp-2">
                        {getName(product)}
                      </h3>

                      {/* Gold underline - reveals on hover */}
                      <div className={cn("h-0.5 w-0 group-hover:w-12 bg-primary transition-all duration-500 mt-2", isRTL ? "mr-0" : "ml-0")} />

                      <div className={cn(
                        "mt-3 flex items-center gap-2 text-sm font-semibold text-metal-400 group-hover:text-primary transition-colors",
                      )}>
                        <span>{t('products.viewDetails') || 'التفاصيل'}</span>
                        <ArrowRight
                          size={14}
                          className={cn(
                            "transition-transform duration-300",
                            isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"
                          )}
                        />
                      </div>
                    </div>

                    {/* Side gold accent bar on hover */}
                    <div className={cn(
                      "absolute top-0 w-1 h-full bg-primary z-10 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500",
                      isRTL ? "right-0" : "left-0"
                    )} />
                  </div>
                </Link>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-metal-600 mb-8 text-lg">
            {t('products.cta_text') ||
              'اكتشف مجموعتنا الكاملة من ماكينات التعبئة والتغليف'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/products">
                {t('products.browseAll') || 'تصفح جميع المنتجات'}
              </Link>
            </Button>
            <Button variant="industrial" size="lg" asChild>
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

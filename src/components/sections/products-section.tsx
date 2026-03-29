'use client';

import { useRef, memo, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ImageWithSkeleton } from '@/components/ui/image-with-skeleton';
import { TiltCard } from '@/components/ui/tilt-card';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView, AnimatePresence, type Variants } from 'framer-motion';
import { ArrowRight, Package, X, CheckCircle } from 'lucide-react';
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
  descriptionAr?: string;
  descriptionEn?: string;
  descriptionTr?: string;
  shortDescAr?: string;
  shortDescEn?: string;
  shortDescTr?: string;
  slug: string;
  images: string[];
  isFeatured: boolean;
  specifications?: Record<string, string>;
  features?: string[];
  category?: {
    id: string;
    nameAr: string;
    nameEn: string;
    nameTr: string;
    slug: string;
  };
}

interface ProductDetail extends Product {
  relatedProducts?: Product[];
}

export const ProductsSection = memo(function ProductsSection() {
  const t = useTranslations();
  const { isRTL, locale } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerProduct, setDrawerProduct] = useState<ProductDetail | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

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

  // Open drawer with full product details
  const openDrawer = useCallback(async (slug: string) => {
    setDrawerLoading(true);
    setDrawerProduct(null);
    try {
      const res = await fetch(`/api/public/products/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setDrawerProduct(data);
      }
    } catch (e) { console.error(e); }
    finally { setDrawerLoading(false); }
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerProduct(null);
  }, []);

  // Lock scroll when drawer open
  useEffect(() => {
    if (drawerProduct || drawerLoading) {
      document.body.style.overflow = 'hidden';
      const navbar = document.querySelector('header');
      if (navbar) (navbar as HTMLElement).style.zIndex = '0';
    } else {
      document.body.style.overflow = '';
      const navbar = document.querySelector('header');
      if (navbar) (navbar as HTMLElement).style.zIndex = '';
    }
    return () => {
      document.body.style.overflow = '';
      const navbar = document.querySelector('header');
      if (navbar) (navbar as HTMLElement).style.zIndex = '';
    };
  }, [drawerProduct, drawerLoading]);

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
      className="py-20 lg:py-28 bg-white/80 relative overflow-hidden"
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

      <IndustrialGear size={450} teeth={18} className="absolute -bottom-20 -right-20 text-primary opacity-[0.40] hidden md:block" strokeWidth={2.5} />

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
                <div onClick={() => openDrawer(product.slug)} className="block h-full cursor-pointer">
                  <div className="group relative overflow-hidden h-full border border-primary/20 hover:border-primary/60 hover:shadow-elevation-3 transition-all duration-500">
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
                </div>
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
          </div>
        </motion.div>
      </div>

      {/* Product Drawer */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {(drawerProduct || drawerLoading) && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={closeDrawer}
              />
              <motion.div
                className={cn(
                  'fixed z-[101] bg-white overflow-y-auto overscroll-contain shadow-2xl',
                  'inset-x-0 bottom-0 top-[5vh] rounded-t-2xl',
                  'md:inset-y-0 md:rounded-none md:top-0',
                  isRTL ? 'md:left-0 md:right-auto md:w-[65vw] xl:w-[55vw]' : 'md:right-0 md:left-auto md:w-[65vw] xl:w-[55vw]'
                )}
                initial={{ x: isRTL ? '-100%' : '100%' }}
                animate={{ x: 0 }}
                exit={{ x: isRTL ? '-100%' : '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              >
                <button onClick={closeDrawer}
                  className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm border border-neutral-200 hover:border-primary rounded-full shadow-md">
                  <X size={18} className="text-steel-900" />
                </button>

                {drawerLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <IndustrialSpinner size="md" />
                  </div>
                ) : drawerProduct ? (
                  <>
                    {/* Image */}
                    <div className="relative h-64 md:h-80 bg-neutral-50 overflow-hidden">
                      <Image
                        src={drawerProduct.images?.[0] || '/images/placeholders/product.jpg'}
                        alt={getName(drawerProduct)}
                        fill
                        className="object-contain p-6"
                        sizes="(max-width: 768px) 100vw, 55vw"
                      />
                    </div>

                    {/* Name + Category */}
                    <div className="px-5 md:px-8 py-4 border-b border-neutral-100">
                      {drawerProduct.category && (
                        <span className="text-xs text-primary font-bold uppercase tracking-wider">
                          {getCategoryName(drawerProduct.category)}
                        </span>
                      )}
                      <h3 className="text-xl md:text-2xl font-black text-steel-900 uppercase mt-1">
                        {getName(drawerProduct)}
                      </h3>
                    </div>

                    {/* Content - two columns */}
                    <div className="p-5 md:p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Col 1: Description + Features */}
                        <div>
                          {(() => {
                            const desc = locale === 'ar' ? drawerProduct.descriptionAr : locale === 'tr' ? drawerProduct.descriptionTr : drawerProduct.descriptionEn;
                            return desc ? <p className="text-neutral-600 text-sm leading-relaxed mb-4">{desc}</p> : null;
                          })()}

                          {drawerProduct.features && drawerProduct.features.length > 0 && (
                            <div>
                              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.15em] mb-2 block">
                                {locale === 'ar' ? 'المميزات' : 'FEATURES'}
                              </span>
                              <div className="space-y-1.5">
                                {drawerProduct.features.map((f: string, i: number) => (
                                  <div key={i} className="flex items-start gap-2 text-xs text-neutral-600">
                                    <CheckCircle size={12} className="text-primary mt-0.5 shrink-0" />
                                    {f}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Col 2: Specifications */}
                        {drawerProduct.specifications && Object.keys(drawerProduct.specifications).length > 0 && (
                          <div>
                            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.15em] mb-2 block">
                              {locale === 'ar' ? 'المواصفات الفنية' : 'SPECIFICATIONS'}
                            </span>
                            <div className="border border-neutral-200 divide-y divide-neutral-100">
                              {Object.entries(drawerProduct.specifications).map(([key, val]) => (
                                <div key={key} className={cn("flex justify-between px-3 py-2 text-xs", isRTL && "flex-row-reverse")}>
                                  <span className="text-neutral-400 capitalize">{key.replace(/_/g, ' ')}</span>
                                  <span className="text-steel-900 font-semibold">{String(val)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Additional images */}
                      {drawerProduct.images && drawerProduct.images.length > 1 && (
                        <div className="mt-6">
                          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.15em] mb-2 block">
                            {locale === 'ar' ? 'صور إضافية' : 'MORE IMAGES'}
                          </span>
                          <div className="flex gap-2 overflow-x-auto">
                            {drawerProduct.images.slice(1).map((img: string, i: number) => (
                              <div key={i} className="relative w-24 h-24 shrink-0 bg-neutral-50 border border-neutral-200">
                                <Image src={img} alt="" fill className="object-contain p-2" sizes="96px" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
});

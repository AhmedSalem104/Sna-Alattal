'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';
import { getLocalizedField } from '@/lib/locale-helpers';
import { cn } from '@/lib/utils';
import { getProducts, getCategories } from '@/lib/static-data';


interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  slug: string;
  descriptionAr?: string;
  descriptionEn?: string;
  descriptionTr?: string;
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
  descriptionAr?: string;
  descriptionEn?: string;
  descriptionTr?: string;
  images: string[];
  categoryId: string;
  isFeatured: boolean;
  specifications?: Record<string, string>;
  features?: string[];
  featuresEn?: string[];
  models?: Array<Record<string, string>>;
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
  const isAr = locale === 'ar';
  const [products] = useState<Product[]>(() => getProducts() as unknown as Product[]);
  const [categories] = useState<Category[]>(() => getCategories() as unknown as Category[]);
  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);

  // Drawer controls
  const closeDrawer = useCallback(() => setDrawerProduct(null), []);

  useEffect(() => {
    if (drawerProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerProduct]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getName = (item: any) => getLocalizedField(item, 'name', locale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getShortDesc = (item: any) => getLocalizedField(item, 'shortDesc', locale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDesc = (item: any) => getLocalizedField(item, 'description', locale);

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

  const [activeTab, setActiveTab] = useState<string>('all');

  // Read hash on mount and scroll to category
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      setActiveTab(id);
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (attempts < 10) {
          attempts++;
          setTimeout(tryScroll, 200);
        }
      };
      setTimeout(tryScroll, 300);
    }
  }, []);

  const displayedCategories = activeTab === 'all'
    ? categories
    : categories.filter(c => c.id === activeTab);

  return (
    <>
      {/* Compact Header + Tabs */}
      <section className="pt-20 pb-6 bg-white border-b border-neutral-200 sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
              {t('title')}
            </h1>
            <a href="/downloads/products-catalog.pdf" download="SNA-Products-Catalog.pdf"
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 px-5 py-3 transition-all duration-300 shadow-lg">
              <Download size={16} className="text-steel-900" />
              <div>
                <div className="text-steel-900 font-bold text-xs uppercase tracking-wider">
                  {isAr ? 'تحميل الكتالوج' : 'Download Catalog'}
                </div>
                <div className="text-steel-900/50 text-[9px]">PDF</div>
              </div>
            </a>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                'px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 border',
                activeTab === 'all'
                  ? 'bg-primary text-steel-900 border-primary'
                  : 'bg-white text-neutral-500 border-neutral-200 hover:border-primary/50 hover:text-primary'
              )}
            >
              {isAr ? 'الكل' : 'All'}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTab(cat.id);
                  setTimeout(() => {
                    document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className={cn(
                  'px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 border',
                  activeTab === cat.id
                    ? 'bg-primary text-steel-900 border-primary'
                    : 'bg-white text-neutral-500 border-neutral-200 hover:border-primary/50 hover:text-primary'
                )}
              >
                {getName(cat)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products by Category */}
      {displayedCategories.map((category, catIndex) => {
          const categoryProducts = products.filter(p => p.categoryId === category.id);
          if (categoryProducts.length === 0) return null;

          return (
            <section
              key={category.id}
              id={category.id}
              className={`py-16 scroll-mt-20 ${catIndex % 2 === 1 ? 'bg-neutral-50' : 'bg-white'}`}
            >
              <div className="container mx-auto px-4">
                {/* Category Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-[2px] bg-primary" />
                    <span className="text-primary text-xs font-bold uppercase tracking-[0.2em]">
                      {categoryProducts.length} {isAr ? 'منتجات' : 'Products'}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
                    {getName(category)}
                  </h2>
                  <p className="text-neutral-600 max-w-2xl">
                    {getLocalizedField(category as any, 'description', locale)}
                  </p>
                </motion.div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                    >
                      <div
                        onClick={() => setDrawerProduct(product)}
                        className="group relative bg-white border border-neutral-200 overflow-hidden hover:border-primary/60 transition-all duration-500 h-full flex flex-col cursor-pointer"
                      >
                        {/* Image */}
                        <div className="relative h-52 overflow-hidden bg-neutral-50">
                          <Image
                            src={getProductImage(product)}
                            alt={getName(product)}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="text-base font-bold text-neutral-900 mb-1 group-hover:text-primary transition-colors uppercase">
                            {getName(product)}
                          </h3>

                          {getShortDesc(product) && (
                            <p className="text-neutral-500 text-xs mb-3 line-clamp-2">
                              {getShortDesc(product)}
                            </p>
                          )}

                          {/* Specs */}
                          {getSpecifications(product).length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {getSpecifications(product).map((spec, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* CTA */}
                          <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mt-auto pt-3">
                            <span>{isAr ? 'استكشف' : 'EXPLORE'}</span>
                            <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

      {/* CTA Section */}
      <section className="py-10 md:py-14 bg-gradient-to-r from-primary/20 via-white to-primary/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-neutral-700 mb-6 max-w-2xl mx-auto">
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

      {/* ═══════════════════════════════════════════════════════
          PRODUCT DRAWER (slide-in panel)
          ═══════════════════════════════════════════════════════ */}
      {typeof document !== 'undefined' && createPortal(
      <AnimatePresence>
        {drawerProduct && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
            />

            {/* Drawer - side panel */}
            <motion.div
              className={cn(
                'fixed z-[101] bg-white overflow-y-auto overscroll-contain shadow-2xl',
                'inset-x-0 bottom-0 top-[5vh] rounded-t-2xl',
                'md:inset-y-0 md:rounded-none md:top-0',
                isRTL
                  ? 'md:left-0 md:right-auto md:w-[80vw] lg:w-[75vw] xl:w-[70vw]'
                  : 'md:right-0 md:left-auto md:w-[80vw] lg:w-[75vw] xl:w-[70vw]'
              )}
              initial={{ x: isRTL ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Close button */}
              <button
                onClick={closeDrawer}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm border border-neutral-200 hover:border-primary transition-colors rounded-full shadow-md"
              >
                <X size={18} className="text-steel-900" />
              </button>

              {/* Mobile drag handle */}
              <div className="md:hidden flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-neutral-300 rounded-full" />
              </div>

              {/* Product image - FULL */}
              <div className="relative h-[400px] md:h-[550px] bg-neutral-50 overflow-hidden">
                <Image
                  src={getProductImage(drawerProduct)}
                  alt={getName(drawerProduct)}
                  fill
                  className="object-contain p-4 md:p-8"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  priority
                />
              </div>

              {/* Name + category + model */}
              <div className="px-5 md:px-8 py-4 border-b-4 border-primary">
                {drawerProduct.category && (
                  <span className="text-[10px] px-3 py-1 bg-primary text-steel-900 font-bold uppercase tracking-wider mb-3 inline-block">
                    {getName(drawerProduct.category)}
                  </span>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-steel-900 uppercase mb-1">
                      {getName(drawerProduct)}
                    </h3>
                    <p className="text-neutral-400 text-base">
                      {isAr ? drawerProduct.nameEn : drawerProduct.nameAr}
                    </p>
                  </div>
                  {drawerProduct.specifications?.model && (
                    <div className="shrink-0 bg-primary px-5 py-3 text-center">
                      <div className="text-steel-900/60 text-[10px] font-bold uppercase tracking-wider">{isAr ? 'الموديل' : 'MODEL'}</div>
                      <div className="text-steel-900 font-black text-lg md:text-xl">{drawerProduct.specifications.model}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-8">

                {/* Description */}
                {getDesc(drawerProduct) && (
                  <div className="mb-5">
                    <p className="text-neutral-600 text-base leading-relaxed">
                      {getDesc(drawerProduct)}
                    </p>
                  </div>
                )}

                {/* Specifications */}
                {drawerProduct.specifications && Object.keys(drawerProduct.specifications).length > 0 && (
                  <div className="mb-5">
                    <span className="text-primary text-sm font-bold uppercase tracking-[0.15em] mb-3 block">
                      {isAr ? 'المواصفات' : 'SPECIFICATIONS'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(drawerProduct.specifications).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center px-3 py-2 bg-neutral-50 border border-neutral-100">
                          <span className="text-neutral-400 capitalize text-sm">{key.replace(/_/g, ' ')}</span>
                          <span className="text-steel-900 font-bold text-sm">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Models - Slider */}
                {drawerProduct.models && drawerProduct.models.length > 0 && (
                  <ProductModelsSlider models={drawerProduct.models} isAr={isAr} />
                )}

                {/* Features */}
                {(() => {
                  const features = isAr
                    ? (drawerProduct.features || [])
                    : (drawerProduct.featuresEn || drawerProduct.features || []);
                  if (features.length === 0) return null;
                  return (
                    <div className="mb-4">
                      <span className="text-primary text-sm font-bold uppercase tracking-[0.15em]">
                        {isAr ? 'المميزات' : 'FEATURES'}
                      </span>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                        {features.map((f: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-base text-neutral-600">
                            <div className="w-1 h-1 bg-primary rounded-full mt-2 shrink-0" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
      )}
    </>
  );
}

// ─── Product Models Slider ─────────────────────────
function ProductModelsSlider({ models, isAr }: { models: Array<Record<string, string>>; isAr: boolean }) {
  const [idx, setIdx] = useState(0);
  const headers = Object.keys(models[0]);
  const model = models[idx];

  return (
    <div className="mb-5 -mx-5 md:-mx-8 px-5 md:px-8 py-5 bg-steel-900">
      <div className="flex items-center justify-between mb-4">
        <span className="text-primary text-base font-bold uppercase tracking-[0.15em]">
          {isAr ? 'الموديلات' : 'MODELS'} ({models.length})
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setIdx(prev => prev > 0 ? prev - 1 : models.length - 1); }}
            className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-primary/30 text-white hover:text-primary transition-colors"
          >
            <ArrowRight size={14} className="rotate-180" />
          </button>
          <span className="text-white/50 text-xs px-2 tabular-nums">{idx + 1} / {models.length}</span>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx(prev => prev < models.length - 1 ? prev + 1 : 0); }}
            className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-primary/30 text-white hover:text-primary transition-colors"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Model Tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {models.map((m, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setIdx(i); }}
            className={cn(
              'px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border shrink-0',
              idx === i
                ? 'bg-primary text-steel-900 border-primary'
                : 'bg-white/5 text-white/50 border-white/10 hover:border-primary/40 hover:text-primary'
            )}
          >
            {m[headers[0]] || `#${i + 1}`}
          </button>
        ))}
      </div>

      {/* Active Model Card */}
      <motion.div
        key={idx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/5 border border-primary/20 p-5"
      >
        {model[headers[0]] && (
          <div className="text-primary font-black text-xl mb-4 pb-3 border-b border-primary/20">
            {model[headers[0]]}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          {headers.slice(1).map(h => (
            model[h] ? (
              <div key={h}>
                <div className="text-white/30 text-xs uppercase tracking-wider mb-1">{h.replace(/_/g, ' ')}</div>
                <div className="text-white/90 text-base font-semibold">{model[h]}</div>
              </div>
            ) : null
          ))}
        </div>
      </motion.div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {models.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setIdx(i); }}
            className={cn(
              'h-1.5 rounded-full transition-all',
              idx === i ? 'w-6 bg-primary' : 'w-1.5 bg-white/20 hover:bg-white/40'
            )}
          />
        ))}
      </div>
    </div>
  );
}

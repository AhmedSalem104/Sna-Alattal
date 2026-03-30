'use client';

import { useRef, memo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView, type Variants } from 'framer-motion';
import { ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IndustrialSpinner } from '@/components/ui/industrial-spinner';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';
import { IndustrialGear } from '@/components/decorative';
import categoriesData from '@/data/categories.json';

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  slug: string;
  descriptionAr?: string;
  descriptionEn?: string;
  descriptionTr?: string;
  image?: string;
  _count?: { products: number };
}

export const ProductsSection = memo(function ProductsSection() {
  const t = useTranslations();
  const { isRTL, locale } = useLocale();
  const isAr = locale === 'ar';
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [categories] = useState<Category[]>(() => (categoriesData as any[]).filter(c => c.isActive && !c.deletedAt).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) as Category[]);
  const loading = false;
  const [activeTab, setActiveTab] = useState<string>('all');

  const getName = (item: Category) => {
    if (locale === 'ar') return item.nameAr;
    if (locale === 'tr') return item.nameTr;
    return item.nameEn;
  };

  const getDesc = (item: Category) => {
    if (locale === 'ar') return item.descriptionAr || '';
    if (locale === 'tr') return item.descriptionTr || '';
    return item.descriptionEn || '';
  };

  const filteredCategories = activeTab === 'all'
    ? categories
    : categories.filter(c => c.id === activeTab);

  const gridContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
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
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 border-2 border-primary/30 bg-primary/5 px-4 py-2 mb-4">
              <Package size={16} className="text-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                {t('products.title')}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 uppercase tracking-wide">
              {isAr ? 'خطوط إنتاج متكاملة' : 'Complete Production Lines'}
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

        {/* Filter Tabs */}
        {!loading && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-10"
          >
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
                onClick={() => setActiveTab(cat.id)}
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
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <IndustrialSpinner size="md" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto text-metal-300 mb-4" />
            <p className="text-metal-500">{t('common.noData')}</p>
          </div>
        ) : (
          /* Categories Grid */
          <motion.div
            key={activeTab}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredCategories.map((category) => (
              <motion.div
                key={category.id}
                variants={cardVariants}
              >
                <Link href={`/products#${category.id}`} className="block h-full">
                  <div className="group relative overflow-hidden h-full border border-neutral-200 hover:border-primary/60 hover:shadow-elevation-3 transition-all duration-500 bg-white">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-neutral-50">
                      <Image
                        src={category.image || '/images/placeholders/product.svg'}
                        alt={getName(category)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />

                      {/* Product count badge */}
                      <div className="absolute top-3 right-3 bg-primary text-steel-900 text-xs font-bold px-2.5 py-1">
                        {category._count?.products || 0} {isAr ? 'منتج' : 'Products'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-steel-900 font-bold text-base md:text-lg uppercase tracking-wide group-hover:text-primary transition-colors">
                        {getName(category)}
                      </h3>

                      <p className="text-neutral-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {getDesc(category)}
                      </p>

                      {/* Gold underline on hover */}
                      <div className={cn("h-0.5 w-0 group-hover:w-12 bg-primary transition-all duration-500 mt-3", isRTL ? "mr-0" : "ml-0")} />

                      <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-neutral-400 group-hover:text-primary transition-colors">
                        <span>{isAr ? 'استكشف' : 'Explore'}</span>
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
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
});

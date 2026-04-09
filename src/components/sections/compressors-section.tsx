'use client';

import { useRef, memo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView, type Variants } from 'framer-motion';
import { ArrowRight, Wind, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';
import compressorsData from '@/data/compressors.json';

interface Compressor {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  shortDescAr: string;
  shortDescEn: string;
  shortDescTr: string;
  image: string;
  models: Array<Record<string, string>>;
}

export const CompressorsSection = memo(function CompressorsSection() {
  const t = useTranslations();
  const { isRTL, locale } = useLocale();
  const isAr = locale === 'ar';
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [compressors] = useState<Compressor[]>(() => (compressorsData as any[]).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)).slice(0, 6) as Compressor[]);

  const getName = (item: Compressor) => {
    if (locale === 'ar') return item.nameAr;
    if (locale === 'tr') return item.nameTr;
    return item.nameEn;
  };

  const getShortDesc = (item: Compressor) => {
    if (locale === 'ar') return item.shortDescAr;
    if (locale === 'tr') return item.shortDescTr;
    return item.shortDescEn;
  };

  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      ref={ref}
      className="py-12 lg:py-16 bg-white relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(26,26,46,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,46,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 mb-4">
              <Wind size={16} className="text-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                {isAr ? 'ضواغط الهواء' : 'AIR COMPRESSORS'}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-steel-900 uppercase tracking-wide border-l-4 border-primary pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4">
              {isAr ? 'ضواغط الهواء اللولبية' : 'Screw Air Compressors'}
            </h2>

            <div className="flex items-center gap-4 mt-4">
              <div className="h-1 w-8 bg-primary/25" />
              <div className="h-1 w-16 bg-primary/50" />
              <div className="h-1 w-24 bg-primary" />
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            <a href="/downloads/compressors-catalog.pdf" download
              className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 hover:bg-primary/30 px-4 py-2.5 transition-all">
              <Download size={16} className="text-primary" />
              <span className="text-primary text-xs font-bold uppercase">{isAr ? 'الكتالوج' : 'Catalog'}</span>
            </a>
            <Button asChild variant="industrial" className="group">
              <Link href="/compressors">
                {isAr ? 'عرض الكل' : 'View All'}
                <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} transition-transform group-hover:translate-x-1`} size={16} />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Compressors Grid - 3 cols */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={gridVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {compressors.map((compressor) => (
            <motion.div key={compressor.id} variants={cardVariants}>
              <Link href="/compressors" className="block h-full">
                <div className="group relative overflow-hidden h-full bg-white border border-neutral-200 hover:border-primary/50 hover:shadow-lg transition-all duration-500">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-neutral-50">
                    <Image
                      src={compressor.image}
                      alt={getName(compressor)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />

                    {/* Models count badge */}
                    <div className="absolute top-3 right-3 bg-primary text-steel-900 text-[10px] font-bold px-2 py-1">
                      {compressor.models.length} {locale === 'ar' ? 'موديل' : locale === 'tr' ? 'Model' : 'Models'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-steel-900 font-bold text-sm uppercase tracking-wide group-hover:text-primary transition-colors line-clamp-2">
                      {getName(compressor)}
                    </h3>

                    <p className="text-neutral-500 text-xs mt-2 line-clamp-2">
                      {getShortDesc(compressor)}
                    </p>

                    <div className={cn("h-0.5 w-0 group-hover:w-10 bg-primary transition-all duration-500 mt-3")} />

                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-neutral-400 group-hover:text-primary transition-colors">
                      <span>{locale === 'ar' ? 'استكشف' : locale === 'tr' ? 'Keşfet' : 'Explore'}</span>
                      <ArrowRight size={12} className={cn("transition-transform", isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1")} />
                    </div>
                  </div>

                  {/* Side accent */}
                  <div className={cn(
                    "absolute top-0 w-1 h-full bg-primary z-10 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500",
                    isRTL ? "right-0" : "left-0"
                  )} />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

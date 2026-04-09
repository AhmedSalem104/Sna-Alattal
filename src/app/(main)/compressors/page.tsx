'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X, Download, ArrowRight, ChevronDown, Factory, Cog, Printer, Package, Gauge, Layers, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';
import { useCountUp } from '@/hooks/useAnimations';
import { cn } from '@/lib/utils';
import { getCompressors } from '@/lib/static-data';
import { translateSpecKey } from '@/lib/spec-translations';

// ─── Types ────────────────────────────────────────────
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
  features: string[];
  specifications: Record<string, string>;
  models: Array<Record<string, string>>;
  order: number;
}

// ─── Static product data for the grid ──────────────────
type ApplicationKey = 'plastic' | 'cnc' | 'packaging' | 'printing' | 'highPressure' | 'general';

interface ProductCard {
  key: string;
  nameEn: string;
  nameAr: string;
  image: string;
  specs: string[];
  specsAr: string[];
  colSpan: number;
  row: number;
  applications: ApplicationKey[];
  // Spec bar data for drawer visualizer
  specBars: { label: string; labelAr: string; value: number; max: number; unit: string }[];
}

const PRODUCTS: ProductCard[] = [
  {
    key: 'variable-frequency',
    nameEn: 'Compressor VFD',
    nameAr: 'كمبروسور',
    image: '/images/compressors/variable-frequency.jpg',
    specs: ['15 - 250 kW', '2.0 - 40 m\u00B3/min', '7 - 13 bar'],
    specsAr: ['15 - 250 كيلوواط', '2.0 - 40 م\u00B3/د', '7 - 13 بار'],
    colSpan: 1,
    row: 1,
    applications: ['plastic', 'cnc', 'printing'],
    specBars: [
      { label: 'Power', labelAr: 'القدرة', value: 250, max: 300, unit: 'kW' },
      { label: 'Air Flow', labelAr: 'تدفق الهواء', value: 40, max: 50, unit: 'm\u00B3/min' },
      { label: 'Noise', labelAr: 'الضوضاء', value: 66, max: 100, unit: 'dB' },
      { label: 'Pressure', labelAr: 'الضغط', value: 13, max: 16, unit: 'bar' },
    ],
  },
  {
    key: 'booster',
    nameEn: 'Booster Compressor',
    nameAr: 'ضاغط معزز',
    image: '/images/compressors/booster-cylinders.png',
    specs: ['15 - 132 kW', 'Up to 40 bar', 'Oil-free option'],
    specsAr: ['15 - 132 كيلوواط', 'حتى 40 بار', 'خيار بدون زيت'],
    colSpan: 1,
    row: 1,
    applications: ['highPressure'],
    specBars: [
      { label: 'Power', labelAr: 'القدرة', value: 132, max: 300, unit: 'kW' },
      { label: 'Air Flow', labelAr: 'تدفق الهواء', value: 20, max: 50, unit: 'm\u00B3/min' },
      { label: 'Noise', labelAr: 'الضوضاء', value: 75, max: 100, unit: 'dB' },
      { label: 'Pressure', labelAr: 'الضغط', value: 40, max: 45, unit: 'bar' },
    ],
  },
  {
    key: 'world-leading',
    nameEn: 'Screw Compressor',
    nameAr: 'ضاغط لولبي',
    image: '/images/compressors/hero-world-leading.png',
    specs: ['7.5 - 250 kW', '0.8 - 40 m\u00B3/min', '7 - 13 bar'],
    specsAr: ['7.5 - 250 كيلوواط', '0.8 - 40 م\u00B3/د', '7 - 13 بار'],
    colSpan: 2,
    row: 1,
    applications: ['general', 'cnc', 'plastic'],
    specBars: [
      { label: 'Power', labelAr: 'القدرة', value: 250, max: 300, unit: 'kW' },
      { label: 'Air Flow', labelAr: 'تدفق الهواء', value: 40, max: 50, unit: 'm\u00B3/min' },
      { label: 'Noise', labelAr: 'الضوضاء', value: 72, max: 100, unit: 'dB' },
      { label: 'Pressure', labelAr: 'الضغط', value: 13, max: 16, unit: 'bar' },
    ],
  },
  {
    key: 'belt-driven',
    nameEn: 'Belt Driven HDS Series',
    nameAr: 'سلسلة HDS بسير التشغيل',
    image: '/images/compressors/belt-driven-hds.png',
    specs: ['5.5 - 75 kW', '0.6 - 13 m\u00B3/min', '8 - 13 bar'],
    specsAr: ['5.5 - 75 كيلوواط', '0.6 - 13 م\u00B3/د', '8 - 13 بار'],
    colSpan: 1,
    row: 1,
    applications: ['plastic', 'packaging', 'general'],
    specBars: [
      { label: 'Power', labelAr: 'القدرة', value: 75, max: 300, unit: 'kW' },
      { label: 'Air Flow', labelAr: 'تدفق الهواء', value: 13, max: 50, unit: 'm\u00B3/min' },
      { label: 'Noise', labelAr: 'الضوضاء', value: 68, max: 100, unit: 'dB' },
      { label: 'Pressure', labelAr: 'الضغط', value: 13, max: 16, unit: 'bar' },
    ],
  },
  {
    key: 'direct-connected',
    nameEn: 'Direct Connected Compressor',
    nameAr: 'ضاغط توصيل مباشر',
    image: '/images/compressors/direct-connected-open.png',
    specs: ['15 - 250 kW', '2.3 - 42 m\u00B3/min', '7 - 13 bar'],
    specsAr: ['15 - 250 كيلوواط', '2.3 - 42 م\u00B3/د', '7 - 13 بار'],
    colSpan: 1,
    row: 2,
    applications: ['cnc', 'plastic'],
    specBars: [
      { label: 'Power', labelAr: 'القدرة', value: 250, max: 300, unit: 'kW' },
      { label: 'Air Flow', labelAr: 'تدفق الهواء', value: 42, max: 50, unit: 'm\u00B3/min' },
      { label: 'Noise', labelAr: 'الضوضاء', value: 70, max: 100, unit: 'dB' },
      { label: 'Pressure', labelAr: 'الضغط', value: 13, max: 16, unit: 'bar' },
    ],
  },
  {
    key: 'integrated-station',
    nameEn: 'Integrated Station',
    nameAr: 'محطة متكاملة',
    image: '/images/compressors/integrated-station.png',
    specs: ['7.5 - 37 kW', '1.0 - 6.2 m\u00B3/min', '8 - 10 bar'],
    specsAr: ['7.5 - 37 كيلوواط', '1.0 - 6.2 م\u00B3/د', '8 - 10 بار'],
    colSpan: 1,
    row: 2,
    applications: ['packaging', 'general'],
    specBars: [
      { label: 'Power', labelAr: 'القدرة', value: 37, max: 300, unit: 'kW' },
      { label: 'Air Flow', labelAr: 'تدفق الهواء', value: 6.2, max: 50, unit: 'm\u00B3/min' },
      { label: 'Noise', labelAr: 'الضوضاء', value: 65, max: 100, unit: 'dB' },
      { label: 'Pressure', labelAr: 'الضغط', value: 10, max: 16, unit: 'bar' },
    ],
  },
  {
    key: 'precision-filters',
    nameEn: 'Precision Air Filters',
    nameAr: 'فلاتر هواء الدقيقة',
    image: '/images/compressors/precision-filters.png',
    specs: ['0.01\u03BCm filtration', 'Dew point -40\u00B0C', 'ISO 8573-1 Class 1'],
    specsAr: ['ترشيح 0.01 ميكرون', 'نقطة ندى -40\u00B0م', 'ISO 8573-1 فئة 1'],
    colSpan: 1,
    row: 3,
    applications: ['printing', 'cnc', 'packaging'],
    specBars: [
      { label: 'Filtration', labelAr: 'الترشيح', value: 99, max: 100, unit: '%' },
      { label: 'Dew Point', labelAr: 'نقطة الندى', value: 40, max: 70, unit: '\u00B0C' },
      { label: 'Flow Rate', labelAr: 'معدل التدفق', value: 30, max: 50, unit: 'm\u00B3/min' },
      { label: 'Pressure Drop', labelAr: 'فقدان الضغط', value: 15, max: 100, unit: 'mbar' },
    ],
  },
  {
    key: 'air-dryers',
    nameEn: 'Refrigerated Air Dryer',
    nameAr: 'مجفف الهواء',
    image: '/images/compressors/air-dryer-new.png',
    specs: ['1.0 - 45 m\u00B3/min', 'Dew point 3~10\u00B0C', 'R-22 / R-407 / R-410'],
    specsAr: ['1.0 - 45 م\u00B3/د', 'نقطة ندى 3~10\u00B0م', 'R-22 / R-407 / R-410'],
    colSpan: 1,
    row: 3,
    applications: ['general', 'packaging', 'cnc'],
    specBars: [
      { label: 'Air Flow', labelAr: 'تدفق الهواء', value: 45, max: 50, unit: 'm\u00B3/min' },
      { label: 'Dew Point', labelAr: 'نقطة الندى', value: 10, max: 40, unit: '\u00B0C' },
      { label: 'Power', labelAr: 'القدرة', value: 8, max: 10, unit: 'HP' },
      { label: 'Models', labelAr: 'الموديلات', value: 12, max: 15, unit: '' },
    ],
  },
];

const APPLICATIONS: { key: ApplicationKey; labelAr: string; labelEn: string; icon: React.ElementType }[] = [
  { key: 'plastic', labelAr: 'بلاستيك', labelEn: 'Plastic', icon: Layers },
  { key: 'cnc', labelAr: 'CNC', labelEn: 'CNC', icon: Cog },
  { key: 'packaging', labelAr: 'تغليف', labelEn: 'Packaging', icon: Package },
  { key: 'printing', labelAr: 'طباعة', labelEn: 'Printing', icon: Printer },
  { key: 'highPressure', labelAr: 'ضغط عالي', labelEn: 'High Pressure', icon: Gauge },
  { key: 'general', labelAr: 'عام', labelEn: 'General', icon: Factory },
];

const APP_LABEL_MAP: Record<ApplicationKey, { ar: string; en: string }> = {
  plastic: { ar: 'بلاستيك', en: 'Plastic' },
  cnc: { ar: 'CNC', en: 'CNC' },
  packaging: { ar: 'تغليف', en: 'Packaging' },
  printing: { ar: 'طباعة', en: 'Printing' },
  highPressure: { ar: 'ضغط عالي', en: 'High Pressure' },
  general: { ar: 'عام', en: 'General' },
};

// ─── Counter Component ─────────────────────────────────
function CounterStat({ value, suffix, label, inView, delay }: {
  value: number; suffix?: string; label: string; inView: boolean; delay: number;
}) {
  const count = useCountUp(value, 2000, inView, delay);
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-black text-primary tabular-nums">
        {suffix === '+' && '+'}{count}{suffix === ':' ? '' : ''}{suffix === 'year' ? '' : ''}
      </div>
      <div className="text-xs md:text-sm text-neutral-500 mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}

// ─── Spec Bar Component (animated) ─────────────────────
function SpecBar({ label, value, max, unit, delay, isAr }: {
  label: string; value: number; max: number; unit: string; delay: number; isAr: boolean;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="mb-2.5">
      <div className={cn("flex justify-between items-baseline mb-1", isAr && "flex-row-reverse")}>
        <span className="text-neutral-500 text-xs uppercase tracking-wider">{label}</span>
        <span className="text-steel-900 font-bold text-sm">{value} {unit}</span>
      </div>
      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#F5C400] to-[#F5C400]/70 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

// ─── Main Page Component ───────────────────────────────
export default function CompressorsPage() {
  const { locale, isRTL } = useLocale();
  const isAr = locale === 'ar';

  const [compressors] = useState<Compressor[]>(() => getCompressors() as unknown as Compressor[]);
  const [activeApp, setActiveApp] = useState<ApplicationKey | null>(null);
  const [drawerProduct, setDrawerProduct] = useState<ProductCard | null>(null);
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' });

  // Match API compressor to a product card
  // Direct mapping from card key to API slug
  const SLUG_MAP: Record<string, string> = {
    'world-leading': 'belt-driven-screw',
    'belt-driven': 'belt-driven-screw',
    'direct-connected': 'direct-connected-screw',
    'integrated-station': 'integrated-screw',
    'variable-frequency': 'permanent-variable-frequency',
    'booster': 'three-cylinder-booster',
    'precision-filters': 'precision-filter',
    'air-dryers': 'air-dryers',
  };

  const getApiCompressor = useCallback((productKey: string): Compressor | undefined => {
    const slug = SLUG_MAP[productKey];
    if (slug) return compressors.find(c => c.slug === slug);
    return compressors.find(c =>
      c.slug.includes(productKey) ||
      productKey.includes(c.slug)
    );
  }, [compressors]);

  // Handle application filter click
  const handleAppClick = useCallback((key: ApplicationKey) => {
    setActiveApp(prev => prev === key ? null : key);
    // Scroll to grid
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  // Check if product matches active application
  const isHighlighted = useCallback((product: ProductCard) => {
    if (!activeApp) return false;
    return product.applications.includes(activeApp);
  }, [activeApp]);

  // Close drawer
  const closeDrawer = useCallback(() => {
    setDrawerProduct(null);
    setShowAllSpecs(false);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (drawerProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerProduct]);

  // Product rows for asymmetric layout
  const row1 = PRODUCTS.filter(p => p.row === 1);
  const row2 = PRODUCTS.filter(p => p.row === 2);
  const row3 = PRODUCTS.filter(p => p.row === 3);

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="bg-white min-h-screen">

      {/* ═══════════════════════════════════════════════════════
          HERO + ABOUT COMPRESSORS
          ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-steel-900">
        {/* Background */}
        <div className="absolute inset-0">
          <Image src="/images/compressors/hero-world-leading.png" alt="" fill className="object-cover opacity-[0.12]" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-steel-900/60 via-steel-900/40 to-steel-900" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-24 pb-20">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
            <Wind size={14} className="text-primary" />
            <span className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.25em]">
              {isAr ? 'ضواغط الهواء اللولبية' : 'SCREW AIR COMPRESSORS'}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight max-w-4xl mb-6">
            {isAr ? 'ضواغط الهواء اللولبية الرائدة على مستوى العالم' : 'THE WORLD LEADING SCREW AIR COMPRESSORS'}
          </motion.h1>

          {/* Two column: Description + Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
            {/* Left: About text */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6">
                {isAr
                  ? 'تعد شركة SNA العتال من الشركات الرائدة في مجال تصنيع وتركيب وتوريد معدات ضغط الهواء بكافة أشكالها وأحجامها وأنواعها. تتمتع الشركة بسمعة طيبة في السوق بفضل جودة منتجاتها العالية ومتانتها وفعاليتها.'
                  : 'SNA is a pioneer in the manufacturing, installation, and supply of air compressor equipment in all its shapes, sizes, and types. The company enjoys a strong reputation in the market due to the high quality, durability, and efficiency of its products.'}
              </p>
              <p className="text-white/50 text-sm leading-relaxed mb-8">
                {isAr
                  ? 'نحن نقدم أفضل التقنيات الأوروبية ذات الأداء الأفضل عالمياً. يتم استخدامها في آلاف الضواغط في العالم، وتشتهر بخلوها من العيوب وأقل تكاليف الصيانة. هدفنا هو تلبية احتياجات الضواغط من الموثوقية الصناعية العالية والكفاءة العالية واستهلاك الطاقة المنخفض.'
                  : 'We introduce European top technology with best performance in the world. Used in thousands of compressors globally, known for defect-free operation and lowest maintenance costs. Our goal is to satisfy industrial high-reliability, high-efficiency and low-energy compressor needs.'}
              </p>

              {/* Download */}
              <a href="/downloads/compressors-catalog.pdf" download="SNA-Compressors-Catalog.pdf"
                className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 px-7 py-4 transition-all duration-300 shadow-lg">
                <Download size={20} className="text-steel-900" />
                <div>
                  <div className="text-steel-900 font-bold text-sm uppercase tracking-wider">
                    {isAr ? 'تحميل الكتالوج' : 'Download Catalog'}
                  </div>
                  <div className="text-steel-900/50 text-[10px]">PDF • 3.6 MB</div>
                </div>
              </a>
            </motion.div>

            {/* Right: Product Features */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <h3 className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-5">
                {isAr ? 'مميزات المنتج' : 'PRODUCT FEATURES'}
              </h3>
              <div className="space-y-4">
                {[
                  { titleAr: 'صوت منخفض', titleEn: 'Low Noise', descAr: 'نقل الحركة مباشرة دون ضوضاء', descEn: 'Direct driven, without gear noise' },
                  { titleAr: 'توفير طاقة', titleEn: 'Energy Saving', descAr: 'توفر الطاقة بشكل كبير حيث تصل كل آلة إلى معيار توفير الطاقة العالمي', descEn: 'Greatly saves energy, each machine reaches global energy saving standard' },
                  { titleAr: 'تصميم خارجي فعال', titleEn: 'High Effective Mainframe', descAr: 'محرك ذو فعالية عالية مع نظام تشغيل مباشر بدون تروس', descEn: 'High effective motor with direct driven system, no gears' },
                  { titleAr: 'مروحة تبريد متغيرة التردد', titleEn: 'Frequency Conversion Cooling', descAr: 'مروحة تبريد زيت متغيرة التردد لأداء مثالي', descEn: 'Frequency conversion oil-cooling fan for optimal performance' },
                  { titleAr: 'مصداقية عالية', titleEn: 'High Reliability', descAr: 'منتجات ذات جودة وكفاءة عالية مع النقل المباشر للحركة', descEn: 'Products of high quality and efficiency with direct driven big rotor' },
                ].map((feat, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <div>
                      <h4 className="text-white text-sm font-bold mb-0.5">{isAr ? feat.titleAr : feat.titleEn}</h4>
                      <p className="text-white/40 text-xs leading-relaxed">{isAr ? feat.descAr : feat.descEn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STICKY FILTER + PRODUCT GRID
          ═══════════════════════════════════════════════════════ */}
      <section className="pt-20 pb-4 bg-white border-b border-neutral-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-steel-900">
              {isAr ? 'استكشف الضواغط' : 'Explore Compressors'}
            </h2>
            <a href="/downloads/compressors-catalog.pdf" download
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 px-4 py-2 transition-all shadow-sm">
              <Download size={14} className="text-steel-900" />
              <span className="text-steel-900 font-bold text-xs uppercase">{isAr ? 'تحميل الكتالوج' : 'Download Catalog'}</span>
            </a>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveApp(null)}
              className={cn(
                'px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 border',
                !activeApp
                  ? 'bg-primary text-steel-900 border-primary'
                  : 'bg-white text-neutral-500 border-neutral-200 hover:border-primary/50 hover:text-primary'
              )}
            >
              {locale === 'ar' ? 'الكل' : locale === 'tr' ? 'Tümü' : 'All'}
            </button>
            {APPLICATIONS.map(app => (
              <button
                key={app.key}
                onClick={() => handleAppClick(app.key)}
                className={cn(
                  'px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 border inline-flex items-center gap-1.5',
                  activeApp === app.key
                    ? 'bg-primary text-steel-900 border-primary'
                    : 'bg-white text-neutral-500 border-neutral-200 hover:border-primary/50 hover:text-primary'
                )}
              >
                <app.icon size={12} />
                {isAr ? app.labelAr : app.labelEn}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section ref={gridRef} className="py-10 scroll-mt-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {PRODUCTS.map((product, i) => (
              <ProductGridCard
                key={product.key}
                product={product}
                index={i}
                isHighlighted={isHighlighted(product)}
                activeApp={activeApp}
                isAr={isAr}
                onExplore={() => setDrawerProduct(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          WHY SNA STRIP - ANIMATED COUNTERS
          ═══════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="py-10 md:py-14 bg-steel-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <CounterStat
              value={1997}
              label={isAr ? '\u062A\u0623\u0633\u0633\u062A' : 'ESTABLISHED'}
              inView={statsInView}
              delay={0}
            />
            <CounterStat
              value={20}
              suffix="+"
              label={isAr ? '\u0633\u0646\u0629 \u062E\u0628\u0631\u0629' : 'YEARS EXPERIENCE'}
              inView={statsInView}
              delay={200}
            />
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-3xl md:text-4xl font-black text-primary"
              >
                ISO
              </motion.div>
              <div className="text-xs md:text-sm text-neutral-500 mt-1 uppercase tracking-wider">9001:2015</div>
            </div>
            <CounterStat
              value={3}
              label={isAr ? '\u0641\u0631\u0648\u0639 \u062F\u0648\u0644\u064A\u0629' : 'INTERNATIONAL BRANCHES'}
              inView={statsInView}
              delay={600}
            />
          </div>
        </div>
      </section>

      {/* CTA removed per request */}

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
                  src={drawerProduct.image}
                  alt={isAr ? drawerProduct.nameAr : drawerProduct.nameEn}
                  fill
                  className="object-contain p-4 md:p-8"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>

              {/* Name + specs */}
              <div className="px-5 md:px-8 py-4 border-b-4 border-primary">
                <h3 className="text-2xl md:text-3xl font-black text-steel-900 uppercase mb-1">
                  {isAr ? drawerProduct.nameAr : drawerProduct.nameEn}
                </h3>
                <p className="text-neutral-400 text-lg mb-3">{isAr ? drawerProduct.nameEn : drawerProduct.nameAr}</p>
                <div className="flex flex-wrap gap-2">
                  {(isAr ? drawerProduct.specsAr : drawerProduct.specs).map((spec, i) => (
                    <span key={i} className="text-sm px-4 py-1.5 bg-primary/10 text-primary font-semibold">{spec}</span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-8">

                {/* Two columns: Spec Bars + Specs/Apps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                  {/* Col 1: Spec Bars */}
                  <div>
                    <span className="text-primary text-base font-bold uppercase tracking-[0.15em] mb-3 block">
                      {locale === 'ar' ? 'الأداء' : locale === 'tr' ? 'PERFORMANS' : 'PERFORMANCE'}
                    </span>
                    {drawerProduct.specBars.map((bar, i) => (
                      <SpecBar key={bar.label} label={isAr ? bar.labelAr : bar.label} value={bar.value} max={bar.max} unit={bar.unit} delay={0.1 + i * 0.1} isAr={isAr} />
                    ))}
                  </div>

                  {/* Col 2: Specs + Applications */}
                  <div>
                    {/* All specs - grid layout */}
                    {(() => {
                      const apiComp = getApiCompressor(drawerProduct.key);
                      if (!apiComp || Object.keys(apiComp.specifications).length === 0) return null;
                      return (
                        <div className="mb-3">
                          <span className="text-primary text-base font-bold uppercase tracking-[0.15em] mb-3 block">
                            {locale === 'ar' ? 'المواصفات' : locale === 'tr' ? 'ÖZELLİKLER' : 'SPECIFICATIONS'}
                          </span>
                          <div className="grid grid-cols-1 gap-1.5">
                            {Object.entries(apiComp.specifications).map(([key, val]) => (
                              <div key={key} className="flex justify-between items-center px-3 py-2.5 bg-neutral-50 border border-neutral-100">
                                <span className="text-neutral-400 capitalize text-base">{translateSpecKey(key, locale)}</span>
                                <span className="text-steel-900 font-bold text-base">{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Applications */}
                    <span className="text-primary text-base font-bold uppercase tracking-[0.15em] mb-2 block">
                      {locale === 'ar' ? 'التطبيقات' : locale === 'tr' ? 'UYGULAMALAR' : 'APPLICATIONS'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {drawerProduct.applications.map(appKey => (
                        <span key={appKey} className="px-4 py-2 bg-primary/10 text-primary text-base font-medium">
                          {isAr ? APP_LABEL_MAP[appKey].ar : APP_LABEL_MAP[appKey].en}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Models - Slider */}
                {(() => {
                  const apiComp = getApiCompressor(drawerProduct.key);
                  if (!apiComp || !apiComp.models || apiComp.models.length === 0) return null;
                  return <ModelsSlider models={apiComp.models} isAr={isAr} />;
                })()}

                {/* Features from API */}
                {(() => {
                  const apiComp = getApiCompressor(drawerProduct.key);
                  if (!apiComp || !apiComp.features || apiComp.features.length === 0) return null;
                  return (
                    <div className="mb-4">
                      <span className="text-primary text-base font-bold uppercase tracking-[0.15em]">
                        {locale === 'ar' ? 'المميزات' : locale === 'tr' ? 'ÖZELLİKLER' : 'FEATURES'}
                      </span>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-3">
                        {apiComp.features.map((f: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-lg text-neutral-600">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 shrink-0" />
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
    </div>
  );
}

// ─── Product Grid Card Component ────────────────────────
function ProductGridCard({
  product,
  index,
  isHighlighted,
  activeApp,
  isAr,
  onExplore,
  className,
  tall = false,
}: {
  product: ProductCard;
  index: number;
  isHighlighted: boolean;
  activeApp: ApplicationKey | null;
  isAr: boolean;
  onExplore: () => void;
  className?: string;
  tall?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className={cn(
        'group relative bg-white border overflow-hidden transition-all duration-500 cursor-pointer h-full flex flex-col',
        isHighlighted
          ? 'border-primary shadow-[0_0_30px_rgba(245,196,0,0.15)]'
          : 'border-neutral-200 hover:border-primary/60',
        className
      )}
      onClick={onExplore}
    >
      {/* Image area */}
      <div className="relative overflow-hidden bg-neutral-50 h-52">
        <Image
          src={product.image}
          alt={isAr ? product.nameAr : product.nameEn}
          fill
          className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
          sizes={tall ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="p-5 md:p-6 flex-1 flex flex-col">
        <h3 className="text-steel-900 text-base md:text-lg font-bold uppercase mb-0.5">
          {isAr ? product.nameAr : product.nameEn}
        </h3>
        <p className="text-neutral-400 text-xs mb-4">
          {isAr ? product.nameEn : product.nameAr}
        </p>

        {/* Key specs */}
        <ul className="space-y-1.5 mb-5">
          {(isAr ? product.specsAr : product.specs).map((spec, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-neutral-500">
              <div className="w-1 h-1 bg-primary rounded-full shrink-0" />
              {spec}
            </li>
          ))}
        </ul>

        {/* Explore button */}
        <button
          className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider group/btn mt-auto pt-3"
        >
          {isAr ? '\u0627\u0633\u062A\u0643\u0634\u0641' : 'EXPLORE'}
          <ArrowRight size={14} className={cn(
            'transition-transform',
            isAr ? 'rotate-180 group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'
          )} />
        </button>
      </div>

      {/* Yellow bottom strip on hover - shows applications */}
      <div className={cn(
        'absolute bottom-0 left-0 right-0 bg-primary transition-all duration-500 overflow-hidden flex items-center justify-center gap-3',
        isHighlighted ? 'h-8' : 'h-0 group-hover:h-8'
      )}>
        {product.applications.map(appKey => (
          <span key={appKey} className="text-[#0A0A0A] text-[10px] font-bold uppercase tracking-wider">
            {isAr ? APP_LABEL_MAP[appKey].ar : APP_LABEL_MAP[appKey].en}
          </span>
        ))}
      </div>

      {/* Glow highlight when matching app */}
      {isHighlighted && (
        <motion.div
          className="absolute inset-0 pointer-events-none border-2 border-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

// ─── Models Slider Component ─────────────────────────
function ModelsSlider({ models, isAr }: { models: Array<Record<string, string>>; isAr: boolean; }) {
  const [idx, setIdx] = useState(0);
  const headers = Object.keys(models[0]);
  const model = models[idx];

  return (
    <div className="mb-4 -mx-5 md:-mx-8 px-5 md:px-8 py-5 bg-steel-900">
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
                <div className="text-white/30 text-xs uppercase tracking-wider mb-1">{translateSpecKey(h, isAr ? 'ar' : 'en')}</div>
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

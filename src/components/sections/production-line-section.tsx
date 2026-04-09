'use client';

import { useRef, useState, useCallback, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Factory, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';
import { IndustrialGear } from '@/components/decorative';
import productsData from '@/data/products.json';
import { getLocalizedField } from '@/lib/locale-helpers';

interface Transform {
  x: number;
  y: number;
  scale: number;
}

interface ProductionLineHotspot {
  id: string;
  x: number;
  y: number;
  slug: string;
  labelKey: string;
}

const PRODUCTION_LINE_HOTSPOTS: ProductionLineHotspot[] = [
  { id: 'shrink-wrapping', x: 57, y: 33, slug: 'shrink-wrapping-machine', labelKey: 'shrinkWrapping' },
  { id: 'labeling', x: 30, y: 38, slug: 'opp-labeling-machine', labelKey: 'labeling' },
  { id: 'conveyor', x: 48, y: 20, slug: 'conveyor-systems', labelKey: 'conveyor' },
  { id: 'filling-capping', x: 70, y: 18, slug: 'filling-machine-f50', labelKey: 'fillingCapping' },
  { id: 'bottle-unscrambler', x: 60, y: 58, slug: 'bottle-unscrambler', labelKey: 'bottleUnscrambler' },
  { id: 'blow-molding', x: 83, y: 42, slug: 'pet-blow-molding-4c-8000ph', labelKey: 'blowMolding' }
];

function HotspotMarker({
  hotspot,
  label,
  scale,
  isDragging,
  onNavigate,
}: {
  hotspot: ProductionLineHotspot;
  label: string;
  scale: number;
  isDragging: boolean;
  onNavigate: (slug: string) => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const counterScale = 1 / scale;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const dx = Math.abs(e.clientX - pointerDownPos.current.x);
    const dy = Math.abs(e.clientY - pointerDownPos.current.y);
    if (dx < 5 && dy < 5) {
      e.stopPropagation();
      e.preventDefault();
      onNavigate(hotspot.slug);
    }
  }, [hotspot.slug, onNavigate]);

  return (
    <div
      className="absolute z-10"
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        transform: `translate(-50%, -50%) scale(${counterScale})`,
      }}
    >
      <div
        role="link"
        tabIndex={0}
        aria-label={label}
        className="relative cursor-pointer group"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onMouseEnter={() => { if (!isDragging) setShowTooltip(true); }}
        onMouseLeave={() => setShowTooltip(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onNavigate(hotspot.slug);
          }
        }}
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 -m-3 rounded-full animate-hotspot-ping bg-primary/40" />

        {/* Marker body */}
        <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary shadow-lg shadow-primary/40 animate-hotspot-bounce group-hover:bg-primary-600 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>

        {/* Connecting dot */}
        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-1.5 h-1.5 rounded-full bg-primary/60" />
      </div>

      {/* Tooltip (desktop only via mouse events) */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-2 bg-steel-900/95 backdrop-blur-sm text-white text-xs font-medium whitespace-nowrap pointer-events-none animate-fade-in rounded-sm z-50">
          {label}
          <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-steel-900/95" />
        </div>
      )}
    </div>
  );
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const ZOOM_STEP = 1.3;

interface DrawerProduct {
  nameAr: string;
  nameEn: string;
  nameTr: string;
  descriptionAr?: string;
  descriptionEn?: string;
  descriptionTr?: string;
  images: string[];
  specifications?: Record<string, string>;
  features?: string[];
  featuresEn?: string[];
  models?: Array<Record<string, string>>;
  category?: { nameAr: string; nameEn: string; nameTr: string };
}

export const ProductionLineSection = memo(function ProductionLineSection() {
  const t = useTranslations();
  const { isRTL, locale } = useLocale();
  const isAr = locale === 'ar';
  const sectionRef = useRef(null);
  const [drawerProduct, setDrawerProduct] = useState<DrawerProduct | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastTouchDistRef = useRef(0);
  const lastTouchCenterRef = useRef({ x: 0, y: 0 });

  // Zoom controls
  const zoomIn = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(prev.scale * ZOOM_STEP, MAX_SCALE),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(prev.scale / ZOOM_STEP, MIN_SCALE),
    }));
  }, []);

  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Mouse wheel zoom (centered on cursor).
  // Only intercept wheel when already zoomed in; at default view let the page scroll normally.
  const transformRef = useRef(transform);
  transformRef.current = transform;

  const handleWheel = useCallback((e: WheelEvent) => {
    const { scale, x, y } = transformRef.current;
    const isDefault = scale === 1 && x === 0 && y === 0;

    // Scrolling down while at default view → let the page scroll
    if (isDefault && e.deltaY > 0) return;
    // Scrolling up (zoom out direction) while at default → let the page scroll
    if (isDefault && e.deltaY < 0) {
      // Allow zoom-in on scroll-up only if user is intentionally zooming (Ctrl held)
      if (!e.ctrlKey) return;
    }

    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const delta = e.deltaY > 0 ? 1 / ZOOM_STEP : ZOOM_STEP;

    setTransform(prev => {
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev.scale * delta));
      const ratio = newScale / prev.scale;
      return {
        scale: newScale,
        x: mouseX - ratio * (mouseX - prev.x),
        y: mouseY - ratio * (mouseY - prev.y),
      };
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  // Mouse drag (pan)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - transform.x,
      y: e.clientY - transform.y,
    };
  }, [transform.x, transform.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    }));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch support (pinch zoom + drag)
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length < 2) {
      return { x: touches[0].clientX, y: touches[0].clientY };
    }
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - transform.x,
        y: e.touches[0].clientY - transform.y,
      };
    } else if (e.touches.length === 2) {
      lastTouchDistRef.current = getTouchDistance(e.touches);
      lastTouchCenterRef.current = getTouchCenter(e.touches);
    }
  }, [transform.x, transform.y]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.touches[0].clientX - dragStartRef.current.x,
        y: e.touches[0].clientY - dragStartRef.current.y,
      }));
    } else if (e.touches.length === 2) {
      const newDist = getTouchDistance(e.touches);
      const newCenter = getTouchCenter(e.touches);

      if (lastTouchDistRef.current > 0) {
        const scaleDelta = newDist / lastTouchDistRef.current;
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const cx = newCenter.x - rect.left;
          const cy = newCenter.y - rect.top;

          setTransform(prev => {
            const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev.scale * scaleDelta));
            const ratio = newScale / prev.scale;
            return {
              scale: newScale,
              x: cx - ratio * (cx - prev.x) + (newCenter.x - lastTouchCenterRef.current.x),
              y: cy - ratio * (cy - prev.y) + (newCenter.y - lastTouchCenterRef.current.y),
            };
          });
        }
      }
      lastTouchDistRef.current = newDist;
      lastTouchCenterRef.current = newCenter;
    }
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    lastTouchDistRef.current = 0;
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.matches(':hover')) return;
      const PAN_STEP = 50;
      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetView();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setTransform(prev => ({ ...prev, x: prev.x + PAN_STEP }));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setTransform(prev => ({ ...prev, x: prev.x - PAN_STEP }));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setTransform(prev => ({ ...prev, y: prev.y + PAN_STEP }));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setTransform(prev => ({ ...prev, y: prev.y - PAN_STEP }));
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, resetView]);

  // Open drawer with product + all similar products from same category
  const handleHotspotNavigate = useCallback((slug: string) => {
    const product = (productsData as any[]).find(p => p.slug === slug);
    if (product) {
      // Find all products in the same category
      const allInCategory = (productsData as any[]).filter(
        p => p.categoryId === product.categoryId && p.isActive && !p.deletedAt
      ).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

      // Merge all models from all products in same category
      const allModels: Record<string, string>[] = [];
      allInCategory.forEach((p: any) => {
        if (p.models && p.models.length > 0) {
          p.models.forEach((m: Record<string, string>) => allModels.push(m));
        }
      });

      // Use the clicked product but with all category models
      const enriched = {
        ...product,
        models: allModels.length > 0 ? allModels : product.models,
      };
      setDrawerProduct(enriched as DrawerProduct);
    }
  }, []);

  const closeDrawer = useCallback(() => setDrawerProduct(null), []);

  useEffect(() => {
    if (drawerProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerProduct]);

  const scalePercent = Math.round(transform.scale * 100);

  const formatNumber = (num: number) => {
    if (locale === 'ar') {
      return num.toLocaleString('ar-EG') + '٪';
    }
    return num + '%';
  };

  return (
    <section
      ref={sectionRef}
      className="py-12 lg:py-16 bg-white/80 relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Subtle Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-primary/5 blur-3xl -translate-x-1/2" />
        <IndustrialGear size={400} teeth={16} className="absolute -top-16 -left-16 text-primary opacity-[0.35] hidden md:block" strokeWidth={2.5} />
        <IndustrialGear size={300} teeth={12} className="absolute -bottom-12 -right-12 text-primary opacity-[0.35] hidden md:block" reverse strokeWidth={2.5} />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          {/* Section Tag */}
          <div className="inline-flex items-center gap-2 border-2 border-primary/40 bg-primary/20 px-4 py-2 mb-6">
            <Factory size={16} className="text-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              {t('productionLine.tag')}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 uppercase tracking-wide mb-4 border-l-4 border-primary pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4">
            {t('productionLine.title')}
          </h2>

          {/* Gold Divider */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>

          <p className="text-neutral-600">
            {t('productionLine.description')}
          </p>
        </motion.div>

        {/* Interactive Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            ref={containerRef}
            className={`relative w-full overflow-hidden border-2 border-primary/30 bg-gradient-to-b from-[#e8ecf0] to-[#d0d5dc] select-none animate-glow-pulse ${isFullscreen ? 'h-screen' : 'aspect-[16/8] md:aspect-[16/7]'}`}
            style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Zoom Controls */}
            <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20 flex flex-col gap-2`}>
              <Button
                variant="ghost"
                size="icon"
                className="bg-steel-900/80 hover:bg-primary text-white hover:text-steel-900 rounded-none w-10 h-10 backdrop-blur-sm"
                onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                title="Zoom In (+)"
              >
                <ZoomIn size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-steel-900/80 hover:bg-primary text-white hover:text-steel-900 rounded-none w-10 h-10 backdrop-blur-sm"
                onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                title="Zoom Out (-)"
              >
                <ZoomOut size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-steel-900/80 hover:bg-primary text-white hover:text-steel-900 rounded-none w-10 h-10 backdrop-blur-sm"
                onClick={(e) => { e.stopPropagation(); resetView(); }}
                title="Reset (0)"
              >
                <RotateCcw size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-steel-900/80 hover:bg-primary text-white hover:text-steel-900 rounded-none w-10 h-10 backdrop-blur-sm hidden md:flex"
                onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                title="Fullscreen"
              >
                <Maximize2 size={18} />
              </Button>
            </div>

            {/* Scale Indicator */}
            <div className={`absolute bottom-4 ${isRTL ? 'right-4' : 'left-4'} z-20`}>
              <div className="bg-steel-900/80 backdrop-blur-sm text-white px-3 py-1.5 text-xs font-mono tracking-wider">
                {formatNumber(scalePercent)}
              </div>
            </div>

            {/* Hint with repeating fade in/out */}
            {transform.scale === 1 && transform.x === 0 && transform.y === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  times: [0, 0.15, 0.7, 1],
                  ease: 'easeInOut',
                }}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
              >
                <motion.div
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="bg-steel-900/70 backdrop-blur-sm text-white px-6 py-3 flex items-center gap-3"
                >
                  <ZoomIn size={20} className="text-primary" />
                  <span className="text-sm font-medium">
                    {t('productionLine.hint')}
                  </span>
                </motion.div>
              </motion.div>
            )}

            {/* Production Line Image */}
            <div
              className="absolute inset-0"
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                transformOrigin: '0 0',
                transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <Image
                src="/images/production-line.jpg"
                alt={t('productionLine.title')}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                className="object-contain"
                priority={false}
                loading="lazy"
                quality={90}
                draggable={false}
              />

              {/* Machine Hotspot Markers */}
              {PRODUCTION_LINE_HOTSPOTS.map((hotspot) => (
                <HotspotMarker
                  key={hotspot.id}
                  hotspot={hotspot}
                  label={t(`productionLine.machines.${hotspot.labelKey}`)}
                  scale={transform.scale}
                  isDragging={isDragging}
                  onNavigate={handleHotspotNavigate}
                />
              ))}
            </div>
          </div>

          {/* Controls hint bar */}
          <div className="flex items-center justify-center gap-6 mt-4 text-neutral-400 text-xs">
            <span className="hidden md:inline-flex items-center gap-1.5">
              <kbd className="bg-neutral-100 text-neutral-500 px-1.5 py-0.5 text-[10px] border border-neutral-200">+</kbd>
              <kbd className="bg-neutral-100 text-neutral-500 px-1.5 py-0.5 text-[10px] border border-neutral-200">-</kbd>
              {t('productionLine.zoomKeys')}
            </span>
            <span className={`hidden md:inline-flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <kbd className="bg-neutral-100 text-neutral-500 px-1.5 py-0.5 text-[10px] border border-neutral-200">{isRTL ? '&rarr;' : '&larr;'}</kbd>
              <kbd className="bg-neutral-100 text-neutral-500 px-1.5 py-0.5 text-[10px] border border-neutral-200">{isRTL ? '&larr;' : '&rarr;'}</kbd>
              {t('productionLine.panKeys')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-4 h-4 border border-neutral-300 flex items-center justify-center text-[8px]">&#x1f5b1;</span>
              {t('productionLine.scrollZoom')}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Product Drawer */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {drawerProduct && (
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
                  isRTL
                    ? 'md:left-0 md:right-auto md:w-[80vw] lg:w-[75vw] xl:w-[70vw]'
                    : 'md:right-0 md:left-auto md:w-[80vw] lg:w-[75vw] xl:w-[70vw]'
                )}
                initial={{ x: isRTL ? '-100%' : '100%' }}
                animate={{ x: 0 }}
                exit={{ x: isRTL ? '-100%' : '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              >
                <button onClick={closeDrawer}
                  className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm border border-neutral-200 hover:border-primary transition-colors rounded-full shadow-md">
                  <X size={18} className="text-steel-900" />
                </button>

                <div className="md:hidden flex justify-center pt-3 pb-2">
                  <div className="w-10 h-1 bg-neutral-300 rounded-full" />
                </div>

                {/* Image - FULL */}
                <div className="relative h-[400px] md:h-[550px] bg-neutral-50 overflow-hidden">
                  <Image
                    src={drawerProduct.images?.[0] || '/images/placeholders/product.svg'}
                    alt={getLocalizedField(drawerProduct as any, 'name', locale)}
                    fill
                    className="object-contain p-4 md:p-8"
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority
                  />
                </div>

                {/* Name + model */}
                <div className="px-5 md:px-8 py-4 border-b-4 border-primary">
                  {drawerProduct.category && (
                    <span className="text-[10px] px-3 py-1 bg-primary text-steel-900 font-bold uppercase tracking-wider mb-3 inline-block">
                      {getLocalizedField(drawerProduct.category as any, 'name', locale)}
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-steel-900 uppercase mb-1">
                        {getLocalizedField(drawerProduct as any, 'name', locale)}
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
                  {getLocalizedField(drawerProduct as any, 'description', locale) && (
                    <p className="text-neutral-600 text-base leading-relaxed mb-5">
                      {getLocalizedField(drawerProduct as any, 'description', locale)}
                    </p>
                  )}

                  {/* Specifications - grid */}
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
                    <PLModelsSlider models={drawerProduct.models} isAr={isAr} />
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
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-3">
                          {features.map((f: string, i: number) => (
                            <div key={i} className="flex items-start gap-2 text-base text-neutral-600">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
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
    </section>
  );
});

// ─── Production Line Models Slider ─────────────────
function PLModelsSlider({ models, isAr }: { models: Array<Record<string, string>>; isAr: boolean }) {
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
            <ZoomIn size={14} className="rotate-180" />
          </button>
          <span className="text-white/50 text-xs px-2 tabular-nums">{idx + 1} / {models.length}</span>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx(prev => prev < models.length - 1 ? prev + 1 : 0); }}
            className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-primary/30 text-white hover:text-primary transition-colors"
          >
            <ZoomIn size={14} />
          </button>
        </div>
      </div>

      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {models.map((m, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setIdx(i); }}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border shrink-0 ${
              idx === i
                ? 'bg-primary text-steel-900 border-primary'
                : 'bg-white/5 text-white/50 border-white/10 hover:border-primary/40 hover:text-primary'
            }`}
          >
            {m[headers[0]] || `#${i + 1}`}
          </button>
        ))}
      </div>

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

      <div className="flex justify-center gap-1.5 mt-4">
        {models.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setIdx(i); }}
            className={`h-1.5 rounded-full transition-all ${
              idx === i ? 'w-6 bg-primary' : 'w-1.5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

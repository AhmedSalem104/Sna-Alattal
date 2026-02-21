'use client';

import { useRef, useState, useCallback, useEffect, memo } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Factory } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';
import { IndustrialGear } from '@/components/decorative';

interface Transform {
  x: number;
  y: number;
  scale: number;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const ZOOM_STEP = 1.3;

export const ProductionLineSection = memo(function ProductionLineSection() {
  const t = useTranslations();
  const { isRTL, locale } = useLocale();
  const sectionRef = useRef(null);
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
      className="py-20 lg:py-28 bg-gradient-to-b from-steel-900 to-steel-800 relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Industrial Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(201, 162, 39, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201, 162, 39, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        <IndustrialGear size={400} teeth={16} className="absolute -top-16 -left-16 text-primary opacity-[0.15] hidden md:block" strokeWidth={1.5} />
        <IndustrialGear size={300} teeth={12} className="absolute -bottom-12 -right-12 text-primary opacity-[0.15] hidden md:block" reverse strokeWidth={1.5} />
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

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wide mb-4">
            {t('productionLine.title')}
          </h2>

          {/* Gold Divider */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-1 w-8 bg-primary/25" />
            <div className="h-1 w-16 bg-primary/50" />
            <div className="h-1 w-24 bg-primary" />
            <div className="h-1 w-16 bg-primary/50" />
            <div className="h-1 w-8 bg-primary/25" />
          </div>

          <p className="text-metal-300">
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
                className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
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
                sizes="100vw"
                className="object-contain"
                priority={false}
                quality={90}
                draggable={false}
              />
            </div>
          </div>

          {/* Controls hint bar */}
          <div className="flex items-center justify-center gap-6 mt-4 text-metal-400 text-xs">
            <span className="hidden md:inline-flex items-center gap-1.5">
              <kbd className="bg-steel-700 text-metal-300 px-1.5 py-0.5 text-[10px] border border-steel-600">+</kbd>
              <kbd className="bg-steel-700 text-metal-300 px-1.5 py-0.5 text-[10px] border border-steel-600">-</kbd>
              {t('productionLine.zoomKeys')}
            </span>
            <span className={`hidden md:inline-flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <kbd className="bg-steel-700 text-metal-300 px-1.5 py-0.5 text-[10px] border border-steel-600">{isRTL ? '&rarr;' : '&larr;'}</kbd>
              <kbd className="bg-steel-700 text-metal-300 px-1.5 py-0.5 text-[10px] border border-steel-600">{isRTL ? '&larr;' : '&rarr;'}</kbd>
              {t('productionLine.panKeys')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-4 h-4 border border-metal-500 flex items-center justify-center text-[8px]">&#x1f5b1;</span>
              {t('productionLine.scrollZoom')}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

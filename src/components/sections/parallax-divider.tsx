'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface ParallaxDividerProps {
  image: string;
  titleKey?: string;
  subtitleKey?: string;
  height?: string;
  overlay?: 'dark' | 'gold' | 'steel';
  showStats?: boolean;
}

export function ParallaxDivider({
  image,
  titleKey,
  subtitleKey,
  height = 'h-[350px] md:h-[450px]',
  overlay = 'dark',
  showStats = false,
}: ParallaxDividerProps) {
  const t = useTranslations();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const overlayClasses = {
    dark: 'bg-steel-900/75',
    gold: 'bg-gradient-to-r from-steel-900/80 via-steel-900/60 to-primary/30',
    steel: 'bg-gradient-to-b from-steel-900/90 via-steel-900/70 to-steel-900/90',
  };

  return (
    <section
      ref={ref}
      className={`relative ${height} overflow-hidden`}
      style={{
        backgroundImage: `url(${image})`,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />

      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-4">
          {titleKey && (
            <motion.h3
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight"
            >
              {t(titleKey)}
            </motion.h3>
          )}

          {subtitleKey && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-primary font-medium max-w-2xl mx-auto"
            >
              {t(subtitleKey)}
            </motion.p>
          )}

          {/* Decorative gold divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 mx-auto h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </div>
      </div>
    </section>
  );
}

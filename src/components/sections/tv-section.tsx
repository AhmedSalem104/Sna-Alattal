'use client';

import { useRef, useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Play, Tv, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';

interface TVInterview {
  id: string;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  channel: string;
  videoUrl: string;
  thumbnailUrl: string;
  date: string;
}

export const TVSection = memo(function TVSection() {
  const t = useTranslations();
  const { isRTL, locale } = useLocale();
  const [tvInterviews, setTvInterviews] = useState<TVInterview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTvInterviews = async () => {
      try {
        const response = await fetch('/api/public/tv-interviews?limit=3');
        if (response.ok) {
          const data = await response.json();
          setTvInterviews(data);
        }
      } catch (error) {
        console.error('Error fetching TV interviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTvInterviews();
  }, []);

  const getTitle = (interview: TVInterview) => {
    switch (locale) {
      case 'ar':
        return interview.titleAr;
      case 'tr':
        return interview.titleTr;
      default:
        return interview.titleEn;
    }
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <>
      <section
        ref={ref}
        className="py-20 lg:py-28 bg-white relative overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Industrial Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(26, 26, 46, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(26, 26, 46, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-24 h-1 bg-primary" />
        <div className="absolute top-0 right-0 w-24 h-1 bg-primary" />

        <div className="container-custom relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 border-2 border-primary/30 bg-primary/5 px-4 py-2 mb-6">
              <Tv size={16} className="text-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                {t('tv.title') || 'المقابلات التلفزيونية'}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 uppercase tracking-wide mb-4">
              {t('tv.subtitle') || 'ظهورنا الإعلامي'}
            </h2>

            {/* Gold Divider */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-1 w-8 bg-primary/25" />
              <div className="h-1 w-16 bg-primary/50" />
              <div className="h-1 w-24 bg-primary" />
              <div className="h-1 w-16 bg-primary/50" />
              <div className="h-1 w-8 bg-primary/25" />
            </div>

            <p className="text-metal-600">
              {t('tv.description') || 'نشارك خبراتنا ورؤيتنا في أهم القنوات والمنصات الإعلامية'}
            </p>
          </motion.div>

          {/* Videos Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : tvInterviews.length === 0 ? (
            <div className="text-center py-20">
              <Tv className="w-16 h-16 mx-auto text-metal-300 mb-4" />
              <p className="text-metal-500">
                {t('tv.noInterviews') || 'لا توجد مقابلات تلفزيونية حالياً'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {tvInterviews.map((interview, index) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div
                    className="group relative bg-metal-50 border-2 border-metal-200 overflow-hidden hover:border-primary transition-all duration-300 cursor-pointer"
                    onClick={() => setActiveVideo(interview.videoUrl)}
                  >
                    {/* Gold Accent Bar */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary z-10 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={interview.thumbnailUrl}
                        alt={getTitle(interview)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-steel-900/40 group-hover:bg-steel-900/30 transition-colors" />

                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-gold">
                          <Play size={28} className="text-steel-900 ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 border-t-2 border-metal-100">
                      <span className="text-xs text-primary font-bold uppercase tracking-wider">
                        {interview.channel}
                      </span>
                      <h3 className="text-steel-900 font-bold uppercase tracking-wide group-hover:text-primary transition-colors mt-1">
                        {getTitle(interview)}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-steel-900/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl aspect-video bg-steel-800 border-4 border-primary overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={activeVideo}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-steel-900/80 hover:bg-primary text-white hover:text-steel-900 rounded-none"
              onClick={() => setActiveVideo(null)}
            >
              <X size={24} />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
});

'use client';

import { useRef, useState, useEffect, memo } from 'react';
import { ImageWithSkeleton } from '@/components/ui/image-with-skeleton';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Play, Tv, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IndustrialSpinner } from '@/components/ui/industrial-spinner';
import { useLocale } from '@/hooks/useLocale';
import { IndustrialGear } from '@/components/decorative';

interface TVInterview {
  id: string;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  channelAr: string;
  channelEn: string;
  channelTr: string;
  videoUrl: string;
  thumbnail: string;
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
        const response = await fetch('/api/public/tv-interviews?limit=6');
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

  const getChannel = (interview: TVInterview) => {
    switch (locale) {
      case 'ar':
        return interview.channelAr;
      case 'tr':
        return interview.channelTr;
      default:
        return interview.channelEn;
    }
  };

  const getThumbnail = (interview: TVInterview) => {
    if (interview.thumbnail) return interview.thumbnail;
    // Extract YouTube thumbnail from video URL as fallback
    const url = interview.videoUrl || '';
    const ytMatch = url.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    return '/images/placeholders/news.svg';
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <>
      <section
        ref={ref}
        className="py-20 lg:py-28 bg-white/[0.93] relative overflow-hidden"
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
          <IndustrialGear size={280} teeth={14} className="absolute -bottom-10 -right-10 text-primary opacity-[0.15] hidden md:block" reverse strokeWidth={1.5} />
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
            <div className="inline-flex items-center gap-2 border-2 border-primary/30 bg-primary/15 px-4 py-2 mb-6">
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
              <IndustrialSpinner size="md" />
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
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    className="group relative overflow-hidden cursor-pointer aspect-[16/10] bg-steel-900"
                    onClick={() => setActiveVideo(interview.videoUrl)}
                  >
                    {/* Full-bleed thumbnail */}
                    <ImageWithSkeleton
                      src={getThumbnail(interview)}
                      alt={getTitle(interview)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out"
                      wrapperClassName="absolute inset-0"
                      loading="lazy"
                    />

                    {/* Cinematic gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-steel-950 via-steel-900/40 to-transparent group-hover:via-steel-900/30 transition-colors duration-300" />

                    {/* Gold top line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10" />

                    {/* Channel badge - top left */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-wider group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300">
                        <Tv size={12} />
                        {getChannel(interview)}
                      </span>
                    </div>

                    {/* Center play button */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="relative">
                        {/* Pulse ring */}
                        <div className="absolute -inset-3 border-2 border-white/20 rounded-full group-hover:border-primary/40 group-hover:scale-125 transition-all duration-500 opacity-0 group-hover:opacity-100" />
                        <div className="relative w-14 h-14 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-lg">
                          <Play size={22} className="text-white group-hover:text-steel-900 ml-0.5 transition-colors" fill="currentColor" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                      <h3 className="text-white font-bold text-base uppercase tracking-wide group-hover:text-primary transition-colors duration-300 line-clamp-2">
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

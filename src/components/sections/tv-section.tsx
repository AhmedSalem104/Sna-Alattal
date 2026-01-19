'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Play, Tv, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tvInterviews = [
  {
    id: '1',
    title: 'لقاء خاص مع المدير العام',
    channel: 'قناة القاهرة والناس',
    date: '2024-01-15',
    thumbnail: '/images/logo.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '2',
    title: 'العتال في معرض جلفود',
    channel: 'قناة العربية',
    date: '2024-02-20',
    thumbnail: '/images/logo.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '3',
    title: 'صناعة خطوط الإنتاج في مصر',
    channel: 'قناة CBC',
    date: '2024-03-10',
    thumbnail: '/images/logo.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
];

export function TVSection() {
  const t = useTranslations();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <>
      <section ref={ref} className="section-padding bg-dark relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Tv size={16} />
              المقابلات التلفزيونية
            </div>
            <h2 className="heading-2 text-white mb-4">ظهورنا الإعلامي</h2>
            <p className="text-gray-400">نشارك خبراتنا ورؤيتنا في أهم القنوات والمنصات الإعلامية</p>
          </motion.div>

          {/* Videos Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {tvInterviews.map((interview, index) => (
              <motion.div
                key={interview.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div
                  className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 cursor-pointer"
                  onClick={() => setActiveVideo(interview.videoUrl)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={interview.thumbnail}
                      alt={interview.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-dark/50 group-hover:bg-dark/30 transition-colors" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                        <Play size={28} className="text-dark ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-xs text-primary mb-1">{interview.channel}</p>
                    <h3 className="text-white font-semibold group-hover:text-primary transition-colors">
                      {interview.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-dark/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl aspect-video bg-dark rounded-xl overflow-hidden"
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
              className="absolute top-4 right-4 bg-dark/50 hover:bg-dark text-white"
              onClick={() => setActiveVideo(null)}
            >
              <X size={24} />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

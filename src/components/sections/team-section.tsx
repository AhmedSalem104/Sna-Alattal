'use client';

import { useRef, memo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Linkedin, Mail, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IndustrialSpinner } from '@/components/ui/industrial-spinner';
import { useLocale } from '@/hooks/useLocale';

interface TeamMember {
  id: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  positionAr: string;
  positionEn: string;
  positionTr: string;
  image: string;
  email: string;
  phone: string;
}

export const TeamSection = memo(function TeamSection() {
  const t = useTranslations();
  const { isRTL, locale } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch('/api/public/team?limit=4');
        if (response.ok) {
          const data = await response.json();
          setTeam(data);
        }
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const getName = (member: TeamMember) => {
    if (locale === 'ar') return member.nameAr;
    if (locale === 'tr') return member.nameTr;
    return member.nameEn;
  };

  const getPosition = (member: TeamMember) => {
    if (locale === 'ar') return member.positionAr;
    if (locale === 'tr') return member.positionTr;
    return member.positionEn;
  };

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-metal-50 relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Industrial Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 160, 10, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 160, 10, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-1 h-32 bg-primary" />
      <div className="absolute bottom-0 right-0 w-1 h-32 bg-primary" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 border-2 border-primary/30 bg-primary/5 px-4 py-2 mb-4">
              <Users size={16} className="text-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                {t('team.title')}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 uppercase tracking-wide">
              {t('team.subtitle')}
            </h2>

            {/* Gold Divider */}
            <div className="flex items-center gap-4 mt-4">
              <div className="h-1 w-16 bg-primary" />
              <div className="h-1 w-8 bg-primary/50" />
              <div className="h-1 w-4 bg-primary/25" />
            </div>

            <p className="text-metal-600 mt-4 max-w-xl">{t('team.description')}</p>
          </div>

          <Button variant="industrialOutline" asChild className="group shrink-0">
            <Link href="/team">
              {t('team.viewAll') || 'عرض الفريق'}
              <ArrowRight
                className={`${isRTL ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`}
                size={18}
              />
            </Link>
          </Button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <IndustrialSpinner size="md" />
          </div>
        )}

        {/* Empty State */}
        {!loading && team.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-metal-300 mx-auto mb-4" />
            <p className="text-metal-500 text-lg">
              {t('team.noMembers') || 'No team members found'}
            </p>
          </div>
        )}

        {/* Team Grid */}
        {!loading && team.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden hover:shadow-elevation-3 transition-all duration-500">
                  {/* Gold Accent Bar - hover reveal */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary z-10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={member.image || '/images/placeholders/team.svg'}
                      alt={getName(member)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-steel-900 via-steel-900/30 to-transparent" />

                    {/* Social Links */}
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href="#"
                        className="w-10 h-10 bg-steel-900/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary hover:text-steel-900 transition-all"
                      >
                        <Linkedin size={18} />
                      </a>
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="w-10 h-10 bg-steel-900/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary hover:text-steel-900 transition-all"
                        >
                          <Mail size={18} />
                        </a>
                      )}
                    </div>

                    {/* Name Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-bold text-white uppercase tracking-wider group-hover:text-primary transition-colors">
                        {getName(member)}
                      </h3>
                      <p className="text-sm text-primary font-semibold uppercase tracking-wider">
                        {getPosition(member)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

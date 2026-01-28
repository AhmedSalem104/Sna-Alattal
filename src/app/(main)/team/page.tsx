'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Users, Linkedin, Mail, Loader2 } from 'lucide-react';
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

export default function TeamPage() {
  const t = useTranslations();
  const { locale, isRTL } = useLocale();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch('/api/public/team');
        if (res.ok) {
          const data = await res.json();
          setTeam(data);
        }
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setLoading(false);
      }
    }

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-b from-primary/20 via-white to-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1 bg-primary/20 text-primary rounded-full text-sm mb-4">
              {t('team.title')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {t('team.subtitle')}
            </h1>
            <p className="text-xl text-gray-700">
              {t('team.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : team.length === 0 ? (
            <div className="text-center py-20">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-xl">{t('team.noMembers')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group"
                >
                  <div className="relative bg-white border-2 border-gray-200 overflow-hidden hover:border-primary transition-all duration-300 rounded-lg">
                    {/* Gold Accent Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary z-10" />

                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={member.image || '/images/team/placeholder.jpg'}
                        alt={getName(member)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />

                      {/* Social Links */}
                      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href="#"
                          className="w-10 h-10 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary hover:text-gray-900 transition-all rounded"
                        >
                          <Linkedin size={18} />
                        </a>
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="w-10 h-10 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary hover:text-gray-900 transition-all rounded"
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
    </div>
  );
}

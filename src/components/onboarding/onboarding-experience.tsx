'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ChevronRight, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingPhase {
  id: number;
  titleKey: string;
  subtitleKey: string;
  bgColor: string;
  icon: React.ReactNode;
}

const phases: OnboardingPhase[] = [
  {
    id: 1,
    titleKey: 'phase1.title',
    subtitleKey: 'phase1.subtitle',
    bgColor: 'from-white via-white-50 to-white',
    icon: <Sparkles className="text-primary" size={40} />,
  },
  {
    id: 2,
    titleKey: 'phase2.title',
    subtitleKey: 'phase2.subtitle',
    bgColor: 'from-primary/20 via-white to-white',
    icon: <span className="text-5xl">🏭</span>,
  },
  {
    id: 3,
    titleKey: 'phase3.title',
    subtitleKey: 'phase3.subtitle',
    bgColor: 'from-white via-primary/10 to-white',
    icon: <span className="text-5xl">⚙️</span>,
  },
  {
    id: 4,
    titleKey: 'phase4.title',
    subtitleKey: 'phase4.subtitle',
    bgColor: 'from-white to-primary/20',
    icon: <span className="text-5xl">🌍</span>,
  },
];

const ONBOARDING_KEY = 'sna_onboarding_completed';

export function OnboardingExperience() {
  const t = useTranslations('onboarding');
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already seen onboarding
    const hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (!hasSeenOnboarding) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsVisible(false);
    document.body.style.overflow = '';
  };

  const handleNext = () => {
    if (currentPhase < phases.length - 1) {
      setCurrentPhase(currentPhase + 1);
    } else {
      handleSkip();
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-white"
      >
        {/* Skip Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="absolute top-6 right-6 z-10 text-gray-600 hover:text-primary"
        >
          {t('skip')}
          <X size={18} className="mr-2" />
        </Button>

        {/* Phase Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b ${phases[currentPhase].bgColor}`}
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-8"
            >
              <Image
                src="/images/logo.jpg"
                alt="S.N.A Al-Attal"
                width={120}
                height={120}
                className="rounded-xl shadow-2xl"
              />
            </motion.div>

            {/* Icon */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              {phases[currentPhase].icon}
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center px-6 max-w-md"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t(phases[currentPhase].titleKey)}
              </h2>
              <p className="text-lg text-gray-700">
                {t(phases[currentPhase].subtitleKey)}
              </p>
            </motion.div>

            {/* Progress Indicators */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-2 mt-12"
            >
              {phases.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhase(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentPhase
                      ? 'w-8 bg-primary'
                      : index < currentPhase
                      ? 'w-2 bg-primary/60'
                      : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </motion.div>

            {/* Next Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12"
            >
              <Button variant="gold" size="xl" onClick={handleNext} className="group">
                {currentPhase === phases.length - 1 ? t('start') : 'التالي'}
                <ChevronRight className="mr-2 group-hover:translate-x-1 rtl:rotate-180 transition-transform" size={20} />
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

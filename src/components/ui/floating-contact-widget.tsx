'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';

const WHATSAPP_NUMBER = '201032221038';
const PHONE_NUMBER = '+20-103-222-1038';
const EMAIL = 'info@sna-alattal.com';
const WHATSAPP_MESSAGE_AR = 'مرحبًا، أود الاستفسار عن منتجاتكم وخدماتكم';
const WHATSAPP_MESSAGE_EN = 'Hello, I would like to inquire about your products and services';

const channels = [
  {
    id: 'whatsapp',
    icon: WhatsAppIcon,
    bg: 'bg-[#25D366]',
    hoverBg: 'hover:bg-[#1DA851]',
    href: (isRTL: boolean) =>
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        isRTL ? WHATSAPP_MESSAGE_AR : WHATSAPP_MESSAGE_EN
      )}`,
    label: 'WhatsApp',
    external: true,
  },
  {
    id: 'phone',
    icon: Phone,
    bg: 'bg-steel-700',
    hoverBg: 'hover:bg-steel-600',
    href: () => `tel:${PHONE_NUMBER}`,
    label: 'اتصل بنا',
    external: false,
  },
  {
    id: 'email',
    icon: Mail,
    bg: 'bg-steel-700',
    hoverBg: 'hover:bg-steel-600',
    href: () => `mailto:${EMAIL}`,
    label: 'البريد الإلكتروني',
    external: false,
  },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { isRTL } = useLocale();

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <div
      className={cn(
        'fixed bottom-24 z-50',
        isRTL ? 'left-4 md:left-6' : 'right-4 md:right-6'
      )}
    >
      {/* Channel buttons */}
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col gap-3 mb-3">
            {channels.map((channel, i) => {
              const Icon = channel.icon;
              return (
                <motion.a
                  key={channel.id}
                  href={channel.href(isRTL)}
                  target={channel.external ? '_blank' : undefined}
                  rel={channel.external ? 'noopener noreferrer' : undefined}
                  aria-label={channel.label}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ delay: i * 0.07, duration: 0.2 }}
                  className={cn(
                    'w-12 h-12 flex items-center justify-center text-white shadow-lg',
                    'transition-colors duration-200',
                    channel.bg,
                    channel.hoverBg
                  )}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main FAB button */}
      <motion.button
        onClick={toggle}
        aria-label={isOpen ? 'إغلاق' : 'تواصل معنا'}
        aria-expanded={isOpen}
        className={cn(
          'w-14 h-14 flex items-center justify-center shadow-lg',
          'transition-colors duration-300',
          isOpen
            ? 'bg-steel-800 text-white hover:bg-steel-700'
            : 'bg-primary text-primary-foreground hover:bg-primary-600'
        )}
        whileTap={{ scale: 0.92 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Phone className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring when closed */}
        {!isOpen && (
          <span
            className="absolute inset-0 bg-primary/30 animate-ping"
            aria-hidden="true"
          />
        )}
      </motion.button>
    </div>
  );
}

'use client';

import { useRef, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail, Send, Loader2, MessageSquare, Building2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useLocale } from '@/hooks/useLocale';

export function ContactSection() {
  const t = useTranslations();
  const { isRTL } = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t('contact.form.validation.nameRequired')),
        email: z.string().email(t('contact.form.validation.emailInvalid')),
        phone: z.string().optional(),
        company: z.string().optional(),
        subject: z.string().min(2, t('contact.form.validation.subjectRequired')),
        message: z.string().min(10, t('contact.form.validation.messageMinLength')),
      }),
    [t]
  );

  type ContactFormData = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success(t('contact.form.success'));
      reset();
    } catch {
      toast.error(t('contact.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-steel-900 relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Industrial Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 160, 10, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 160, 10, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Top Gold Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          {/* Section Tag */}
          <div className="inline-flex items-center gap-2 border-2 border-primary/30 bg-primary/10 px-4 py-2 mb-6">
            <MessageSquare size={16} className="text-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              {t('contact.title')}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wide mb-4">
            {t('contact.subtitle')}
          </h2>

          {/* Gold Divider */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-1 w-8 bg-primary/25" />
            <div className="h-1 w-16 bg-primary/50" />
            <div className="h-1 w-24 bg-primary" />
            <div className="h-1 w-16 bg-primary/50" />
            <div className="h-1 w-8 bg-primary/25" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Egypt Office */}
            <div className="bg-steel-800 border-2 border-steel-700 p-6 relative group hover:border-primary transition-colors">
              {/* Gold Accent Bar */}
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary flex items-center justify-center">
                  <Building2 size={24} className="text-steel-900" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                    {t('contact.info.egypt.title')}
                  </h3>
                  <p className="text-metal-400 text-sm">{t('contact.info.egypt.country') || 'Egypt'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-steel-600 bg-steel-700 flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" size={18} />
                  </div>
                  <p className="text-metal-300 pt-2">{t('contact.info.egypt.address')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-steel-600 bg-steel-700 flex items-center justify-center shrink-0">
                    <Phone className="text-primary" size={18} />
                  </div>
                  <a
                    href="tel:+201032221038"
                    className="text-metal-300 hover:text-primary transition-colors"
                  >
                    01032221038
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-steel-600 bg-steel-700 flex items-center justify-center shrink-0">
                    <Phone className="text-primary" size={18} />
                  </div>
                  <a
                    href="tel:+201006193661"
                    className="text-metal-300 hover:text-primary transition-colors"
                  >
                    01006193661
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-steel-600 bg-steel-700 flex items-center justify-center shrink-0">
                    <Mail className="text-primary" size={18} />
                  </div>
                  <a
                    href="mailto:snaalattal@gmail.com"
                    className="text-metal-300 hover:text-primary transition-colors"
                  >
                    snaalattal@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Turkey Office */}
            <div className="bg-steel-800 border-2 border-steel-700 p-6 relative group hover:border-primary transition-colors">
              {/* Gold Accent Bar */}
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary flex items-center justify-center">
                  <Globe size={24} className="text-steel-900" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                    {t('contact.info.turkey.title')}
                  </h3>
                  <p className="text-metal-400 text-sm">{t('contact.info.turkey.country') || 'Turkey'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-steel-600 bg-steel-700 flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" size={18} />
                  </div>
                  <p className="text-metal-300 pt-2">{t('contact.info.turkey.address')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-steel-600 bg-steel-700 flex items-center justify-center shrink-0">
                    <Phone className="text-primary" size={18} />
                  </div>
                  <span className="text-metal-300">{t('contact.info.turkey.phone')}</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="bg-primary p-6">
              <h4 className="text-steel-900 font-bold uppercase tracking-wider mb-3">
                {t('contact.quick_response') || 'Quick Response'}
              </h4>
              <p className="text-steel-800 text-sm">
                {t('contact.quick_response_text') ||
                  'نحن نستجيب لجميع الاستفسارات خلال 24 ساعة عمل'}
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white border-2 border-metal-200 p-6 md:p-8">
              {/* Form Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-steel-900 uppercase tracking-wider mb-2">
                  {t('contact.form.title') || 'Send us a message'}
                </h3>
                <div className="h-1 w-12 bg-primary" />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-steel-800 font-semibold uppercase text-xs tracking-wider">
                      {t('contact.form.name')} *
                    </Label>
                    <Input
                      id="name"
                      variant="industrial"
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-steel-800 font-semibold uppercase text-xs tracking-wider">
                      {t('contact.form.email')} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      variant="industrial"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-steel-800 font-semibold uppercase text-xs tracking-wider">
                      {t('contact.form.phone')}
                    </Label>
                    <Input
                      id="phone"
                      variant="industrial"
                      {...register('phone')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-steel-800 font-semibold uppercase text-xs tracking-wider">
                      {t('contact.form.company')}
                    </Label>
                    <Input
                      id="company"
                      variant="industrial"
                      {...register('company')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-steel-800 font-semibold uppercase text-xs tracking-wider">
                    {t('contact.form.subject')} *
                  </Label>
                  <Input
                    id="subject"
                    variant="industrial"
                    {...register('subject')}
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-500">{errors.subject.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-steel-800 font-semibold uppercase text-xs tracking-wider">
                    {t('contact.form.message')} *
                  </Label>
                  <Textarea
                    id="message"
                    rows={5}
                    className="rounded-none border-2 border-metal-200 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                    {...register('message')}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="outline"
                  size="lg"
                  className="w-full border-2 border-primary bg-primary/10 text-primary hover:bg-primary hover:text-steel-900 font-bold uppercase tracking-wider transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t('contact.form.sending')}
                    </>
                  ) : (
                    <>
                      {t('contact.form.submit')}
                      <Send size={18} />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

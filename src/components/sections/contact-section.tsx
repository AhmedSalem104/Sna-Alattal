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
import { IndustrialGear } from '@/components/decorative';

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
      className="py-12 lg:py-16 bg-gradient-to-b from-white/[0.93] to-neutral-50/95 relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Subtle Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-copper-500/5 blur-3xl opacity-30" />
      </div>

      <IndustrialGear size={350} teeth={12} className="absolute -bottom-12 -right-12 text-primary opacity-[0.40] hidden md:block" strokeWidth={2.5} />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          {/* Section Tag */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 mb-6">
            <MessageSquare size={16} />
            <span className="text-sm font-semibold">
              {t('contact.title')}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-900 tracking-tight mb-4 border-l-4 border-primary pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4">
            {t('contact.subtitle')}
          </h2>

          {/* Modern Divider */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Egypt Office */}
            <div className="bg-white border border-neutral-200 p-5 relative group hover:border-primary/40 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={20} className="text-primary" />
                <h3 className="font-bold text-steel-900">🇪🇬 فرع مصر — المقر الرئيسي</h3>
              </div>
              <div className="space-y-2 text-sm text-neutral-600">
                <div className="flex items-center gap-2"><MapPin size={14} className="text-primary shrink-0" /> العاشر من رمضان — المنطقة الصناعية B4 — قطعة 183</div>
                <div className="flex items-center gap-2"><Phone size={14} className="text-primary shrink-0" /> أ. آية سعيد: <a href="tel:+201211459495" className="hover:text-primary font-medium" dir="ltr">+20 121 145 9495</a></div>
                <div className="flex items-center gap-2"><Phone size={14} className="text-primary shrink-0" /> أ. امتياز حمدي: <a href="tel:+201032221038" className="hover:text-primary font-medium" dir="ltr">+20 103 222 1038</a> / <a href="tel:+201006193661" className="hover:text-primary font-medium" dir="ltr">+20 100 619 3661</a></div>
                <div className="flex items-center gap-2"><Mail size={14} className="text-primary shrink-0" /> <a href="mailto:info@snalattal.com" className="hover:text-primary">info@snalattal.com</a></div>
              </div>
            </div>

            {/* All Branches Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Syria */}
              <div className="bg-white border border-neutral-200 p-4 group hover:border-primary/40 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={16} className="text-primary" />
                  <h3 className="font-bold text-steel-900 text-sm">🇸🇾 فرع سوريا</h3>
                </div>
                <div className="space-y-2 text-xs text-neutral-600">
                  <div className="flex items-center gap-2"><MapPin size={12} className="text-primary shrink-0" /> حلب — ريف المهندسين الأول</div>
                  <div className="flex items-center gap-2"><Phone size={12} className="text-primary shrink-0" /> أ. عمار بارود: <a href="tel:+963944971509" className="hover:text-primary" dir="ltr">+963 944 971 509</a></div>
                  <div className="flex items-center gap-2"><Phone size={12} className="text-primary shrink-0" /> أ. عبادة المنجد: <a href="tel:+905366777156" className="hover:text-primary" dir="ltr">+90 536 677 7156</a></div>
                </div>
              </div>

              {/* Saudi */}
              <div className="bg-white border border-neutral-200 p-4 group hover:border-primary/40 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={16} className="text-primary" />
                  <h3 className="font-bold text-steel-900 text-sm">🇸🇦 فرع السعودية</h3>
                </div>
                <div className="space-y-2 text-xs text-neutral-600">
                  <div className="flex items-center gap-2"><Phone size={12} className="text-primary shrink-0" /> أ. عمرو يوسف (الطائف): <a href="tel:+966536471877" className="hover:text-primary" dir="ltr">+966 53 647 1877</a></div>
                  <div className="flex items-center gap-2"><Phone size={12} className="text-primary shrink-0" /> أ. عبدالرحمن السني (الرياض): <a href="tel:+966554996623" className="hover:text-primary" dir="ltr">+966 55 499 6623</a></div>
                </div>
              </div>

              {/* Turkey */}
              <div className="bg-white border border-neutral-200 p-4 group hover:border-primary/40 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={16} className="text-primary" />
                  <h3 className="font-bold text-steel-900 text-sm">🇹🇷 فرع تركيا</h3>
                </div>
                <div className="space-y-2 text-xs text-neutral-600">
                  <div className="flex items-center gap-2"><MapPin size={12} className="text-primary shrink-0" /> إسطنبول — ديميركابي</div>
                  <div className="flex items-center gap-2"><Phone size={12} className="text-primary shrink-0" /> أ. منير عنان: <a href="tel:+905516072123" className="hover:text-primary" dir="ltr">+90 551 607 2123</a></div>
                </div>
              </div>

              {/* Iraq */}
              <div className="bg-white border border-neutral-200 p-4 group hover:border-primary/40 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={16} className="text-primary" />
                  <h3 className="font-bold text-steel-900 text-sm">🇮🇶 فرع العراق</h3>
                </div>
                <div className="space-y-2 text-xs text-neutral-600">
                  <div className="flex items-center gap-2"><MapPin size={12} className="text-primary shrink-0" /> بغداد</div>
                  <div className="flex items-center gap-2"><Phone size={12} className="text-primary shrink-0" /> أ. مرتضى اللامي: <a href="tel:+9647714375620" className="hover:text-primary" dir="ltr">+964 771 437 5620</a></div>
                </div>
              </div>
            </div>

            {/* Marketing Department */}
            <div className="bg-primary/10 p-4 mt-2">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={16} className="text-primary" />
                <h4 className="text-steel-900 font-bold text-sm">📢 إدارة التسويق (واتساب)</h4>
              </div>
              <div className="space-y-1 text-xs text-neutral-600">
                <div className="flex items-center gap-2"><Phone size={12} className="text-primary shrink-0" /> <a href="tel:+201032221038" className="hover:text-primary">+20 103 222 1038</a></div>
                <div className="flex items-center gap-2"><Phone size={12} className="text-primary shrink-0" /> <a href="tel:+9647774123070" className="hover:text-primary" dir="ltr">+964 777 412 3070</a></div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white border border-neutral-200 p-6 md:p-8 shadow-sm">
              {/* Form Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-steel-900 mb-2">
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

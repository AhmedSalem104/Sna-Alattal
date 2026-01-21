'use client';

import { useRef, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function ContactSection() {
  const t = useTranslations();
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
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(t('contact.form.success'));
      reset();
    } catch {
      toast.error(t('contact.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} className="section-padding bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
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
            <Mail size={16} />
            {t('contact.title')}
          </div>
          <h2 className="heading-2 text-gray-900 mb-4">{t('contact.subtitle')}</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Egypt Office */}
            <div className="p-6 bg-gray-100 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('contact.info.egypt.title')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <p className="text-gray-600">{t('contact.info.egypt.address')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="text-primary" size={20} />
                  </div>
                  <a href="tel:+201032221038" className="text-gray-600 hover:text-primary transition-colors">
                    {t('contact.info.egypt.phone')}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <a href="mailto:info@sna-attal.com" className="text-gray-600 hover:text-primary transition-colors">
                    info@sna-attal.com
                  </a>
                </div>
              </div>
            </div>

            {/* Turkey Office */}
            <div className="p-6 bg-gray-100 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('contact.info.turkey.title')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <p className="text-gray-600">{t('contact.info.turkey.address')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="text-primary" size={20} />
                  </div>
                  <span className="text-gray-600">{t('contact.info.turkey.phone')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-900">{t('contact.form.name')}</Label>
                  <Input
                    id="name"
                    className="bg-gray-100 border-gray-200 text-gray-900"
                    {...register('name')}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-900">{t('contact.form.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    className="bg-gray-100 border-gray-200 text-gray-900"
                    {...register('email')}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-900">{t('contact.form.phone')}</Label>
                  <Input
                    id="phone"
                    className="bg-gray-100 border-gray-200 text-gray-900"
                    {...register('phone')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-gray-900">{t('contact.form.company')}</Label>
                  <Input
                    id="company"
                    className="bg-gray-100 border-gray-200 text-gray-900"
                    {...register('company')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-gray-900">{t('contact.form.subject')}</Label>
                <Input
                  id="subject"
                  className="bg-gray-100 border-gray-200 text-gray-900"
                  {...register('subject')}
                />
                {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-900">{t('contact.form.message')}</Label>
                <Textarea
                  id="message"
                  rows={5}
                  className="bg-gray-100 border-gray-200 text-gray-900 resize-none"
                  {...register('message')}
                />
                {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
              </div>

              <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    {t('contact.form.sending')}
                  </>
                ) : (
                  <>
                    {t('contact.form.submit')}
                    <Send className="mr-2" size={18} />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

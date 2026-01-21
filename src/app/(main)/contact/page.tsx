'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building2,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  company: z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const offices = [
  {
    country: 'egypt',
    name: 'المقر الرئيسي - مصر',
    nameEn: 'Headquarters - Egypt',
    address: 'المنطقة الصناعية، العاشر من رمضان، الشرقية، مصر',
    addressEn: 'Industrial Zone, 10th of Ramadan City, Egypt',
    phone: '+20 123 456 7890',
    email: 'egypt@sna-alattal.com',
    hours: '8:00 AM - 5:00 PM (Sun-Thu)',
  },
  {
    country: 'turkey',
    name: 'فرع تركيا',
    nameEn: 'Turkey Branch',
    address: 'إسطنبول، تركيا',
    addressEn: 'Istanbul, Turkey',
    phone: '+90 212 345 6789',
    email: 'turkey@sna-alattal.com',
    hours: '9:00 AM - 6:00 PM (Mon-Fri)',
  },
];

const subjects = [
  { value: 'quote', label: 'طلب عرض سعر', labelEn: 'Request a Quote' },
  { value: 'support', label: 'دعم فني', labelEn: 'Technical Support' },
  { value: 'sales', label: 'استفسار مبيعات', labelEn: 'Sales Inquiry' },
  { value: 'partnership', label: 'شراكة تجارية', labelEn: 'Business Partnership' },
  { value: 'other', label: 'أخرى', labelEn: 'Other' },
];

export default function ContactPage() {
  const t = useTranslations('contactPage');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
    setTimeout(() => setIsSuccess(false), 5000);
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
              {t('badge')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-700">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1 space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('getInTouch')}</h2>
                <p className="text-gray-600">{t('getInTouchDesc')}</p>
              </div>

              {/* Offices */}
              {offices.map((office, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-2xl border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Building2 className="text-primary" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{office.name}</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-primary mt-1 flex-shrink-0" size={18} />
                      <span className="text-gray-600 text-sm">{office.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-primary flex-shrink-0" size={18} />
                      <a href={`tel:${office.phone}`} className="text-gray-600 text-sm hover:text-primary transition-colors">
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="text-primary flex-shrink-0" size={18} />
                      <a href={`mailto:${office.email}`} className="text-gray-600 text-sm hover:text-primary transition-colors">
                        {office.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="text-primary flex-shrink-0" size={18} />
                      <span className="text-gray-600 text-sm">{office.hours}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick Contact */}
              <div className="bg-primary/10 p-6 rounded-2xl border border-primary/30">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="text-primary" size={24} />
                  <h3 className="text-lg font-bold text-gray-900">{t('quickResponse')}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{t('quickResponseDesc')}</p>
                <a
                  href="https://wa.me/201234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <Globe size={18} />
                  WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('sendMessage')}</h2>

                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/20 border border-green-500/50 text-green-400 p-4 rounded-xl mb-6"
                  >
                    {t('successMessage')}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <Label htmlFor="name" className="text-gray-900">{t('form.name')}</Label>
                      <Input
                        id="name"
                        {...register('name')}
                        className="mt-2 bg-white border-gray-200 text-gray-900"
                        placeholder={t('form.namePlaceholder')}
                      />
                      {errors.name && (
                        <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-gray-900">{t('form.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        className="mt-2 bg-white border-gray-200 text-gray-900"
                        placeholder={t('form.emailPlaceholder')}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone" className="text-gray-900">{t('form.phone')}</Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        className="mt-2 bg-white border-gray-200 text-gray-900"
                        placeholder={t('form.phonePlaceholder')}
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Company */}
                    <div>
                      <Label htmlFor="company" className="text-gray-900">{t('form.company')}</Label>
                      <Input
                        id="company"
                        {...register('company')}
                        className="mt-2 bg-white border-gray-200 text-gray-900"
                        placeholder={t('form.companyPlaceholder')}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <Label className="text-gray-900">{t('form.subject')}</Label>
                    <Select onValueChange={(value) => setValue('subject', value)}>
                      <SelectTrigger className="mt-2 bg-white border-gray-200 text-gray-900">
                        <SelectValue placeholder={t('form.subjectPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        {subjects.map((subject) => (
                          <SelectItem key={subject.value} value={subject.value}>
                            {subject.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subject && (
                      <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message" className="text-gray-900">{t('form.message')}</Label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      className="mt-2 bg-white border-gray-200 text-gray-900 min-h-[150px]"
                      placeholder={t('form.messagePlaceholder')}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t('form.sending')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send size={18} />
                        {t('form.send')}
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('findUs')}</h2>
            <p className="text-gray-600">{t('findUsDesc')}</p>
          </motion.div>

          <div className="h-96 rounded-2xl overflow-hidden border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.123456789!2d31.7654321!3d30.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDA3JzI0LjQiTiAzMcKwNDUnNTUuNiJF!5e0!3m2!1sen!2seg!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
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
  Globe,
  Loader2
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
import { useLocale } from '@/hooks/useLocale';
import { getLocalizedField } from '@/lib/locale-helpers';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  company: z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface Office {
  country: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  addressAr: string;
  addressEn: string;
  addressTr: string;
  phone: string;
  email: string;
  hours: string;
}

// Fallback offices data (used if settings not yet populated)
const defaultOffices: Office[] = [
  {
    country: 'egypt',
    nameAr: 'المقر الرئيسي - مصر',
    nameEn: 'Headquarters - Egypt',
    nameTr: 'Genel Merkez - Mısır',
    addressAr: 'ب4، ثان، العاشر من رمضان، مدينة العاشر من رمضان، 44634، EG',
    addressEn: 'B4, 2nd, 10th of Ramadan, 10th of Ramadan City, 44634, EG',
    addressTr: 'B4, 2., 10. Ramazan, 10. Ramazan Şehri, 44634, EG',
    phone: '01032221038',
    email: 'snaalattal@gmail.com',
    hours: '8:00 AM - 5:00 PM (Sun-Thu)',
  },
  {
    country: 'turkey',
    nameAr: 'فرع تركيا',
    nameEn: 'Turkey Branch',
    nameTr: 'Türkiye Şubesi',
    addressAr: 'إسطنبول، تركيا',
    addressEn: 'Istanbul, Turkey',
    addressTr: 'İstanbul, Türkiye',
    phone: '+90 212 345 6789',
    email: 'snaalattal@gmail.com',
    hours: '9:00 AM - 6:00 PM (Mon-Fri)',
  },
];

const subjects = [
  { value: 'quote', labelAr: 'طلب عرض سعر', labelEn: 'Request a Quote', labelTr: 'Teklif İste' },
  { value: 'support', labelAr: 'دعم فني', labelEn: 'Technical Support', labelTr: 'Teknik Destek' },
  { value: 'sales', labelAr: 'استفسار مبيعات', labelEn: 'Sales Inquiry', labelTr: 'Satış Sorgusu' },
  { value: 'partnership', labelAr: 'شراكة تجارية', labelEn: 'Business Partnership', labelTr: 'İş Ortaklığı' },
  { value: 'other', labelAr: 'أخرى', labelEn: 'Other', labelTr: 'Diğer' },
];

export default function ContactPage() {
  const t = useTranslations('contactPage');
  const { locale } = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offices, setOffices] = useState<Office[]>(defaultOffices);
  const [loadingOffices, setLoadingOffices] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    async function fetchOffices() {
      try {
        const res = await fetch('/api/public/settings?group=offices');
        if (res.ok) {
          const data = await res.json();
          if (data.office_locations && Array.isArray(data.office_locations) && data.office_locations.length > 0) {
            setOffices(data.office_locations);
          }
        }
      } catch (error) {
        console.error('Error fetching offices:', error);
        // Keep using default offices
      } finally {
        setLoadingOffices(false);
      }
    }

    fetchOffices();
  }, []);

  const getOfficeName = (office: Office) => getLocalizedField(office, 'name', locale);
  const getOfficeAddress = (office: Office) => getLocalizedField(office, 'address', locale);
  const getSubjectLabel = (subject: typeof subjects[0]) => getLocalizedField(subject, 'label', locale);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 429) {
          throw new Error(t('errors.tooManyRequests') || 'Too many requests. Please try again later.');
        }
        throw new Error(errorData.error || t('errors.sendFailed') || 'Failed to send message');
      }

      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.sendFailed') || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
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
              {loadingOffices ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                offices.map((office, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-6 rounded-2xl border border-gray-200"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <Building2 className="text-primary" size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{getOfficeName(office)}</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="text-primary mt-1 flex-shrink-0" size={18} />
                        <span className="text-gray-600 text-sm">{getOfficeAddress(office)}</span>
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
                ))
              )}

              {/* Quick Contact */}
              <div className="bg-primary/10 p-6 rounded-2xl border border-primary/30">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="text-primary" size={24} />
                  <h3 className="text-lg font-bold text-gray-900">{t('quickResponse')}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{t('quickResponseDesc')}</p>
                <a
                  href="https://wa.me/201032221038"
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
                    role="alert"
                    aria-live="polite"
                    className="bg-green-100 border border-green-500 text-green-700 p-4 rounded-xl mb-6"
                  >
                    {t('successMessage')}
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    aria-live="polite"
                    className="bg-red-100 border border-red-500 text-red-700 p-4 rounded-xl mb-6"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <Label htmlFor="name" className="text-gray-900">{t('form.name')} <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        {...register('name')}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className="mt-2 bg-white border-gray-200 text-gray-900"
                        placeholder={t('form.namePlaceholder')}
                      />
                      {errors.name && (
                        <p id="name-error" role="alert" className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-gray-900">{t('form.email')} <span className="text-red-500">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className="mt-2 bg-white border-gray-200 text-gray-900"
                        placeholder={t('form.emailPlaceholder')}
                      />
                      {errors.email && (
                        <p id="email-error" role="alert" className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone" className="text-gray-900">{t('form.phone')} <span className="text-red-500">*</span></Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        className="mt-2 bg-white border-gray-200 text-gray-900"
                        placeholder={t('form.phonePlaceholder')}
                      />
                      {errors.phone && (
                        <p id="phone-error" role="alert" className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
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
                    <Label className="text-gray-900">{t('form.subject')} <span className="text-red-500">*</span></Label>
                    <Select onValueChange={(value) => setValue('subject', value)}>
                      <SelectTrigger
                        className="mt-2 bg-white border-gray-200 text-gray-900"
                        aria-invalid={!!errors.subject}
                        aria-describedby={errors.subject ? 'subject-error' : undefined}
                      >
                        <SelectValue placeholder={t('form.subjectPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        {subjects.map((subject) => (
                          <SelectItem key={subject.value} value={subject.value}>
                            {getSubjectLabel(subject)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subject && (
                      <p id="subject-error" role="alert" className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message" className="text-gray-900">{t('form.message')} <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      className="mt-2 bg-white border-gray-200 text-gray-900 min-h-[150px]"
                      placeholder={t('form.messagePlaceholder')}
                    />
                    {errors.message && (
                      <p id="message-error" role="alert" className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="outline"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full border-2 border-primary bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold transition-all duration-300"
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

          <div className="h-64 sm:h-80 md:h-96 lg:h-[450px] xl:h-[500px] 2xl:h-[600px] rounded-2xl overflow-hidden border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.123456789!2d31.7654321!3d30.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDA3JzI0LjQiTiAzMcKwNDUnNTUuNiJF!5e0!3m2!1sen!2seg!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="S.N.A Al-Attal Location Map"
              aria-label="Google Maps showing S.N.A Al-Attal headquarters location"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

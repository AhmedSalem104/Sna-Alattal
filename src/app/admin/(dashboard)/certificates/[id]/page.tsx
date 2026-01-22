'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/admin/image-upload';
import { ArrowRight, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const certificateSchema = z.object({
  nameAr: z.string().min(2, 'اسم الشهادة بالعربية مطلوب'),
  nameEn: z.string().min(2, 'اسم الشهادة بالإنجليزية مطلوب'),
  nameTr: z.string().min(2, 'اسم الشهادة بالتركية مطلوب'),
  issuingBodyAr: z.string().min(2, 'جهة الإصدار بالعربية مطلوبة'),
  issuingBodyEn: z.string().min(2, 'جهة الإصدار بالإنجليزية مطلوبة'),
  issuingBodyTr: z.string().min(2, 'جهة الإصدار بالتركية مطلوبة'),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionTr: z.string().optional(),
  issueDate: z.string().min(1, 'تاريخ الإصدار مطلوب'),
  expiryDate: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

type CertificateFormData = z.infer<typeof certificateSchema>;

export default function EditCertificatePage() {
  const router = useRouter();
  const params = useParams();
  const certificateId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/certificates/${certificateId}`);

        if (res.ok) {
          const certificate = await res.json();
          reset({
            nameAr: certificate.nameAr,
            nameEn: certificate.nameEn,
            nameTr: certificate.nameTr,
            issuingBodyAr: certificate.issuingBodyAr,
            issuingBodyEn: certificate.issuingBodyEn,
            issuingBodyTr: certificate.issuingBodyTr,
            descriptionAr: certificate.descriptionAr || '',
            descriptionEn: certificate.descriptionEn || '',
            descriptionTr: certificate.descriptionTr || '',
            issueDate: certificate.issueDate ? new Date(certificate.issueDate).toISOString().split('T')[0] : '',
            expiryDate: certificate.expiryDate ? new Date(certificate.expiryDate).toISOString().split('T')[0] : '',
            isActive: certificate.isActive,
            order: certificate.order,
          });
          setImage(certificate.image || '');
        } else {
          toast.error('الشهادة غير موجودة');
          router.push('/admin/certificates');
        }
      } catch (error) {
        toast.error('فشل تحميل بيانات الشهادة');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [certificateId, reset, router]);

  const onSubmit = async (data: CertificateFormData) => {
    if (!image) {
      toast.error('يرجى إضافة صورة الشهادة');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/certificates/${certificateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, image }),
      });

      if (res.ok) {
        toast.success('تم تحديث الشهادة بنجاح');
        router.push('/admin/certificates');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'فشل تحديث الشهادة');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الشهادة');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/certificates">
            <Button variant="ghost" size="icon">
              <ArrowRight size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تعديل الشهادة</h1>
            <p className="text-gray-600 mt-1">قم بتعديل بيانات الشهادة</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="ar" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ar">العربية</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="tr">Türkçe</TabsTrigger>
              </TabsList>

              <TabsContent value="ar">
                <Card>
                  <CardHeader>
                    <CardTitle>المعلومات بالعربية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="nameAr">اسم الشهادة *</Label>
                      <Input
                        id="nameAr"
                        {...register('nameAr')}
                        className="mt-1.5"
                        placeholder="مثال: شهادة الأيزو 9001"
                      />
                      {errors.nameAr && (
                        <p className="text-sm text-red-500 mt-1">{errors.nameAr.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="issuingBodyAr">جهة الإصدار *</Label>
                      <Input
                        id="issuingBodyAr"
                        {...register('issuingBodyAr')}
                        className="mt-1.5"
                        placeholder="مثال: منظمة الأيزو العالمية"
                      />
                      {errors.issuingBodyAr && (
                        <p className="text-sm text-red-500 mt-1">{errors.issuingBodyAr.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="descriptionAr">الوصف</Label>
                      <Textarea
                        id="descriptionAr"
                        {...register('descriptionAr')}
                        className="mt-1.5 min-h-[120px]"
                        placeholder="وصف الشهادة (اختياري)"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="en">
                <Card>
                  <CardHeader>
                    <CardTitle>English Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="nameEn">Certificate Name *</Label>
                      <Input
                        id="nameEn"
                        {...register('nameEn')}
                        className="mt-1.5"
                        placeholder="e.g., ISO 9001 Certificate"
                        dir="ltr"
                      />
                      {errors.nameEn && (
                        <p className="text-sm text-red-500 mt-1">{errors.nameEn.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="issuingBodyEn">Issuing Body *</Label>
                      <Input
                        id="issuingBodyEn"
                        {...register('issuingBodyEn')}
                        className="mt-1.5"
                        placeholder="e.g., International Organization for Standardization"
                        dir="ltr"
                      />
                      {errors.issuingBodyEn && (
                        <p className="text-sm text-red-500 mt-1">{errors.issuingBodyEn.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="descriptionEn">Description</Label>
                      <Textarea
                        id="descriptionEn"
                        {...register('descriptionEn')}
                        className="mt-1.5 min-h-[120px]"
                        placeholder="Certificate description (optional)"
                        dir="ltr"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tr">
                <Card>
                  <CardHeader>
                    <CardTitle>Türkçe Bilgi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="nameTr">Sertifika Adı *</Label>
                      <Input
                        id="nameTr"
                        {...register('nameTr')}
                        className="mt-1.5"
                        placeholder="örn: ISO 9001 Sertifikası"
                        dir="ltr"
                      />
                      {errors.nameTr && (
                        <p className="text-sm text-red-500 mt-1">{errors.nameTr.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="issuingBodyTr">Yayıncı Kuruluş *</Label>
                      <Input
                        id="issuingBodyTr"
                        {...register('issuingBodyTr')}
                        className="mt-1.5"
                        placeholder="örn: Uluslararası Standardizasyon Örgütü"
                        dir="ltr"
                      />
                      {errors.issuingBodyTr && (
                        <p className="text-sm text-red-500 mt-1">{errors.issuingBodyTr.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="descriptionTr">Açıklama</Label>
                      <Textarea
                        id="descriptionTr"
                        {...register('descriptionTr')}
                        className="mt-1.5 min-h-[120px]"
                        placeholder="Sertifika açıklaması (isteğe bağlı)"
                        dir="ltr"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Image */}
            <Card>
              <CardHeader>
                <CardTitle>صورة الشهادة *</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={image ? [image] : []}
                  onChange={(urls) => setImage(urls[0] || '')}
                  maxFiles={1}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>التواريخ والإعدادات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="issueDate">تاريخ الإصدار *</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    {...register('issueDate')}
                    className="mt-1.5"
                    dir="ltr"
                  />
                  {errors.issueDate && (
                    <p className="text-sm text-red-500 mt-1">{errors.issueDate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="expiryDate">تاريخ الانتهاء</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    {...register('expiryDate')}
                    className="mt-1.5"
                    dir="ltr"
                  />
                </div>

                <div>
                  <Label htmlFor="order">الترتيب</Label>
                  <Input
                    id="order"
                    type="number"
                    {...register('order', { valueAsNumber: true })}
                    className="mt-1.5"
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">مفعل</Label>
                  <Switch
                    id="isActive"
                    {...register('isActive')}
                    onCheckedChange={(checked) => setValue('isActive', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-slate-900"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="ml-2 h-4 w-4" />
                  حفظ التغييرات
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

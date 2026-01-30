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

const clientSchema = z.object({
  nameAr: z.string().min(2, 'اسم العميل بالعربية مطلوب'),
  nameEn: z.string().min(2, 'اسم العميل بالإنجليزية مطلوب'),
  nameTr: z.string().min(2, 'اسم العميل بالتركية مطلوب'),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionTr: z.string().optional(),
  website: z.string().url('رابط الموقع غير صالح').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  order: z.number().default(0),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logo, setLogo] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  const isActive = watch('isActive');
  const isFeatured = watch('isFeatured');

  // Fetch client data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/clients/${clientId}`);

        if (res.ok) {
          const client = await res.json();
          reset({
            nameAr: client.nameAr,
            nameEn: client.nameEn,
            nameTr: client.nameTr,
            descriptionAr: client.descriptionAr || '',
            descriptionEn: client.descriptionEn || '',
            descriptionTr: client.descriptionTr || '',
            website: client.website || '',
            isActive: client.isActive,
            isFeatured: client.isFeatured,
            order: client.order,
          });
          setLogo(client.logo || '');
        } else {
          toast.error('العميل غير موجود');
          router.push('/admin/clients');
        }
      } catch (error) {
        toast.error('فشل تحميل بيانات العميل');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [clientId, reset, router]);

  const onSubmit = async (data: ClientFormData) => {
    if (!logo) {
      toast.error('يرجى إضافة شعار العميل');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, logo }),
      });

      if (res.ok) {
        toast.success('تم تحديث بيانات العميل بنجاح');
        router.push('/admin/clients');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'فشل تحديث بيانات العميل');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث بيانات العميل');
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
          <Link href="/admin/clients">
            <Button variant="ghost" size="icon">
              <ArrowRight size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تعديل بيانات العميل</h1>
            <p className="text-gray-600 mt-1">قم بتعديل بيانات العميل</p>
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
                      <Label htmlFor="nameAr">اسم العميل *</Label>
                      <Input
                        id="nameAr"
                        {...register('nameAr')}
                        className="mt-1.5"
                        placeholder="أدخل اسم العميل بالعربية"
                      />
                      {errors.nameAr && (
                        <p className="text-sm text-red-500 mt-1">{errors.nameAr.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="descriptionAr">الوصف</Label>
                      <Textarea
                        id="descriptionAr"
                        {...register('descriptionAr')}
                        className="mt-1.5 min-h-[120px]"
                        placeholder="وصف مختصر عن العميل (اختياري)"
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
                      <Label htmlFor="nameEn">Client Name *</Label>
                      <Input
                        id="nameEn"
                        {...register('nameEn')}
                        className="mt-1.5"
                        placeholder="Enter client name in English"
                        dir="ltr"
                      />
                      {errors.nameEn && (
                        <p className="text-sm text-red-500 mt-1">{errors.nameEn.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="descriptionEn">Description</Label>
                      <Textarea
                        id="descriptionEn"
                        {...register('descriptionEn')}
                        className="mt-1.5 min-h-[120px]"
                        placeholder="Short description about the client (optional)"
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
                      <Label htmlFor="nameTr">Müşteri Adı *</Label>
                      <Input
                        id="nameTr"
                        {...register('nameTr')}
                        className="mt-1.5"
                        placeholder="Müşteri adını Türkçe girin"
                        dir="ltr"
                      />
                      {errors.nameTr && (
                        <p className="text-sm text-red-500 mt-1">{errors.nameTr.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="descriptionTr">Açıklama</Label>
                      <Textarea
                        id="descriptionTr"
                        {...register('descriptionTr')}
                        className="mt-1.5 min-h-[120px]"
                        placeholder="Müşteri hakkında kısa açıklama (isteğe bağlı)"
                        dir="ltr"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Logo */}
            <Card>
              <CardHeader>
                <CardTitle>شعار العميل *</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  يفضل استخدام صورة شفافة PNG بدقة 400x200 بكسل أو أكبر
                </p>
                <ImageUpload
                  value={logo}
                  onChange={(url) => setLogo(url as string)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>معلومات إضافية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="website">الموقع الإلكتروني</Label>
                  <Input
                    id="website"
                    type="url"
                    {...register('website')}
                    className="mt-1.5"
                    placeholder="https://example.com"
                    dir="ltr"
                  />
                  {errors.website && (
                    <p className="text-sm text-red-500 mt-1">{errors.website.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الإعدادات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    checked={isActive}
                    onCheckedChange={(checked) => setValue('isActive', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isFeatured">مميز</Label>
                  <Switch
                    id="isFeatured"
                    checked={isFeatured}
                    onCheckedChange={(checked) => setValue('isFeatured', checked)}
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

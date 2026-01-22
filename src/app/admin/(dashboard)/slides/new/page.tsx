'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

const slideSchema = z.object({
  titleAr: z.string().min(3, 'العنوان بالعربية مطلوب'),
  titleEn: z.string().min(3, 'العنوان بالإنجليزية مطلوب'),
  titleTr: z.string().min(3, 'العنوان بالتركية مطلوب'),
  subtitleAr: z.string().optional(),
  subtitleEn: z.string().optional(),
  subtitleTr: z.string().optional(),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionTr: z.string().optional(),
  buttonTextAr: z.string().optional(),
  buttonTextEn: z.string().optional(),
  buttonTextTr: z.string().optional(),
  buttonLink: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

type SlideFormData = z.infer<typeof slideSchema>;

export default function NewSlidePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SlideFormData>({
    resolver: zodResolver(slideSchema),
    defaultValues: {
      isActive: true,
      order: 0,
    },
  });

  const onSubmit = async (data: SlideFormData) => {
    if (!image) {
      toast.error('يرجى إضافة صورة للسلايد');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, image }),
      });

      if (res.ok) {
        toast.success('تم إنشاء السلايد بنجاح');
        router.push('/admin/slides');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'فشل إنشاء السلايد');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء السلايد');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/slides">
            <Button variant="ghost" size="icon">
              <ArrowRight size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إضافة سلايد جديد</h1>
            <p className="text-gray-600 mt-1">أضف شريحة عرض جديدة للصفحة الرئيسية</p>
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
                    <CardTitle>المحتوى بالعربية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="titleAr">العنوان الرئيسي *</Label>
                      <Input
                        id="titleAr"
                        {...register('titleAr')}
                        className="mt-1.5"
                        placeholder="أدخل العنوان بالعربية"
                      />
                      {errors.titleAr && (
                        <p className="text-sm text-red-500 mt-1">{errors.titleAr.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="subtitleAr">العنوان الفرعي</Label>
                      <Input
                        id="subtitleAr"
                        {...register('subtitleAr')}
                        className="mt-1.5"
                        placeholder="العنوان الفرعي (اختياري)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="descriptionAr">الوصف</Label>
                      <Textarea
                        id="descriptionAr"
                        {...register('descriptionAr')}
                        className="mt-1.5 min-h-[100px]"
                        placeholder="وصف قصير للسلايد (اختياري)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="buttonTextAr">نص الزر</Label>
                      <Input
                        id="buttonTextAr"
                        {...register('buttonTextAr')}
                        className="mt-1.5"
                        placeholder="مثال: اكتشف المزيد"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="en">
                <Card>
                  <CardHeader>
                    <CardTitle>English Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="titleEn">Main Title *</Label>
                      <Input
                        id="titleEn"
                        {...register('titleEn')}
                        className="mt-1.5"
                        placeholder="Enter title in English"
                        dir="ltr"
                      />
                      {errors.titleEn && (
                        <p className="text-sm text-red-500 mt-1">{errors.titleEn.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="subtitleEn">Subtitle</Label>
                      <Input
                        id="subtitleEn"
                        {...register('subtitleEn')}
                        className="mt-1.5"
                        placeholder="Subtitle (optional)"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <Label htmlFor="descriptionEn">Description</Label>
                      <Textarea
                        id="descriptionEn"
                        {...register('descriptionEn')}
                        className="mt-1.5 min-h-[100px]"
                        placeholder="Short description (optional)"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <Label htmlFor="buttonTextEn">Button Text</Label>
                      <Input
                        id="buttonTextEn"
                        {...register('buttonTextEn')}
                        className="mt-1.5"
                        placeholder="e.g., Learn More"
                        dir="ltr"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tr">
                <Card>
                  <CardHeader>
                    <CardTitle>Türkçe İçerik</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="titleTr">Ana Başlık *</Label>
                      <Input
                        id="titleTr"
                        {...register('titleTr')}
                        className="mt-1.5"
                        placeholder="Başlığı Türkçe girin"
                        dir="ltr"
                      />
                      {errors.titleTr && (
                        <p className="text-sm text-red-500 mt-1">{errors.titleTr.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="subtitleTr">Alt Başlık</Label>
                      <Input
                        id="subtitleTr"
                        {...register('subtitleTr')}
                        className="mt-1.5"
                        placeholder="Alt başlık (isteğe bağlı)"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <Label htmlFor="descriptionTr">Açıklama</Label>
                      <Textarea
                        id="descriptionTr"
                        {...register('descriptionTr')}
                        className="mt-1.5 min-h-[100px]"
                        placeholder="Kısa açıklama (isteğe bağlı)"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <Label htmlFor="buttonTextTr">Buton Metni</Label>
                      <Input
                        id="buttonTextTr"
                        {...register('buttonTextTr')}
                        className="mt-1.5"
                        placeholder="örn: Daha Fazla"
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
                <CardTitle>صورة السلايد *</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  يفضل استخدام صورة بدقة 1920x1080 بكسل أو أكبر
                </p>
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
                <CardTitle>الإعدادات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="buttonLink">رابط الزر</Label>
                  <Input
                    id="buttonLink"
                    {...register('buttonLink')}
                    className="mt-1.5"
                    placeholder="/products أو رابط خارجي"
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
                    defaultChecked
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
                  حفظ السلايد
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

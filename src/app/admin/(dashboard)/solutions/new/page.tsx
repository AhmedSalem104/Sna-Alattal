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
import { ArrowRight, Loader2, Save, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const solutionSchema = z.object({
  titleAr: z.string().min(2, 'عنوان الحل بالعربية مطلوب'),
  titleEn: z.string().min(2, 'عنوان الحل بالإنجليزية مطلوب'),
  titleTr: z.string().min(2, 'عنوان الحل بالتركية مطلوب'),
  slug: z.string().min(2, 'الرابط مطلوب').regex(/^[a-z0-9-]+$/, 'الرابط يجب أن يحتوي على حروف صغيرة وأرقام وشرطات فقط'),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionTr: z.string().optional(),
  shortDescAr: z.string().optional(),
  shortDescEn: z.string().optional(),
  shortDescTr: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  order: z.number().default(0),
});

type SolutionFormData = z.infer<typeof solutionSchema>;

export default function NewSolutionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<string>('');
  const [features, setFeatures] = useState<{ ar: string; en: string; tr: string }[]>([]);
  const [newFeature, setNewFeature] = useState({ ar: '', en: '', tr: '' });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SolutionFormData>({
    resolver: zodResolver(solutionSchema),
    defaultValues: { isActive: true, isFeatured: false, order: 0 },
  });

  const titleEn = watch('titleEn');

  const generateSlug = () => {
    if (titleEn) {
      const slug = titleEn
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  };

  const addFeature = () => {
    if (newFeature.ar && newFeature.en && newFeature.tr) {
      setFeatures([...features, newFeature]);
      setNewFeature({ ar: '', en: '', tr: '' });
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: SolutionFormData) => {
    if (!image) {
      toast.error('يرجى إضافة صورة للحل');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/solutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, image, features }),
      });

      if (res.ok) {
        toast.success('تم إضافة الحل بنجاح');
        router.push('/admin/solutions');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'فشل إضافة الحل');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة الحل');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/solutions">
          <Button variant="ghost" size="icon"><ArrowRight size={20} /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إضافة حل جديد</h1>
          <p className="text-gray-600 mt-1">أضف حل أو خدمة جديدة</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="ar" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ar">العربية</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="tr">Türkçe</TabsTrigger>
              </TabsList>

              <TabsContent value="ar">
                <Card>
                  <CardHeader><CardTitle>المعلومات بالعربية</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="titleAr">عنوان الحل *</Label>
                      <Input id="titleAr" {...register('titleAr')} className="mt-1.5" placeholder="عنوان الحل" />
                      {errors.titleAr && <p className="text-sm text-red-500 mt-1">{errors.titleAr.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="shortDescAr">وصف قصير</Label>
                      <Input id="shortDescAr" {...register('shortDescAr')} className="mt-1.5" placeholder="وصف قصير للحل" />
                    </div>
                    <div>
                      <Label htmlFor="descriptionAr">الوصف التفصيلي</Label>
                      <Textarea id="descriptionAr" {...register('descriptionAr')} className="mt-1.5 min-h-[150px]" placeholder="وصف تفصيلي للحل (اختياري)" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="en">
                <Card>
                  <CardHeader><CardTitle>English Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="titleEn">Solution Title *</Label>
                      <div className="flex gap-2">
                        <Input id="titleEn" {...register('titleEn')} className="mt-1.5" placeholder="Solution title" dir="ltr" />
                        <Button type="button" variant="outline" className="mt-1.5" onClick={generateSlug}>
                          توليد الرابط
                        </Button>
                      </div>
                      {errors.titleEn && <p className="text-sm text-red-500 mt-1">{errors.titleEn.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="shortDescEn">Short Description</Label>
                      <Input id="shortDescEn" {...register('shortDescEn')} className="mt-1.5" placeholder="Short description" dir="ltr" />
                    </div>
                    <div>
                      <Label htmlFor="descriptionEn">Full Description</Label>
                      <Textarea id="descriptionEn" {...register('descriptionEn')} className="mt-1.5 min-h-[150px]" placeholder="Full description (optional)" dir="ltr" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tr">
                <Card>
                  <CardHeader><CardTitle>Türkçe Bilgi</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="titleTr">Çözüm Başlığı *</Label>
                      <Input id="titleTr" {...register('titleTr')} className="mt-1.5" placeholder="Çözüm başlığı" dir="ltr" />
                      {errors.titleTr && <p className="text-sm text-red-500 mt-1">{errors.titleTr.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="shortDescTr">Kısa Açıklama</Label>
                      <Input id="shortDescTr" {...register('shortDescTr')} className="mt-1.5" placeholder="Kısa açıklama" dir="ltr" />
                    </div>
                    <div>
                      <Label htmlFor="descriptionTr">Tam Açıklama</Label>
                      <Textarea id="descriptionTr" {...register('descriptionTr')} className="mt-1.5 min-h-[150px]" placeholder="Tam açıklama (isteğe bağlı)" dir="ltr" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader><CardTitle>المميزات</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="الميزة بالعربية"
                    value={newFeature.ar}
                    onChange={(e) => setNewFeature({ ...newFeature, ar: e.target.value })}
                  />
                  <Input
                    placeholder="Feature in English"
                    value={newFeature.en}
                    onChange={(e) => setNewFeature({ ...newFeature, en: e.target.value })}
                    dir="ltr"
                  />
                  <Input
                    placeholder="Türkçe özellik"
                    value={newFeature.tr}
                    onChange={(e) => setNewFeature({ ...newFeature, tr: e.target.value })}
                    dir="ltr"
                  />
                </div>
                <Button type="button" variant="outline" onClick={addFeature} disabled={!newFeature.ar || !newFeature.en || !newFeature.tr}>
                  <Plus size={16} className="ml-2" /> إضافة ميزة
                </Button>

                {features.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 grid grid-cols-3 gap-2 text-sm">
                          <span>{feature.ar}</span>
                          <span dir="ltr">{feature.en}</span>
                          <span dir="ltr">{feature.tr}</span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)}>
                          <X size={16} className="text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>صورة الحل *</CardTitle></CardHeader>
              <CardContent>
                <ImageUpload value={image ? [image] : []} onChange={(urls) => setImage(urls[0] || '')} maxFiles={1} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>الرابط والأيقونة</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="slug">الرابط (Slug) *</Label>
                  <Input id="slug" {...register('slug')} className="mt-1.5" placeholder="solution-name" dir="ltr" />
                  {errors.slug && <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>}
                </div>
                <div>
                  <Label htmlFor="icon">أيقونة (Lucide Icon Name)</Label>
                  <Input id="icon" {...register('icon')} className="mt-1.5" placeholder="مثال: Lightbulb" dir="ltr" />
                  <p className="text-xs text-gray-400 mt-1">اسم الأيقونة من مكتبة Lucide</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>الإعدادات</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="order">الترتيب</Label>
                  <Input id="order" type="number" {...register('order', { valueAsNumber: true })} className="mt-1.5" placeholder="0" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">مفعل</Label>
                  <Switch id="isActive" defaultChecked onCheckedChange={(checked) => setValue('isActive', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isFeatured">مميز</Label>
                  <Switch id="isFeatured" onCheckedChange={(checked) => setValue('isFeatured', checked)} />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-slate-900">
              {isSubmitting ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" />جاري الحفظ...</> : <><Save className="ml-2 h-4 w-4" />حفظ الحل</>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

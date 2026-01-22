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

const interviewSchema = z.object({
  titleAr: z.string().min(3, 'العنوان بالعربية مطلوب'),
  titleEn: z.string().min(3, 'العنوان بالإنجليزية مطلوب'),
  titleTr: z.string().min(3, 'العنوان بالتركية مطلوب'),
  channelAr: z.string().min(2, 'اسم القناة بالعربية مطلوب'),
  channelEn: z.string().min(2, 'اسم القناة بالإنجليزية مطلوب'),
  channelTr: z.string().min(2, 'اسم القناة بالتركية مطلوب'),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionTr: z.string().optional(),
  videoUrl: z.string().url('رابط الفيديو غير صالح'),
  date: z.string().min(1, 'التاريخ مطلوب'),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

type InterviewFormData = z.infer<typeof interviewSchema>;

export default function NewTVInterviewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<InterviewFormData>({
    resolver: zodResolver(interviewSchema),
    defaultValues: { isActive: true, order: 0 },
  });

  const onSubmit = async (data: InterviewFormData) => {
    if (!thumbnail) {
      toast.error('يرجى إضافة صورة مصغرة');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/tv-interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, thumbnail }),
      });

      if (res.ok) {
        toast.success('تم إضافة المقابلة بنجاح');
        router.push('/admin/tv-interviews');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'فشل إضافة المقابلة');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة المقابلة');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/tv-interviews">
          <Button variant="ghost" size="icon"><ArrowRight size={20} /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إضافة مقابلة جديدة</h1>
          <p className="text-gray-600 mt-1">أضف مقابلة تلفزيونية جديدة</p>
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
                      <Label htmlFor="titleAr">عنوان المقابلة *</Label>
                      <Input id="titleAr" {...register('titleAr')} className="mt-1.5" placeholder="عنوان المقابلة" />
                      {errors.titleAr && <p className="text-sm text-red-500 mt-1">{errors.titleAr.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="channelAr">القناة *</Label>
                      <Input id="channelAr" {...register('channelAr')} className="mt-1.5" placeholder="اسم القناة" />
                      {errors.channelAr && <p className="text-sm text-red-500 mt-1">{errors.channelAr.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="descriptionAr">الوصف</Label>
                      <Textarea id="descriptionAr" {...register('descriptionAr')} className="mt-1.5 min-h-[120px]" placeholder="وصف المقابلة (اختياري)" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="en">
                <Card>
                  <CardHeader><CardTitle>English Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="titleEn">Interview Title *</Label>
                      <Input id="titleEn" {...register('titleEn')} className="mt-1.5" dir="ltr" />
                      {errors.titleEn && <p className="text-sm text-red-500 mt-1">{errors.titleEn.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="channelEn">Channel *</Label>
                      <Input id="channelEn" {...register('channelEn')} className="mt-1.5" dir="ltr" />
                      {errors.channelEn && <p className="text-sm text-red-500 mt-1">{errors.channelEn.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="descriptionEn">Description</Label>
                      <Textarea id="descriptionEn" {...register('descriptionEn')} className="mt-1.5 min-h-[120px]" dir="ltr" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tr">
                <Card>
                  <CardHeader><CardTitle>Türkçe Bilgi</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="titleTr">Röportaj Başlığı *</Label>
                      <Input id="titleTr" {...register('titleTr')} className="mt-1.5" dir="ltr" />
                      {errors.titleTr && <p className="text-sm text-red-500 mt-1">{errors.titleTr.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="channelTr">Kanal *</Label>
                      <Input id="channelTr" {...register('channelTr')} className="mt-1.5" dir="ltr" />
                      {errors.channelTr && <p className="text-sm text-red-500 mt-1">{errors.channelTr.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="descriptionTr">Açıklama</Label>
                      <Textarea id="descriptionTr" {...register('descriptionTr')} className="mt-1.5 min-h-[120px]" dir="ltr" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader><CardTitle>الصورة المصغرة *</CardTitle></CardHeader>
              <CardContent>
                <ImageUpload value={thumbnail ? [thumbnail] : []} onChange={(urls) => setThumbnail(urls[0] || '')} maxFiles={1} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>الفيديو والإعدادات</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="videoUrl">رابط الفيديو *</Label>
                  <Input id="videoUrl" {...register('videoUrl')} className="mt-1.5" placeholder="https://youtube.com/..." dir="ltr" />
                  {errors.videoUrl && <p className="text-sm text-red-500 mt-1">{errors.videoUrl.message}</p>}
                </div>
                <div>
                  <Label htmlFor="date">تاريخ المقابلة *</Label>
                  <Input id="date" type="date" {...register('date')} className="mt-1.5" dir="ltr" />
                  {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>}
                </div>
                <div>
                  <Label htmlFor="order">الترتيب</Label>
                  <Input id="order" type="number" {...register('order', { valueAsNumber: true })} className="mt-1.5" placeholder="0" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">مفعل</Label>
                  <Switch id="isActive" defaultChecked onCheckedChange={(checked) => setValue('isActive', checked)} />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-slate-900">
              {isSubmitting ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" />جاري الحفظ...</> : <><Save className="ml-2 h-4 w-4" />حفظ المقابلة</>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

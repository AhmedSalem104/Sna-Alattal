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

const exhibitionSchema = z.object({
  nameAr: z.string().min(2, 'اسم المعرض بالعربية مطلوب'),
  nameEn: z.string().min(2, 'اسم المعرض بالإنجليزية مطلوب'),
  nameTr: z.string().min(2, 'اسم المعرض بالتركية مطلوب'),
  locationAr: z.string().min(2, 'الموقع بالعربية مطلوب'),
  locationEn: z.string().min(2, 'الموقع بالإنجليزية مطلوب'),
  locationTr: z.string().min(2, 'الموقع بالتركية مطلوب'),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionTr: z.string().optional(),
  startDate: z.string().min(1, 'تاريخ البداية مطلوب'),
  endDate: z.string().min(1, 'تاريخ النهاية مطلوب'),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

type ExhibitionFormData = z.infer<typeof exhibitionSchema>;

export default function EditExhibitionPage() {
  const router = useRouter();
  const params = useParams();
  const exhibitionId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<ExhibitionFormData>({
    resolver: zodResolver(exhibitionSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/exhibitions/${exhibitionId}`);
        if (res.ok) {
          const data = await res.json();
          reset({
            ...data,
            startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
            endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
          });
          setImages(data.images || []);
        } else {
          toast.error('المعرض غير موجود');
          router.push('/admin/exhibitions');
        }
      } catch (error) {
        toast.error('فشل تحميل البيانات');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [exhibitionId, reset, router]);

  const onSubmit = async (data: ExhibitionFormData) => {
    if (images.length === 0) {
      toast.error('يرجى إضافة صورة واحدة على الأقل');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/exhibitions/${exhibitionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, images }),
      });

      if (res.ok) {
        toast.success('تم تحديث المعرض بنجاح');
        router.push('/admin/exhibitions');
      } else {
        toast.error('فشل تحديث المعرض');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث المعرض');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/exhibitions">
          <Button variant="ghost" size="icon"><ArrowRight size={20} /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تعديل المعرض</h1>
          <p className="text-gray-600 mt-1">قم بتعديل بيانات المعرض</p>
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
                      <Label htmlFor="nameAr">اسم المعرض *</Label>
                      <Input id="nameAr" {...register('nameAr')} className="mt-1.5" />
                      {errors.nameAr && <p className="text-sm text-red-500 mt-1">{errors.nameAr.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="locationAr">الموقع *</Label>
                      <Input id="locationAr" {...register('locationAr')} className="mt-1.5" />
                      {errors.locationAr && <p className="text-sm text-red-500 mt-1">{errors.locationAr.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="descriptionAr">الوصف</Label>
                      <Textarea id="descriptionAr" {...register('descriptionAr')} className="mt-1.5 min-h-[120px]" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="en">
                <Card>
                  <CardHeader><CardTitle>English Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="nameEn">Exhibition Name *</Label>
                      <Input id="nameEn" {...register('nameEn')} className="mt-1.5" dir="ltr" />
                      {errors.nameEn && <p className="text-sm text-red-500 mt-1">{errors.nameEn.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="locationEn">Location *</Label>
                      <Input id="locationEn" {...register('locationEn')} className="mt-1.5" dir="ltr" />
                      {errors.locationEn && <p className="text-sm text-red-500 mt-1">{errors.locationEn.message}</p>}
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
                      <Label htmlFor="nameTr">Fuar Adı *</Label>
                      <Input id="nameTr" {...register('nameTr')} className="mt-1.5" dir="ltr" />
                      {errors.nameTr && <p className="text-sm text-red-500 mt-1">{errors.nameTr.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="locationTr">Konum *</Label>
                      <Input id="locationTr" {...register('locationTr')} className="mt-1.5" dir="ltr" />
                      {errors.locationTr && <p className="text-sm text-red-500 mt-1">{errors.locationTr.message}</p>}
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
              <CardHeader><CardTitle>صور المعرض *</CardTitle></CardHeader>
              <CardContent>
                <ImageUpload value={images} onChange={setImages} maxFiles={10} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>التواريخ والإعدادات</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="startDate">تاريخ البداية *</Label>
                  <Input id="startDate" type="date" {...register('startDate')} className="mt-1.5" dir="ltr" />
                  {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>}
                </div>
                <div>
                  <Label htmlFor="endDate">تاريخ النهاية *</Label>
                  <Input id="endDate" type="date" {...register('endDate')} className="mt-1.5" dir="ltr" />
                  {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate.message}</p>}
                </div>
                <div>
                  <Label htmlFor="order">الترتيب</Label>
                  <Input id="order" type="number" {...register('order', { valueAsNumber: true })} className="mt-1.5" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">مفعل</Label>
                  <Switch id="isActive" {...register('isActive')} onCheckedChange={(checked) => setValue('isActive', checked)} />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-slate-900">
              {isSubmitting ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" />جاري الحفظ...</> : <><Save className="ml-2 h-4 w-4" />حفظ التغييرات</>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

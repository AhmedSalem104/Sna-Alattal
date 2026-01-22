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
import { ArrowRight, Loader2, Save, FileText, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const catalogueSchema = z.object({
  nameAr: z.string().min(2, 'اسم الكتالوج بالعربية مطلوب'),
  nameEn: z.string().min(2, 'اسم الكتالوج بالإنجليزية مطلوب'),
  nameTr: z.string().min(2, 'اسم الكتالوج بالتركية مطلوب'),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionTr: z.string().optional(),
  fileUrl: z.string().url('رابط الملف غير صالح'),
  fileSize: z.number().default(0),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

type CatalogueFormData = z.infer<typeof catalogueSchema>;

export default function NewCataloguePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CatalogueFormData>({
    resolver: zodResolver(catalogueSchema),
    defaultValues: { isActive: true, order: 0, fileSize: 0 },
  });

  const fileUrl = watch('fileUrl');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF only)
    if (file.type !== 'application/pdf') {
      toast.error('يرجى اختيار ملف PDF فقط');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('حجم الملف يجب أن يكون أقل من 50MB');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setValue('fileUrl', data.url);
        setValue('fileSize', file.size);
        toast.success('تم رفع الملف بنجاح');
      } else {
        toast.error('فشل رفع الملف');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء رفع الملف');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: CatalogueFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/catalogues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, thumbnail }),
      });

      if (res.ok) {
        toast.success('تم إضافة الكتالوج بنجاح');
        router.push('/admin/catalogues');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'فشل إضافة الكتالوج');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة الكتالوج');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/catalogues">
          <Button variant="ghost" size="icon"><ArrowRight size={20} /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إضافة كتالوج جديد</h1>
          <p className="text-gray-600 mt-1">أضف كتالوج منتجات أو ملف PDF جديد</p>
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
                      <Label htmlFor="nameAr">اسم الكتالوج *</Label>
                      <Input id="nameAr" {...register('nameAr')} className="mt-1.5" placeholder="اسم الكتالوج" />
                      {errors.nameAr && <p className="text-sm text-red-500 mt-1">{errors.nameAr.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="descriptionAr">الوصف</Label>
                      <Textarea id="descriptionAr" {...register('descriptionAr')} className="mt-1.5 min-h-[120px]" placeholder="وصف الكتالوج (اختياري)" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="en">
                <Card>
                  <CardHeader><CardTitle>English Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="nameEn">Catalogue Name *</Label>
                      <Input id="nameEn" {...register('nameEn')} className="mt-1.5" placeholder="Catalogue name" dir="ltr" />
                      {errors.nameEn && <p className="text-sm text-red-500 mt-1">{errors.nameEn.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="descriptionEn">Description</Label>
                      <Textarea id="descriptionEn" {...register('descriptionEn')} className="mt-1.5 min-h-[120px]" placeholder="Catalogue description (optional)" dir="ltr" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tr">
                <Card>
                  <CardHeader><CardTitle>Türkçe Bilgi</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="nameTr">Katalog Adı *</Label>
                      <Input id="nameTr" {...register('nameTr')} className="mt-1.5" placeholder="Katalog adı" dir="ltr" />
                      {errors.nameTr && <p className="text-sm text-red-500 mt-1">{errors.nameTr.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="descriptionTr">Açıklama</Label>
                      <Textarea id="descriptionTr" {...register('descriptionTr')} className="mt-1.5 min-h-[120px]" placeholder="Katalog açıklaması (isteğe bağlı)" dir="ltr" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader><CardTitle>صورة الغلاف</CardTitle></CardHeader>
              <CardContent>
                <ImageUpload value={thumbnail ? [thumbnail] : []} onChange={(urls) => setThumbnail(urls[0] || '')} maxFiles={1} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>ملف الكتالوج *</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                  {fileUrl ? (
                    <div className="space-y-3">
                      <div className="w-16 h-16 mx-auto bg-red-100 rounded-xl flex items-center justify-center">
                        <FileText className="text-red-600" size={32} />
                      </div>
                      <p className="text-sm text-gray-600">تم رفع الملف بنجاح</p>
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                        عرض الملف
                      </a>
                      <Button type="button" variant="outline" size="sm" onClick={() => setValue('fileUrl', '')}>
                        تغيير الملف
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-xl flex items-center justify-center">
                        <Upload className="text-gray-400" size={32} />
                      </div>
                      <div>
                        <p className="text-gray-600">اسحب ملف PDF هنا أو</p>
                        <label className="text-primary hover:underline cursor-pointer">
                          اختر ملف
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-400">PDF فقط، بحد أقصى 50MB</p>
                      {isUploading && (
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          جاري الرفع...
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="fileUrl">أو أدخل رابط الملف مباشرة</Label>
                  <Input id="fileUrl" {...register('fileUrl')} className="mt-1.5" placeholder="https://..." dir="ltr" />
                  {errors.fileUrl && <p className="text-sm text-red-500 mt-1">{errors.fileUrl.message}</p>}
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
              </CardContent>
            </Card>

            <Button type="submit" disabled={isSubmitting || !fileUrl} className="w-full bg-primary hover:bg-primary/90 text-slate-900">
              {isSubmitting ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" />جاري الحفظ...</> : <><Save className="ml-2 h-4 w-4" />حفظ الكتالوج</>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

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
import { ArrowRight, Loader2, Save, FileText, Upload, Download } from 'lucide-react';
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

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function EditCataloguePage() {
  const router = useRouter();
  const params = useParams();
  const catalogueId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CatalogueFormData>({
    resolver: zodResolver(catalogueSchema),
  });

  const fileUrl = watch('fileUrl');
  const fileSize = watch('fileSize');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/catalogues/${catalogueId}`);
        if (res.ok) {
          const data = await res.json();
          reset(data);
          setThumbnail(data.thumbnail || '');
          setDownloadCount(data.downloadCount || 0);
        } else {
          toast.error('الكتالوج غير موجود');
          router.push('/admin/catalogues');
        }
      } catch (error) {
        toast.error('فشل تحميل البيانات');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [catalogueId, reset, router]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('يرجى اختيار ملف PDF فقط');
      return;
    }

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
      const res = await fetch(`/api/admin/catalogues/${catalogueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, thumbnail }),
      });

      if (res.ok) {
        toast.success('تم تحديث الكتالوج بنجاح');
        router.push('/admin/catalogues');
      } else {
        toast.error('فشل تحديث الكتالوج');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الكتالوج');
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
        <Link href="/admin/catalogues">
          <Button variant="ghost" size="icon"><ArrowRight size={20} /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تعديل الكتالوج</h1>
          <p className="text-gray-600 mt-1">قم بتعديل بيانات الكتالوج</p>
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
                      <Input id="nameAr" {...register('nameAr')} className="mt-1.5" />
                      {errors.nameAr && <p className="text-sm text-red-500 mt-1">{errors.nameAr.message}</p>}
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
                      <Label htmlFor="nameEn">Catalogue Name *</Label>
                      <Input id="nameEn" {...register('nameEn')} className="mt-1.5" dir="ltr" />
                      {errors.nameEn && <p className="text-sm text-red-500 mt-1">{errors.nameEn.message}</p>}
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
                      <Label htmlFor="nameTr">Katalog Adı *</Label>
                      <Input id="nameTr" {...register('nameTr')} className="mt-1.5" dir="ltr" />
                      {errors.nameTr && <p className="text-sm text-red-500 mt-1">{errors.nameTr.message}</p>}
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
                      <p className="text-sm text-gray-600">الملف الحالي</p>
                      {fileSize > 0 && <p className="text-xs text-gray-400">{formatFileSize(fileSize)}</p>}
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                        عرض الملف
                      </a>
                      <label className="block">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span className="cursor-pointer">
                            تغيير الملف
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={handleFileUpload}
                              className="hidden"
                              disabled={isUploading}
                            />
                          </span>
                        </Button>
                      </label>
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
                    </div>
                  )}
                  {isUploading && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      جاري الرفع...
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="fileUrl">أو أدخل رابط الملف مباشرة</Label>
                  <Input id="fileUrl" {...register('fileUrl')} className="mt-1.5" dir="ltr" />
                  {errors.fileUrl && <p className="text-sm text-red-500 mt-1">{errors.fileUrl.message}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>الإحصائيات</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Download className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{downloadCount}</p>
                    <p className="text-sm text-gray-600">مرة تحميل</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>الإعدادات</CardTitle></CardHeader>
              <CardContent className="space-y-4">
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

            <Button type="submit" disabled={isSubmitting || !fileUrl} className="w-full bg-primary hover:bg-primary/90 text-slate-900">
              {isSubmitting ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" />جاري الحفظ...</> : <><Save className="ml-2 h-4 w-4" />حفظ التغييرات</>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

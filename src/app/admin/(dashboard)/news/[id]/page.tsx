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
import { ArrowRight, Loader2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const newsSchema = z.object({
  titleAr: z.string().min(5, 'العنوان بالعربية مطلوب (5 أحرف على الأقل)'),
  titleEn: z.string().min(5, 'العنوان بالإنجليزية مطلوب (5 أحرف على الأقل)'),
  titleTr: z.string().min(5, 'العنوان بالتركية مطلوب (5 أحرف على الأقل)'),
  slug: z.string().min(3, 'الـ Slug مطلوب').regex(/^[a-z0-9-]+$/, 'الـ Slug يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط'),
  contentAr: z.string().min(50, 'المحتوى بالعربية مطلوب (50 حرف على الأقل)'),
  contentEn: z.string().min(50, 'المحتوى بالإنجليزية مطلوب (50 حرف على الأقل)'),
  contentTr: z.string().min(50, 'المحتوى بالتركية مطلوب (50 حرف على الأقل)'),
  excerptAr: z.string().optional(),
  excerptEn: z.string().optional(),
  excerptTr: z.string().optional(),
  author: z.string().optional(),
  publishedAt: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

type NewsFormData = z.infer<typeof newsSchema>;

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<string>('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
  });

  // Fetch news data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/news/${newsId}`);

        if (res.ok) {
          const news = await res.json();
          reset({
            titleAr: news.titleAr,
            titleEn: news.titleEn,
            titleTr: news.titleTr,
            slug: news.slug,
            contentAr: news.contentAr,
            contentEn: news.contentEn,
            contentTr: news.contentTr,
            excerptAr: news.excerptAr || '',
            excerptEn: news.excerptEn || '',
            excerptTr: news.excerptTr || '',
            author: news.author || '',
            publishedAt: news.publishedAt ? new Date(news.publishedAt).toISOString().slice(0, 16) : '',
            isActive: news.isActive,
            isFeatured: news.isFeatured,
            tags: news.tags || [],
          });
          setImage(news.image || '');
          setTags(news.tags || []);
        } else {
          toast.error('الخبر غير موجود');
          router.push('/admin/news');
        }
      } catch (error) {
        toast.error('فشل تحميل بيانات الخبر');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [newsId, reset, router]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const onSubmit = async (data: NewsFormData) => {
    if (!image) {
      toast.error('يرجى إضافة صورة للخبر');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/news/${newsId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          image,
          tags,
          publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : new Date().toISOString(),
        }),
      });

      if (res.ok) {
        toast.success('تم تحديث الخبر بنجاح');
        router.push('/admin/news');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'فشل تحديث الخبر');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الخبر');
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
          <Link href="/admin/news">
            <Button variant="ghost" size="icon">
              <ArrowRight size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تعديل الخبر</h1>
            <p className="text-gray-600 mt-1">قم بتعديل بيانات الخبر</p>
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
                      <Label htmlFor="titleAr">عنوان الخبر *</Label>
                      <Input
                        id="titleAr"
                        {...register('titleAr')}
                        className="mt-1.5"
                        placeholder="أدخل عنوان الخبر بالعربية"
                      />
                      {errors.titleAr && (
                        <p className="text-sm text-red-500 mt-1">{errors.titleAr.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="excerptAr">الملخص</Label>
                      <Textarea
                        id="excerptAr"
                        {...register('excerptAr')}
                        className="mt-1.5 min-h-[80px]"
                        placeholder="ملخص قصير للخبر (اختياري)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contentAr">المحتوى *</Label>
                      <Textarea
                        id="contentAr"
                        {...register('contentAr')}
                        className="mt-1.5 min-h-[300px]"
                        placeholder="أدخل محتوى الخبر بالعربية"
                      />
                      {errors.contentAr && (
                        <p className="text-sm text-red-500 mt-1">{errors.contentAr.message}</p>
                      )}
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
                      <Label htmlFor="titleEn">News Title *</Label>
                      <Input
                        id="titleEn"
                        {...register('titleEn')}
                        className="mt-1.5"
                        placeholder="Enter news title in English"
                        dir="ltr"
                      />
                      {errors.titleEn && (
                        <p className="text-sm text-red-500 mt-1">{errors.titleEn.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="excerptEn">Excerpt</Label>
                      <Textarea
                        id="excerptEn"
                        {...register('excerptEn')}
                        className="mt-1.5 min-h-[80px]"
                        placeholder="Short excerpt (optional)"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contentEn">Content *</Label>
                      <Textarea
                        id="contentEn"
                        {...register('contentEn')}
                        className="mt-1.5 min-h-[300px]"
                        placeholder="Enter news content in English"
                        dir="ltr"
                      />
                      {errors.contentEn && (
                        <p className="text-sm text-red-500 mt-1">{errors.contentEn.message}</p>
                      )}
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
                      <Label htmlFor="titleTr">Haber Başlığı *</Label>
                      <Input
                        id="titleTr"
                        {...register('titleTr')}
                        className="mt-1.5"
                        placeholder="Haber başlığını Türkçe girin"
                        dir="ltr"
                      />
                      {errors.titleTr && (
                        <p className="text-sm text-red-500 mt-1">{errors.titleTr.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="excerptTr">Özet</Label>
                      <Textarea
                        id="excerptTr"
                        {...register('excerptTr')}
                        className="mt-1.5 min-h-[80px]"
                        placeholder="Kısa özet (isteğe bağlı)"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contentTr">İçerik *</Label>
                      <Textarea
                        id="contentTr"
                        {...register('contentTr')}
                        className="mt-1.5 min-h-[300px]"
                        placeholder="Haber içeriğini Türkçe girin"
                        dir="ltr"
                      />
                      {errors.contentTr && (
                        <p className="text-sm text-red-500 mt-1">{errors.contentTr.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Image */}
            <Card>
              <CardHeader>
                <CardTitle>صورة الخبر *</CardTitle>
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
                <CardTitle>الإعدادات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="slug">الـ Slug *</Label>
                  <Input
                    id="slug"
                    {...register('slug')}
                    className="mt-1.5 font-mono text-sm"
                    placeholder="news-slug"
                    dir="ltr"
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="author">الكاتب</Label>
                  <Input
                    id="author"
                    {...register('author')}
                    className="mt-1.5"
                    placeholder="اسم الكاتب (اختياري)"
                  />
                </div>

                <div>
                  <Label htmlFor="publishedAt">تاريخ النشر</Label>
                  <Input
                    id="publishedAt"
                    type="datetime-local"
                    {...register('publishedAt')}
                    className="mt-1.5"
                    dir="ltr"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">منشور</Label>
                  <Switch
                    id="isActive"
                    {...register('isActive')}
                    onCheckedChange={(checked) => setValue('isActive', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isFeatured">مميز</Label>
                  <Switch
                    id="isFeatured"
                    {...register('isFeatured')}
                    onCheckedChange={(checked) => setValue('isFeatured', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>الوسوم</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="أضف وسم"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    إضافة
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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

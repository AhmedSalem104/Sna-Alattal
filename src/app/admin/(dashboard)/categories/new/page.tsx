'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/admin/image-upload';
import { ArrowRight, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const categorySchema = z.object({
  nameAr: z.string().min(2, 'الاسم بالعربية مطلوب'),
  nameEn: z.string().min(2, 'الاسم بالإنجليزية مطلوب'),
  nameTr: z.string().min(2, 'الاسم بالتركية مطلوب'),
  slug: z.string().min(2, 'الـ Slug مطلوب').regex(/^[a-z0-9-]+$/, 'الـ Slug يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط'),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionTr: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
}

export default function NewCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      isActive: true,
      order: 0,
    },
  });

  const nameEn = watch('nameEn');

  // Auto-generate slug from English name
  useEffect(() => {
    if (nameEn) {
      const slug = nameEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', slug);
    }
  }, [nameEn, setValue]);

  // Fetch parent categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.filter((c: Category & { parent?: unknown }) => !c.parent)); // Only root categories
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, image }),
      });

      if (res.ok) {
        toast.success('تم إنشاء التصنيف بنجاح');
        router.push('/admin/categories');
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'فشل إنشاء التصنيف');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء التصنيف');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/categories">
            <Button variant="ghost" size="icon">
              <ArrowRight size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إضافة تصنيف جديد</h1>
            <p className="text-gray-600 mt-1">أضف تصنيف جديد للمنتجات</p>
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
                      <Label htmlFor="nameAr">اسم التصنيف *</Label>
                      <Input
                        id="nameAr"
                        {...register('nameAr')}
                        className="mt-1.5"
                        placeholder="أدخل اسم التصنيف بالعربية"
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
                        placeholder="أدخل وصف التصنيف بالعربية"
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
                      <Label htmlFor="nameEn">Category Name *</Label>
                      <Input
                        id="nameEn"
                        {...register('nameEn')}
                        className="mt-1.5"
                        placeholder="Enter category name in English"
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
                        placeholder="Enter category description in English"
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
                      <Label htmlFor="nameTr">Kategori Adı *</Label>
                      <Input
                        id="nameTr"
                        {...register('nameTr')}
                        className="mt-1.5"
                        placeholder="Kategori adını Türkçe girin"
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
                        placeholder="Kategori açıklamasını Türkçe girin"
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
                <CardTitle>صورة التصنيف</CardTitle>
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
                    placeholder="category-slug"
                    dir="ltr"
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="parentId">التصنيف الأب</Label>
                  <Select onValueChange={(value) => setValue('parentId', value === 'none' ? undefined : value)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="اختر تصنيف أب (اختياري)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">بدون تصنيف أب</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.nameAr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  حفظ التصنيف
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

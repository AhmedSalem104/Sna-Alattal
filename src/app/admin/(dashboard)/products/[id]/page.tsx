'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Loader2, Save, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { ImageUpload } from '@/components/admin';
import { toast } from 'sonner';
import Link from 'next/link';

const productSchema = z.object({
  nameAr: z.string().min(2, 'اسم المنتج بالعربية مطلوب'),
  nameEn: z.string().min(2, 'اسم المنتج بالإنجليزية مطلوب'),
  nameTr: z.string().min(2, 'اسم المنتج بالتركية مطلوب'),
  slug: z.string().min(2, 'Slug مطلوب'),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionTr: z.string().optional(),
  shortDescAr: z.string().max(500).optional(),
  shortDescEn: z.string().max(500).optional(),
  shortDescTr: z.string().max(500).optional(),
  categoryId: z.string().optional(),
  images: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  specifications: z.record(z.string()).default({}),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  order: z.number().default(0),
  seoTitleAr: z.string().optional(),
  seoTitleEn: z.string().optional(),
  seoTitleTr: z.string().optional(),
  seoDescAr: z.string().max(500).optional(),
  seoDescEn: z.string().max(500).optional(),
  seoDescTr: z.string().max(500).optional(),
  seoKeywords: z.array(z.string()).default([]),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Category {
  id: string;
  nameAr: string;
}

interface EditProductPageProps {
  params: { id: string };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${params.id}`);
        if (response.ok) {
          const product = await response.json();
          reset({
            nameAr: product.nameAr,
            nameEn: product.nameEn,
            nameTr: product.nameTr,
            slug: product.slug,
            descriptionAr: product.descriptionAr || '',
            descriptionEn: product.descriptionEn || '',
            descriptionTr: product.descriptionTr || '',
            shortDescAr: product.shortDescAr || '',
            shortDescEn: product.shortDescEn || '',
            shortDescTr: product.shortDescTr || '',
            categoryId: product.categoryId || '',
            features: product.features || [],
            specifications: product.specifications || {},
            isActive: product.isActive,
            isFeatured: product.isFeatured,
            order: product.order,
            seoTitleAr: product.seoTitleAr || '',
            seoTitleEn: product.seoTitleEn || '',
            seoTitleTr: product.seoTitleTr || '',
            seoDescAr: product.seoDescAr || '',
            seoDescEn: product.seoDescEn || '',
            seoDescTr: product.seoDescTr || '',
            seoKeywords: product.seoKeywords || [],
          });
          setImages(product.images || []);
        } else {
          toast.error('فشل في تحميل بيانات المنتج');
          router.push('/admin/products');
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('حدث خطأ غير متوقع');
      } finally {
        setIsFetching(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [params.id, reset, router]);

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, images }),
      });

      if (response.ok) {
        toast.success('تم تحديث المنتج بنجاح');
        router.push('/admin/products');
      } else {
        const error = await response.json();
        toast.error(error.message || 'فشل في تحديث المنتج');
      }
    } catch (error) {
      toast.error('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Link href="/admin/products" className="hover:text-primary transition-colors">
              المنتجات
            </Link>
            <ArrowRight size={16} />
            <span className="text-gray-900">تعديل المنتج</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">تعديل المنتج</h1>
        </div>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="bg-gray-50 border border-gray-200">
            <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
            <TabsTrigger value="content">المحتوى</TabsTrigger>
            <TabsTrigger value="media">الصور</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Basic Info */}
          <TabsContent value="basic" className="space-y-6">
            <Card className="bg-gray-50 border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">المعلومات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Names */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-900">اسم المنتج (عربي) *</Label>
                    <Input
                      {...register('nameAr')}
                      className="mt-2 bg-white border-gray-200 text-gray-900"
                    />
                    {errors.nameAr && (
                      <p className="text-red-400 text-sm mt-1">{errors.nameAr.message}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-900">اسم المنتج (إنجليزي) *</Label>
                    <Input
                      {...register('nameEn')}
                      className="mt-2 bg-white border-gray-200 text-gray-900"
                    />
                    {errors.nameEn && (
                      <p className="text-red-400 text-sm mt-1">{errors.nameEn.message}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-900">اسم المنتج (تركي) *</Label>
                    <Input
                      {...register('nameTr')}
                      className="mt-2 bg-white border-gray-200 text-gray-900"
                    />
                    {errors.nameTr && (
                      <p className="text-red-400 text-sm mt-1">{errors.nameTr.message}</p>
                    )}
                  </div>
                </div>

                {/* Slug & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-900">Slug *</Label>
                    <Input
                      {...register('slug')}
                      className="mt-2 bg-white border-gray-200 text-gray-900"
                    />
                    {errors.slug && (
                      <p className="text-red-400 text-sm mt-1">{errors.slug.message}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-900">التصنيف</Label>
                    <Select
                      value={watch('categoryId')}
                      onValueChange={(value) => setValue('categoryId', value)}
                    >
                      <SelectTrigger className="mt-2 bg-white border-gray-200 text-gray-900">
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-50 border-gray-200">
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.nameAr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Switches */}
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="isActive"
                      checked={watch('isActive')}
                      onCheckedChange={(checked) => setValue('isActive', checked)}
                    />
                    <Label htmlFor="isActive" className="text-gray-900 cursor-pointer">
                      نشط
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="isFeatured"
                      checked={watch('isFeatured')}
                      onCheckedChange={(checked) => setValue('isFeatured', checked)}
                    />
                    <Label htmlFor="isFeatured" className="text-gray-900 cursor-pointer">
                      منتج مميز
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="text-gray-900">الترتيب</Label>
                    <Input
                      type="number"
                      {...register('order', { valueAsNumber: true })}
                      className="w-20 bg-white border-gray-200 text-gray-900"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content */}
          <TabsContent value="content" className="space-y-6">
            <Card className="bg-gray-50 border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">الوصف المختصر</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-900">الوصف المختصر (عربي)</Label>
                  <Textarea
                    {...register('shortDescAr')}
                    className="mt-2 bg-white border-gray-200 text-gray-900 min-h-[100px]"
                  />
                </div>
                <div>
                  <Label className="text-gray-900">الوصف المختصر (إنجليزي)</Label>
                  <Textarea
                    {...register('shortDescEn')}
                    className="mt-2 bg-white border-gray-200 text-gray-900 min-h-[100px]"
                  />
                </div>
                <div>
                  <Label className="text-gray-900">الوصف المختصر (تركي)</Label>
                  <Textarea
                    {...register('shortDescTr')}
                    className="mt-2 bg-white border-gray-200 text-gray-900 min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">الوصف الكامل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-900">الوصف الكامل (عربي)</Label>
                  <Textarea
                    {...register('descriptionAr')}
                    className="mt-2 bg-white border-gray-200 text-gray-900 min-h-[200px]"
                  />
                </div>
                <div>
                  <Label className="text-gray-900">الوصف الكامل (إنجليزي)</Label>
                  <Textarea
                    {...register('descriptionEn')}
                    className="mt-2 bg-white border-gray-200 text-gray-900 min-h-[200px]"
                  />
                </div>
                <div>
                  <Label className="text-gray-900">الوصف الكامل (تركي)</Label>
                  <Textarea
                    {...register('descriptionTr')}
                    className="mt-2 bg-white border-gray-200 text-gray-900 min-h-[200px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media */}
          <TabsContent value="media" className="space-y-6">
            <Card className="bg-gray-50 border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">صور المنتج</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={images}
                  onChange={(value) => setImages(value as string[])}
                  multiple
                  maxFiles={5}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO */}
          <TabsContent value="seo" className="space-y-6">
            <Card className="bg-gray-50 border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">تحسين محركات البحث (SEO)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-900">عنوان SEO (عربي)</Label>
                    <Input
                      {...register('seoTitleAr')}
                      className="mt-2 bg-white border-gray-200 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-900">عنوان SEO (إنجليزي)</Label>
                    <Input
                      {...register('seoTitleEn')}
                      className="mt-2 bg-white border-gray-200 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-900">عنوان SEO (تركي)</Label>
                    <Input
                      {...register('seoTitleTr')}
                      className="mt-2 bg-white border-gray-200 text-gray-900"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-900">وصف SEO (عربي)</Label>
                    <Textarea
                      {...register('seoDescAr')}
                      className="mt-2 bg-white border-gray-200 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-900">وصف SEO (إنجليزي)</Label>
                    <Textarea
                      {...register('seoDescEn')}
                      className="mt-2 bg-white border-gray-200 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-900">وصف SEO (تركي)</Label>
                    <Textarea
                      {...register('seoDescTr')}
                      className="mt-2 bg-white border-gray-200 text-gray-900"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-6">
          <Link href="/admin/products">
            <Button type="button" variant="outline" className="border-gray-300 text-gray-900">
              إلغاء
            </Button>
          </Link>
          <Button type="submit" variant="gold" disabled={isLoading}>
            {isLoading ? (
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
      </form>
    </div>
  );
}

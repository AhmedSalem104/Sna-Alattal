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

const teamSchema = z.object({
  nameAr: z.string().min(2, 'الاسم بالعربية مطلوب'),
  nameEn: z.string().min(2, 'الاسم بالإنجليزية مطلوب'),
  nameTr: z.string().min(2, 'الاسم بالتركية مطلوب'),
  positionAr: z.string().min(2, 'المنصب بالعربية مطلوب'),
  positionEn: z.string().min(2, 'المنصب بالإنجليزية مطلوب'),
  positionTr: z.string().min(2, 'المنصب بالتركية مطلوب'),
  bioAr: z.string().optional(),
  bioEn: z.string().optional(),
  bioTr: z.string().optional(),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  phone: z.string().optional(),
  linkedin: z.string().url('رابط LinkedIn غير صالح').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

type TeamFormData = z.infer<typeof teamSchema>;

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
  });

  // Fetch team member data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/team/${memberId}`);

        if (res.ok) {
          const member = await res.json();
          reset({
            nameAr: member.nameAr,
            nameEn: member.nameEn,
            nameTr: member.nameTr,
            positionAr: member.positionAr,
            positionEn: member.positionEn,
            positionTr: member.positionTr,
            bioAr: member.bioAr || '',
            bioEn: member.bioEn || '',
            bioTr: member.bioTr || '',
            email: member.email || '',
            phone: member.phone || '',
            linkedin: member.linkedin || '',
            isActive: member.isActive,
            order: member.order,
          });
          setImage(member.image || '');
        } else {
          toast.error('العضو غير موجود');
          router.push('/admin/team');
        }
      } catch (error) {
        toast.error('فشل تحميل بيانات العضو');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [memberId, reset, router]);

  const onSubmit = async (data: TeamFormData) => {
    if (!image) {
      toast.error('يرجى إضافة صورة العضو');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/team/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, image }),
      });

      if (res.ok) {
        toast.success('تم تحديث بيانات العضو بنجاح');
        router.push('/admin/team');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'فشل تحديث بيانات العضو');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث بيانات العضو');
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
          <Link href="/admin/team">
            <Button variant="ghost" size="icon">
              <ArrowRight size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تعديل بيانات العضو</h1>
            <p className="text-gray-600 mt-1">قم بتعديل بيانات عضو الفريق</p>
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
                      <Label htmlFor="nameAr">الاسم *</Label>
                      <Input
                        id="nameAr"
                        {...register('nameAr')}
                        className="mt-1.5"
                        placeholder="أدخل اسم العضو بالعربية"
                      />
                      {errors.nameAr && (
                        <p className="text-sm text-red-500 mt-1">{errors.nameAr.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="positionAr">المنصب *</Label>
                      <Input
                        id="positionAr"
                        {...register('positionAr')}
                        className="mt-1.5"
                        placeholder="مثال: مدير عام"
                      />
                      {errors.positionAr && (
                        <p className="text-sm text-red-500 mt-1">{errors.positionAr.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="bioAr">نبذة تعريفية</Label>
                      <Textarea
                        id="bioAr"
                        {...register('bioAr')}
                        className="mt-1.5 min-h-[120px]"
                        placeholder="نبذة مختصرة عن العضو (اختياري)"
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
                      <Label htmlFor="nameEn">Name *</Label>
                      <Input
                        id="nameEn"
                        {...register('nameEn')}
                        className="mt-1.5"
                        placeholder="Enter name in English"
                        dir="ltr"
                      />
                      {errors.nameEn && (
                        <p className="text-sm text-red-500 mt-1">{errors.nameEn.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="positionEn">Position *</Label>
                      <Input
                        id="positionEn"
                        {...register('positionEn')}
                        className="mt-1.5"
                        placeholder="e.g., General Manager"
                        dir="ltr"
                      />
                      {errors.positionEn && (
                        <p className="text-sm text-red-500 mt-1">{errors.positionEn.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="bioEn">Bio</Label>
                      <Textarea
                        id="bioEn"
                        {...register('bioEn')}
                        className="mt-1.5 min-h-[120px]"
                        placeholder="Short bio (optional)"
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
                      <Label htmlFor="nameTr">Ad *</Label>
                      <Input
                        id="nameTr"
                        {...register('nameTr')}
                        className="mt-1.5"
                        placeholder="Adı Türkçe girin"
                        dir="ltr"
                      />
                      {errors.nameTr && (
                        <p className="text-sm text-red-500 mt-1">{errors.nameTr.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="positionTr">Pozisyon *</Label>
                      <Input
                        id="positionTr"
                        {...register('positionTr')}
                        className="mt-1.5"
                        placeholder="örn: Genel Müdür"
                        dir="ltr"
                      />
                      {errors.positionTr && (
                        <p className="text-sm text-red-500 mt-1">{errors.positionTr.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="bioTr">Biyografi</Label>
                      <Textarea
                        id="bioTr"
                        {...register('bioTr')}
                        className="mt-1.5 min-h-[120px]"
                        placeholder="Kısa biyografi (isteğe bağlı)"
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
                <CardTitle>صورة العضو *</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  يفضل استخدام صورة مربعة بدقة 400x400 بكسل أو أكبر
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
                <CardTitle>معلومات التواصل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="mt-1.5"
                    placeholder="example@company.com"
                    dir="ltr"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    className="mt-1.5"
                    placeholder="+90 555 123 4567"
                    dir="ltr"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin">رابط LinkedIn</Label>
                  <Input
                    id="linkedin"
                    {...register('linkedin')}
                    className="mt-1.5"
                    placeholder="https://linkedin.com/in/username"
                    dir="ltr"
                  />
                  {errors.linkedin && (
                    <p className="text-sm text-red-500 mt-1">{errors.linkedin.message}</p>
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
                    {...register('isActive')}
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

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, Globe, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Settings2, Search } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsData {
  // General
  siteNameAr: string;
  siteNameEn: string;
  siteNameTr: string;
  siteDescriptionAr: string;
  siteDescriptionEn: string;
  siteDescriptionTr: string;
  logo: string;
  favicon: string;

  // Contact
  email: string;
  phone: string;
  whatsapp: string;
  addressAr: string;
  addressEn: string;
  addressTr: string;
  mapUrl: string;
  workingHoursAr: string;
  workingHoursEn: string;
  workingHoursTr: string;

  // Social Media
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;

  // SEO
  seoTitleAr: string;
  seoTitleEn: string;
  seoTitleTr: string;
  seoDescriptionAr: string;
  seoDescriptionEn: string;
  seoDescriptionTr: string;
  seoKeywords: string;
  googleAnalytics: string;
  googleTagManager: string;
}

const defaultSettings: SettingsData = {
  siteNameAr: '',
  siteNameEn: '',
  siteNameTr: '',
  siteDescriptionAr: '',
  siteDescriptionEn: '',
  siteDescriptionTr: '',
  logo: '',
  favicon: '',
  email: '',
  phone: '',
  whatsapp: '',
  addressAr: '',
  addressEn: '',
  addressTr: '',
  mapUrl: '',
  workingHoursAr: '',
  workingHoursEn: '',
  workingHoursTr: '',
  facebook: '',
  twitter: '',
  instagram: '',
  linkedin: '',
  youtube: '',
  tiktok: '',
  seoTitleAr: '',
  seoTitleEn: '',
  seoTitleTr: '',
  seoDescriptionAr: '',
  seoDescriptionEn: '',
  seoDescriptionTr: '',
  seoKeywords: '',
  googleAnalytics: '',
  googleTagManager: '',
};

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<SettingsData>({
    defaultValues: defaultSettings,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          reset({ ...defaultSettings, ...data });
        }
      } catch (error) {
        toast.error('فشل تحميل الإعدادات');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: SettingsData) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: data, group: 'general' }),
      });

      if (res.ok) {
        toast.success('تم حفظ الإعدادات بنجاح');
        reset(data);
      } else {
        toast.error('فشل حفظ الإعدادات');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsSaving(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
          <p className="text-gray-600 mt-1">إعدادات الموقع العامة ومعلومات التواصل</p>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving || !isDirty}
          className="bg-primary hover:bg-primary/90 text-slate-900"
        >
          {isSaving ? (
            <><Loader2 className="ml-2 h-4 w-4 animate-spin" />جاري الحفظ...</>
          ) : (
            <><Save size={18} className="ml-2" /> حفظ الإعدادات</>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings2 size={16} /> عام
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone size={16} /> التواصل
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Globe size={16} /> التواصل الاجتماعي
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Search size={16} /> SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>اسم الموقع</CardTitle>
                <CardDescription>اسم الموقع كما يظهر في العنوان والشعار</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="siteNameAr">بالعربية</Label>
                  <Input id="siteNameAr" {...register('siteNameAr')} className="mt-1.5" placeholder="شركة العتال" />
                </div>
                <div>
                  <Label htmlFor="siteNameEn">بالإنجليزية</Label>
                  <Input id="siteNameEn" {...register('siteNameEn')} className="mt-1.5" placeholder="Al-Attal Company" dir="ltr" />
                </div>
                <div>
                  <Label htmlFor="siteNameTr">بالتركية</Label>
                  <Input id="siteNameTr" {...register('siteNameTr')} className="mt-1.5" placeholder="Al-Attal Şirketi" dir="ltr" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>وصف الموقع</CardTitle>
                <CardDescription>وصف مختصر عن الشركة والخدمات المقدمة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteDescriptionAr">بالعربية</Label>
                  <Textarea id="siteDescriptionAr" {...register('siteDescriptionAr')} className="mt-1.5 min-h-[100px]" placeholder="شركة رائدة في الصناعات الهندسية..." />
                </div>
                <div>
                  <Label htmlFor="siteDescriptionEn">بالإنجليزية</Label>
                  <Textarea id="siteDescriptionEn" {...register('siteDescriptionEn')} className="mt-1.5 min-h-[100px]" placeholder="A leading company in engineering industries..." dir="ltr" />
                </div>
                <div>
                  <Label htmlFor="siteDescriptionTr">بالتركية</Label>
                  <Textarea id="siteDescriptionTr" {...register('siteDescriptionTr')} className="mt-1.5 min-h-[100px]" placeholder="Mühendislik endüstrilerinde lider bir şirket..." dir="ltr" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الشعار والأيقونة</CardTitle>
                <CardDescription>روابط صور الشعار وأيقونة الموقع</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logo">رابط الشعار</Label>
                  <Input id="logo" {...register('logo')} className="mt-1.5" placeholder="https://..." dir="ltr" />
                </div>
                <div>
                  <Label htmlFor="favicon">رابط الأيقونة (Favicon)</Label>
                  <Input id="favicon" {...register('favicon')} className="mt-1.5" placeholder="https://..." dir="ltr" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>معلومات التواصل</CardTitle>
                <CardDescription>البريد الإلكتروني وأرقام الهاتف</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail size={14} /> البريد الإلكتروني
                  </Label>
                  <Input id="email" type="email" {...register('email')} className="mt-1.5" placeholder="info@example.com" dir="ltr" />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone size={14} /> رقم الهاتف
                  </Label>
                  <Input id="phone" {...register('phone')} className="mt-1.5" placeholder="+90 555 123 4567" dir="ltr" />
                </div>
                <div>
                  <Label htmlFor="whatsapp" className="flex items-center gap-2">
                    <Phone size={14} /> واتساب
                  </Label>
                  <Input id="whatsapp" {...register('whatsapp')} className="mt-1.5" placeholder="+90 555 123 4567" dir="ltr" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>العنوان</CardTitle>
                <CardDescription>عنوان المقر الرئيسي</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="addressAr" className="flex items-center gap-2">
                      <MapPin size={14} /> بالعربية
                    </Label>
                    <Textarea id="addressAr" {...register('addressAr')} className="mt-1.5" placeholder="العنوان بالعربية" />
                  </div>
                  <div>
                    <Label htmlFor="addressEn">بالإنجليزية</Label>
                    <Textarea id="addressEn" {...register('addressEn')} className="mt-1.5" placeholder="Address in English" dir="ltr" />
                  </div>
                  <div>
                    <Label htmlFor="addressTr">بالتركية</Label>
                    <Textarea id="addressTr" {...register('addressTr')} className="mt-1.5" placeholder="Türkçe adres" dir="ltr" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="mapUrl">رابط خريطة جوجل</Label>
                  <Input id="mapUrl" {...register('mapUrl')} className="mt-1.5" placeholder="https://maps.google.com/..." dir="ltr" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ساعات العمل</CardTitle>
                <CardDescription>أوقات الدوام الرسمي</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="workingHoursAr">بالعربية</Label>
                  <Input id="workingHoursAr" {...register('workingHoursAr')} className="mt-1.5" placeholder="السبت - الخميس: 9 ص - 6 م" />
                </div>
                <div>
                  <Label htmlFor="workingHoursEn">بالإنجليزية</Label>
                  <Input id="workingHoursEn" {...register('workingHoursEn')} className="mt-1.5" placeholder="Sat - Thu: 9 AM - 6 PM" dir="ltr" />
                </div>
                <div>
                  <Label htmlFor="workingHoursTr">بالتركية</Label>
                  <Input id="workingHoursTr" {...register('workingHoursTr')} className="mt-1.5" placeholder="Cmt - Per: 09:00 - 18:00" dir="ltr" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>روابط التواصل الاجتماعي</CardTitle>
                <CardDescription>روابط صفحات الشركة على منصات التواصل الاجتماعي</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <Facebook size={14} className="text-blue-600" /> فيسبوك
                  </Label>
                  <Input id="facebook" {...register('facebook')} className="mt-1.5" placeholder="https://facebook.com/..." dir="ltr" />
                </div>
                <div>
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter size={14} className="text-sky-500" /> تويتر / X
                  </Label>
                  <Input id="twitter" {...register('twitter')} className="mt-1.5" placeholder="https://twitter.com/..." dir="ltr" />
                </div>
                <div>
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram size={14} className="text-pink-500" /> إنستجرام
                  </Label>
                  <Input id="instagram" {...register('instagram')} className="mt-1.5" placeholder="https://instagram.com/..." dir="ltr" />
                </div>
                <div>
                  <Label htmlFor="linkedin" className="flex items-center gap-2">
                    <Linkedin size={14} className="text-blue-700" /> لينكد إن
                  </Label>
                  <Input id="linkedin" {...register('linkedin')} className="mt-1.5" placeholder="https://linkedin.com/company/..." dir="ltr" />
                </div>
                <div>
                  <Label htmlFor="youtube" className="flex items-center gap-2">
                    <Youtube size={14} className="text-red-600" /> يوتيوب
                  </Label>
                  <Input id="youtube" {...register('youtube')} className="mt-1.5" placeholder="https://youtube.com/@..." dir="ltr" />
                </div>
                <div>
                  <Label htmlFor="tiktok" className="flex items-center gap-2">
                    <Globe size={14} /> تيك توك
                  </Label>
                  <Input id="tiktok" {...register('tiktok')} className="mt-1.5" placeholder="https://tiktok.com/@..." dir="ltr" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>عنوان SEO</CardTitle>
                <CardDescription>العنوان الذي يظهر في نتائج محركات البحث</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="seoTitleAr">بالعربية</Label>
                  <Input id="seoTitleAr" {...register('seoTitleAr')} className="mt-1.5" placeholder="شركة العتال للصناعات الهندسية" />
                </div>
                <div>
                  <Label htmlFor="seoTitleEn">بالإنجليزية</Label>
                  <Input id="seoTitleEn" {...register('seoTitleEn')} className="mt-1.5" placeholder="Al-Attal Engineering Industries" dir="ltr" />
                </div>
                <div>
                  <Label htmlFor="seoTitleTr">بالتركية</Label>
                  <Input id="seoTitleTr" {...register('seoTitleTr')} className="mt-1.5" placeholder="Al-Attal Mühendislik Endüstrileri" dir="ltr" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>وصف SEO</CardTitle>
                <CardDescription>الوصف الذي يظهر أسفل العنوان في نتائج البحث</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoDescriptionAr">بالعربية</Label>
                  <Textarea id="seoDescriptionAr" {...register('seoDescriptionAr')} className="mt-1.5" placeholder="وصف الموقع لمحركات البحث..." />
                </div>
                <div>
                  <Label htmlFor="seoDescriptionEn">بالإنجليزية</Label>
                  <Textarea id="seoDescriptionEn" {...register('seoDescriptionEn')} className="mt-1.5" placeholder="SEO description..." dir="ltr" />
                </div>
                <div>
                  <Label htmlFor="seoDescriptionTr">بالتركية</Label>
                  <Textarea id="seoDescriptionTr" {...register('seoDescriptionTr')} className="mt-1.5" placeholder="SEO açıklaması..." dir="ltr" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الكلمات المفتاحية والتحليلات</CardTitle>
                <CardDescription>الكلمات المفتاحية وأكواد تتبع الزيارات</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoKeywords">الكلمات المفتاحية</Label>
                  <Textarea id="seoKeywords" {...register('seoKeywords')} className="mt-1.5" placeholder="كلمة1, كلمة2, كلمة3..." />
                  <p className="text-xs text-gray-400 mt-1">افصل بين الكلمات بفاصلة</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                    <Input id="googleAnalytics" {...register('googleAnalytics')} className="mt-1.5" placeholder="G-XXXXXXXXXX" dir="ltr" />
                  </div>
                  <div>
                    <Label htmlFor="googleTagManager">Google Tag Manager ID</Label>
                    <Input id="googleTagManager" {...register('googleTagManager')} className="mt-1.5" placeholder="GTM-XXXXXXX" dir="ltr" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6 pt-6 border-t">
          <Button
            type="submit"
            disabled={isSaving || !isDirty}
            className="bg-primary hover:bg-primary/90 text-slate-900"
          >
            {isSaving ? (
              <><Loader2 className="ml-2 h-4 w-4 animate-spin" />جاري الحفظ...</>
            ) : (
              <><Save size={18} className="ml-2" /> حفظ جميع الإعدادات</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

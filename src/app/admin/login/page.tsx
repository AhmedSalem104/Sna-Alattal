'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff, Cog, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('فشل تسجيل الدخول', {
          description: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        });
      } else {
        toast.success('تم تسجيل الدخول بنجاح');
        router.push('/admin');
        router.refresh();
      }
    } catch {
      toast.error('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-steel-900 p-4 relative overflow-hidden">
      {/* Industrial Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 160, 10, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 160, 10, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Decorative Gears */}
      <div className="absolute top-20 left-20 opacity-5">
        <Cog size={200} className="text-primary animate-spin" style={{ animationDuration: '30s' }} />
      </div>
      <div className="absolute bottom-20 right-20 opacity-5">
        <Cog size={150} className="text-primary animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border-2 border-metal-200 shadow-2xl relative z-10">
        {/* Top Gold Border */}
        <div className="h-1 bg-primary" />

        {/* Header */}
        <div className="text-center px-8 pt-8 pb-6 border-b border-metal-200">
          <div className="mx-auto mb-4 relative inline-block">
            {/* Corner Accents */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-primary" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-primary" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary" />

            <Image
              src="/images/logo.jpg"
              alt="S.N.A Al-Attal"
              width={100}
              height={100}
              className="relative z-10"
            />
          </div>
          <h1 className="text-2xl font-bold text-steel-900 uppercase tracking-wider">لوحة التحكم</h1>
          <p className="text-metal-500 mt-2">
            قم بتسجيل الدخول للوصول إلى لوحة التحكم
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-steel-900 font-bold uppercase tracking-wider text-xs">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-metal-400" size={18} />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sna-attal.com"
                  className="pr-10 bg-metal-50 border-2 border-metal-200 text-steel-900 placeholder:text-metal-400 focus:border-primary rounded-none"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 border-r-2 border-red-500 pr-2">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-steel-900 font-bold uppercase tracking-wider text-xs">
                كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-metal-400" size={18} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pr-10 pl-10 bg-metal-50 border-2 border-metal-200 text-steel-900 placeholder:text-metal-400 focus:border-primary rounded-none"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-metal-500 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 border-r-2 border-red-500 pr-2">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="industrial"
              className="w-full h-12 text-base font-bold uppercase tracking-wider"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 text-center">
          <p className="text-xs text-metal-400 uppercase tracking-wider">
            S.N.A Al-Attal للصناعات الهندسية
          </p>
        </div>
      </div>
    </div>
  );
}

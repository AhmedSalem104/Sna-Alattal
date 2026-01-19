import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl text-white mb-4">الصفحة غير موجودة</h2>
        <p className="text-gray-400 mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة.
        </p>
        <Button variant="gold" asChild>
          <Link href="/">العودة للرئيسية</Link>
        </Button>
      </div>
    </div>
  );
}

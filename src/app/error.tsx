'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-2">500</h1>
          <h2 className="text-2xl text-gray-700 mb-4">حدث خطأ غير متوقع</h2>
          <p className="text-gray-600 mb-8">
            عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            variant="outline"
            className="border-gray-300"
          >
            <RefreshCw size={18} className="ml-2" />
            إعادة المحاولة
          </Button>
          <Button variant="gold" asChild>
            <Link href="/">
              <Home size={18} className="ml-2" />
              العودة للرئيسية
            </Link>
          </Button>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-gray-400">
            رمز الخطأ: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}

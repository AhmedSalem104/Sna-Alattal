'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/admin/data-table';
import { DeleteDialog } from '@/components/admin/delete-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Power,
  Newspaper,
  Star,
  Calendar,
  ArrowUpDown,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface News {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  image: string;
  author: string | null;
  publishedAt: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/admin/news');
      if (res.ok) {
        const data = await res.json();
        setNews(data);
      }
    } catch (error) {
      toast.error('فشل تحميل الأخبار');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        setNews(prev =>
          prev.map(item => (item.id === id ? { ...item, isActive: !isActive } : item))
        );
        toast.success(isActive ? 'تم إلغاء تفعيل الخبر' : 'تم تفعيل الخبر');
      }
    } catch (error) {
      toast.error('فشل تحديث حالة الخبر');
    }
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });

      if (res.ok) {
        setNews(prev =>
          prev.map(item => (item.id === id ? { ...item, isFeatured: !isFeatured } : item))
        );
        toast.success(isFeatured ? 'تم إلغاء التمييز' : 'تم تمييز الخبر');
      }
    } catch (error) {
      toast.error('فشل تحديث حالة الخبر');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setNews(prev => prev.filter(item => item.id !== id));
        toast.success('تم حذف الخبر بنجاح');
      } else {
        const data = await res.json();
        toast.error(data.error || 'فشل حذف الخبر');
      }
    } catch (error) {
      toast.error('فشل حذف الخبر');
    }
  };

  const columns: ColumnDef<News>[] = [
    {
      accessorKey: 'image',
      header: 'الصورة',
      cell: ({ row }) => {
        const image = row.original.image;
        return (
          <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {image ? (
              <Image
                src={image}
                alt={row.original.titleAr}
                width={64}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <Newspaper className="text-gray-400" size={20} />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'titleAr',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent"
        >
          العنوان
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          <p className="font-medium text-gray-900 line-clamp-1">{row.original.titleAr}</p>
          <p className="text-sm text-gray-500 line-clamp-1">{row.original.titleEn}</p>
        </div>
      ),
    },
    {
      accessorKey: 'author',
      header: 'الكاتب',
      cell: ({ row }) => (
        <span className="text-gray-600">{row.original.author || '-'}</span>
      ),
    },
    {
      accessorKey: 'publishedAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent"
        >
          تاريخ النشر
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={14} />
          <span>{format(new Date(row.original.publishedAt), 'dd MMM yyyy', { locale: ar })}</span>
        </div>
      ),
    },
    {
      accessorKey: 'isFeatured',
      header: 'مميز',
      cell: ({ row }) => (
        <button
          onClick={() => handleToggleFeatured(row.original.id, row.original.isFeatured)}
          className="cursor-pointer"
        >
          <Star
            size={20}
            className={row.original.isFeatured ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        </button>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'الحالة',
      cell: ({ row }) => (
        <Badge
          variant={row.original.isActive ? 'default' : 'secondary'}
          className={row.original.isActive ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-600'}
        >
          {row.original.isActive ? 'منشور' : 'مسودة'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'الإجراءات',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">فتح القائمة</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/news/${item.id}`} className="flex items-center gap-2 cursor-pointer">
                  <Pencil size={16} />
                  تعديل
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/news/${item.slug}`} target="_blank" className="flex items-center gap-2 cursor-pointer">
                  <Eye size={16} />
                  معاينة
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleToggleActive(item.id, item.isActive)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Power size={16} />
                {item.isActive ? 'إلغاء النشر' : 'نشر'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteDialog
                title="حذف الخبر"
                description={`هل أنت متأكد من حذف الخبر "${item.titleAr}"؟ لا يمكن التراجع عن هذا الإجراء.`}
                onDelete={() => handleDelete(item.id)}
                trigger={
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer">
                    <Trash2 size={16} />
                    حذف
                  </button>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-600">جاري تحميل الأخبار...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الأخبار</h1>
          <p className="text-gray-600 mt-1">إدارة أخبار الشركة</p>
        </div>
        <Link href="/admin/news/new">
          <Button className="bg-primary hover:bg-primary/90 text-slate-900">
            <Plus size={18} className="ml-2 rtl:ml-0 rtl:mr-2" />
            إضافة خبر
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Newspaper className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{news.length}</p>
              <p className="text-sm text-gray-600">إجمالي الأخبار</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Power className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {news.filter(n => n.isActive).length}
              </p>
              <p className="text-sm text-gray-600">أخبار منشورة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {news.filter(n => n.isFeatured).length}
              </p>
              <p className="text-sm text-gray-600">أخبار مميزة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {news.filter(n => {
                  const date = new Date(n.publishedAt);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </p>
              <p className="text-sm text-gray-600">هذا الشهر</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={columns}
          data={news}
          searchKey="titleAr"
          searchPlaceholder="بحث في الأخبار..."
        />
      </div>
    </div>
  );
}

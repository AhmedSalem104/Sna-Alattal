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
  Power,
  Image as ImageIcon,
  ArrowUpDown,
  Loader2,
  GripVertical,
} from 'lucide-react';
import { toast } from 'sonner';

interface Slide {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string | null;
  image: string;
  buttonLink: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export default function SlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/admin/slides');
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      }
    } catch (error) {
      toast.error('فشل تحميل السلايدات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/slides/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        setSlides(prev =>
          prev.map(item => (item.id === id ? { ...item, isActive: !isActive } : item))
        );
        toast.success(isActive ? 'تم إلغاء تفعيل السلايد' : 'تم تفعيل السلايد');
      }
    } catch (error) {
      toast.error('فشل تحديث حالة السلايد');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/slides/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSlides(prev => prev.filter(item => item.id !== id));
        toast.success('تم حذف السلايد بنجاح');
      } else {
        const data = await res.json();
        toast.error(data.error || 'فشل حذف السلايد');
      }
    } catch (error) {
      toast.error('فشل حذف السلايد');
    }
  };

  const columns: ColumnDef<Slide>[] = [
    {
      accessorKey: 'order',
      header: 'الترتيب',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <GripVertical className="text-gray-400" size={16} />
          <span className="font-mono text-gray-600">{row.original.order}</span>
        </div>
      ),
    },
    {
      accessorKey: 'image',
      header: 'الصورة',
      cell: ({ row }) => {
        const image = row.original.image;
        return (
          <div className="w-24 h-14 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {image ? (
              <Image
                src={image}
                alt={row.original.titleAr}
                width={96}
                height={56}
                className="object-cover w-full h-full"
              />
            ) : (
              <ImageIcon className="text-gray-400" size={20} />
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
        <div className="max-w-[250px]">
          <p className="font-medium text-gray-900 line-clamp-1">{row.original.titleAr}</p>
          <p className="text-sm text-gray-500 line-clamp-1">{row.original.subtitleAr || '-'}</p>
        </div>
      ),
    },
    {
      accessorKey: 'buttonLink',
      header: 'الرابط',
      cell: ({ row }) => (
        <span className="text-gray-600 text-sm">
          {row.original.buttonLink ? (
            <a href={row.original.buttonLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {row.original.buttonLink.substring(0, 30)}...
            </a>
          ) : '-'}
        </span>
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
          {row.original.isActive ? 'مفعل' : 'معطل'}
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
                <Link href={`/admin/slides/${item.id}`} className="flex items-center gap-2 cursor-pointer">
                  <Pencil size={16} />
                  تعديل
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleToggleActive(item.id, item.isActive)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Power size={16} />
                {item.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteDialog
                title="حذف السلايد"
                description={`هل أنت متأكد من حذف السلايد "${item.titleAr}"؟ لا يمكن التراجع عن هذا الإجراء.`}
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
          <p className="text-gray-600">جاري تحميل السلايدات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">السلايدر</h1>
          <p className="text-gray-600 mt-1">إدارة شرائح العرض الرئيسية</p>
        </div>
        <Link href="/admin/slides/new">
          <Button className="bg-primary hover:bg-primary/90 text-slate-900">
            <Plus size={18} className="ml-2 rtl:ml-0 rtl:mr-2" />
            إضافة سلايد
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ImageIcon className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{slides.length}</p>
              <p className="text-sm text-gray-600">إجمالي السلايدات</p>
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
                {slides.filter(s => s.isActive).length}
              </p>
              <p className="text-sm text-gray-600">سلايدات مفعلة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Power className="text-gray-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {slides.filter(s => !s.isActive).length}
              </p>
              <p className="text-sm text-gray-600">سلايدات معطلة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={columns}
          data={slides}
          searchKey="titleAr"
          searchPlaceholder="بحث في السلايدات..."
        />
      </div>
    </div>
  );
}

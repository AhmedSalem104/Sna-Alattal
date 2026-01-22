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
import { Plus, MoreHorizontal, Pencil, Trash2, Power, Lightbulb, Star, ArrowUpDown, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';

interface Solution {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  image: string | null;
  icon: string | null;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  _count: { products: number };
}

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSolutions = async () => {
    try {
      const res = await fetch('/api/admin/solutions');
      if (res.ok) {
        const data = await res.json();
        setSolutions(data);
      }
    } catch (error) {
      toast.error('فشل تحميل الحلول');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/solutions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        setSolutions(prev => prev.map(item => (item.id === id ? { ...item, isActive: !isActive } : item)));
        toast.success(isActive ? 'تم إلغاء تفعيل الحل' : 'تم تفعيل الحل');
      }
    } catch (error) {
      toast.error('فشل تحديث حالة الحل');
    }
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const res = await fetch(`/api/admin/solutions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });

      if (res.ok) {
        setSolutions(prev => prev.map(item => (item.id === id ? { ...item, isFeatured: !isFeatured } : item)));
        toast.success(isFeatured ? 'تم إزالة الحل من المميزة' : 'تم إضافة الحل للمميزة');
      }
    } catch (error) {
      toast.error('فشل تحديث الحل');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/solutions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSolutions(prev => prev.filter(item => item.id !== id));
        toast.success('تم حذف الحل بنجاح');
      }
    } catch (error) {
      toast.error('فشل حذف الحل');
    }
  };

  const columns: ColumnDef<Solution>[] = [
    {
      accessorKey: 'image',
      header: 'الصورة',
      cell: ({ row }) => (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
          {row.original.image ? (
            <Image src={row.original.image} alt={row.original.titleAr} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Lightbulb className="text-gray-400" size={24} />
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'titleAr',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="hover:bg-transparent">
          الحل <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="max-w-[250px]">
          <p className="font-medium text-gray-900 line-clamp-1">{row.original.titleAr}</p>
          <p className="text-sm text-gray-500 line-clamp-1">{row.original.titleEn}</p>
        </div>
      ),
    },
    {
      accessorKey: 'slug',
      header: 'الرابط',
      cell: ({ row }) => <code className="text-xs bg-gray-100 px-2 py-1 rounded">{row.original.slug}</code>,
    },
    {
      accessorKey: '_count',
      header: 'المنتجات',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Package size={14} />
          {row.original._count.products}
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'الحالة',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge variant={row.original.isActive ? 'default' : 'secondary'} className={row.original.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
            {row.original.isActive ? 'مفعل' : 'معطل'}
          </Badge>
          {row.original.isFeatured && (
            <Badge className="bg-yellow-100 text-yellow-700">
              <Star size={12} className="ml-1" /> مميز
            </Badge>
          )}
        </div>
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
              <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/solutions/${item.id}`} className="flex items-center gap-2 cursor-pointer">
                  <Pencil size={16} /> تعديل
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleFeatured(item.id, item.isFeatured)} className="flex items-center gap-2 cursor-pointer">
                <Star size={16} /> {item.isFeatured ? 'إزالة من المميزة' : 'إضافة للمميزة'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleActive(item.id, item.isActive)} className="flex items-center gap-2 cursor-pointer">
                <Power size={16} /> {item.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteDialog
                title="حذف الحل"
                description={`هل أنت متأكد من حذف "${item.titleAr}"؟`}
                onDelete={() => handleDelete(item.id)}
                trigger={
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer">
                    <Trash2 size={16} /> حذف
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الحلول</h1>
          <p className="text-gray-600 mt-1">إدارة الحلول والخدمات المقدمة</p>
        </div>
        <Link href="/admin/solutions/new">
          <Button className="bg-primary hover:bg-primary/90 text-slate-900">
            <Plus size={18} className="ml-2" /> إضافة حل
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><Lightbulb className="text-blue-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{solutions.length}</p>
              <p className="text-sm text-gray-600">إجمالي الحلول</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><Power className="text-green-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{solutions.filter(s => s.isActive).length}</p>
              <p className="text-sm text-gray-600">حلول مفعلة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg"><Star className="text-yellow-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{solutions.filter(s => s.isFeatured).length}</p>
              <p className="text-sm text-gray-600">حلول مميزة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg"><Package className="text-purple-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {solutions.reduce((acc, s) => acc + s._count.products, 0)}
              </p>
              <p className="text-sm text-gray-600">منتجات مرتبطة</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable columns={columns} data={solutions} searchKey="titleAr" searchPlaceholder="بحث في الحلول..." />
      </div>
    </div>
  );
}

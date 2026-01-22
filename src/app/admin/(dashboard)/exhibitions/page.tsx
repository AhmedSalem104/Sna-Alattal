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
  CalendarDays,
  MapPin,
  ArrowUpDown,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Exhibition {
  id: string;
  nameAr: string;
  nameEn: string;
  locationAr: string;
  images: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  order: number;
}

export default function ExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExhibitions = async () => {
    try {
      const res = await fetch('/api/admin/exhibitions');
      if (res.ok) {
        const data = await res.json();
        setExhibitions(data);
      }
    } catch (error) {
      toast.error('فشل تحميل المعارض');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/exhibitions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        setExhibitions(prev =>
          prev.map(item => (item.id === id ? { ...item, isActive: !isActive } : item))
        );
        toast.success(isActive ? 'تم إلغاء تفعيل المعرض' : 'تم تفعيل المعرض');
      }
    } catch (error) {
      toast.error('فشل تحديث حالة المعرض');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/exhibitions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExhibitions(prev => prev.filter(item => item.id !== id));
        toast.success('تم حذف المعرض بنجاح');
      }
    } catch (error) {
      toast.error('فشل حذف المعرض');
    }
  };

  const columns: ColumnDef<Exhibition>[] = [
    {
      accessorKey: 'images',
      header: 'الصورة',
      cell: ({ row }) => {
        const images = row.original.images;
        return (
          <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {images && images.length > 0 ? (
              <Image src={images[0]} alt={row.original.nameAr} width={64} height={48} className="object-cover w-full h-full" />
            ) : (
              <ImageIcon className="text-gray-400" size={20} />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'nameAr',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="hover:bg-transparent">
          المعرض
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900">{row.original.nameAr}</p>
          <p className="text-sm text-gray-500">{row.original.nameEn}</p>
        </div>
      ),
    },
    {
      accessorKey: 'locationAr',
      header: 'الموقع',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-gray-400" />
          <span className="text-gray-600">{row.original.locationAr}</span>
        </div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'التاريخ',
      cell: ({ row }) => (
        <div className="text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <CalendarDays size={14} />
            {format(new Date(row.original.startDate), 'dd MMM', { locale: ar })} - {format(new Date(row.original.endDate), 'dd MMM yyyy', { locale: ar })}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'الحالة',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'} className={row.original.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
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
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/exhibitions/${item.id}`} className="flex items-center gap-2 cursor-pointer">
                  <Pencil size={16} />
                  تعديل
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleActive(item.id, item.isActive)} className="flex items-center gap-2 cursor-pointer">
                <Power size={16} />
                {item.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteDialog
                title="حذف المعرض"
                description={`هل أنت متأكد من حذف "${item.nameAr}"؟`}
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
          <p className="text-gray-600">جاري تحميل المعارض...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المعارض</h1>
          <p className="text-gray-600 mt-1">إدارة المعارض والفعاليات</p>
        </div>
        <Link href="/admin/exhibitions/new">
          <Button className="bg-primary hover:bg-primary/90 text-slate-900">
            <Plus size={18} className="ml-2" />
            إضافة معرض
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarDays className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{exhibitions.length}</p>
              <p className="text-sm text-gray-600">إجمالي المعارض</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Power className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{exhibitions.filter(e => e.isActive).length}</p>
              <p className="text-sm text-gray-600">معارض مفعلة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CalendarDays className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {exhibitions.filter(e => new Date(e.endDate) >= new Date()).length}
              </p>
              <p className="text-sm text-gray-600">معارض قادمة/حالية</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable columns={columns} data={exhibitions} searchKey="nameAr" searchPlaceholder="بحث في المعارض..." />
      </div>
    </div>
  );
}

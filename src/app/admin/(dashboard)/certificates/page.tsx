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
  Award,
  ArrowUpDown,
  Loader2,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Certificate {
  id: string;
  nameAr: string;
  nameEn: string;
  issuingBodyAr: string;
  issuingBodyEn: string;
  image: string;
  issueDate: string;
  expiryDate: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/admin/certificates');
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
      }
    } catch (error) {
      toast.error('فشل تحميل الشهادات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/certificates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        setCertificates(prev =>
          prev.map(item => (item.id === id ? { ...item, isActive: !isActive } : item))
        );
        toast.success(isActive ? 'تم إلغاء تفعيل الشهادة' : 'تم تفعيل الشهادة');
      }
    } catch (error) {
      toast.error('فشل تحديث حالة الشهادة');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/certificates/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCertificates(prev => prev.filter(item => item.id !== id));
        toast.success('تم حذف الشهادة بنجاح');
      } else {
        const data = await res.json();
        toast.error(data.error || 'فشل حذف الشهادة');
      }
    } catch (error) {
      toast.error('فشل حذف الشهادة');
    }
  };

  const columns: ColumnDef<Certificate>[] = [
    {
      accessorKey: 'image',
      header: 'الصورة',
      cell: ({ row }) => {
        const image = row.original.image;
        return (
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {image ? (
              <Image
                src={image}
                alt={row.original.nameAr}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            ) : (
              <Award className="text-gray-400" size={24} />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'nameAr',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent"
        >
          الشهادة
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
      accessorKey: 'issuingBodyAr',
      header: 'جهة الإصدار',
      cell: ({ row }) => (
        <span className="text-gray-600">{row.original.issuingBodyAr}</span>
      ),
    },
    {
      accessorKey: 'issueDate',
      header: 'تاريخ الإصدار',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={14} />
          <span>{format(new Date(row.original.issueDate), 'dd MMM yyyy', { locale: ar })}</span>
        </div>
      ),
    },
    {
      accessorKey: 'expiryDate',
      header: 'تاريخ الانتهاء',
      cell: ({ row }) => {
        const expiryDate = row.original.expiryDate;
        if (!expiryDate) return <span className="text-gray-400">-</span>;

        const isExpired = new Date(expiryDate) < new Date();
        return (
          <span className={isExpired ? 'text-red-600' : 'text-gray-600'}>
            {format(new Date(expiryDate), 'dd MMM yyyy', { locale: ar })}
          </span>
        );
      },
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
                <Link href={`/admin/certificates/${item.id}`} className="flex items-center gap-2 cursor-pointer">
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
                title="حذف الشهادة"
                description={`هل أنت متأكد من حذف الشهادة "${item.nameAr}"؟ لا يمكن التراجع عن هذا الإجراء.`}
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
          <p className="text-gray-600">جاري تحميل الشهادات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الشهادات</h1>
          <p className="text-gray-600 mt-1">إدارة شهادات الجودة والاعتمادات</p>
        </div>
        <Link href="/admin/certificates/new">
          <Button className="bg-primary hover:bg-primary/90 text-slate-900">
            <Plus size={18} className="ml-2 rtl:ml-0 rtl:mr-2" />
            إضافة شهادة
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
              <p className="text-sm text-gray-600">إجمالي الشهادات</p>
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
                {certificates.filter(c => c.isActive).length}
              </p>
              <p className="text-sm text-gray-600">شهادات مفعلة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Calendar className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {certificates.filter(c => c.expiryDate && new Date(c.expiryDate) < new Date()).length}
              </p>
              <p className="text-sm text-gray-600">شهادات منتهية</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={columns}
          data={certificates}
          searchKey="nameAr"
          searchPlaceholder="بحث في الشهادات..."
        />
      </div>
    </div>
  );
}

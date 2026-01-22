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
  Users,
  ArrowUpDown,
  Loader2,
  Mail,
  Linkedin,
} from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  nameAr: string;
  nameEn: string;
  positionAr: string;
  positionEn: string;
  image: string;
  email: string | null;
  linkedin: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/admin/team');
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (error) {
      toast.error('فشل تحميل أعضاء الفريق');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/team/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        setMembers(prev =>
          prev.map(item => (item.id === id ? { ...item, isActive: !isActive } : item))
        );
        toast.success(isActive ? 'تم إلغاء تفعيل العضو' : 'تم تفعيل العضو');
      }
    } catch (error) {
      toast.error('فشل تحديث حالة العضو');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/team/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMembers(prev => prev.filter(item => item.id !== id));
        toast.success('تم حذف العضو بنجاح');
      } else {
        const data = await res.json();
        toast.error(data.error || 'فشل حذف العضو');
      }
    } catch (error) {
      toast.error('فشل حذف العضو');
    }
  };

  const columns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: 'image',
      header: 'الصورة',
      cell: ({ row }) => {
        const image = row.original.image;
        return (
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {image ? (
              <Image
                src={image}
                alt={row.original.nameAr}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <Users className="text-gray-400" size={20} />
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
          الاسم
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
      accessorKey: 'positionAr',
      header: 'المنصب',
      cell: ({ row }) => (
        <div>
          <p className="text-gray-900">{row.original.positionAr}</p>
          <p className="text-sm text-gray-500">{row.original.positionEn}</p>
        </div>
      ),
    },
    {
      accessorKey: 'contact',
      header: 'التواصل',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.email && (
            <a href={`mailto:${row.original.email}`} className="text-gray-500 hover:text-blue-600">
              <Mail size={18} />
            </a>
          )}
          {row.original.linkedin && (
            <a href={row.original.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
              <Linkedin size={18} />
            </a>
          )}
          {!row.original.email && !row.original.linkedin && (
            <span className="text-gray-400 text-sm">-</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'order',
      header: 'الترتيب',
      cell: ({ row }) => (
        <span className="font-mono text-gray-600">{row.original.order}</span>
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
                <Link href={`/admin/team/${item.id}`} className="flex items-center gap-2 cursor-pointer">
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
                title="حذف العضو"
                description={`هل أنت متأكد من حذف العضو "${item.nameAr}"؟ لا يمكن التراجع عن هذا الإجراء.`}
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
          <p className="text-gray-600">جاري تحميل أعضاء الفريق...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">فريق العمل</h1>
          <p className="text-gray-600 mt-1">إدارة أعضاء فريق العمل</p>
        </div>
        <Link href="/admin/team/new">
          <Button className="bg-primary hover:bg-primary/90 text-slate-900">
            <Plus size={18} className="ml-2 rtl:ml-0 rtl:mr-2" />
            إضافة عضو
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
              <p className="text-sm text-gray-600">إجمالي الأعضاء</p>
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
                {members.filter(m => m.isActive).length}
              </p>
              <p className="text-sm text-gray-600">أعضاء مفعلين</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Linkedin className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => m.linkedin).length}
              </p>
              <p className="text-sm text-gray-600">لديهم LinkedIn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={columns}
          data={members}
          searchKey="nameAr"
          searchPlaceholder="بحث في أعضاء الفريق..."
        />
      </div>
    </div>
  );
}

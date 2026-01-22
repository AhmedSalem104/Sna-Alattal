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
import { Plus, MoreHorizontal, Pencil, Trash2, Power, Tv, Calendar, ArrowUpDown, Loader2, Play } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface TVInterview {
  id: string;
  titleAr: string;
  titleEn: string;
  channelAr: string;
  thumbnail: string;
  videoUrl: string;
  date: string;
  isActive: boolean;
  order: number;
}

export default function TVInterviewsPage() {
  const [interviews, setInterviews] = useState<TVInterview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      const res = await fetch('/api/admin/tv-interviews');
      if (res.ok) {
        const data = await res.json();
        setInterviews(data);
      }
    } catch (error) {
      toast.error('فشل تحميل المقابلات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/tv-interviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        setInterviews(prev => prev.map(item => (item.id === id ? { ...item, isActive: !isActive } : item)));
        toast.success(isActive ? 'تم إلغاء تفعيل المقابلة' : 'تم تفعيل المقابلة');
      }
    } catch (error) {
      toast.error('فشل تحديث حالة المقابلة');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/tv-interviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInterviews(prev => prev.filter(item => item.id !== id));
        toast.success('تم حذف المقابلة بنجاح');
      }
    } catch (error) {
      toast.error('فشل حذف المقابلة');
    }
  };

  const columns: ColumnDef<TVInterview>[] = [
    {
      accessorKey: 'thumbnail',
      header: 'الصورة',
      cell: ({ row }) => (
        <div className="relative w-20 h-12 rounded-lg overflow-hidden bg-gray-100">
          {row.original.thumbnail ? (
            <>
              <Image src={row.original.thumbnail} alt={row.original.titleAr} fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play size={16} className="text-white" />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tv className="text-gray-400" size={20} />
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'titleAr',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="hover:bg-transparent">
          العنوان <ArrowUpDown className="mr-2 h-4 w-4" />
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
      accessorKey: 'channelAr',
      header: 'القناة',
      cell: ({ row }) => <span className="text-gray-600">{row.original.channelAr}</span>,
    },
    {
      accessorKey: 'date',
      header: 'التاريخ',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={14} />
          {format(new Date(row.original.date), 'dd MMM yyyy', { locale: ar })}
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
              <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/tv-interviews/${item.id}`} className="flex items-center gap-2 cursor-pointer">
                  <Pencil size={16} /> تعديل
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer">
                  <Play size={16} /> مشاهدة
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleActive(item.id, item.isActive)} className="flex items-center gap-2 cursor-pointer">
                <Power size={16} /> {item.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteDialog
                title="حذف المقابلة"
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
          <h1 className="text-2xl font-bold text-gray-900">المقابلات التلفزيونية</h1>
          <p className="text-gray-600 mt-1">إدارة المقابلات والظهور الإعلامي</p>
        </div>
        <Link href="/admin/tv-interviews/new">
          <Button className="bg-primary hover:bg-primary/90 text-slate-900">
            <Plus size={18} className="ml-2" /> إضافة مقابلة
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><Tv className="text-blue-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{interviews.length}</p>
              <p className="text-sm text-gray-600">إجمالي المقابلات</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><Power className="text-green-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{interviews.filter(i => i.isActive).length}</p>
              <p className="text-sm text-gray-600">مقابلات مفعلة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg"><Calendar className="text-purple-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {interviews.filter(i => {
                  const date = new Date(i.date);
                  const now = new Date();
                  return date.getFullYear() === now.getFullYear();
                }).length}
              </p>
              <p className="text-sm text-gray-600">هذا العام</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable columns={columns} data={interviews} searchKey="titleAr" searchPlaceholder="بحث في المقابلات..." />
      </div>
    </div>
  );
}

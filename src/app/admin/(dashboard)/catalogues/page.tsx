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
import { Plus, MoreHorizontal, Pencil, Trash2, Power, FileText, Download, ArrowUpDown, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Catalogue {
  id: string;
  nameAr: string;
  nameEn: string;
  thumbnail: string | null;
  fileUrl: string;
  fileSize: number;
  downloadCount: number;
  isActive: boolean;
  order: number;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function CataloguesPage() {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCatalogues = async () => {
    try {
      const res = await fetch('/api/admin/catalogues');
      if (res.ok) {
        const data = await res.json();
        setCatalogues(data);
      }
    } catch (error) {
      toast.error('فشل تحميل الكتالوجات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogues();
  }, []);

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/catalogues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        setCatalogues(prev => prev.map(item => (item.id === id ? { ...item, isActive: !isActive } : item)));
        toast.success(isActive ? 'تم إلغاء تفعيل الكتالوج' : 'تم تفعيل الكتالوج');
      }
    } catch (error) {
      toast.error('فشل تحديث حالة الكتالوج');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/catalogues/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCatalogues(prev => prev.filter(item => item.id !== id));
        toast.success('تم حذف الكتالوج بنجاح');
      }
    } catch (error) {
      toast.error('فشل حذف الكتالوج');
    }
  };

  const columns: ColumnDef<Catalogue>[] = [
    {
      accessorKey: 'thumbnail',
      header: 'الغلاف',
      cell: ({ row }) => (
        <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-100 border">
          {row.original.thumbnail ? (
            <Image src={row.original.thumbnail} alt={row.original.nameAr} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="text-gray-400" size={24} />
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'nameAr',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="hover:bg-transparent">
          الاسم <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <p className="font-medium text-gray-900 line-clamp-1">{row.original.nameAr}</p>
          <p className="text-sm text-gray-500 line-clamp-1">{row.original.nameEn}</p>
        </div>
      ),
    },
    {
      accessorKey: 'fileSize',
      header: 'الحجم',
      cell: ({ row }) => <span className="text-gray-600">{formatFileSize(row.original.fileSize)}</span>,
    },
    {
      accessorKey: 'downloadCount',
      header: 'التحميلات',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Download size={14} />
          {row.original.downloadCount}
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
                <Link href={`/admin/catalogues/${item.id}`} className="flex items-center gap-2 cursor-pointer">
                  <Pencil size={16} /> تعديل
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer">
                  <ExternalLink size={16} /> فتح الملف
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleActive(item.id, item.isActive)} className="flex items-center gap-2 cursor-pointer">
                <Power size={16} /> {item.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteDialog
                title="حذف الكتالوج"
                description={`هل أنت متأكد من حذف "${item.nameAr}"؟`}
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

  const totalDownloads = catalogues.reduce((acc, cat) => acc + cat.downloadCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الكتالوجات</h1>
          <p className="text-gray-600 mt-1">إدارة كتالوجات المنتجات والملفات</p>
        </div>
        <Link href="/admin/catalogues/new">
          <Button className="bg-primary hover:bg-primary/90 text-slate-900">
            <Plus size={18} className="ml-2" /> إضافة كتالوج
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><FileText className="text-blue-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{catalogues.length}</p>
              <p className="text-sm text-gray-600">إجمالي الكتالوجات</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><Power className="text-green-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{catalogues.filter(c => c.isActive).length}</p>
              <p className="text-sm text-gray-600">كتالوجات مفعلة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg"><Download className="text-purple-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalDownloads}</p>
              <p className="text-sm text-gray-600">إجمالي التحميلات</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg"><FileText className="text-orange-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatFileSize(catalogues.reduce((acc, cat) => acc + cat.fileSize, 0))}
              </p>
              <p className="text-sm text-gray-600">الحجم الإجمالي</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable columns={columns} data={catalogues} searchKey="nameAr" searchPlaceholder="بحث في الكتالوجات..." />
      </div>
    </div>
  );
}

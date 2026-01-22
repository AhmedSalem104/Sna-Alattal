'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  FolderTree,
  Package,
  ArrowUpDown,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  slug: string;
  image: string | null;
  isActive: boolean;
  order: number;
  parent?: { id: string; nameAr: string } | null;
  _count: { products: number; children: number };
  createdAt: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      toast.error('فشل تحميل التصنيفات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        setCategories(prev =>
          prev.map(cat => (cat.id === id ? { ...cat, isActive: !isActive } : cat))
        );
        toast.success(isActive ? 'تم إلغاء تفعيل التصنيف' : 'تم تفعيل التصنيف');
      }
    } catch (error) {
      toast.error('فشل تحديث حالة التصنيف');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCategories(prev => prev.filter(cat => cat.id !== id));
        toast.success('تم حذف التصنيف بنجاح');
      } else {
        const data = await res.json();
        toast.error(data.error || 'فشل حذف التصنيف');
      }
    } catch (error) {
      toast.error('فشل حذف التصنيف');
    }
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: 'image',
      header: 'الصورة',
      cell: ({ row }) => {
        const image = row.original.image;
        return (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {image ? (
              <Image
                src={image}
                alt={row.original.nameAr}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <FolderTree className="text-gray-400" size={20} />
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
      accessorKey: 'parent',
      header: 'التصنيف الأب',
      cell: ({ row }) => {
        const parent = row.original.parent;
        return parent ? (
          <Badge variant="outline" className="font-normal">
            {parent.nameAr}
          </Badge>
        ) : (
          <span className="text-gray-400 text-sm">تصنيف رئيسي</span>
        );
      },
    },
    {
      accessorKey: '_count.products',
      header: 'المنتجات',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Package size={16} className="text-gray-400" />
          <span className="font-medium">{row.original._count.products}</span>
        </div>
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
      accessorKey: 'order',
      header: 'الترتيب',
      cell: ({ row }) => (
        <span className="text-gray-600 font-mono">{row.original.order}</span>
      ),
    },
    {
      id: 'actions',
      header: 'الإجراءات',
      cell: ({ row }) => {
        const category = row.original;
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
                <Link href={`/admin/categories/${category.id}`} className="flex items-center gap-2 cursor-pointer">
                  <Pencil size={16} />
                  تعديل
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/categories/${category.slug}`} target="_blank" className="flex items-center gap-2 cursor-pointer">
                  <Eye size={16} />
                  معاينة
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleToggleActive(category.id, category.isActive)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Power size={16} />
                {category.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteDialog
                title="حذف التصنيف"
                description={`هل أنت متأكد من حذف التصنيف "${category.nameAr}"؟ لا يمكن التراجع عن هذا الإجراء.`}
                onDelete={() => handleDelete(category.id)}
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
          <p className="text-gray-600">جاري تحميل التصنيفات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التصنيفات</h1>
          <p className="text-gray-600 mt-1">إدارة تصنيفات المنتجات</p>
        </div>
        <Link href="/admin/categories/new">
          <Button className="bg-primary hover:bg-primary/90 text-slate-900">
            <Plus size={18} className="ml-2 rtl:ml-0 rtl:mr-2" />
            إضافة تصنيف
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderTree className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              <p className="text-sm text-gray-600">إجمالي التصنيفات</p>
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
                {categories.filter(c => c.isActive).length}
              </p>
              <p className="text-sm text-gray-600">تصنيفات مفعلة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FolderTree className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter(c => !c.parent).length}
              </p>
              <p className="text-sm text-gray-600">تصنيفات رئيسية</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {categories.reduce((sum, c) => sum + c._count.products, 0)}
              </p>
              <p className="text-sm text-gray-600">إجمالي المنتجات</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={columns}
          data={categories}
          searchKey="nameAr"
          searchPlaceholder="بحث في التصنيفات..."
        />
      </div>
    </div>
  );
}

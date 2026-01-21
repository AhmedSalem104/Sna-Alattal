'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import {
  Plus,
  Pencil,
  Eye,
  MoreHorizontal,
  Check,
  X,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable, DeleteDialog } from '@/components/admin';
import { toast } from 'sonner';

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  images: string[];
  category: { nameAr: string } | null;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('فشل في تحميل المنتجات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('تم نقل المنتج إلى سلة المحذوفات');
        fetchProducts();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      toast.error('فشل في حذف المنتج');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        toast.success(isActive ? 'تم إلغاء تفعيل المنتج' : 'تم تفعيل المنتج');
        fetchProducts();
      }
    } catch (error) {
      toast.error('فشل في تحديث حالة المنتج');
    }
  };

  const toggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });

      if (response.ok) {
        toast.success(isFeatured ? 'تم إزالة المنتج من المميزات' : 'تم إضافة المنتج للمميزات');
        fetchProducts();
      }
    } catch (error) {
      toast.error('فشل في تحديث حالة المنتج');
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'images',
      header: 'الصورة',
      cell: ({ row }) => {
        const images = row.original.images as string[];
        return (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white">
            {images?.[0] ? (
              <Image
                src={images[0]}
                alt={row.original.nameAr}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                <Eye size={20} />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'nameAr',
      header: 'اسم المنتج',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.nameAr}</p>
          <p className="text-xs text-gray-600">{row.original.nameEn}</p>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'التصنيف',
      cell: ({ row }) => (
        <Badge variant="outline" className="border-gray-300">
          {row.original.category?.nameAr || 'بدون تصنيف'}
        </Badge>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'الحالة',
      cell: ({ row }) => (
        <Badge
          variant={row.original.isActive ? 'default' : 'secondary'}
          className={row.original.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-600'}
        >
          {row.original.isActive ? 'نشط' : 'غير نشط'}
        </Badge>
      ),
    },
    {
      accessorKey: 'isFeatured',
      header: 'مميز',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleFeatured(row.original.id, row.original.isFeatured)}
          className={row.original.isFeatured ? 'text-primary' : 'text-gray-600'}
        >
          <Star size={18} fill={row.original.isFeatured ? 'currentColor' : 'none'} />
        </Button>
      ),
    },
    {
      accessorKey: 'order',
      header: 'الترتيب',
    },
    {
      id: 'actions',
      header: 'الإجراءات',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-50 border-gray-200">
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${row.original.id}`} className="cursor-pointer">
                <Pencil size={16} className="ml-2" />
                تعديل
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/products/${row.original.slug}`} target="_blank" className="cursor-pointer">
                <Eye size={16} className="ml-2" />
                معاينة
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toggleActive(row.original.id, row.original.isActive)}
              className="cursor-pointer"
            >
              {row.original.isActive ? (
                <>
                  <X size={16} className="ml-2" />
                  إلغاء التفعيل
                </>
              ) : (
                <>
                  <Check size={16} className="ml-2" />
                  تفعيل
                </>
              )}
            </DropdownMenuItem>
            <DeleteDialog
              onConfirm={() => handleDelete(row.original.id)}
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-red-400 focus:text-red-400 cursor-pointer"
                >
                  حذف
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المنتجات</h1>
          <p className="text-gray-600">إدارة منتجات الشركة</p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="gold">
            <Plus size={18} className="ml-2" />
            إضافة منتج
          </Button>
        </Link>
      </motion.div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {isLoading ? (
          <div className="text-center py-12 text-gray-600">جاري التحميل...</div>
        ) : (
          <DataTable
            columns={columns}
            data={products}
            searchKey="nameAr"
            searchPlaceholder="البحث عن منتج..."
          />
        )}
      </motion.div>
    </div>
  );
}

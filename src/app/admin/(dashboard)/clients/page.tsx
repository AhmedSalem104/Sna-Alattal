'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, MoreHorizontal, Check, X, Star, Globe } from 'lucide-react';
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

interface Client {
  id: string;
  nameAr: string;
  nameEn: string;
  logo: string;
  website: string | null;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      toast.error('فشل في تحميل العملاء');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/clients/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('تم نقل العميل إلى سلة المحذوفات');
        fetchClients();
      }
    } catch (error) {
      toast.error('فشل في حذف العميل');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (response.ok) {
        toast.success(isActive ? 'تم إلغاء تفعيل العميل' : 'تم تفعيل العميل');
        fetchClients();
      }
    } catch (error) {
      toast.error('فشل في تحديث حالة العميل');
    }
  };

  const toggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });
      if (response.ok) {
        toast.success(isFeatured ? 'تم إزالة العميل من المميزين' : 'تم إضافة العميل للمميزين');
        fetchClients();
      }
    } catch (error) {
      toast.error('فشل في تحديث حالة العميل');
    }
  };

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'logo',
      header: 'الشعار',
      cell: ({ row }) => (
        <div className="w-16 h-12 rounded-lg overflow-hidden bg-white p-1">
          <Image
            src={row.original.logo || '/images/placeholder.png'}
            alt={row.original.nameAr}
            width={64}
            height={48}
            className="w-full h-full object-contain"
          />
        </div>
      ),
    },
    {
      accessorKey: 'nameAr',
      header: 'اسم العميل',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.nameAr}</p>
          <p className="text-xs text-gray-400">{row.original.nameEn}</p>
        </div>
      ),
    },
    {
      accessorKey: 'website',
      header: 'الموقع',
      cell: ({ row }) =>
        row.original.website ? (
          <a
            href={row.original.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline"
          >
            <Globe size={14} />
            زيارة
          </a>
        ) : (
          <span className="text-gray-500">-</span>
        ),
    },
    {
      accessorKey: 'isActive',
      header: 'الحالة',
      cell: ({ row }) => (
        <Badge
          variant={row.original.isActive ? 'default' : 'secondary'}
          className={row.original.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}
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
          className={row.original.isFeatured ? 'text-primary' : 'text-gray-500'}
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
          <DropdownMenuContent align="end" className="bg-dark-50 border-white/10">
            <DropdownMenuItem asChild>
              <Link href={`/admin/clients/${row.original.id}`} className="cursor-pointer">
                <Pencil size={16} className="ml-2" />
                تعديل
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">العملاء</h1>
          <p className="text-gray-400">إدارة عملاء الشركة</p>
        </div>
        <Link href="/admin/clients/new">
          <Button variant="gold">
            <Plus size={18} className="ml-2" />
            إضافة عميل
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">جاري التحميل...</div>
        ) : (
          <DataTable
            columns={columns}
            data={clients}
            searchKey="nameAr"
            searchPlaceholder="البحث عن عميل..."
          />
        )}
      </motion.div>
    </div>
  );
}

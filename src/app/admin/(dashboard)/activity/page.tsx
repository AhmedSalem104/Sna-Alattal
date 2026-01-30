'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import {
  Activity,
  User,
  Package,
  FileText,
  Image,
  Users,
  Award,
  Tv,
  Calendar,
  Building2,
  Layers,
  Settings,
  Newspaper
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  oldData: object | null;
  newData: object | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const entityIcons: Record<string, React.ReactNode> = {
  'منتج': <Package size={16} />,
  'تصنيف': <Layers size={16} />,
  'خبر': <Newspaper size={16} />,
  'حل': <FileText size={16} />,
  'سلايد': <Image size={16} />,
  'عميل': <Building2 size={16} />,
  'عضو فريق': <Users size={16} />,
  'شهادة': <Award size={16} />,
  'مقابلة تلفزيونية': <Tv size={16} />,
  'معرض': <Calendar size={16} />,
  'كتالوج': <FileText size={16} />,
  'إعدادات': <Settings size={16} />,
};

const actionColors: Record<string, string> = {
  'إنشاء': 'bg-green-500/20 text-green-600',
  'تعديل': 'bg-blue-500/20 text-blue-600',
  'حذف': 'bg-red-500/20 text-red-600',
  'حذف نهائي': 'bg-red-700/20 text-red-700',
  'استعادة': 'bg-purple-500/20 text-purple-600',
};

export default function ActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLogs = async (page = 1) => {
    try {
      const response = await fetch(`/api/admin/activity?page=${page}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
      toast.error('فشل في تحميل سجل النشاطات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  const formatDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ar });
    } catch {
      return dateStr;
    }
  };

  const columns: ColumnDef<ActivityLog>[] = [
    {
      accessorKey: 'createdAt',
      header: 'الوقت',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: 'user',
      header: 'المستخدم',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User size={14} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">{row.original.user.name}</p>
            <p className="text-xs text-gray-500">{row.original.user.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'action',
      header: 'الإجراء',
      cell: ({ row }) => (
        <Badge className={actionColors[row.original.action] || 'bg-gray-500/20 text-gray-600'}>
          {row.original.action}
        </Badge>
      ),
    },
    {
      accessorKey: 'entity',
      header: 'العنصر',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-600">
            {entityIcons[row.original.entity] || <Activity size={16} />}
          </span>
          <span>{row.original.entity}</span>
        </div>
      ),
    },
    {
      accessorKey: 'entityId',
      header: 'معرف العنصر',
      cell: ({ row }) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
          {row.original.entityId.slice(0, 8)}...
        </code>
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
          <h1 className="text-2xl font-bold text-gray-900">سجل النشاطات</h1>
          <p className="text-gray-600">
            تتبع جميع العمليات التي تمت في لوحة التحكم
            {pagination && (
              <span className="mr-2">
                ({pagination.total} نشاط)
              </span>
            )}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {isLoading ? (
          <div className="text-center py-12 text-gray-600">جاري التحميل...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <Activity size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">لا يوجد نشاطات مسجلة بعد</p>
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={logs}
              searchKey="entity"
              searchPlaceholder="البحث في النشاطات..."
            />

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  السابق
                </button>
                <span className="text-sm text-gray-600">
                  صفحة {currentPage} من {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

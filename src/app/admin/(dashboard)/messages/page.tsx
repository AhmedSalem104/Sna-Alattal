'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import {
  Eye,
  MoreHorizontal,
  Mail,
  MailOpen,
  Archive,
  Phone,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataTable, DeleteDialog } from '@/components/admin';
import { toast } from 'sonner';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('فشل في تحميل الرسائل');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const viewMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      try {
        await fetch(`/api/admin/messages/${message.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true }),
        });
        fetchMessages();
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
  };

  const handleArchive = async (id: string, isArchived: boolean) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: !isArchived }),
      });
      toast.success(isArchived ? 'تم إلغاء الأرشفة' : 'تم أرشفة الرسالة');
      fetchMessages();
    } catch (error) {
      toast.error('فشل في تحديث الرسالة');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      toast.success('تم حذف الرسالة');
      fetchMessages();
    } catch (error) {
      toast.error('فشل في حذف الرسالة');
    }
  };

  const columns: ColumnDef<Message>[] = [
    {
      accessorKey: 'isRead',
      header: '',
      cell: ({ row }) => (
        <div className="w-8">
          {row.original.isRead ? (
            <MailOpen size={18} className="text-gray-500" />
          ) : (
            <Mail size={18} className="text-primary" />
          )}
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'المرسل',
      cell: ({ row }) => (
        <div>
          <p className={`font-medium ${!row.original.isRead ? 'text-white' : 'text-gray-300'}`}>
            {row.original.name}
          </p>
          <p className="text-xs text-gray-400">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'subject',
      header: 'الموضوع',
      cell: ({ row }) => (
        <Badge variant="outline" className="border-white/20">
          {row.original.subject === 'quote'
            ? 'طلب عرض سعر'
            : row.original.subject === 'support'
            ? 'دعم فني'
            : row.original.subject === 'sales'
            ? 'استفسار مبيعات'
            : row.original.subject === 'partnership'
            ? 'شراكة تجارية'
            : 'أخرى'}
        </Badge>
      ),
    },
    {
      accessorKey: 'message',
      header: 'الرسالة',
      cell: ({ row }) => (
        <p className="text-gray-400 truncate max-w-xs">{row.original.message}</p>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'التاريخ',
      cell: ({ row }) => (
        <span className="text-gray-400 text-sm flex items-center gap-1">
          <Calendar size={14} />
          {new Date(row.original.createdAt).toLocaleDateString('ar-EG')}
        </span>
      ),
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
            <DropdownMenuItem onClick={() => viewMessage(row.original)} className="cursor-pointer">
              <Eye size={16} className="ml-2" />
              عرض
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleArchive(row.original.id, row.original.isArchived)}
              className="cursor-pointer"
            >
              <Archive size={16} className="ml-2" />
              {row.original.isArchived ? 'إلغاء الأرشفة' : 'أرشفة'}
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

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">الرسائل</h1>
          <p className="text-gray-400">
            {unreadCount > 0 ? `${unreadCount} رسالة غير مقروءة` : 'لا توجد رسائل جديدة'}
          </p>
        </div>
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
            data={messages}
            searchKey="name"
            searchPlaceholder="البحث في الرسائل..."
          />
        )}
      </motion.div>

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="bg-dark-50 border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">تفاصيل الرسالة</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">الاسم</p>
                  <p className="text-white font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">البريد الإلكتروني</p>
                  <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <p className="text-gray-400 text-sm">الهاتف</p>
                    <a href={`tel:${selectedMessage.phone}`} className="text-primary hover:underline flex items-center gap-1">
                      <Phone size={14} />
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
                {selectedMessage.company && (
                  <div>
                    <p className="text-gray-400 text-sm">الشركة</p>
                    <p className="text-white">{selectedMessage.company}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">الموضوع</p>
                <Badge variant="outline" className="border-white/20">
                  {selectedMessage.subject === 'quote'
                    ? 'طلب عرض سعر'
                    : selectedMessage.subject === 'support'
                    ? 'دعم فني'
                    : selectedMessage.subject === 'sales'
                    ? 'استفسار مبيعات'
                    : selectedMessage.subject === 'partnership'
                    ? 'شراكة تجارية'
                    : 'أخرى'}
                </Badge>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">الرسالة</p>
                <div className="bg-dark rounded-xl p-4 text-white whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(selectedMessage.createdAt).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <div className="flex gap-2">
                  <a href={`mailto:${selectedMessage.email}`}>
                    <Button variant="gold" size="sm">
                      <Mail size={16} className="ml-2" />
                      رد
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Package,
  Users,
  MessageSquare,
  FileText,
  Eye,
  TrendingUp,
  ArrowLeft,
  Calendar,
  Clock,
  Cog,
} from 'lucide-react';
import { StatsCard } from '@/components/admin';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  products: number;
  clients: number;
  messages: { total: number; unread: number };
  downloads: number;
}

interface RecentActivity {
  id: string;
  action: string;
  entity: string;
  entityName: string;
  createdAt: string;
}

interface RecentMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  isRead: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    clients: 0,
    messages: { total: 0, unread: 0 },
    downloads: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setRecentActivities(data.recentActivities || []);
          setRecentMessages(data.recentMessages || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickLinks = [
    { label: 'إضافة منتج', href: '/admin/products/new', icon: Package },
    { label: 'إضافة خبر', href: '/admin/news/new', icon: FileText },
    { label: 'عرض الرسائل', href: '/admin/messages', icon: MessageSquare },
    { label: 'إدارة العملاء', href: '/admin/clients', icon: Users },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white border-2 border-metal-200 p-6 overflow-hidden"
      >
        {/* Gold Accent Bar */}
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

        {/* Decorative Gear */}
        <div className="absolute top-4 left-4 opacity-5">
          <Cog size={80} className="text-primary" />
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-steel-900 uppercase tracking-wider mb-2">
            مرحباً، {session?.user?.name}
          </h1>
          <p className="text-metal-600">
            مرحباً بك في لوحة تحكم <span className="text-primary font-semibold">S.N.A العطال</span> للصناعات الهندسية
          </p>
        </div>

        {/* Gold Divider */}
        <div className="flex items-center gap-4 mt-4">
          <div className="h-0.5 w-16 bg-primary" />
          <div className="h-0.5 w-8 bg-primary/50" />
          <div className="h-0.5 w-4 bg-primary/25" />
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard
          title="إجمالي المنتجات"
          value={stats.products}
          icon={Package}
          trend={{ value: 12, isPositive: true }}
          description="هذا الشهر"
        />
        <StatsCard
          title="العملاء"
          value={stats.clients}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
          description="هذا الشهر"
        />
        <StatsCard
          title="الرسائل الجديدة"
          value={stats.messages.unread}
          icon={MessageSquare}
          description={`من ${stats.messages.total} رسالة`}
        />
        <StatsCard
          title="تحميلات الكتالوج"
          value={stats.downloads}
          icon={FileText}
          trend={{ value: 23, isPositive: true }}
          description="هذا الشهر"
        />
      </motion.div>

      {/* Quick Links & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white border-2 border-metal-200 h-full relative">
            {/* Gold Accent Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

            <div className="p-6">
              <h2 className="text-lg font-bold text-steel-900 uppercase tracking-wider mb-4">روابط سريعة</h2>
              <div className="space-y-2">
                {quickLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-steel-700 hover:text-primary hover:bg-primary/5 rounded-none border-r-2 border-transparent hover:border-primary"
                    >
                      <span className="flex items-center gap-3">
                        <div className="p-1.5 bg-primary/10 border border-primary/20">
                          <link.icon size={16} className="text-primary" />
                        </div>
                        {link.label}
                      </span>
                      <ArrowLeft size={16} />
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="bg-white border-2 border-metal-200 h-full relative">
            {/* Gold Accent Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-steel-900 uppercase tracking-wider">النشاط الأخير</h2>
                <Link href="/admin/activity">
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 rounded-none">
                    عرض الكل
                  </Button>
                </Link>
              </div>

              {recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-3 bg-metal-50 border border-metal-100 hover:border-primary/30 transition-colors"
                    >
                      <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Clock className="text-primary" size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-steel-900 text-sm">
                          <span className="text-primary font-semibold">{activity.action}</span>{' '}
                          {activity.entity}: {activity.entityName}
                        </p>
                        <p className="text-metal-500 text-xs flex items-center gap-1 mt-1">
                          <Calendar size={12} />
                          {new Date(activity.createdAt).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-metal-500">
                  <Clock className="mx-auto mb-2 opacity-50" size={40} />
                  <p className="uppercase tracking-wider text-sm">لا يوجد نشاط حديث</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Messages Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="bg-white border-2 border-metal-200 relative">
          {/* Gold Accent Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-steel-900 uppercase tracking-wider">آخر الرسائل</h2>
              <Link href="/admin/messages">
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 rounded-none">
                  عرض الكل
                </Button>
              </Link>
            </div>

            {recentMessages.length > 0 ? (
              <div className="space-y-3">
                {recentMessages.map((message) => (
                  <Link key={message.id} href={`/admin/messages?id=${message.id}`}>
                    <div className={`flex items-center gap-4 p-3 border transition-colors cursor-pointer ${
                      message.isRead
                        ? 'bg-metal-50 border-metal-100 hover:border-primary/30'
                        : 'bg-primary/5 border-primary/20 hover:border-primary/50'
                    }`}>
                      <div className={`w-10 h-10 border flex items-center justify-center ${
                        message.isRead
                          ? 'bg-metal-100 border-metal-200'
                          : 'bg-primary/10 border-primary/20'
                      }`}>
                        <MessageSquare className={message.isRead ? 'text-metal-500' : 'text-primary'} size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-steel-900 text-sm font-medium truncate">
                          {message.subject || 'بدون عنوان'}
                        </p>
                        <p className="text-metal-500 text-xs truncate">
                          من: {message.name} - {message.email}
                        </p>
                        <p className="text-metal-400 text-xs flex items-center gap-1 mt-1">
                          <Calendar size={12} />
                          {new Date(message.createdAt).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      {!message.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-metal-500 bg-metal-50 border border-metal-100">
                <MessageSquare className="mx-auto mb-2 opacity-50" size={40} />
                <p className="uppercase tracking-wider text-sm">لا توجد رسائل جديدة</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white border-2 border-metal-200 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 border border-green-200 flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 animate-pulse" />
              </div>
              <div>
                <p className="text-steel-900 font-bold uppercase tracking-wider">حالة النظام</p>
                <p className="text-green-600 text-sm font-semibold">يعمل بشكل طبيعي</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-metal-200 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Eye className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-steel-900 font-bold uppercase tracking-wider">زيارات اليوم</p>
                <p className="text-metal-500 text-sm">قريباً</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-metal-200 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center">
                <TrendingUp className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-steel-900 font-bold uppercase tracking-wider">أداء الموقع</p>
                <p className="text-metal-500 text-sm">ممتاز</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

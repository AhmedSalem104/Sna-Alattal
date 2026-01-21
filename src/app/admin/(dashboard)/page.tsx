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
} from 'lucide-react';
import { StatsCard } from '@/components/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    clients: 0,
    messages: { total: 0, unread: 0 },
    downloads: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setRecentActivities(data.recentActivities || []);
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
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          مرحباً، {session?.user?.name}
        </h1>
        <p className="text-gray-600">
          مرحباً بك في لوحة تحكم S.N.A العطال للصناعات الهندسية
        </p>
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
          <Card className="bg-gray-50 border-gray-200 h-full">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">روابط سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-gray-700 hover:text-primary hover:bg-gray-100"
                  >
                    <span className="flex items-center gap-3">
                      <link.icon size={18} className="text-primary" />
                      {link.label}
                    </span>
                    <ArrowLeft size={16} />
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="bg-gray-50 border-gray-200 h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-gray-900">النشاط الأخير</CardTitle>
              <Link href="/admin/activity">
                <Button variant="ghost" size="sm" className="text-primary">
                  عرض الكل
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-white hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Clock className="text-primary" size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 text-sm">
                          <span className="text-primary">{activity.action}</span>{' '}
                          {activity.entity}: {activity.entityName}
                        </p>
                        <p className="text-gray-600 text-xs flex items-center gap-1 mt-1">
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
                <div className="text-center py-8 text-gray-600">
                  <Clock className="mx-auto mb-2 opacity-50" size={40} />
                  <p>لا يوجد نشاط حديث</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Messages Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-gray-900">آخر الرسائل</CardTitle>
            <Link href="/admin/messages">
              <Button variant="ghost" size="sm" className="text-primary">
                عرض الكل
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-600">
              <MessageSquare className="mx-auto mb-2 opacity-50" size={40} />
              <p>لا توجد رسائل جديدة</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div>
                <p className="text-gray-900 font-medium">حالة النظام</p>
                <p className="text-green-400 text-sm">يعمل بشكل طبيعي</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Eye className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-gray-900 font-medium">زيارات اليوم</p>
                <p className="text-gray-600 text-sm">قريباً</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingUp className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-gray-900 font-medium">أداء الموقع</p>
                <p className="text-gray-600 text-sm">ممتاز</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

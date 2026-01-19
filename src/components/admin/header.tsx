'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bell, Search, Plus, ChevronLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MobileSidebar } from './sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const pageTitles: Record<string, string> = {
  '/admin': 'الرئيسية',
  '/admin/products': 'المنتجات',
  '/admin/products/new': 'إضافة منتج جديد',
  '/admin/categories': 'التصنيفات',
  '/admin/categories/new': 'إضافة تصنيف جديد',
  '/admin/solutions': 'الحلول',
  '/admin/solutions/new': 'إضافة حل جديد',
  '/admin/clients': 'العملاء',
  '/admin/clients/new': 'إضافة عميل جديد',
  '/admin/team': 'فريق العمل',
  '/admin/team/new': 'إضافة عضو جديد',
  '/admin/certificates': 'الشهادات',
  '/admin/certificates/new': 'إضافة شهادة جديدة',
  '/admin/exhibitions': 'المعارض',
  '/admin/exhibitions/new': 'إضافة معرض جديد',
  '/admin/tv-interviews': 'المقابلات التلفزيونية',
  '/admin/tv-interviews/new': 'إضافة مقابلة جديدة',
  '/admin/news': 'الأخبار',
  '/admin/news/new': 'إضافة خبر جديد',
  '/admin/slides': 'السلايدر',
  '/admin/slides/new': 'إضافة شريحة جديدة',
  '/admin/catalogues': 'الكتالوجات',
  '/admin/catalogues/new': 'إضافة كتالوج جديد',
  '/admin/messages': 'الرسائل',
  '/admin/pages': 'الصفحات',
  '/admin/pages/new': 'إضافة صفحة جديدة',
  '/admin/trash': 'سلة المحذوفات',
  '/admin/settings': 'الإعدادات',
};

const quickActions = [
  { label: 'منتج جديد', href: '/admin/products/new' },
  { label: 'خبر جديد', href: '/admin/news/new' },
  { label: 'عميل جديد', href: '/admin/clients/new' },
  { label: 'شريحة جديدة', href: '/admin/slides/new' },
];

interface HeaderProps {
  isCollapsed: boolean;
}

export function Header({ isCollapsed }: HeaderProps) {
  const pathname = usePathname();

  const getPageTitle = () => {
    // Check for exact match first
    if (pageTitles[pathname]) {
      return pageTitles[pathname];
    }

    // Check for edit pages (e.g., /admin/products/123)
    const segments = pathname.split('/');
    if (segments.length === 4 && segments[3] !== 'new') {
      const basePath = `/${segments[1]}/${segments[2]}`;
      const baseTitle = pageTitles[basePath];
      if (baseTitle) {
        return `تعديل ${baseTitle.slice(0, -1)}`;
      }
    }

    return 'لوحة التحكم';
  };

  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    let path = '';

    for (const segment of segments) {
      path += `/${segment}`;
      const title = pageTitles[path];
      if (title) {
        breadcrumbs.push({ label: title, href: path });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 h-16 bg-dark border-b border-white/10 flex items-center justify-between px-6">
      {/* Right Side - Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <MobileSidebar />

        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-2 text-sm">
          <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
            <Home size={16} />
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-2">
              <ChevronLeft size={14} className="text-gray-600" />
              {index === breadcrumbs.length - 1 ? (
                <span className="text-white font-medium">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-gray-400 hover:text-white transition-colors">
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Title */}
        <h1 className="md:hidden text-lg font-bold text-white">{getPageTitle()}</h1>
      </div>

      {/* Left Side - Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden lg:block relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="بحث..."
            className="w-64 pr-10 bg-dark-50 border-white/10 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Quick Add */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="gold" size="sm" className="hidden sm:flex">
              <Plus size={16} className="ml-1" />
              إضافة جديد
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-dark-50 border-white/10">
            <DropdownMenuLabel className="text-gray-400">إضافة سريعة</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            {quickActions.map((action) => (
              <DropdownMenuItem key={action.href} asChild>
                <Link href={action.href} className="text-white hover:text-primary cursor-pointer">
                  {action.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
              <Bell size={20} />
              <span className="absolute top-1 left-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-dark-50 border-white/10">
            <DropdownMenuLabel className="text-gray-400">الإشعارات</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <div className="p-4 text-center text-gray-400 text-sm">
              لا توجد إشعارات جديدة
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Visit Site */}
        <Link href="/" target="_blank">
          <Button variant="outline" size="sm" className="hidden sm:flex border-white/20 text-gray-300 hover:text-white">
            زيارة الموقع
          </Button>
        </Link>
      </div>
    </header>
  );
}

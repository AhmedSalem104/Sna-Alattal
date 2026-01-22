'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  Search,
  Plus,
  ChevronLeft,
  Home,
  ExternalLink,
  Package,
  Newspaper,
  Users,
  ImageIcon,
  RefreshCw,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MobileSidebar } from './sidebar';
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
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

const pageTitles: Record<string, string> = {
  '/admin': 'لوحة التحكم',
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
  { label: 'منتج جديد', href: '/admin/products/new', icon: Package },
  { label: 'خبر جديد', href: '/admin/news/new', icon: Newspaper },
  { label: 'عميل جديد', href: '/admin/clients/new', icon: Users },
  { label: 'شريحة جديدة', href: '/admin/slides/new', icon: ImageIcon },
];

const searchCommands = [
  { group: 'الصفحات', items: [
    { label: 'لوحة التحكم', href: '/admin', icon: Home },
    { label: 'المنتجات', href: '/admin/products', icon: Package },
    { label: 'العملاء', href: '/admin/clients', icon: Users },
    { label: 'الأخبار', href: '/admin/news', icon: Newspaper },
  ]},
  { group: 'الإجراءات السريعة', items: quickActions },
];

interface HeaderProps {
  isCollapsed: boolean;
}

export function Header({ isCollapsed }: HeaderProps) {
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getPageTitle = () => {
    if (pageTitles[pathname]) {
      return pageTitles[pathname];
    }

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="h-16 flex items-center justify-between px-4 sm:px-6">
          {/* Right Side - Mobile Menu & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <MobileSidebar />

            {/* Breadcrumbs - Desktop */}
            <nav className="hidden md:flex items-center gap-2 text-sm">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-gray-100"
              >
                <Home size={16} />
                <span className="hidden lg:inline">الرئيسية</span>
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center gap-2">
                  <ChevronLeft size={14} className="text-gray-400 rtl:rotate-180" />
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-gray-900 font-semibold bg-primary/10 px-3 py-1 rounded-full">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-gray-500 hover:text-primary transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile Title */}
            <h1 className="md:hidden text-lg font-bold text-gray-900">{getPageTitle()}</h1>
          </div>

          {/* Left Side - Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCommandOpen(true)}
              className="hidden sm:flex items-center gap-2 text-gray-500 border-gray-200 hover:border-primary/50 hover:bg-gray-50 w-48 lg:w-64 justify-start"
            >
              <Search size={16} />
              <span className="text-gray-400">بحث سريع...</span>
              <kbd className="mr-auto hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] text-gray-500">
                ⌘K
              </kbd>
            </Button>

            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCommandOpen(true)}
              className="sm:hidden text-gray-500 hover:text-primary"
            >
              <Search size={20} />
            </Button>

            {/* Refresh */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-gray-500 hover:text-primary hover:bg-gray-100"
            >
              <RefreshCw size={18} className={cn(isRefreshing && 'animate-spin')} />
            </Button>

            {/* Quick Add */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="hidden sm:flex bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-slate-900 font-medium shadow-md shadow-primary/20"
                >
                  <Plus size={16} className="ml-1.5 rtl:ml-0 rtl:mr-1.5" />
                  إضافة جديد
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-white border-gray-200 shadow-xl">
                <DropdownMenuLabel className="text-gray-500 text-xs uppercase tracking-wider">
                  إضافة سريعة
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100" />
                {quickActions.map((action) => (
                  <DropdownMenuItem key={action.href} asChild>
                    <Link
                      href={action.href}
                      className="flex items-center gap-3 text-gray-700 hover:text-primary cursor-pointer py-2.5"
                    >
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <action.icon size={16} className="text-primary" />
                      </div>
                      {action.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Add */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  className="sm:hidden bg-primary hover:bg-primary/90 text-slate-900"
                >
                  <Plus size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-white border-gray-200">
                {quickActions.map((action) => (
                  <DropdownMenuItem key={action.href} asChild>
                    <Link href={action.href} className="flex items-center gap-3">
                      <action.icon size={16} className="text-primary" />
                      {action.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-500 hover:text-primary hover:bg-gray-100"
                >
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 rtl:right-auto rtl:left-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white border-gray-200 shadow-xl">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">الإشعارات</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                    3 جديدة
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100" />
                <div className="max-h-80 overflow-y-auto">
                  {/* Notification Items */}
                  <div className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Package size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">منتج جديد تمت إضافته</p>
                        <p className="text-xs text-gray-500 mt-0.5">منذ 5 دقائق</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-green-100">
                        <Users size={16} className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">رسالة جديدة من عميل</p>
                        <p className="text-xs text-gray-500 mt-0.5">منذ 15 دقيقة</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-purple-100">
                        <Newspaper size={16} className="text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">تم نشر خبر جديد</p>
                        <p className="text-xs text-gray-500 mt-0.5">منذ ساعة</p>
                      </div>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-gray-100" />
                <div className="p-2">
                  <Button variant="ghost" size="sm" className="w-full text-primary hover:bg-primary/10">
                    عرض كل الإشعارات
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Visit Site */}
            <Link href="/" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="hidden lg:flex items-center gap-2 border-gray-200 text-gray-600 hover:text-primary hover:border-primary/50"
              >
                <ExternalLink size={14} />
                زيارة الموقع
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Command Palette */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="ابحث عن صفحة أو إجراء..." className="text-right" />
        <CommandList>
          <CommandEmpty>لا توجد نتائج</CommandEmpty>
          {searchCommands.map((group) => (
            <CommandGroup key={group.group} heading={group.group}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.href}
                  onSelect={() => {
                    setCommandOpen(false);
                    window.location.href = item.href;
                  }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <item.icon size={16} className="text-gray-500" />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}

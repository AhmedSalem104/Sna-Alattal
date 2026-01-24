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
  X,
  Cog,
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
      <header className="sticky top-0 z-30 bg-white border-b-2 border-metal-200 shadow-sm">
        {/* Top Gold Accent Line */}
        <div className="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary" />

        <div className="h-16 flex items-center justify-between px-4 sm:px-6">
          {/* Right Side - Mobile Menu & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <MobileSidebar />

            {/* Breadcrumbs - Desktop */}
            <nav className="hidden md:flex items-center gap-2 text-sm">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-metal-500 hover:text-primary transition-colors p-1.5 hover:bg-metal-100"
              >
                <Home size={16} />
                <span className="hidden lg:inline">الرئيسية</span>
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center gap-2">
                  <ChevronLeft size={14} className="text-metal-400 rtl:rotate-180" />
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-steel-900 font-bold uppercase tracking-wider bg-primary/10 px-3 py-1 border-l-2 border-primary">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-metal-500 hover:text-primary transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile Title */}
            <h1 className="md:hidden text-lg font-bold text-steel-900 uppercase tracking-wider">{getPageTitle()}</h1>
          </div>

          {/* Left Side - Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCommandOpen(true)}
              className="hidden sm:flex items-center gap-2 text-metal-500 border-metal-200 hover:border-primary/50 hover:bg-metal-50 w-48 lg:w-64 justify-start rounded-none"
            >
              <Search size={16} />
              <span className="text-metal-400">بحث سريع...</span>
              <kbd className="mr-auto hidden lg:inline-flex h-5 items-center gap-1 border border-metal-200 bg-metal-100 px-1.5 font-mono text-[10px] text-metal-500">
                ⌘K
              </kbd>
            </Button>

            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCommandOpen(true)}
              className="sm:hidden text-metal-500 hover:text-primary rounded-none"
            >
              <Search size={20} />
            </Button>

            {/* Refresh */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-metal-500 hover:text-primary hover:bg-metal-100 rounded-none"
            >
              <RefreshCw size={18} className={cn(isRefreshing && 'animate-spin')} />
            </Button>

            {/* Quick Add */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="industrial"
                  size="sm"
                  className="hidden sm:flex"
                >
                  <Plus size={16} className="ml-1.5 rtl:ml-0 rtl:mr-1.5" />
                  إضافة جديد
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-white border-2 border-metal-200 shadow-xl rounded-none">
                <DropdownMenuLabel className="text-metal-500 text-xs uppercase tracking-widest font-bold">
                  إضافة سريعة
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-metal-200" />
                {quickActions.map((action) => (
                  <DropdownMenuItem key={action.href} asChild>
                    <Link
                      href={action.href}
                      className="flex items-center gap-3 text-steel-700 hover:text-primary cursor-pointer py-2.5 rounded-none"
                    >
                      <div className="p-1.5 bg-primary/10 border border-primary/20">
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
                  variant="industrial"
                  size="icon"
                  className="sm:hidden"
                >
                  <Plus size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-white border-2 border-metal-200 rounded-none">
                {quickActions.map((action) => (
                  <DropdownMenuItem key={action.href} asChild>
                    <Link href={action.href} className="flex items-center gap-3 rounded-none">
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
                  className="relative text-metal-500 hover:text-primary hover:bg-metal-100 rounded-none"
                >
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 rtl:right-auto rtl:left-1.5 w-2 h-2 bg-red-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white border-2 border-metal-200 shadow-xl rounded-none">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span className="text-steel-700 font-bold uppercase tracking-wider">الإشعارات</span>
                  <Badge variant="industrial" className="text-xs">
                    3 جديدة
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-metal-200" />
                <div className="max-h-80 overflow-y-auto">
                  {/* Notification Items */}
                  <div className="p-3 hover:bg-metal-50 cursor-pointer border-b border-metal-100">
                    <div className="flex gap-3">
                      <div className="p-2 bg-blue-100 border border-blue-200">
                        <Package size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-steel-900">منتج جديد تمت إضافته</p>
                        <p className="text-xs text-metal-500 mt-0.5">منذ 5 دقائق</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-metal-50 cursor-pointer border-b border-metal-100">
                    <div className="flex gap-3">
                      <div className="p-2 bg-green-100 border border-green-200">
                        <Users size={16} className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-steel-900">رسالة جديدة من عميل</p>
                        <p className="text-xs text-metal-500 mt-0.5">منذ 15 دقيقة</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-metal-50 cursor-pointer">
                    <div className="flex gap-3">
                      <div className="p-2 bg-purple-100 border border-purple-200">
                        <Newspaper size={16} className="text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-steel-900">تم نشر خبر جديد</p>
                        <p className="text-xs text-metal-500 mt-0.5">منذ ساعة</p>
                      </div>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-metal-200" />
                <div className="p-2">
                  <Button variant="ghost" size="sm" className="w-full text-primary hover:bg-primary/10 rounded-none">
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
                className="hidden lg:flex items-center gap-2 border-metal-200 text-metal-600 hover:text-primary hover:border-primary/50 rounded-none"
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
                  <item.icon size={16} className="text-metal-500" />
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

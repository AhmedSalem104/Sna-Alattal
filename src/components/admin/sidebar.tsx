'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Lightbulb,
  Users,
  Award,
  CalendarDays,
  Tv,
  Newspaper,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const menuItems = [
  { title: 'الرئيسية', href: '/admin', icon: LayoutDashboard },
  { title: 'المنتجات', href: '/admin/products', icon: Package },
  { title: 'التصنيفات', href: '/admin/categories', icon: FolderTree },
  { title: 'الحلول', href: '/admin/solutions', icon: Lightbulb },
  { title: 'العملاء', href: '/admin/clients', icon: Users },
  { title: 'فريق العمل', href: '/admin/team', icon: UserCircle },
  { title: 'الشهادات', href: '/admin/certificates', icon: Award },
  { title: 'المعارض', href: '/admin/exhibitions', icon: CalendarDays },
  { title: 'المقابلات التلفزيونية', href: '/admin/tv-interviews', icon: Tv },
  { title: 'الأخبار', href: '/admin/news', icon: Newspaper },
  { title: 'السلايدر', href: '/admin/slides', icon: ImageIcon },
  { title: 'الكتالوجات', href: '/admin/catalogues', icon: FileText },
  { title: 'الرسائل', href: '/admin/messages', icon: MessageSquare },
  { title: 'الصفحات', href: '/admin/pages', icon: FileText },
];

const bottomMenuItems = [
  { title: 'سلة المحذوفات', href: '/admin/trash', icon: Trash2 },
  { title: 'الإعدادات', href: '/admin/settings', icon: Settings },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed top-0 right-0 z-40 h-screen bg-dark-50 border-l border-white/10 transition-all duration-300 flex flex-col',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          {!isCollapsed && (
            <Link href="/admin" className="flex items-center gap-3">
              <Image
                src="/images/logo.jpg"
                alt="S.N.A"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="font-bold text-white">لوحة التحكم</span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/admin" className="mx-auto">
              <Image
                src="/images/logo.jpg"
                alt="S.N.A"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn('text-gray-400 hover:text-white', isCollapsed && 'hidden')}
          >
            <ChevronRight size={20} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                        isActive(item.href)
                          ? 'bg-primary text-dark font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-white/5',
                        isCollapsed && 'justify-center'
                      )}
                    >
                      <item.icon size={20} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="left" className="bg-dark-50 border-white/10">
                      <p>{item.title}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </li>
            ))}
          </ul>

          {/* Separator */}
          <div className="my-4 border-t border-white/10" />

          {/* Bottom Menu */}
          <ul className="space-y-1">
            {bottomMenuItems.map((item) => (
              <li key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                        isActive(item.href)
                          ? 'bg-primary text-dark font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-white/5',
                        isCollapsed && 'justify-center'
                      )}
                    >
                      <item.icon size={20} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="left" className="bg-dark-50 border-white/10">
                      <p>{item.title}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <UserCircle className="text-primary" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {session?.user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="text-gray-400 hover:text-red-400"
              >
                <LogOut size={18} />
              </Button>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="w-full text-gray-400 hover:text-red-400"
                >
                  <LogOut size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-dark-50 border-white/10">
                <p>تسجيل الخروج</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Collapse Toggle (shown when collapsed) */}
        {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="absolute top-4 -left-3 w-6 h-6 rounded-full bg-dark-50 border border-white/10 text-gray-400 hover:text-white"
          >
            <ChevronLeft size={14} />
          </Button>
        )}
      </aside>
    </TooltipProvider>
  );
}

// Mobile Sidebar
export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="lg:hidden text-gray-400"
      >
        <Menu size={24} />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 right-0 z-50 h-screen w-64 bg-dark-50 border-l border-white/10 transition-transform duration-300 lg:hidden flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <Image
              src="/images/logo.jpg"
              alt="S.N.A"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="font-bold text-white">لوحة التحكم</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-primary text-dark font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <item.icon size={20} />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="my-4 border-t border-white/10" />

          <ul className="space-y-1">
            {bottomMenuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-primary text-dark font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <item.icon size={20} />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <UserCircle className="text-primary" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {session?.user?.email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="text-gray-400 hover:text-red-400"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

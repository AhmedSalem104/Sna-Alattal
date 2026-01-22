'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  Search,
  Pin,
  PinOff,
  ChevronDown,
  Star,
  Clock,
  Sparkles,
  Building2,
  GalleryHorizontalEnd,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

// Menu categories with items
const menuCategories = [
  {
    id: 'main',
    title: 'الرئيسية',
    icon: LayoutDashboard,
    items: [
      { title: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard, badge: null },
    ],
  },
  {
    id: 'content',
    title: 'إدارة المحتوى',
    icon: Package,
    items: [
      { title: 'المنتجات', href: '/admin/products', icon: Package, badge: null },
      { title: 'التصنيفات', href: '/admin/categories', icon: FolderTree, badge: null },
      { title: 'الحلول', href: '/admin/solutions', icon: Lightbulb, badge: null },
      { title: 'الأخبار', href: '/admin/news', icon: Newspaper, badge: null },
      { title: 'السلايدر', href: '/admin/slides', icon: ImageIcon, badge: null },
      { title: 'الصفحات', href: '/admin/pages', icon: FileText, badge: null },
    ],
  },
  {
    id: 'company',
    title: 'الشركة',
    icon: Building2,
    items: [
      { title: 'العملاء', href: '/admin/clients', icon: Users, badge: null },
      { title: 'فريق العمل', href: '/admin/team', icon: UserCircle, badge: null },
      { title: 'الشهادات', href: '/admin/certificates', icon: Award, badge: null },
    ],
  },
  {
    id: 'media',
    title: 'الوسائط والفعاليات',
    icon: GalleryHorizontalEnd,
    items: [
      { title: 'المعارض', href: '/admin/exhibitions', icon: CalendarDays, badge: null },
      { title: 'المقابلات التلفزيونية', href: '/admin/tv-interviews', icon: Tv, badge: null },
      { title: 'الكتالوجات', href: '/admin/catalogues', icon: BookOpen, badge: null },
    ],
  },
  {
    id: 'communication',
    title: 'التواصل',
    icon: MessageSquare,
    items: [
      { title: 'الرسائل', href: '/admin/messages', icon: MessageSquare, badge: 'new' },
    ],
  },
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
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['main', 'content']);
  const [pinnedItems, setPinnedItems] = useState<string[]>([]);
  const [recentItems, setRecentItems] = useState<string[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Load saved states from localStorage
  useEffect(() => {
    const savedPinned = localStorage.getItem('sidebar_pinned');
    const savedRecent = localStorage.getItem('sidebar_recent');
    const savedExpanded = localStorage.getItem('sidebar_expanded');

    if (savedPinned) setPinnedItems(JSON.parse(savedPinned));
    if (savedRecent) setRecentItems(JSON.parse(savedRecent));
    if (savedExpanded) setExpandedCategories(JSON.parse(savedExpanded));
  }, []);

  // Fetch unread messages count
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/admin/messages?count=true');
        if (res.ok) {
          const data = await res.json();
          setUnreadMessages(data.unread || 0);
        }
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Track recent items
  useEffect(() => {
    if (pathname && pathname !== '/admin') {
      setRecentItems(prev => {
        const filtered = prev.filter(item => item !== pathname);
        const newRecent = [pathname, ...filtered].slice(0, 5);
        localStorage.setItem('sidebar_recent', JSON.stringify(newRecent));
        return newRecent;
      });
    }
  }, [pathname]);

  const isActive = useCallback((href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  }, [pathname]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const newExpanded = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
      localStorage.setItem('sidebar_expanded', JSON.stringify(newExpanded));
      return newExpanded;
    });
  }, []);

  const togglePin = useCallback((href: string) => {
    setPinnedItems(prev => {
      const newPinned = prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href];
      localStorage.setItem('sidebar_pinned', JSON.stringify(newPinned));
      return newPinned;
    });
  }, []);

  // Filter menu items based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return menuCategories;

    return menuCategories.map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    })).filter(category => category.items.length > 0);
  }, [searchQuery]);

  // Get item title from href
  const getItemTitle = useCallback((href: string) => {
    for (const category of menuCategories) {
      const item = category.items.find(i => i.href === href);
      if (item) return item.title;
    }
    for (const item of bottomMenuItems) {
      if (item.href === href) return item.title;
    }
    return href;
  }, []);

  // Get item icon from href
  const getItemIcon = useCallback((href: string) => {
    for (const category of menuCategories) {
      const item = category.items.find(i => i.href === href);
      if (item) return item.icon;
    }
    for (const item of bottomMenuItems) {
      if (item.href === href) return item.icon;
    }
    return FileText;
  }, []);

  // Expanded state based on hover or actual state
  const isExpanded = !isCollapsed || isHovering;

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        onMouseEnter={() => isCollapsed && setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          'fixed top-0 right-0 z-40 h-screen transition-all duration-300 flex flex-col',
          'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900',
          'border-l border-slate-700/50',
          'shadow-2xl shadow-black/20',
          isExpanded ? 'w-72' : 'w-20'
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50 bg-slate-900/50">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3"
              >
                <Link href="/admin" className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src="/images/logo.jpg"
                      alt="S.N.A"
                      width={42}
                      height={42}
                      className="rounded-xl ring-2 ring-primary/30"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-lg">لوحة التحكم</span>
                    <p className="text-xs text-slate-400">S.N.A Al-Attal</p>
                  </div>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mx-auto"
              >
                <Link href="/admin">
                  <Image
                    src="/images/logo.jpg"
                    alt="S.N.A"
                    width={42}
                    height={42}
                    className="rounded-xl ring-2 ring-primary/30"
                  />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {isExpanded && !isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <ChevronRight size={18} />
            </Button>
          )}
        </div>

        {/* Search Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-3 border-b border-slate-700/50"
            >
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث في القائمة..."
                  className="w-full pr-9 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-primary/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pinned Items */}
        <AnimatePresence>
          {isExpanded && pinnedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 py-2 border-b border-slate-700/50"
            >
              <div className="flex items-center gap-2 px-2 mb-2">
                <Star size={12} className="text-primary" />
                <span className="text-xs font-medium text-slate-400">المثبتة</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {pinnedItems.map((href) => {
                  const Icon = getItemIcon(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all',
                        isActive(href)
                          ? 'bg-primary text-slate-900 font-medium'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
                      )}
                    >
                      <Icon size={14} />
                      {getItemTitle(href)}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Items */}
        <AnimatePresence>
          {isExpanded && recentItems.length > 0 && !searchQuery && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 py-2 border-b border-slate-700/50"
            >
              <div className="flex items-center gap-2 px-2 mb-2">
                <Clock size={12} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-400">الأخيرة</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {recentItems.slice(0, 3).map((href) => {
                  const Icon = getItemIcon(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-all',
                        isActive(href)
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                      )}
                    >
                      <Icon size={12} />
                      {getItemTitle(href)}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 custom-scrollbar">
          {/* Categories */}
          {filteredCategories.map((category) => (
            <div key={category.id} className="mb-2">
              {isExpanded ? (
                <Collapsible
                  open={expandedCategories.includes(category.id) || !!searchQuery}
                  onOpenChange={() => !searchQuery && toggleCategory(category.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/30 transition-colors">
                      <div className="flex items-center gap-2">
                        <category.icon size={16} />
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          {category.title}
                        </span>
                      </div>
                      <ChevronDown
                        size={14}
                        className={cn(
                          'transition-transform duration-200',
                          expandedCategories.includes(category.id) && 'rotate-180'
                        )}
                      />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <motion.ul
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 space-y-0.5"
                    >
                      {category.items.map((item) => (
                        <li key={item.href} className="group relative">
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                              isActive(item.href)
                                ? 'bg-gradient-to-l from-primary/20 to-primary/5 text-primary border-r-2 border-primary'
                                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                            )}
                          >
                            <item.icon size={18} className={cn(
                              isActive(item.href) ? 'text-primary' : 'text-slate-400 group-hover:text-slate-200'
                            )} />
                            <span className="flex-1">{item.title}</span>

                            {/* Badge for messages */}
                            {item.href === '/admin/messages' && unreadMessages > 0 && (
                              <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 min-w-[20px] h-5 flex items-center justify-center">
                                {unreadMessages}
                              </Badge>
                            )}

                            {/* Pin button */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                togglePin(item.href);
                              }}
                              className={cn(
                                'opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-600',
                                pinnedItems.includes(item.href) && 'opacity-100 text-primary'
                              )}
                            >
                              {pinnedItems.includes(item.href) ? (
                                <PinOff size={14} />
                              ) : (
                                <Pin size={14} />
                              )}
                            </button>
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                // Collapsed view - show only icons
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li key={item.href}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center justify-center p-3 rounded-lg transition-all duration-200 relative',
                              isActive(item.href)
                                ? 'bg-primary/20 text-primary'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                            )}
                          >
                            <item.icon size={20} />
                            {item.href === '/admin/messages' && unreadMessages > 0 && (
                              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            )}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="bg-slate-800 border-slate-700 text-white">
                          <p>{item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Separator */}
          <div className="my-3 border-t border-slate-700/50" />

          {/* Bottom Menu */}
          <ul className="space-y-1">
            {bottomMenuItems.map((item) => (
              <li key={item.href}>
                {isExpanded ? (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                      isActive(item.href)
                        ? 'bg-gradient-to-l from-primary/20 to-primary/5 text-primary border-r-2 border-primary'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    )}
                  >
                    <item.icon size={18} className={cn(
                      isActive(item.href) ? 'text-primary' : 'text-slate-400'
                    )} />
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center justify-center p-3 rounded-lg transition-all duration-200',
                          isActive(item.href)
                            ? 'bg-primary/20 text-primary'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        )}
                      >
                        <item.icon size={20} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-slate-800 border-slate-700 text-white">
                      <p>{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
          {isExpanded ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                  <UserCircle className="text-primary" size={24} />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session?.user?.name || 'مدير النظام'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {session?.user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="text-slate-400 hover:text-red-400 hover:bg-red-400/10"
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
                  className="w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                >
                  <LogOut size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-slate-800 border-slate-700 text-white">
                <p>تسجيل الخروج</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Collapse Toggle (shown when collapsed and not hovering) */}
        {isCollapsed && !isHovering && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="absolute top-4 -left-3 w-6 h-6 rounded-full bg-slate-800 border border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700"
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
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['main', 'content']);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return menuCategories;

    return menuCategories.map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    })).filter(category => category.items.length > 0);
  }, [searchQuery]);

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="lg:hidden text-slate-600 hover:text-primary"
      >
        <Menu size={24} />
      </Button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-screen w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-l border-slate-700/50 lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50 bg-slate-900/50">
              <Link href="/admin" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                <div className="relative">
                  <Image
                    src="/images/logo.jpg"
                    alt="S.N.A"
                    width={42}
                    height={42}
                    className="rounded-xl ring-2 ring-primary/30"
                  />
                </div>
                <div>
                  <span className="font-bold text-white">لوحة التحكم</span>
                  <p className="text-xs text-slate-400">S.N.A Al-Attal</p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-slate-700/50">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث في القائمة..."
                  className="w-full pr-9 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-3 px-3">
              {filteredCategories.map((category) => (
                <div key={category.id} className="mb-2">
                  <Collapsible
                    open={expandedCategories.includes(category.id) || !!searchQuery}
                    onOpenChange={() => !searchQuery && toggleCategory(category.id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/30">
                        <div className="flex items-center gap-2">
                          <category.icon size={16} />
                          <span className="text-xs font-semibold uppercase tracking-wider">
                            {category.title}
                          </span>
                        </div>
                        <ChevronDown
                          size={14}
                          className={cn(
                            'transition-transform',
                            expandedCategories.includes(category.id) && 'rotate-180'
                          )}
                        />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="mt-1 space-y-0.5">
                        {category.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                                isActive(item.href)
                                  ? 'bg-gradient-to-l from-primary/20 to-primary/5 text-primary border-r-2 border-primary'
                                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                              )}
                            >
                              <item.icon size={18} className={cn(
                                isActive(item.href) ? 'text-primary' : 'text-slate-400'
                              )} />
                              <span>{item.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}

              <div className="my-3 border-t border-slate-700/50" />

              <ul className="space-y-1">
                {bottomMenuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                        isActive(item.href)
                          ? 'bg-gradient-to-l from-primary/20 to-primary/5 text-primary border-r-2 border-primary'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      )}
                    >
                      <item.icon size={18} className={cn(
                        isActive(item.href) ? 'text-primary' : 'text-slate-400'
                      )} />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <UserCircle className="text-primary" size={24} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {session?.user?.name || 'مدير النظام'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {session?.user?.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

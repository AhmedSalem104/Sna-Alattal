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
  Settings,
  LogOut,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Menu,
  X,
  Search,
  ChevronDown,
  Building2,
  GalleryHorizontalEnd,
  BookOpen,
  Pin,
  PinOff,
  ChevronsDownUp,
  ChevronsUpDown,
  Cog,
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
      { title: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    id: 'content',
    title: 'إدارة المحتوى',
    icon: Package,
    items: [
      { title: 'المنتجات', href: '/admin/products', icon: Package },
      { title: 'التصنيفات', href: '/admin/categories', icon: FolderTree },
      { title: 'الحلول', href: '/admin/solutions', icon: Lightbulb },
      { title: 'الأخبار', href: '/admin/news', icon: Newspaper },
      { title: 'السلايدر', href: '/admin/slides', icon: ImageIcon },
    ],
  },
  {
    id: 'company',
    title: 'الشركة',
    icon: Building2,
    items: [
      { title: 'العملاء', href: '/admin/clients', icon: Users },
      { title: 'فريق العمل', href: '/admin/team', icon: UserCircle },
      { title: 'الشهادات', href: '/admin/certificates', icon: Award },
    ],
  },
  {
    id: 'media',
    title: 'الوسائط والفعاليات',
    icon: GalleryHorizontalEnd,
    items: [
      { title: 'المعارض', href: '/admin/exhibitions', icon: CalendarDays },
      { title: 'المقابلات التلفزيونية', href: '/admin/tv-interviews', icon: Tv },
      { title: 'الكتالوجات', href: '/admin/catalogues', icon: BookOpen },
    ],
  },
  {
    id: 'communication',
    title: 'التواصل',
    icon: MessageSquare,
    items: [
      { title: 'الرسائل', href: '/admin/messages', icon: MessageSquare, hasBadge: true },
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
  isPinned: boolean;
  onPinToggle: () => void;
  isHovering?: boolean;
}

export function Sidebar({ isCollapsed, onToggle, isPinned, onPinToggle, isHovering }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['main', 'content']);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Load saved states from localStorage
  useEffect(() => {
    const savedExpanded = localStorage.getItem('sidebar_expanded');
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
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, []);

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

  // Collapse all categories
  const collapseAll = useCallback(() => {
    setExpandedCategories([]);
    localStorage.setItem('sidebar_expanded', JSON.stringify([]));
  }, []);

  // Expand all categories
  const expandAll = useCallback(() => {
    const allIds = menuCategories.map(c => c.id);
    setExpandedCategories(allIds);
    localStorage.setItem('sidebar_expanded', JSON.stringify(allIds));
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

  const isExpanded = !isCollapsed;
  const allCollapsed = expandedCategories.length === 0;

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{
          width: isExpanded ? 280 : 80,
          boxShadow: isHovering && !isPinned
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(212, 160, 10, 0.15)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
        }}
        transition={{
          duration: 0.35,
          ease: [0.25, 0.46, 0.45, 0.94],
          width: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
          boxShadow: { duration: 0.5, ease: 'easeOut' }
        }}
        className={cn(
          'h-full min-h-screen flex flex-col flex-shrink-0 relative',
          'bg-steel-900',
          'border-l-2 border-steel-700',
          isHovering && !isPinned && 'border-l-primary'
        )}
      >
        {/* Industrial Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(212, 160, 10, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(212, 160, 10, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />
        </div>

        {/* Top Gold Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

        {/* Logo Section */}
        <motion.div
          className="h-16 flex items-center justify-between px-4 border-b-2 border-steel-700 relative z-10"
          animate={{
            backgroundColor: isHovering && !isPinned ? 'rgba(212, 160, 10, 0.05)' : 'transparent'
          }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded-logo"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex items-center gap-3"
              >
                <Link href="/admin" className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 border-2 border-primary" />
                    <Image
                      src="/images/logo.jpg"
                      alt="S.N.A"
                      width={40}
                      height={40}
                      className="relative z-10"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-steel-900" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-base uppercase tracking-wider">لوحة التحكم</span>
                    <p className="text-xs text-primary font-semibold">S.N.A Al-Attal</p>
                  </div>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="mx-auto"
              >
                <Link href="/admin">
                  <div className="relative">
                    <div className="absolute inset-0 border-2 border-primary" />
                    <Image
                      src="/images/logo.jpg"
                      alt="S.N.A"
                      width={40}
                      height={40}
                      className="relative z-10"
                    />
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1"
              >
                {/* Pin Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onPinToggle}
                      className={cn(
                        "h-8 w-8 transition-colors rounded-none border border-transparent",
                        isPinned
                          ? "text-primary border-primary/50 bg-primary/10"
                          : "text-metal-400 hover:text-white hover:bg-steel-700 hover:border-steel-600"
                      )}
                    >
                      {isPinned ? <Pin size={16} /> : <PinOff size={16} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-steel-800 border-steel-600 text-white text-xs rounded-none">
                    {isPinned ? 'إلغاء التثبيت' : 'تثبيت القائمة'}
                  </TooltipContent>
                </Tooltip>

                {/* Collapse/Expand Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggle}
                  className="text-metal-400 hover:text-white hover:bg-steel-700 h-8 w-8 rounded-none border border-transparent hover:border-steel-600"
                >
                  <ChevronLeft size={16} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Search & Actions Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="px-4 py-3 border-b-2 border-steel-700 relative z-10"
            >
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-metal-500" size={16} />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="بحث..."
                    variant="industrial"
                    className="w-full pr-9 h-9 text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-metal-400 hover:text-white transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Collapse/Expand All Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={allCollapsed ? expandAll : collapseAll}
                      className="h-9 w-9 text-metal-400 hover:text-white hover:bg-steel-700 flex-shrink-0 rounded-none border border-transparent hover:border-steel-600"
                    >
                      {allCollapsed ? <ChevronsUpDown size={16} /> : <ChevronsDownUp size={16} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-steel-800 border-steel-600 text-white text-xs rounded-none">
                    {allCollapsed ? 'فتح الكل' : 'إغلاق الكل'}
                  </TooltipContent>
                </Tooltip>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar relative z-10">
          {/* Categories */}
          {filteredCategories.map((category) => (
            <div key={category.id} className="mb-2">
              {isExpanded ? (
                <Collapsible
                  open={expandedCategories.includes(category.id) || !!searchQuery}
                  onOpenChange={() => !searchQuery && toggleCategory(category.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <motion.div
                      className="flex items-center justify-between px-3 py-2 text-metal-400 hover:text-primary hover:bg-steel-800 transition-all duration-200 border-r-2 border-transparent hover:border-primary"
                      whileHover={{ x: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2">
                        <category.icon size={15} />
                        <span className="text-xs font-bold uppercase tracking-widest">
                          {category.title}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedCategories.includes(category.id) ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <ChevronDown size={14} />
                      </motion.div>
                    </motion.div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <motion.ul
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="mt-1 space-y-0.5"
                    >
                      {category.items.map((item, index) => (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2.5 transition-all duration-300 border-r-2',
                              isActive(item.href)
                                ? 'bg-primary/10 text-primary border-primary'
                                : 'text-metal-300 hover:text-white hover:bg-steel-800 border-transparent hover:border-steel-600'
                            )}
                          >
                            <item.icon size={18} className={cn(
                              'transition-colors duration-200',
                              isActive(item.href) ? 'text-primary' : 'text-metal-500'
                            )} />
                            <span className="flex-1 text-sm font-medium">{item.title}</span>

                            {/* Badge for messages */}
                            {item.href === '/admin/messages' && unreadMessages > 0 && (
                              <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 min-w-[20px] h-5 flex items-center justify-center rounded-none">
                                {unreadMessages}
                              </Badge>
                            )}
                          </Link>
                        </motion.li>
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
                              'flex items-center justify-center p-3 transition-all duration-300 relative border-r-2',
                              isActive(item.href)
                                ? 'bg-primary/10 text-primary border-primary'
                                : 'text-metal-400 hover:text-white hover:bg-steel-800 border-transparent hover:border-steel-600'
                            )}
                          >
                            <item.icon size={20} />
                            {item.href === '/admin/messages' && unreadMessages > 0 && (
                              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500" />
                            )}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="bg-steel-800 border-steel-600 text-white text-sm rounded-none">
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
          <div className="my-4 border-t-2 border-steel-700" />

          {/* Bottom Menu */}
          <ul className="space-y-1">
            {bottomMenuItems.map((item) => (
              <li key={item.href}>
                {isExpanded ? (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 transition-all duration-300 border-r-2',
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary border-primary'
                        : 'text-metal-300 hover:text-white hover:bg-steel-800 border-transparent hover:border-steel-600'
                    )}
                  >
                    <item.icon size={18} className={cn(
                      'transition-colors duration-200',
                      isActive(item.href) ? 'text-primary' : 'text-metal-500'
                    )} />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center justify-center p-3 transition-all duration-300 border-r-2',
                          isActive(item.href)
                            ? 'bg-primary/10 text-primary border-primary'
                            : 'text-metal-400 hover:text-white hover:bg-steel-800 border-transparent hover:border-steel-600'
                        )}
                      >
                        <item.icon size={20} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-steel-800 border-steel-600 text-white text-sm rounded-none">
                      <p>{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t-2 border-steel-700 relative z-10">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded-user"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-steel-800 border-2 border-primary/50 flex items-center justify-center">
                    <UserCircle className="text-primary" size={22} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-steel-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {session?.user?.name || 'مدير النظام'}
                  </p>
                  <p className="text-xs text-metal-400 truncate">
                    {session?.user?.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="text-metal-400 hover:text-red-400 hover:bg-red-400/10 h-9 w-9 transition-all duration-200 rounded-none border border-transparent hover:border-red-400/30"
                >
                  <LogOut size={18} />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-user"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => signOut({ callbackUrl: '/admin/login' })}
                      className="w-full text-metal-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 rounded-none"
                    >
                      <LogOut size={20} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-steel-800 border-steel-600 text-white text-sm rounded-none">
                    <p>تسجيل الخروج</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Toggle (shown when collapsed) */}
        {isCollapsed && (
          <div className="p-3 border-t-2 border-steel-700 relative z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="w-full text-metal-400 hover:text-white hover:bg-steel-700 rounded-none border border-transparent hover:border-steel-600"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        )}

        {/* Decorative Gear */}
        <div className="absolute bottom-20 left-4 opacity-5 pointer-events-none">
          <Cog size={60} className="text-primary" />
        </div>
      </motion.aside>
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

  const collapseAll = () => setExpandedCategories([]);
  const expandAll = () => setExpandedCategories(menuCategories.map(c => c.id));
  const allCollapsed = expandedCategories.length === 0;

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
        className="lg:hidden text-steel-600 hover:text-primary hover:bg-steel-100 rounded-none"
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
            transition={{ duration: 0.3, ease: 'easeOut' }}
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
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 right-0 z-50 h-screen w-80 bg-steel-900 border-l-2 border-primary lg:hidden flex flex-col"
          >
            {/* Industrial Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(212, 160, 10, 0.5) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(212, 160, 10, 0.5) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }}
              />
            </div>

            {/* Top Gold Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b-2 border-steel-700 relative z-10">
              <Link href="/admin" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                <div className="relative">
                  <div className="absolute inset-0 border-2 border-primary" />
                  <Image
                    src="/images/logo.jpg"
                    alt="S.N.A"
                    width={40}
                    height={40}
                    className="relative z-10"
                  />
                </div>
                <div>
                  <span className="font-bold text-white uppercase tracking-wider">لوحة التحكم</span>
                  <p className="text-xs text-primary font-semibold">S.N.A Al-Attal</p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-metal-400 hover:text-white hover:bg-steel-700 rounded-none"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b-2 border-steel-700 relative z-10">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-metal-500" size={16} />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="بحث..."
                    variant="industrial"
                    className="w-full pr-9 h-9 text-sm"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={allCollapsed ? expandAll : collapseAll}
                  className="h-9 w-9 text-metal-400 hover:text-white hover:bg-steel-700 flex-shrink-0 rounded-none"
                >
                  {allCollapsed ? <ChevronsUpDown size={16} /> : <ChevronsDownUp size={16} />}
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 relative z-10">
              {filteredCategories.map((category) => (
                <div key={category.id} className="mb-2">
                  <Collapsible
                    open={expandedCategories.includes(category.id) || !!searchQuery}
                    onOpenChange={() => !searchQuery && toggleCategory(category.id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between px-3 py-2 text-metal-400 hover:text-primary hover:bg-steel-800 transition-all duration-200 border-r-2 border-transparent hover:border-primary">
                        <div className="flex items-center gap-2">
                          <category.icon size={15} />
                          <span className="text-xs font-bold uppercase tracking-widest">
                            {category.title}
                          </span>
                        </div>
                        <ChevronDown
                          size={14}
                          className={cn(
                            'transition-transform duration-300',
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
                                'flex items-center gap-3 px-3 py-2.5 transition-all duration-300 border-r-2',
                                isActive(item.href)
                                  ? 'bg-primary/10 text-primary border-primary'
                                  : 'text-metal-300 hover:text-white hover:bg-steel-800 border-transparent hover:border-steel-600'
                              )}
                            >
                              <item.icon size={18} className={cn(
                                isActive(item.href) ? 'text-primary' : 'text-metal-500'
                              )} />
                              <span className="text-sm font-medium">{item.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}

              <div className="my-4 border-t-2 border-steel-700" />

              <ul className="space-y-1">
                {bottomMenuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 transition-all duration-300 border-r-2',
                        isActive(item.href)
                          ? 'bg-primary/10 text-primary border-primary'
                          : 'text-metal-300 hover:text-white hover:bg-steel-800 border-transparent hover:border-steel-600'
                      )}
                    >
                      <item.icon size={18} className={cn(
                        isActive(item.href) ? 'text-primary' : 'text-metal-500'
                      )} />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User Section */}
            <div className="p-4 border-t-2 border-steel-700 relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-steel-800 border-2 border-primary/50 flex items-center justify-center">
                    <UserCircle className="text-primary" size={22} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-steel-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {session?.user?.name || 'مدير النظام'}
                  </p>
                  <p className="text-xs text-metal-400 truncate">
                    {session?.user?.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="text-metal-400 hover:text-red-400 hover:bg-red-400/10 h-9 w-9 rounded-none"
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

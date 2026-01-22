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
  ChevronDown,
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
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['main', 'content']);
  const [isHovering, setIsHovering] = useState(false);
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

  // Expanded state based on hover or actual state
  const isExpanded = !isCollapsed || isHovering;

  // Animation variants for smooth transitions
  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2, ease: 'easeIn' }
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        variants={sidebarVariants}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        onMouseEnter={() => isCollapsed && setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          'fixed top-0 right-0 z-40 h-screen flex flex-col',
          'bg-white/80 backdrop-blur-xl',
          'border-l border-gray-100',
          'shadow-sm'
        )}
      >
        {/* Logo Section - Same height as navbar */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
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
                    <Image
                      src="/images/logo.jpg"
                      alt="S.N.A"
                      width={40}
                      height={40}
                      className="rounded-xl ring-2 ring-primary/20 shadow-sm"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 text-base">لوحة التحكم</span>
                    <p className="text-xs text-gray-400">S.N.A Al-Attal</p>
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
                  <Image
                    src="/images/logo.jpg"
                    alt="S.N.A"
                    width={40}
                    height={40}
                    className="rounded-xl ring-2 ring-primary/20 shadow-sm"
                  />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isExpanded && !isCollapsed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggle}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 h-8 w-8"
                >
                  <ChevronRight size={16} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="px-4 py-3 border-b border-gray-100"
            >
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث في القائمة..."
                  className="w-full pr-9 bg-gray-50/80 border-gray-200 text-gray-700 placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20 h-9 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
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
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all duration-200"
                      whileHover={{ x: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2">
                        <category.icon size={15} className="text-gray-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider">
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
                              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300',
                              isActive(item.href)
                                ? 'bg-primary/10 text-primary border-r-3 border-primary shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                            )}
                          >
                            <item.icon size={18} className={cn(
                              'transition-colors duration-200',
                              isActive(item.href) ? 'text-primary' : 'text-gray-400'
                            )} />
                            <span className="flex-1 text-sm font-medium">{item.title}</span>

                            {/* Badge for messages */}
                            {item.href === '/admin/messages' && unreadMessages > 0 && (
                              <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 min-w-[20px] h-5 flex items-center justify-center rounded-full">
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
                              'flex items-center justify-center p-3 rounded-xl transition-all duration-300 relative',
                              isActive(item.href)
                                ? 'bg-primary/10 text-primary shadow-sm'
                                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                            )}
                          >
                            <item.icon size={20} />
                            {item.href === '/admin/messages' && unreadMessages > 0 && (
                              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                            )}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="bg-gray-800 border-gray-700 text-white text-sm">
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
          <div className="my-4 border-t border-gray-200/80" />

          {/* Bottom Menu */}
          <ul className="space-y-1">
            {bottomMenuItems.map((item) => (
              <li key={item.href}>
                {isExpanded ? (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300',
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary border-r-3 border-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                    )}
                  >
                    <item.icon size={18} className={cn(
                      'transition-colors duration-200',
                      isActive(item.href) ? 'text-primary' : 'text-gray-400'
                    )} />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center justify-center p-3 rounded-xl transition-all duration-300',
                          isActive(item.href)
                            ? 'bg-primary/10 text-primary shadow-sm'
                            : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                        )}
                      >
                        <item.icon size={20} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-gray-800 border-gray-700 text-white text-sm">
                      <p>{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-100">
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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-primary/10 shadow-sm">
                    <UserCircle className="text-primary" size={22} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {session?.user?.name || 'مدير النظام'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {session?.user?.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-9 w-9 transition-all duration-200"
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
                      className="w-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                    >
                      <LogOut size={20} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-gray-800 border-gray-700 text-white text-sm">
                    <p>تسجيل الخروج</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Toggle (shown when collapsed and not hovering) */}
        <AnimatePresence>
          {isCollapsed && !isHovering && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="absolute top-4 -left-3 w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-primary hover:bg-gray-50 shadow-md transition-all duration-200"
              >
                <ChevronLeft size={14} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
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
        className="lg:hidden text-gray-600 hover:text-primary hover:bg-gray-100"
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
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
            className="fixed top-0 right-0 z-50 h-screen w-80 bg-white/80 backdrop-blur-xl border-l border-gray-100 lg:hidden flex flex-col shadow-lg"
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
              <Link href="/admin" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                <div className="relative">
                  <Image
                    src="/images/logo.jpg"
                    alt="S.N.A"
                    width={40}
                    height={40}
                    className="rounded-xl ring-2 ring-primary/20 shadow-sm"
                  />
                </div>
                <div>
                  <span className="font-bold text-gray-800">لوحة التحكم</span>
                  <p className="text-xs text-gray-400">S.N.A Al-Attal</p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث في القائمة..."
                  className="w-full pr-9 bg-gray-50/80 border-gray-200 text-gray-700 placeholder:text-gray-400 h-9 text-sm"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              {filteredCategories.map((category) => (
                <div key={category.id} className="mb-2">
                  <Collapsible
                    open={expandedCategories.includes(category.id) || !!searchQuery}
                    onOpenChange={() => !searchQuery && toggleCategory(category.id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all duration-200">
                        <div className="flex items-center gap-2">
                          <category.icon size={15} className="text-gray-400" />
                          <span className="text-xs font-semibold uppercase tracking-wider">
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
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300',
                                isActive(item.href)
                                  ? 'bg-primary/10 text-primary border-r-3 border-primary'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                              )}
                            >
                              <item.icon size={18} className={cn(
                                isActive(item.href) ? 'text-primary' : 'text-gray-400'
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

              <div className="my-4 border-t border-gray-200/80" />

              <ul className="space-y-1">
                {bottomMenuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300',
                        isActive(item.href)
                          ? 'bg-primary/10 text-primary border-r-3 border-primary'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                      )}
                    >
                      <item.icon size={18} className={cn(
                        isActive(item.href) ? 'text-primary' : 'text-gray-400'
                      )} />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-primary/10">
                    <UserCircle className="text-primary" size={22} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {session?.user?.name || 'مدير النظام'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {session?.user?.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-9 w-9"
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

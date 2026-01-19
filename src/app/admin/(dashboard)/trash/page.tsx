'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  Package,
  Users,
  Newspaper,
  FileText,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface DeletedItem {
  id: string;
  nameAr?: string;
  titleAr?: string;
  name?: string;
  deletedAt: string;
}

interface TrashData {
  products: DeletedItem[];
  clients: DeletedItem[];
  news: DeletedItem[];
  catalogues: DeletedItem[];
}

export default function TrashPage() {
  const [trashData, setTrashData] = useState<TrashData>({
    products: [],
    clients: [],
    news: [],
    catalogues: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrashData = async () => {
    setIsLoading(true);
    try {
      const [products, clients, news, catalogues] = await Promise.all([
        fetch('/api/admin/products?deleted=true').then((r) => r.json()),
        fetch('/api/admin/clients?deleted=true').then((r) => r.json()),
        fetch('/api/admin/news?deleted=true').then((r) => r.json()),
        fetch('/api/admin/catalogues?deleted=true').then((r) => r.json()),
      ]);

      setTrashData({
        products: products.filter((p: { deletedAt: string | null }) => p.deletedAt),
        clients: clients.filter((c: { deletedAt: string | null }) => c.deletedAt),
        news: news.filter((n: { deletedAt: string | null }) => n.deletedAt),
        catalogues: catalogues.filter((c: { deletedAt: string | null }) => c.deletedAt),
      });
    } catch (error) {
      console.error('Failed to fetch trash data:', error);
      toast.error('فشل في تحميل البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashData();
  }, []);

  const restoreItem = async (type: string, id: string) => {
    try {
      const response = await fetch(`/api/admin/${type}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deletedAt: null }),
      });

      if (response.ok) {
        toast.success('تم استعادة العنصر بنجاح');
        fetchTrashData();
      }
    } catch (error) {
      toast.error('فشل في استعادة العنصر');
    }
  };

  const permanentDelete = async (type: string, id: string) => {
    try {
      const response = await fetch(`/api/admin/${type}/${id}?permanent=true`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('تم حذف العنصر نهائياً');
        fetchTrashData();
      }
    } catch (error) {
      toast.error('فشل في حذف العنصر');
    }
  };

  const emptyTrash = async () => {
    try {
      // Delete all items permanently
      const deletePromises = [
        ...trashData.products.map((p) => permanentDelete('products', p.id)),
        ...trashData.clients.map((c) => permanentDelete('clients', c.id)),
        ...trashData.news.map((n) => permanentDelete('news', n.id)),
        ...trashData.catalogues.map((c) => permanentDelete('catalogues', c.id)),
      ];

      await Promise.all(deletePromises);
      toast.success('تم تفريغ سلة المحذوفات');
      fetchTrashData();
    } catch (error) {
      toast.error('فشل في تفريغ سلة المحذوفات');
    }
  };

  const totalItems =
    trashData.products.length +
    trashData.clients.length +
    trashData.news.length +
    trashData.catalogues.length;

  const renderItemList = (items: DeletedItem[], type: string, icon: React.ReactNode) => (
    <div className="space-y-3">
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Trash2 className="mx-auto mb-2 opacity-50" size={40} />
          <p>لا توجد عناصر محذوفة</p>
        </div>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-dark rounded-xl border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
              <div>
                <p className="text-white font-medium">
                  {item.nameAr || item.titleAr || item.name}
                </p>
                <p className="text-xs text-gray-400">
                  حُذف في {new Date(item.deletedAt).toLocaleDateString('ar-EG')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => restoreItem(type, item.id)}
                className="text-green-400 hover:text-green-300"
              >
                <RotateCcw size={16} className="ml-1" />
                استعادة
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                    <Trash2 size={16} className="ml-1" />
                    حذف نهائي
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-dark-50 border-white/10">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">تأكيد الحذف النهائي</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      هذا الإجراء لا يمكن التراجع عنه. سيتم حذف العنصر نهائياً.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-dark border-white/10 text-white">
                      إلغاء
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => permanentDelete(type, item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      حذف نهائي
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">سلة المحذوفات</h1>
          <p className="text-gray-400">
            {totalItems > 0 ? `${totalItems} عنصر في سلة المحذوفات` : 'سلة المحذوفات فارغة'}
          </p>
        </div>
        {totalItems > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 size={18} className="ml-2" />
                تفريغ السلة
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-dark-50 border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="text-red-400" size={24} />
                  تأكيد تفريغ سلة المحذوفات
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  سيتم حذف جميع العناصر ({totalItems} عنصر) نهائياً ولا يمكن استرجاعها.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-dark border-white/10 text-white">
                  إلغاء
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={emptyTrash}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  تفريغ السلة نهائياً
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="products">
            <TabsList className="bg-dark-50 border border-white/10 mb-6">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package size={16} />
                المنتجات
                {trashData.products.length > 0 && (
                  <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                    {trashData.products.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <Users size={16} />
                العملاء
                {trashData.clients.length > 0 && (
                  <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                    {trashData.clients.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-2">
                <Newspaper size={16} />
                الأخبار
                {trashData.news.length > 0 && (
                  <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                    {trashData.news.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="catalogues" className="flex items-center gap-2">
                <FileText size={16} />
                الكتالوجات
                {trashData.catalogues.length > 0 && (
                  <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                    {trashData.catalogues.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card className="bg-dark-50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">المنتجات المحذوفة</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderItemList(trashData.products, 'products', <Package className="text-primary" size={20} />)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients">
              <Card className="bg-dark-50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">العملاء المحذوفون</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderItemList(trashData.clients, 'clients', <Users className="text-primary" size={20} />)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="news">
              <Card className="bg-dark-50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">الأخبار المحذوفة</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderItemList(trashData.news, 'news', <Newspaper className="text-primary" size={20} />)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="catalogues">
              <Card className="bg-dark-50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">الكتالوجات المحذوفة</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderItemList(trashData.catalogues, 'catalogues', <FileText className="text-primary" size={20} />)}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </div>
  );
}

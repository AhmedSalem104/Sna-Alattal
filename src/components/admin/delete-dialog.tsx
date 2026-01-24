'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';

interface DeleteDialogProps {
  title?: string;
  description?: string;
  onConfirm: () => Promise<void>;
  trigger?: React.ReactNode;
  variant?: 'soft' | 'permanent';
}

export function DeleteDialog({
  title = 'هل أنت متأكد؟',
  description = 'سيتم نقل هذا العنصر إلى سلة المحذوفات.',
  onConfirm,
  trigger,
  variant = 'soft',
}: DeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const isPermanent = variant === 'permanent';

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className="text-metal-500 hover:text-red-500 hover:bg-red-50 rounded-none"
          >
            <Trash2 size={18} />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white border-2 border-metal-200 rounded-none max-w-md">
        {/* Top Gold Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

        <AlertDialogHeader className="pt-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 ${isPermanent ? 'bg-red-100 border border-red-200' : 'bg-primary/10 border border-primary/20'}`}>
              {isPermanent ? (
                <AlertTriangle size={20} className="text-red-500" />
              ) : (
                <Trash2 size={20} className="text-primary" />
              )}
            </div>
            <AlertDialogTitle className="text-steel-900 font-bold uppercase tracking-wider">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-metal-600 border-r-2 border-metal-200 pr-4">
            {isPermanent
              ? 'سيتم حذف هذا العنصر نهائياً ولا يمكن استرجاعه.'
              : description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 border-t border-metal-200 pt-4">
          <AlertDialogCancel className="bg-white border-2 border-metal-200 text-steel-900 hover:bg-metal-50 rounded-none">
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={`rounded-none ${
              isPermanent
                ? 'bg-red-500 hover:bg-red-600 text-white border-2 border-red-500'
                : 'bg-primary hover:bg-primary/90 text-steel-900 border-2 border-primary'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 rtl:ml-0 rtl:mr-2 h-4 w-4 animate-spin" />
                جاري الحذف...
              </>
            ) : isPermanent ? (
              'حذف نهائي'
            ) : (
              'نقل للمحذوفات'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

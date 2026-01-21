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
import { Trash2, Loader2 } from 'lucide-react';

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
            className="text-gray-600 hover:text-red-400"
          >
            <Trash2 size={18} />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-50 border-gray-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            {isPermanent
              ? 'سيتم حذف هذا العنصر نهائياً ولا يمكن استرجاعه.'
              : description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="bg-white border-gray-200 text-gray-900 hover:bg-gray-100">
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={
              isPermanent
                ? 'bg-red-500 hover:bg-red-600 text-gray-900'
                : 'bg-primary hover:bg-primary/90 text-gray-900'
            }
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

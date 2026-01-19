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
            className="text-gray-400 hover:text-red-400"
          >
            <Trash2 size={18} />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-dark-50 border-white/10">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            {isPermanent
              ? 'سيتم حذف هذا العنصر نهائياً ولا يمكن استرجاعه.'
              : description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="bg-dark border-white/10 text-white hover:bg-white/10">
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={
              isPermanent
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-primary hover:bg-primary/90 text-dark'
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
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

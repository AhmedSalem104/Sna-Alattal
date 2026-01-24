'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'dark' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="top-center"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-none',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-none',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-none',
          closeButton:
            'group-[.toast]:bg-background group-[.toast]:border-border',
          success:
            'group-[.toaster]:border-l-4 group-[.toaster]:border-l-green-500',
          error:
            'group-[.toaster]:border-l-4 group-[.toaster]:border-l-red-500',
          warning:
            'group-[.toaster]:border-l-4 group-[.toaster]:border-l-yellow-500',
          info:
            'group-[.toaster]:border-l-4 group-[.toaster]:border-l-blue-500',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

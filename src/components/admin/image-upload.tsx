'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const images = Array.isArray(value) ? value : value ? [value] : [];

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return;

      setIsUploading(true);

      try {
        const uploadedUrls: string[] = [];

        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Upload failed');
          }

          const data = await response.json();
          uploadedUrls.push(data.url);
        }

        if (multiple) {
          onChange([...images, ...uploadedUrls].slice(0, maxFiles));
        } else {
          onChange(uploadedUrls[0]);
        }

        toast.success('تم رفع الصورة بنجاح');
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('فشل رفع الصورة');
      } finally {
        setIsUploading(false);
      }
    },
    [disabled, images, maxFiles, multiple, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxSize,
    maxFiles: multiple ? maxFiles - images.length : 1,
    disabled: disabled || isUploading || (multiple && images.length >= maxFiles),
  });

  const removeImage = (index: number) => {
    if (multiple) {
      const newImages = [...images];
      newImages.splice(index, 1);
      onChange(newImages);
    } else {
      onChange('');
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed p-6 text-center cursor-pointer transition-all relative',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-metal-300 hover:border-primary/50',
          (disabled || isUploading) && 'opacity-50 cursor-not-allowed',
          multiple && images.length >= maxFiles && 'hidden'
        )}
      >
        {/* Gold Corner Accent */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />

        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-metal-600 font-medium">جاري الرفع...</p>
            </>
          ) : (
            <>
              <div className="p-3 bg-primary/10 border border-primary/20">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <p className="text-steel-700 font-medium">
                {isDragActive
                  ? 'أفلت الصور هنا'
                  : 'اسحب الصور هنا أو انقر للاختيار'}
              </p>
              <p className="text-xs text-metal-500 uppercase tracking-wider">
                PNG, JPG, GIF, WEBP (حد أقصى {maxSize / 1024 / 1024}MB)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Preview */}
      {images.length > 0 && (
        <div className={cn('grid gap-4', multiple ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1')}>
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-video overflow-hidden bg-metal-50 group border-2 border-metal-200"
            >
              {/* Gold Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-primary z-10" />

              <Image
                src={image}
                alt={`Uploaded ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-steel-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeImage(index)}
                  className="text-white hover:text-red-400 hover:bg-red-400/20 rounded-none border border-transparent hover:border-red-400/50"
                >
                  <X size={20} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Image Placeholder */}
      {images.length === 0 && !isUploading && (
        <div className="flex items-center justify-center aspect-video bg-metal-50 border-2 border-metal-200 relative">
          {/* Gold Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />

          <div className="text-center text-metal-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm uppercase tracking-wider">لم يتم اختيار صورة</p>
          </div>
        </div>
      )}
    </div>
  );
}

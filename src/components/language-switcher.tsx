'use client';

import { useLocale } from '@/hooks/useLocale';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import type { Locale } from '@/i18n/request';

export function LanguageSwitcher() {
  const { locale, locales, localeNames, changeLocale } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:text-primary"
          aria-label="تغيير اللغة"
          aria-haspopup="true"
        >
          <Globe className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">تغيير اللغة - اللغة الحالية: {localeNames[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-50 border-gray-200" role="menu" aria-label="خيارات اللغة">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => changeLocale(loc as Locale)}
            className={`cursor-pointer ${
              locale === loc ? 'text-primary' : 'text-gray-700 hover:text-primary'
            }`}
          >
            {localeNames[loc as Locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

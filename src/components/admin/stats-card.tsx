'use client';

import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div className={cn(
      'relative bg-white rounded-modern-lg shadow-soft overflow-hidden group hover:shadow-soft-md transition-all duration-300',
      className
    )}>
      {/* Gold Accent Bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

      {/* Industrial Corner Accent */}
      <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 transform rotate-45 translate-x-6 -translate-y-6" />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-metal-500 uppercase tracking-wider">
            {title}
          </h3>
          <div className="p-2 bg-primary/10 border border-primary/20">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="text-3xl font-bold text-steel-900 font-mono">{value}</div>

        {(description || trend) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-metal-100">
            {trend && (
              <span
                className={cn(
                  'flex items-center text-xs font-bold px-2 py-0.5',
                  trend.isPositive
                    ? 'text-green-600 bg-green-50 border border-green-200'
                    : 'text-red-600 bg-red-50 border border-red-200'
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 ml-1 rtl:ml-0 rtl:mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 ml-1 rtl:ml-0 rtl:mr-1" />
                )}
                {trend.value}%
              </span>
            )}
            {description && (
              <span className="text-xs text-metal-500">{description}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

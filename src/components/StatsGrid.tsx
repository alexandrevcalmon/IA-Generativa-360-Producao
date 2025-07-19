import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface StatItem {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
  footer?: React.ReactNode;
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatsGrid({ stats, columns = 4, className }: StatsGridProps) {
  const getColumnsClass = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    }
  };

  return (
    <div className={cn(`grid gap-4 ${getColumnsClass()}`, className)}>
      {stats.map((stat, index) => (
        <Card key={`${stat.title}-${index}`} className="card-dashboard overflow-hidden hover:scale-105 transition-transform duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption mb-1">{stat.title}</p>
                <p className="text-2xl font-bold calmon-gradient-text">{stat.value}</p>
                {stat.footer && <div className="mt-2">{stat.footer}</div>}
              </div>
              <div className={cn(
                'p-3 rounded-full glass-effect',
                stat.bgColor || 'bg-calmon-100'
              )}>
                <stat.icon className={cn(
                  'h-6 w-6',
                  stat.color || 'text-calmon-700'
                )} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
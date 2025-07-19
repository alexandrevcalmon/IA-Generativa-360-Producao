import { ReactNode } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { PageContainer } from './PageContainer';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  headerContent?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  showSidebarTrigger?: boolean;
  background?: 'white' | 'gray' | 'gradient' | 'dark';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  headerCentered?: boolean;
}

export function PageLayout({
  title,
  subtitle,
  headerContent,
  children,
  className,
  headerClassName,
  contentClassName,
  showSidebarTrigger = true,
  background = 'gray',
  maxWidth = '2xl',
  headerCentered = true,
}: PageLayoutProps) {
  // Define background classes based on the background prop
  const getBgClass = () => {
    switch (background) {
      case 'white':
        return 'bg-white';
      case 'gradient':
        return 'bg-calmon-bg-gradient';
      case 'dark':
        return 'bg-adapta-dark text-white';
      case 'gray':
      default:
        return 'bg-gray-50';
    }
  };

  // Define header classes based on the background prop
  const getHeaderClass = () => {
    switch (background) {
      case 'dark':
        return 'border-slate-700/50 py-10 bg-slate-950/90 backdrop-blur-xl shadow-2xl border-slate-700/50';
      case 'white':
        return 'border-gray-200 py-10 bg-white shadow-sm';
      case 'gradient':
        return 'border-gray-200 py-10 bg-white shadow-sm';
      case 'gray':
      default:
        return 'border-gray-200 py-10 bg-white shadow-sm';
    }
  };

  // Define title classes based on the background prop
  const getTitleClass = () => {
    switch (background) {
      case 'dark':
        return 'text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent';
      case 'white':
      case 'gradient':
      case 'gray':
      default:
        return 'page-title-gradient';
    }
  };

  // Define subtitle classes based on the background prop
  const getSubtitleClass = () => {
    switch (background) {
      case 'dark':
        return 'text-slate-300 text-lg leading-relaxed mt-1';
      case 'white':
      case 'gradient':
      case 'gray':
      default:
        return 'page-subtitle mt-1';
    }
  };

  // Define sidebar trigger classes based on the background prop
  const getSidebarTriggerClass = () => {
    switch (background) {
      case 'dark':
        return 'flex md:hidden text-slate-300';
      case 'white':
      case 'gradient':
      case 'gray':
      default:
        return 'flex md:hidden text-gray-700';
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <header className={cn(
        getHeaderClass(),
        "min-h-[156px] flex items-center",
        headerClassName
      )}>
        <PageContainer centered={headerCentered}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              {showSidebarTrigger && <SidebarTrigger className={getSidebarTriggerClass()} />}
              <div>
                <h1 className={getTitleClass()}>{title}</h1>
                {subtitle && (
                  <p className={getSubtitleClass()}>{subtitle}</p>
                )}
              </div>
            </div>
            {headerContent && (
              <div className="flex items-center gap-2 ml-12">
                {headerContent}
              </div>
            )}
          </div>
        </PageContainer>
      </header>

      {/* Main Content */}
      <div className={cn(
        "flex-1 overflow-auto p-4 md:p-6",
        getBgClass(),
        contentClassName
      )}>
        <PageContainer maxWidth={maxWidth}>
          <div className="animate-fade-in">
            {children}
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
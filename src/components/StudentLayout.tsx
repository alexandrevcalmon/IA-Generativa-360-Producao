
import { ReactNode } from 'react';
import { StudentSidebar } from './StudentSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface StudentLayoutProps {
  children: ReactNode;
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StudentSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentLayout;

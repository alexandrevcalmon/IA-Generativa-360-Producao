
import { Outlet } from 'react-router-dom';
import { StudentSidebar } from './StudentSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const StudentLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StudentSidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentLayout;

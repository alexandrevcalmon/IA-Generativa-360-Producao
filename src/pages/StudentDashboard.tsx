
import StudentLayout from '@/components/StudentLayout';
import { useAuth } from '@/hooks/auth';
import { useStudentPoints } from '@/hooks/useStudentGamification';
import { StudentDashboardHeader } from '@/components/student/StudentDashboardHeader';
import { StudentStatsGrid } from '@/components/student/StudentStatsGrid';
import { StudentQuickActions } from '@/components/student/StudentQuickActions';
import { StudentRecentActivities } from '@/components/student/StudentRecentActivities';
import { StudentAchievements } from '@/components/student/StudentAchievements';

const StudentDashboard = () => {
  const { companyUserData } = useAuth();
  const { data: studentPoints } = useStudentPoints();

  const totalPoints = studentPoints?.total_points || 0;
  const currentStreak = studentPoints?.streak_days || 0;

  // Mock data for stats - in real app this would come from actual data
  const mockActivities = [
    { type: 'lesson', title: 'Completou a lição "Introdução ao React"', time: '2 horas atrás', points: 10 },
    { type: 'quiz', title: 'Finalizou quiz de JavaScript', time: '1 dia atrás', points: 15 },
    { type: 'achievement', title: 'Conquistou "Primeira Semana"', time: '2 dias atrás', points: 25 }
  ];

  return (
    <StudentLayout>
      <div className="flex flex-col h-full">
        <StudentDashboardHeader totalPoints={totalPoints} currentStreak={currentStreak} />
        
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="space-y-6">
            <StudentStatsGrid 
              coursesInProgress={2}
              completedCourses={1}
              hoursStudied={15.5}
              totalPoints={totalPoints}
            />
            
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <StudentQuickActions />
                <StudentRecentActivities activities={mockActivities} />
              </div>
              <div>
                <StudentAchievements 
                  coursesInProgress={2} 
                  completedCourses={1} 
                  totalPoints={totalPoints} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;

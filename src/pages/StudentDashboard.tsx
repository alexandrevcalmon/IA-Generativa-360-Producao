
import { useStudentCourses } from '@/hooks/useStudentCourses';
import { useEnrollInCourse } from '@/hooks/useStudentProgress';
import { StudentDashboardHeader } from '@/components/student/StudentDashboardHeader';
import { StudentStatsGrid } from '@/components/student/StudentStatsGrid';
import { StudentQuickActions } from '@/components/student/StudentQuickActions';
import { StudentGoalProgress } from '@/components/student/StudentGoalProgress';
import { StudentRecentActivities } from '@/components/student/StudentRecentActivities';
import { StudentAchievements } from '@/components/student/StudentAchievements';

const StudentDashboard = () => {
  const { data: courses, isLoading: coursesLoading } = useStudentCourses();
  const enrollMutation = useEnrollInCourse();

  console.log('Student courses data:', courses);

  // Calculate stats from real data
  const studentStats = {
    coursesInProgress: courses?.filter(c => c.enrolled_at && c.progress_percentage < 100).length || 0,
    completedCourses: courses?.filter(c => c.progress_percentage === 100).length || 0,
    totalPoints: courses?.reduce((total, course) => {
      return total + Math.floor(course.progress_percentage * 10); // 10 points per percentage
    }, 0) || 0,
    currentStreak: 7, // This would need to be calculated from lesson completion dates
    averageGrade: 8.5, // This would come from quiz results
    hoursStudied: courses?.reduce((total, course) => {
      return total + (course.estimated_hours * (course.progress_percentage / 100));
    }, 0) || 0,
    certificatesEarned: courses?.filter(c => c.progress_percentage === 100).length || 0,
    nextGoalProgress: 75
  };

  const recentActivities = [
    {
      type: 'course_progress',
      title: 'Progresso no curso atualizado',
      time: '2 horas atrás',
      points: 25
    },
    {
      type: 'lesson_completed',
      title: 'Lição completada',
      time: '1 dia atrás',
      points: 50
    },
    {
      type: 'goal_achieved',
      title: 'Meta Semanal Atingida',
      time: '2 dias atrás',
      points: 25
    }
  ];

  if (coursesLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Carregando...
              </h1>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Carregando dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <StudentDashboardHeader 
        totalPoints={studentStats.totalPoints}
        currentStreak={studentStats.currentStreak}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="space-y-6">
          <StudentStatsGrid 
            coursesInProgress={studentStats.coursesInProgress}
            completedCourses={studentStats.completedCourses}
            hoursStudied={studentStats.hoursStudied}
            totalPoints={studentStats.totalPoints}
          />

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Quick Actions - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              <StudentQuickActions />
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              <StudentGoalProgress nextGoalProgress={studentStats.nextGoalProgress} />
              <StudentRecentActivities activities={recentActivities} />
              <StudentAchievements 
                coursesInProgress={studentStats.coursesInProgress}
                completedCourses={studentStats.completedCourses}
                totalPoints={studentStats.totalPoints}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

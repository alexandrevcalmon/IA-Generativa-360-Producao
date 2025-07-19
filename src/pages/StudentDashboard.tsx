// Stub page for StudentDashboard
// TODO: Implement when student dashboard functionality is ready

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StudentDashboard = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">Track your learning progress</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Student dashboard functionality is being developed.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
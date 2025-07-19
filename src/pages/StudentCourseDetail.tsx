// Stub page for StudentCourseDetail
// TODO: Implement when course detail functionality is ready

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StudentCourseDetail = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Course Details</h1>
        <p className="text-muted-foreground">View course information and progress</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Course detail functionality is being developed.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentCourseDetail;
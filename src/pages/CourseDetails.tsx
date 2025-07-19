// Stub page for CourseDetails
// TODO: Implement when course details functionality is ready

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CourseDetails = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Course Details</h1>
        <p className="text-muted-foreground">View detailed course information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Course details functionality is being developed.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetails;
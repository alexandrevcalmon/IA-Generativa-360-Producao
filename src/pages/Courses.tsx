// Stub page for Courses
// TODO: Implement when courses functionality is ready

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Courses = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <p className="text-muted-foreground">Browse available courses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Courses functionality is being developed.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Courses;
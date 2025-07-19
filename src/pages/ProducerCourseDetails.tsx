// Stub page for ProducerCourseDetails
// TODO: Implement when producer course details functionality is ready

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProducerCourseDetails = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Producer Course Details</h1>
        <p className="text-muted-foreground">Manage course content and settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Producer course details functionality is being developed.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProducerCourseDetails;
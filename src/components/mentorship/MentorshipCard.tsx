// Stub component for MentorshipCard
// TODO: Implement when mentorship functionality is ready

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const MentorshipCard = ({ mentorship }: { mentorship: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentorship Session</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Coming soon</p>
      </CardContent>
    </Card>
  );
};
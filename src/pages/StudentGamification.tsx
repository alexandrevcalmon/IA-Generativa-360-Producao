// Stub page for StudentGamification
// TODO: Implement when gamification functionality is ready

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StudentGamification = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gamification</h1>
        <p className="text-muted-foreground">View achievements and leaderboards</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Gamification functionality is being developed.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentGamification;
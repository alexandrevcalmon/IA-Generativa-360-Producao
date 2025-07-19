// Stub page for CompanyMentorships
// TODO: Implement when mentorship functionality is ready

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CompanyMentorships = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Company Mentorships</h1>
        <p className="text-muted-foreground">Manage mentorship sessions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Mentorship functionality is being developed.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyMentorships;
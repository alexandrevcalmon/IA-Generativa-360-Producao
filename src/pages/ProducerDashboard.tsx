// Stub page for ProducerDashboard
// TODO: Implement when producer dashboard functionality is ready

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProducerDashboard = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Producer Dashboard</h1>
        <p className="text-muted-foreground">Manage content and analytics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Producer dashboard functionality is being developed.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProducerDashboard;
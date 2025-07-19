// Stub page for ProducerPlans
// TODO: Implement when plans functionality is ready

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProducerPlans = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Producer Plans</h1>
        <p className="text-muted-foreground">Manage subscription plans</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Plans management functionality is being developed.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProducerPlans;
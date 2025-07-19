// Stub page for Ranking
// TODO: Implement when ranking functionality is ready

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Ranking = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ranking</h1>
        <p className="text-muted-foreground">View leaderboards and rankings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Ranking functionality is being developed.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ranking;
// Stub component for BlockedCollaboratorsCard
// TODO: Implement when needed

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const BlockedCollaboratorsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blocked Collaborators</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">No blocked collaborators</p>
      </CardContent>
    </Card>
  );
};
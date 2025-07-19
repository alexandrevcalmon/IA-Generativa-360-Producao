// Stub page for checkout success
// TODO: Implement when checkout functionality is ready

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CheckoutSuccess = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checkout Success</h1>
        <p className="text-muted-foreground">Payment completed successfully</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Checkout functionality is being developed.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutSuccess;
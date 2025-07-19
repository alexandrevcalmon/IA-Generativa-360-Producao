// Stub page for ActivateAccount
// TODO: Implement when account activation functionality is ready

import { Button } from '@/components/ui/button';

const ActivateAccount = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Account Activation</h1>
        <p className="text-muted-foreground mb-4">Account activation functionality is coming soon.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    </div>
  );
};

export default ActivateAccount;
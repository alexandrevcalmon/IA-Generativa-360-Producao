// Stub component for CreateMentorshipDialog
// TODO: Implement when mentorship functionality is ready

import { Button } from '@/components/ui/button';

interface CreateMentorshipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateMentorshipDialog = ({ open, onOpenChange }: CreateMentorshipDialogProps) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Create Mentorship</h2>
        <p className="text-muted-foreground mb-4">Mentorship functionality is coming soon.</p>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </div>
    </div>
  );
};
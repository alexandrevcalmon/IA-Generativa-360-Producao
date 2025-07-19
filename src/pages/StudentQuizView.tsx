// Stub page for StudentQuizView
// TODO: Implement when quiz functionality is ready

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StudentQuizView = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quiz</h1>
        <p className="text-muted-foreground">Take quizzes and assessments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Quiz functionality is being developed.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentQuizView;
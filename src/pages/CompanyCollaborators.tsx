
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CompanyCollaborators = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Company Collaborators</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Collaborators Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Manage your company's collaborators here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyCollaborators;

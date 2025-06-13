import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building } from "lucide-react";

export default function OrganizationsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Organizations</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage all organizations across the system
          </p>
        </div>
        <Button>
          <Building className="mr-2 h-4 w-4" />
          Add Organization
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Organizations</CardTitle>
          <CardDescription>System-wide organization management</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Organization management interface would be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
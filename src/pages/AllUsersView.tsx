import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

export default function AllUsersView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Users</h1>
      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>Manage all users across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            User management interface would be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

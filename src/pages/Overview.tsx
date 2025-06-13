import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useOutletContext } from "react-router-dom";
import { PlusCircle, CheckSquare, Users, BarChart, User } from "lucide-react";

export default function DashboardOverview() {
  const USER_ROLES = {
  MEMBER: "member",
  ORG_ADMIN: "org_admin", 
  SYSTEM_ADMIN: "system_admin"
};
    type UserRoleType = keyof typeof USER_ROLES;
    type UserType = {
    email: string;
    user_metadata?: {
      first_name?: string;
    };
    };
    
  const { userRole, user } = useOutletContext<{userRole: UserRoleType | null, user: UserType | null}>();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User'}
        </h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {userRole === USER_ROLES.SYSTEM_ADMIN ? 'System Admin' : 
               userRole === USER_ROLES.ORG_ADMIN ? 'Org Admin' : 'Member'}
            </div>
            <p className="text-xs text-muted-foreground">Current access level</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Granite Flow</CardTitle>
          <CardDescription>
            You're logged in as {user?.email} with {userRole} privileges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Your dashboard is ready to go! Start by exploring the navigation menu.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
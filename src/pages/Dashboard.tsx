import { useState, useEffect } from "react";
import { 
  Routes, 
  Route, 
  Navigate, 
  useNavigate, 
  Link,
  Outlet,
  useLocation,
  useOutletContext
} from "react-router-dom";
import { 
  Home, 
  Users, 
  CheckSquare, 
  BarChart, 
  Settings, 
  LogOut, 
  PlusCircle,
  Search, 
  ChevronDown, 
  Shield,
  UserPlus,
  Calendar,
  Building,
  HelpCircle,
  Moon,
  Sun,
  Menu,
  X,
  Database,
  Bell,
  User
} from "lucide-react";
import supabase from "@/lib/supabaseClient";

import DashboardOverview from "./Overview";
import TasksView from "./TasksView";
import TeamView from "./TeamView";
import CalendarView from "./CalendarView";
import MembersView from "./MembersView";
import AnalyticsView from "./AnalyticsView";
import OrganizationSettingsView from "./OrganizationSettingsView";
import OrganizationsView from "./OrganizationsView";
import AllUsersView from "./AllUsersView";
import HelpSupportView from "./HelpSupportView";


import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback} from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// User role constants
const USER_ROLES = {
  MEMBER: "member",
  ORG_ADMIN: "org_admin", 
  SYSTEM_ADMIN: "system_admin"
};

// Placeholder AuthPage component
function AuthPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <p className="text-gray-600">Authentication page placeholder.</p>
      </div>
    </div>
  );
}

// Main App Component that sets up routing
export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview" element={<DashboardOverview />} />
        <Route path="tasks" element={<TasksView />} />
        <Route path="team" element={<TeamView />} />
        <Route path="calendar" element={<CalendarView />} />

        {/* Organization Admin Routes */}
        <Route path="members" element={<AdminRoute><MembersView /></AdminRoute>} />
        <Route path="analytics" element={<AdminRoute><AnalyticsView /></AdminRoute>} />
        <Route path="org-settings" element={<AdminRoute><OrganizationSettingsView /></AdminRoute>} />

        {/* System Admin Routes */}
        <Route path="organizations" element={<SystemAdminRoute><OrganizationsView /></SystemAdminRoute>} />
        <Route path="all-users" element={<SystemAdminRoute><AllUsersView /></SystemAdminRoute>} />
        <Route path="system-settings" element={<SystemAdminRoute><SystemSettingsView /></SystemAdminRoute>} />

        {/* Help & Support */}
        <Route path="help" element={<HelpSupportView />} />
      </Route>
    </Routes>
  );
}

// Types
type ProtectedRouteProps = {
  children: React.ReactNode;
};

type AdminRouteProps = {
  children: React.ReactNode;
};

type SystemAdminRouteProps = {
  children: React.ReactNode;
};

type UserRoleType = typeof USER_ROLES[keyof typeof USER_ROLES];

type UserType = {
  id: string;
  email: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
  };
};


// Protected Route Component
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-teal-500 border-b-transparent border-l-transparent border-r-transparent animate-spin mb-4"></div>
          <p className="text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

// Admin Route Component
function AdminRoute({ children }: AdminRouteProps) {
  const [userRole, setUserRole] = useState<UserRoleType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setUserRole(null);
          return;
        }

        // Check user role from user_roles table
        const { data: userRoleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (userRoleData?.role === 'system_admin') {
          setUserRole(USER_ROLES.SYSTEM_ADMIN);
        } else if (userRoleData?.role === 'org_admin') {
          setUserRole(USER_ROLES.ORG_ADMIN);
        } else {
          setUserRole(USER_ROLES.MEMBER);
        }
      } catch (error) {
        console.error('Role check error:', error);
        setUserRole(USER_ROLES.MEMBER);
      } finally {
        setIsLoading(false);
      }
    };

    checkRole();
  }, []);

  if (isLoading) {
    return <div className="p-8">Loading access permissions...</div>;
  }

  if (userRole === USER_ROLES.MEMBER || !userRole) {
    return <Navigate to="/overview" replace />;
  }

  return <>{children}</>;
}

// System Admin Route Component
function SystemAdminRoute({ children }: SystemAdminRouteProps) {
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setIsSystemAdmin(false);
          return;
        }

        const { data: userRoleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        setIsSystemAdmin(userRoleData?.role === 'system_admin');
      } catch (error) {
        console.error('Admin check error:', error);
        setIsSystemAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkRole();
  }, []);

  if (isLoading) {
    return <div className="p-8">Loading access permissions...</div>;
  }

  if (!isSystemAdmin) {
    return <Navigate to="/overview" replace />;
  }

  return <>{children}</>;
}

function DashboardLayout() {
  const [user, setUser] = useState<UserType | null>(null);
  const [userRole, setUserRole] = useState<UserRoleType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Check auth state and fetch user role
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);

        // Get current session
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          navigate('/auth');
          return;
        }

        setUser(session.user as UserType);

        // Fetch user role
        const { data: userRoleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (roleError) {
          console.error('Role fetch error:', roleError);
          
          // If no role exists, create a default member role
          if (roleError.code === 'PGRST116') {
            console.log('No role found for user, creating member role...');
            const { error: createError } = await supabase
              .from('user_roles')
              .insert([
                {
                  user_id: session.user.id,
                  role: 'member'
                }
              ])
              .select()
              .single();
              
            if (createError) {
              console.error('Error creating role:', createError);
              setUserRole(USER_ROLES.MEMBER);
            } else {
              setUserRole(USER_ROLES.MEMBER);
            }
          } else {
            setUserRole(USER_ROLES.MEMBER);
          }
        } else {
          // Map the role from database to our constants
          switch (userRoleData.role) {
            case 'system_admin':
              setUserRole(USER_ROLES.SYSTEM_ADMIN);
              break;
            case 'org_admin':
              setUserRole(USER_ROLES.ORG_ADMIN);
              break;
            default:
              setUserRole(USER_ROLES.MEMBER);
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        alert("There was a problem loading your profile. Please try signing in again.");
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      alert("Failed to sign out. Please try again.");
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-teal-500 border-b-transparent border-l-transparent border-r-transparent animate-spin mb-4"></div>
          <p className="text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${darkMode ? 'dark bg-gray-900 text-gray-100' : ''}`}>
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-sm z-10 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button 
            className="lg:hidden mr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-2 mr-8">
            <Shield className="h-6 w-6 text-teal-500" />
            <span className="font-bold text-xl">Granite Flow</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input 
              type="search" 
              placeholder="Search..." 
              className="w-64 h-9 pl-10 bg-gray-100 dark:bg-gray-700 border-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Bell size={18} />
          </button>
          
          <button 
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100">
                    {user?.user_metadata?.first_name?.split(' ').map(n => n[0]).join('') || user?.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline text-sm font-medium">
                  {user?.user_metadata?.first_name + ' ' + user?.user_metadata?.last_name || 'User'}
                </span>
                <ChevronDown size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.user_metadata?.first_name + ' ' + user?.user_metadata?.last_name || 'User'}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-500 dark:text-red-400"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-screen pt-16">
        {/* Sidebar Navigation */}
        <aside className={`
          fixed top-16 bottom-0 w-64 bg-gray-800 dark:bg-gray-900 text-white z-20
          transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? 'left-0' : '-left-64 lg:left-0'}
        `}>
          <div className="flex flex-col h-full">
            <div className="px-4 py-3 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Your Role</p>
                  <p className="font-semibold">
                    {userRole === USER_ROLES.SYSTEM_ADMIN ? 'System Admin' : 
                     userRole === USER_ROLES.ORG_ADMIN ? 'Organization Admin' : 'Member'}
                  </p>
                </div>
                <Badge className={`
                  ${userRole === USER_ROLES.SYSTEM_ADMIN 
                    ? 'bg-purple-500 hover:bg-purple-600' 
                    : userRole === USER_ROLES.ORG_ADMIN 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : 'bg-green-500 hover:bg-green-600'}
                  text-white px-2.5 py-0.5 text-xs font-medium
                `}>
                  {userRole === USER_ROLES.SYSTEM_ADMIN ? 'ADMIN' : 
                   userRole === USER_ROLES.ORG_ADMIN ? 'ORG ADMIN' : 'MEMBER'}
                </Badge>
              </div>
            </div>
            
            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
              {/* Core Navigation - For All Users */}
              <Link 
                to="/overview"
                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === "/overview" 
                    ? "bg-gray-700 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              
              <Link
                to="/tasks"
                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === "/tasks" 
                    ? "bg-gray-700 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <CheckSquare className="mr-3 h-5 w-5" />
                My Tasks
              </Link>
              
              <Link
                to="/team"
                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === "/team" 
                    ? "bg-gray-700 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Users className="mr-3 h-5 w-5" />
                Team
              </Link>
              
              <Link
                to="/calendar"
                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === "/calendar" 
                    ? "bg-gray-700 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Calendar className="mr-3 h-5 w-5" />
                Calendar
              </Link>
              
              {/* Organization Admin Navigation */}
              {(userRole === USER_ROLES.ORG_ADMIN || userRole === USER_ROLES.SYSTEM_ADMIN) && (
                <>
                  <Separator className="my-4 bg-gray-700" />
                  <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Admin</p>
                  
                    <button
                      onClick={() => navigate("/members")}
                      className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                        location.pathname === "/members" 
                          ? "bg-gray-700 text-white" 
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <UserPlus className="mr-3 h-5 w-5" />
                      Manage Members
                    </button>
                  
                  <Link
                    to="/analytics"
                    className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                      location.pathname === "/analytics" 
                        ? "bg-gray-700 text-white" 
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <BarChart className="mr-3 h-5 w-5" />
                    Analytics
                  </Link>
                  
                  <Link
                    to="/org-settings"
                    className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                      location.pathname === "/org-settings" 
                        ? "bg-gray-700 text-white" 
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Organization Settings
                  </Link>
                </>
              )}
              
              {/* System Admin Navigation */}
              {userRole === USER_ROLES.SYSTEM_ADMIN && (
                <>
                  <Separator className="my-4 bg-gray-700" />
                  <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">System Admin</p>
                  
                  <Link
                    to="/organizations"
                    className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                      location.pathname === "/organizations" 
                        ? "bg-gray-700 text-white" 
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Building className="mr-3 h-5 w-5" />
                    Organizations
                  </Link>
                  
                  <Link
                    to="/all-users"
                    className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                      location.pathname === "/all-users" 
                        ? "bg-gray-700 text-white" 
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Users className="mr-3 h-5 w-5" />
                    All Users
                  </Link>
                  
                  <Link
                    to="/system-settings"
                    className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                      location.pathname === "/system-settings" 
                        ? "bg-gray-700 text-white" 
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Database className="mr-3 h-5 w-5" />
                    System Settings
                  </Link>
                </>
              )}
              <Separator className="my-4 bg-gray-700" />
              <Link
                to="/help"
                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === "/help" 
                    ? "bg-gray-700 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <HelpCircle className="mr-3 h-5 w-5" />
                Help & Support
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-0 lg:ml-64 bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
          <Outlet context={{ userRole, user }} />
        </main>
      </div>
    </div>
  );
}

function SystemSettingsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">System Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Global System Configuration</CardTitle>
          <CardDescription>Configure system-wide settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            System settings interface would be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
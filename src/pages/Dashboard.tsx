import { useState, useEffect } from "react";
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate, 
  Link,
  Outlet
} from "react-router-dom";
import { 
  Home, 
  Users, 
  CheckSquare, 
  BarChart, 
  Settings, 
  LogOut, 
  PlusCircle,
  Trash2, 
  Edit2, 
  Search, 
  ChevronDown, 
  Shield,
  RefreshCw,
  UserPlus,
  FileText,
  Send,
  Calendar,
  Building,
  HelpCircle,
  Moon,
  Sun,
  Menu,
  X,
  Database,
  Bell,
  AlertCircle
} from "lucide-react";
import supabase from "@/lib/supabaseClient";

// Component imports - in a real app these would be in separate files
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <Route path="/" element={<AuthPage />} />
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

// Protected Route Component
function ProtectedRoute({ children }) {
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
  
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

// Admin Route Component
function AdminRoute({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          return;
        }
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
          
        const { data: systemAdmin } = await supabase
          .from('system_admins')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();
          
        if (systemAdmin) {
          setUserRole(USER_ROLES.SYSTEM_ADMIN);
        } else if (profile?.is_admin) {
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
  
  if (userRole === USER_ROLES.MEMBER) {
    return <Navigate to="/overview" replace />;
  }
  
  return children;
}

// System Admin Route Component
function SystemAdminRoute({ children }) {
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          return;
        }
        
        const { data: systemAdmin } = await supabase
          .from('system_admins')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();
          
        setIsSystemAdmin(!!systemAdmin);
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
  
  return children;
}

// Dashboard Layout Component
function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();

  // Check auth state and fetch user profile
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/');
          return;
        }
        
        setUser(session.user);
        
        // Fetch user profile with organization data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *,
            organizations:organization_id (
              id,
              name,
              created_at
            )
          `)
          .eq('id', session.user.id)
          .single();
          
        if (profileError) throw profileError;
        
        setProfile(profileData);
        setOrganization(profileData.organizations);
        
        // Determine user role
        const { data: systemAdmin } = await supabase
          .from('system_admins')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();
          
        if (systemAdmin) {
          setUserRole(USER_ROLES.SYSTEM_ADMIN);
        } else if (profileData.is_admin) {
          setUserRole(USER_ROLES.ORG_ADMIN);
        } else {
          setUserRole(USER_ROLES.MEMBER);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        alert("There was a problem loading your profile. Please try signing in again.");
        navigate('/');
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
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      alert("Failed to sign out. Please try again.");
    }
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you would apply a class to the root element or use a theme provider
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
          
          <div className="hidden lg:flex items-center space-x-1">
            <Input 
              type="search" 
              placeholder="Search..." 
              className="w-64 h-9 bg-gray-100 dark:bg-gray-700 border-none"
              prefix={<Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
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
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100">
                    {profile?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline text-sm font-medium">
                  {profile?.full_name || user?.email}
                </span>
                <ChevronDown size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{profile?.full_name}</span>
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
                  <p className="text-sm font-medium text-gray-300 mb-1">Organization</p>
                  <p className="font-semibold">{organization?.name || "No Organization"}</p>
                </div>
                <Badge className={`
                  ${userRole === USER_ROLES.SYSTEM_ADMIN 
                    ? 'bg-purple-500 hover:bg-purple-600' 
                    : userRole === USER_ROLES.ORG_ADMIN 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : 'bg-green-500 hover:bg-green-600'}
                  text-white px-2.5 py-0.5 text-xs font-medium
                `}>
                  {userRole === USER_ROLES.SYSTEM_ADMIN ? 'ADMIN' : userRole === USER_ROLES.ORG_ADMIN ? 'ORG ADMIN' : 'MEMBER'}
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
                  
                  <Link
                    to="/members"
                    className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                      location.pathname === "/members" 
                        ? "bg-gray-700 text-white" 
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <UserPlus className="mr-3 h-5 w-5" />
                    Manage Members
                  </Link>
                  
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
            </nav>
            
            <div className="p-4 border-t border-gray-700">
              <Link to="/help">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-gray-300 border-gray-600 hover:text-white hover:bg-gray-700"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </Button>
              </Link>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 ml-0 lg:ml-64 p-4 lg:p-8 bg-gray-50 dark:bg-gray-900 overflow-auto">
          <Outlet context={{ userRole, profile, organization, user }} />
        </main>
      </div>
    </div>
  );
}

// Placeholder for User component
function User({ className, ...props }) {
  return <span className={className} {...props}>👤</span>;
}

// Placeholder for Clock component
function Clock({ className }) {
  return <span className={className}>⏱️</span>;
}

// DashboardOverview Component - Access context from the Outlet
function DashboardOverview() {
  const { userRole, profile, organization } = useOutletContext();
  
  // Component implementation same as before, but use the context from the outlet
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {profile?.full_name?.split(' ')[0] || 'User'}</h1>
      {/* Rest of the component... */}
    </div>
  );
}

// Other view components follow the same pattern
function TasksView() {
  return <h1 className="text-2xl font-bold mb-4">My Tasks</h1>;
}

function TeamView() {
  return <h1 className="text-2xl font-bold mb-4">Team Members</h1>;
}

function CalendarView() {
  return <h1 className="text-2xl font-bold mb-4">Calendar</h1>;
}

function MembersView() {
  const { organization } = useOutletContext();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Members</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Manage team members for {organization?.name}
      </p>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Organization Members</CardTitle>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Member table would go here */}
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">Member management interface</p>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsView() {
  return <h1 className="text-2xl font-bold mb-4">Analytics</h1>;
}

function OrganizationSettingsView() {
  return <h1 className="text-2xl font-bold mb-4">Organization Settings</h1>;
}

function OrganizationsView() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Organizations</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Manage all organizations across the system
      </p>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Organizations</CardTitle>
            <Button>
              <Building className="mr-2 h-4 w-4" />
              Add Organization
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Organizations table would go here */}
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">Organization management interface</p>
        </CardContent>
      </Card>
    </div>
  );
}

function AllUsersView() {
  return <h1 className="text-2xl font-bold mb-4">All Users</h1>;
}

function SystemSettingsView() {
  return <h1 className="text-2xl font-bold mb-4">System Settings</h1>;
}

function HelpSupportView() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Find answers and get assistance with Granite Flow
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Documentation & Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              Help and support resources would be listed here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Other components follow the same pattern...
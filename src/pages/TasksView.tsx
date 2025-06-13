import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  FileText,
  Edit3,
  Trash2,
  Search,
  Filter,
  SortAsc,
  Moon,
  Sun,
  Bell,
  Settings,
  MoreVertical,
  Target,
  TrendingUp,
  Activity,
  Mail,
  LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { Toaster} from 'sonner';
import supabase from "@/lib/supabaseClient";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  assigned_to: string;
  assigned_to_email?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
  };
}

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentUser: UserProfile | null;
}

const Navbar = ({ isDarkMode, toggleDarkMode, currentUser }: NavbarProps) => {
  return (
    <nav className={`border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 ${isDarkMode ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
            </div>
            
            {/* Navigation Links - Hidden on mobile */}
            <div className="hidden md:flex space-x-8">
              <a href="/overview" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </a>
              <a href="/tasks" className="text-sm font-medium text-foreground border-b-2 border-blue-500">
                Tasks
              </a>
              <a href="/settings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Settings
              </a>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* Dark Mode Toggle */}
            <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser?.avatar_url} alt={currentUser?.first_name} />
                    <AvatarFallback>
                      {currentUser?.first_name?.charAt(0) || currentUser?.email?.charAt(0).toLocaleUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{currentUser?.first_name} {currentUser?.last_name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  change: number | null;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend: 'up' | 'down';
}

const StatCard = ({ title, value, change, icon: Icon, color, trend }: StatCardProps) => (
  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold">{value}</p>
            {change && (
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trend === 'up' ? '+' : ''}{change}%
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center text-xs text-muted-foreground">
          <TrendingUp className="mr-1 h-3 w-3" />
          vs last week
        </div>
      )}
    </CardContent>
  </Card>
);

const TaskCard = ({ task, onStatusUpdate, onDelete, onEdit, getUserDisplayName, userRole, isOverdue }: { 
  task: Task; 
  onStatusUpdate: (id: string, status: Task['status']) => void; 
  onDelete: (id: string) => void; 
  onEdit: (task: Task) => void; 
  getUserDisplayName: (userId: string, email?: string) => string; 
  userRole: string; 
  isOverdue: boolean; 
}) => {
  const statusColors = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  const priorityColors = {
    low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    medium: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 border-0 shadow-sm ${
      isOverdue ? 'ring-2 ring-red-200 dark:ring-red-800 bg-red-50/50 dark:bg-red-950/20' : 
      'hover:shadow-xl hover:-translate-y-1'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-lg truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {task.title}
              </h3>
              {isOverdue && (
                <Badge className="bg-red-500 text-white animate-pulse">
                  Overdue
                </Badge>
              )}
            </div>
            
            {task.description && (
              <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(task.deadline).toLocaleDateString()} at {new Date(task.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {getUserDisplayName(task.assigned_to, task.assigned_to_email)?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground">{getUserDisplayName(task.assigned_to, task.assigned_to_email)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3 ml-6">
            <div className="flex items-center gap-2">
              <Badge className={statusColors[task.status]}>
                {task.status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Select 
                value={task.status} 
                onValueChange={(value) => onStatusUpdate(task.id, value as Task['status'])}
              >
                <SelectTrigger className="w-auto h-8 text-xs border-0 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              {(userRole === "org_admin" || userRole === "system_admin") && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600 dark:text-red-400"
                      onClick={() => onDelete(task.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Task form component to reuse between add and edit
const TaskForm = ({ 
  mode, 
  task, 
  users, 
  userId,
  onSubmit, 
  onCancel,
  assignByEmail,
  setAssignByEmail
}: { 
  mode: 'add' | 'edit'; 
  task: Task | null; 
  users: UserProfile[]; 
  userId: string | null; 
  onSubmit: (taskData: { title: string; description: string; deadline: string; priority: 'low' | 'medium' | 'high'; assignedTo: string | null; assigneeEmail: string | null }) => void; 
  onCancel: () => void; 
  assignByEmail: boolean; 
  setAssignByEmail: (value: boolean) => void; 
}) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [deadline, setDeadline] = useState(task?.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [assignedTo, setAssignedTo] = useState(task?.assigned_to || "");
  const [assigneeEmail, setAssigneeEmail] = useState(task?.assigned_to_email || "");
  const [emailValid, setEmailValid] = useState(true);
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setAssigneeEmail(email);
    setEmailValid(email === "" || validateEmail(email));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      window.alert("Title is required");
      return;
    }
    
    if (!deadline) {
      window.alert("Deadline is required");
      return;
    }

    if (assignByEmail && !emailValid) {
      window.alert("Please enter a valid email address");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      priority,
      assignedTo: assignByEmail ? null : assignedTo || userId,
      assigneeEmail: assignByEmail ? assigneeEmail : null
    });
  };

  return (
    <>
      <div className="grid gap-6 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="deadline">Deadline *</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="assignee">Assign To</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="assignByEmail" className="text-xs text-muted-foreground cursor-pointer">
                Assign by email
              </Label>
              <input
                type="checkbox"
                id="assignByEmail"
                checked={assignByEmail}
                onChange={() => setAssignByEmail(!assignByEmail)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {assignByEmail ? (
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={assigneeEmail}
                  onChange={handleEmailChange}
                  className={!emailValid ? "border-red-500" : ""}
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              {!emailValid && (
                <p className="text-xs text-red-500">Please enter a valid email address</p>
              )}
              <p className="text-xs text-muted-foreground">
                If the user doesn't exist, they will be invited to join
              </p>
            </div>
          ) : (
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={userId || ""}>Assign to myself</SelectItem>
                {users.filter(user => user.id !== userId).map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.first_name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          {mode === 'add' ? 'Create Task' : 'Update Task'}
        </Button>
      </DialogFooter>
    </>
  );
};

export default function TasksView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [currentEditingTask, setCurrentEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'created_at'>('deadline');
  const [assignByEmail, setAssignByEmail] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  // Fetch user info and role
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          console.error("User fetch error:", error);
          return;
        }

        setUserId(user.id);
        
        setCurrentUser({
          id: user.id,
          email: user.email || '',
          first_name: user.user_metadata?.first_name,
          last_name: user.user_metadata?.last_name,
          avatar_url: user.user_metadata?.avatar_url
        });

        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (roleError) {
          console.error("Role fetch error:", roleError);
          setUserRole('member');
        } else {
          setUserRole(roleData?.role);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from("user_profiles")
          .select("id, email, full_name, avatar_url");

        if (!profilesError && profilesData) {
          setUsers(profilesData);
          return;
        }

        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, email, full_name, avatar_url");

        if (!usersError && usersData) {
          setUsers(usersData);
          return;
        }

        if (currentUser) {
          setUsers([currentUser]);
        }

      } catch (error) {
        console.error("Error fetching users:", error);
        if (currentUser) {
          setUsers([currentUser]);
        }
      }
    };

    if ((userRole === "org_admin" || userRole === "system_admin") && currentUser) {
      fetchUsers();
    } else if (currentUser) {
      setUsers([currentUser]);
    }
  }, [userRole, currentUser]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        let query = supabase.from("tasks").select("*");
        
        if (userRole === "member" && userId) {
          query = query.eq("assigned_to", userId);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
          console.error("Fetch tasks error:", error);
        } else {
          setTasks(data || []);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && userRole) {
      fetchTasks();
    }
  }, [userId, userRole]);


  const handleEditTask = (task: Task) => {
    setCurrentEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const addTask = async (taskData: { title: string; description: string; deadline: string; priority: 'low' | 'medium' | 'high'; assignedTo: string | null; assigneeEmail: string | null }) => {
    if (userRole !== "org_admin" && userRole !== "system_admin") {
      window.alert("You are not authorized to add tasks.");
      return;
    }

    let assignedToId = taskData.assignedTo;
    let assignedToEmail = null;

    // If assigning by email
    if (taskData.assigneeEmail) {
      // Check if user with this email already exists
      const { data: existingUsers, error: userCheckError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("email", taskData.assigneeEmail)
        .single();

      if (userCheckError && userCheckError.code !== 'PGRST116') { // PGRST116 is "not found" which is expected
        console.error("User check error:", userCheckError);
        window.alert("Error checking user existence");
        return;
      }

      if (existingUsers) {
        // User exists, use their ID
        assignedToId = existingUsers.id;
      } else {
        // User doesn't exist, store email for invitation
        assignedToEmail = taskData.assigneeEmail;
        // We could trigger an invitation flow here
        window.alert(`User with email ${assignedToEmail} will be invited`);
      }
    }

    const newTask = {
      title: taskData.title,
      description: taskData.description,
      status: "pending",
      priority: taskData.priority,
      deadline: new Date(taskData.deadline).toISOString(),
      assigned_to: assignedToId,
      assigned_to_email: assignedToEmail,
      created_by: userId,
    };

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([newTask])
        .select()
        .single();

      if (error) {
        console.error("Insert task error:", error);
        window.alert("Failed to create task. Please try again.");
      } else {
        setTasks((prev) => [data, ...prev]);
        window.alert("Task created successfully!");
        setIsAddDialogOpen(false);
        
        // If we're inviting a new user
        if (assignedToEmail) {
          // We would typically trigger an invitation here
          // For demonstration, we'll show an invitation dialog
          setInviteEmail(assignedToEmail);
          setIsInviteDialogOpen(true);
        }
      }
    } catch (error) {
      console.error("Error adding task:", error);
      window.alert("Failed to create task. Please try again.");
    }
  };

  const updateTask = async (taskData: { title: string; description: string; deadline: string; priority: 'low' | 'medium' | 'high'; assignedTo: string | null; assigneeEmail: string | null }) => {
    if (!currentEditingTask) return;
    
    let assignedToId = taskData.assignedTo;
    let assignedToEmail = null;

    // If assigning by email
    if (taskData.assigneeEmail) {
      // Check if user with this email already exists
      const { data: existingUsers, error: userCheckError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("email", taskData.assigneeEmail)
        .single();

      if (userCheckError && userCheckError.code !== 'PGRST116') {
        console.error("User check error:", userCheckError);
        window.alert("Error checking user existence");
        return;
      }

      if (existingUsers) {
        // User exists, use their ID
        assignedToId = existingUsers.id;
      } else {
        // User doesn't exist, store email for invitation
        assignedToEmail = taskData.assigneeEmail;
        window.alert(`User with email ${assignedToEmail} will be invited`);
      }
    }

    const updatedTask = {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      deadline: new Date(taskData.deadline).toISOString(),
      assigned_to: assignedToId,
      assigned_to_email: assignedToEmail,
      updated_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase
        .from("tasks")
        .update(updatedTask)
        .eq("id", currentEditingTask.id);

      if (error) {
        console.error("Update task error:", error);
        window.alert("Failed to update task. Please try again.");
      } else {
        // setTasks(prev => 
        //   prev.map(task => 
        //     task.id === currentEditingTask.id 
        //       ? { ...task, ...updatedTask, assigned_to: updatedTask.assigned_to || "" }
        //       : task
        //   )
        // );
        window.alert("Task updated successfully!");
        setIsEditDialogOpen(false);
        setCurrentEditingTask(null);
        
        // If we're inviting a new user
        if (assignedToEmail) {
          setInviteEmail(assignedToEmail);
          setIsInviteDialogOpen(true);
        }
      }
    } catch (error) {
      console.error("Error updating task:", error);
      window.alert("Failed to update task. Please try again.");
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", taskId);

      if (error) {
        console.error("Update task error:", error);
        window.alert("Failed to update task status.");
      } else {
        setTasks(prev => 
          prev.map(task => 
            task.id === taskId 
              ? { ...task, status: newStatus, updated_at: new Date().toISOString() }
              : task
          )
        );
        window.alert("Task status updated!");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) {
        console.error("Delete task error:", error);
        window.alert("Failed to delete task.");
      } else {
        setTasks(prev => prev.filter(task => task.id !== taskId));
        window.alert("Task deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const sendInvitation = async () => {
    // In a real application, this would send an invitation email
    // For demonstration, we're just showing a success message
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      window.alert(`Invitation sent to ${inviteEmail}`);
      setIsInviteDialogOpen(false);
      setInviteEmail("");
      setInviteName("");
    } catch (error) {
      console.error("Error sending invitation:", error);
      window.alert("Failed to send invitation");
    }
  };

  const getUserDisplayName = (userId: string, email?: string) => {
    // If an email is provided (for users not in the system yet)
    if (email) return email;
    
    // Otherwise look up the user
    const user = users.find(u => u.id === userId);
    return user?.first_name + ' ' + (user?.last_name || '') || user?.email || userId;
  };

  const isOverdue = (deadline: string, status: string) => {
    return new Date(deadline) < new Date() && status !== 'completed';
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesFilter = filter === 'all' || task.status === filter;
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  // Calculate statistics
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => isOverdue(t.deadline, t.status)).length
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'dark' : ''}`}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? 'dark' : ''}`}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} currentUser={currentUser} />
      {/* <Toaster position="top-right" /> */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              {userRole === 'member' ? 'My Tasks' : 'Task Management'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {userRole === 'member' ? 'Stay on top of your assigned tasks' : 'Organize and track team progress'}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                <span>{completionRate}% completion rate</span>
              </div>
              <Progress value={completionRate} className="w-24 h-2" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="created_at">Created</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Add Task Button */}
            {(userRole === "org_admin" || userRole === "system_admin") && (
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            change={12}
            trend="up"
            icon={FileText}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            change={-5}
            trend="down"
            icon={Clock}
            color="bg-gradient-to-br from-amber-500 to-orange-500"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            change={8}
            trend="up"
            icon={AlertCircle}
            color="bg-gradient-to-br from-blue-500 to-indigo-500"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            change={15}
            trend="up"
            icon={CheckCircle}
            color="bg-gradient-to-br from-emerald-500 to-green-500"
          />
          <StatCard
            title="Overdue"
            value={stats.overdue}
            change={null}
            trend="down"
            icon={AlertCircle}
            color="bg-gradient-to-br from-red-500 to-pink-500"
          />
        </div>

        {/* Tasks List */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  {filter === 'all' ? 'All Tasks' : `${filter.charAt(0).toUpperCase() + filter.slice(1).replace('_', ' ')} Tasks`}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {filteredAndSortedTasks.length === 0 
                    ? `No ${filter === 'all' ? '' : filter.replace('_', ' ')} tasks found`
                    : `Showing ${filteredAndSortedTasks.length} task${filteredAndSortedTasks.length !== 1 ? 's' : ''}`
                  }
                </CardDescription>
              </div>
              
              {/* Add a quick filter here */}
              <div className="hidden md:flex space-x-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={filter === "all" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setFilter("all")}
                      >
                        All
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Show all tasks</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={filter === "pending" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setFilter("pending")}
                        className="text-amber-600"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Show pending tasks</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={filter === "in_progress" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setFilter("in_progress")}
                        className="text-blue-600"
                      >
                        <Activity className="h-3 w-3 mr-1" />
                        In Progress
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Show in-progress tasks</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={filter === "completed" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setFilter("completed")}
                        className="text-green-600"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Show completed tasks</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {filteredAndSortedTasks.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {searchTerm ? 'Try adjusting your search terms or filters.' : 
                   (userRole === "org_admin" || userRole === "system_admin") ? 
                   'Get started by creating your first task.' : 
                   'No tasks have been assigned to you yet.'}
                </p>
                {(userRole === "org_admin" || userRole === "system_admin") && !searchTerm && (
                  <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create your first task
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusUpdate={updateTaskStatus}
                    onDelete={deleteTask}
                    onEdit={handleEditTask}
                    getUserDisplayName={getUserDisplayName}
                    userRole={userRole || "member"}
                    isOverdue={isOverdue(task.deadline, task.status)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Add Task Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task and assign it to a team member.
            </DialogDescription>
          </DialogHeader>
          <TaskForm 
            mode="add"
            task={null}
            users={users}
            userId={userId}
            onSubmit={addTask}
            onCancel={() => setIsAddDialogOpen(false)}
            assignByEmail={assignByEmail}
            setAssignByEmail={setAssignByEmail}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) setCurrentEditingTask(null);
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Task</DialogTitle>
            <DialogDescription>
              Update task details and assignments.
            </DialogDescription>
          </DialogHeader>
          {currentEditingTask && (
            <TaskForm 
              mode="edit"
              task={currentEditingTask}
              users={users}
              userId={userId}
              onSubmit={updateTask}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setCurrentEditingTask(null);
              }}
              assignByEmail={assignByEmail}
              setAssignByEmail={setAssignByEmail}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Invite User</DialogTitle>
            <DialogDescription>
              Send an invitation to join your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email</Label>
              <Input
                id="inviteEmail"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteName">Full Name (optional)</Label>
              <Input
                id="inviteName"
                placeholder="Enter user's name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select defaultValue="member">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="org_admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={sendInvitation}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Building, 
  Phone,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  Users,
  Github,
  Chrome,
  Apple
} from "lucide-react";

// Import the real Supabase client
import supabase from "@/lib/supabaseClient";

export default function AuthPages() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [profileCreationPending, setProfileCreationPending] = useState(false);
  const [pendingProfileData, setPendingProfileData] = useState(null);

  // Check for existing session on load
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          
          // Check if we have a pending profile creation
          if (profileCreationPending && pendingProfileData) {
            console.log("Attempting to create profile after auth state change");
            await createUserProfileWithRetry(session.user.id, pendingProfileData);
            // Clear pending state regardless of success/failure
            setProfileCreationPending(false);
            setPendingProfileData(null);
          }
        } else {
          setUser(null);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [profileCreationPending, pendingProfileData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.company.trim()) newErrors.company = 'Company name is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to create user profile with retry mechanism
  const createUserProfileWithRetry = async (userId, profileData, retryCount = 0) => {
    try {
      console.log(`Creating user profile for ${userId}, attempt ${retryCount + 1}`);
      
      const profileRecord = {
        user_id: userId,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        company_name: profileData.company,
        phone_number: profileData.phone,
        email: profileData.email
      };

      console.log('Profile record to insert:', profileRecord);

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([profileRecord]);

      if (error) {
        console.error('Database error details:', error);
        
        // If RLS error and we haven't retried too many times, retry after a delay
        if (error.code === '42501' && retryCount < 3) {
          console.log(`Retrying profile creation in ${(retryCount + 1) * 500}ms...`);
          setTimeout(() => {
            createUserProfileWithRetry(userId, profileData, retryCount + 1);
          }, (retryCount + 1) * 500);
          return;
        }
        
        throw error;
      }
      
      console.log('Profile created successfully');
      
      
      // Also create role entry
      try {
        await assignUserRole(userId);
      } catch (roleError) {
        console.error('Role assignment failed, but profile was created:', roleError);
      }
      
      return data;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  // Function to assign default role to a user
  const assignUserRole = async (userId, role = 'member') => {
    try {
      console.log(`Assigning role '${role}' to user ${userId}`);
      
      const { data, error } = await supabase
        .from('user_roles')
        .insert([{
          user_id: userId,
          role: role
        }]);

      if (error) throw error;
      
      console.log('Role assigned successfully');
      return data;
    } catch (error) {
      console.error('Error assigning role:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      if (isLogin) {
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) throw error;
        console.log('Login successful:', data);
        
        // Set user state after successful login
        if (data.user) {
          setUser(data.user);
        }
      } else {
        // Sign up with Supabase
        console.log('Starting signup process...');
        
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              company: formData.company,
              phone: formData.phone
            },
          },
        });
        
        if (error) {
          console.error('Signup error:', error);
          throw error;
        }
        
        console.log('Signup successful:', data);

        // Only create profile if user was created successfully
        if (data.user && data.user.id) {
          console.log('User created, id:', data.user.id);
          
          // Store profile data to be created after auth state is fully established
          const profileData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            company: formData.company,
            phone: formData.phone,
            email: formData.email
          };
          
          // Set user and pending profile state
          setUser(data.user);
          setPendingProfileData(profileData);
          setProfileCreationPending(true);
          
          // Set initial success message
          if (data.session) {
            setErrors({ 
              success: 'Registration successful! Setting up your profile...'
            });
            
            // Wait for a moment and attempt profile creation directly
            setTimeout(async () => {
              try {
                await createUserProfileWithRetry(data.user.id, profileData);
                setErrors({ 
                  success: 'Registration and profile creation successful!'
                });
              } catch (profileError) {
                // Profile creation will be retried when auth state changes
                console.log("Initial profile creation attempt failed, will retry");
              }
            }, 1000);
          } else {
            // Email confirmation required
            setErrors({ 
              success: 'Registration successful! Please check your email to confirm your account.'
            });
          }
        } else {
          console.error('No user ID returned from signup');
          setErrors({ 
            auth: 'Account creation failed - no user ID returned.'
          });
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      
      // More specific error messages
      let errorMessage = error.message;
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account before signing in.';
      } else if (error.message?.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      }
      
      setErrors({ auth: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social logins
  const handleSocialLogin = async (provider) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
    } catch (error) {
      console.error(`${provider} login error:`, error.message);
      setErrors({ auth: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      setErrors({ email: "Please enter your email address first" });
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      setErrors({ success: "Password reset link sent to your email!" });
    } catch (error) {
      console.error('Password reset error:', error.message);
      setErrors({ auth: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      company: '',
      phone: '',
      role: ''
    });
  };

  const benefits = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and security protocols"
    },
    {
      icon: Zap,
      title: "Instant Setup",
      description: "Get started in less than 5 minutes"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Built for teams of all sizes"
    }
  ];

  // If user is already logged in, show welcome screen
  if (user) {
    console.log("User is already logged in:", user);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Welcome!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-gray-300">
              You are signed in as {user.email} and your user ID is {user.id} and your name is {user.user_metadata?.first_name + ' ' + user.user_metadata?.last_name || 'N/A'}.
            </p>
            {profileCreationPending && (
              <div className="p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-300 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Setting up your profile...</span>
                </div>
              </div>
            )}
            {errors.success && (
              <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
                {errors.success}
              </div>
            )}
            <Button 
              onClick={async () => {
                await supabase.auth.signOut();
                setUser(null);
                setProfileCreationPending(false);
                setPendingProfileData(null);
              }}
              className="w-full bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-purple-500/10 to-teal-500/10 rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}} />
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Benefits */}
        <div className="hidden lg:block space-y-8 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-teal-400">
              <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500/20 to-purple-500/20">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <div className="text-3xl font-bold">Granite Flow</div>
                <div className="text-sm text-gray-400">by Aurelion Future Forge</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white leading-tight">
                Transform Your Granite Processing Operation
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Join thousands of manufacturers who've revolutionized their workflows with intelligent automation and real-time tracking.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="p-2 rounded-lg bg-teal-500/20">
                    <Icon className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal-400" />
              <span>500+ Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal-400" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal-400" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="relative z-10">
          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="flex lg:hidden items-center justify-center gap-3 text-teal-400 mb-4">
                <Sparkles className="w-6 h-6" />
                <span className="text-xl font-bold">Granite Flow</span>
              </div>
              
              <CardTitle className="text-2xl font-bold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Create Your Account'}
              </CardTitle>
              <p className="text-gray-400">
                {isLogin 
                  ? 'Sign in to access your granite processing dashboard' 
                  : 'Join the future of intelligent manufacturing'
                }
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Display auth errors and success messages */}
              {errors.auth && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                  {errors.auth}
                </div>
              )}
              {errors.success && (
                <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
                  {errors.success}
                </div>
              )}
              
              {/* Social Login Buttons */}
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 hover:border-gray-500 hover:bg-gray-800/50 hover:text-white transition-all duration-300"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Continue with Google
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="border-gray-600 hover:border-gray-500 hover:bg-gray-800/50 hover:text-white transition-all duration-300"
                    onClick={() => handleSocialLogin('github')}
                    disabled={isLoading}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-600 hover:border-gray-500 hover:bg-gray-800/50 hover:text-white transition-all duration-300"
                    onClick={() => handleSocialLogin('apple')}
                    disabled={isLoading}
                  >
                    <Apple className="w-4 h-4 mr-2" />
                    Apple
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-900 px-2 text-gray-400">Or continue with email</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">First Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border ${errors.firstName ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300`}
                            placeholder="First name"
                          />
                        </div>
                        {errors.firstName && <p className="text-red-400 text-xs">{errors.firstName}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Last Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border ${errors.lastName ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300`}
                            placeholder="Last name"
                          />
                        </div>
                        {errors.lastName && <p className="text-red-400 text-xs">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Company Name</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border ${errors.company ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300`}
                          placeholder="Your company name"
                        />
                      </div>
                      {errors.company && <p className="text-red-400 text-xs">{errors.company}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border ${errors.phone ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300`}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword}</p>}
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-600 text-teal-500 focus:ring-teal-500" />
                      <span className="text-sm text-gray-400">Remember me</span>
                    </label>
                    <button 
                      type="button" 
                      onClick={handlePasswordReset}
                      className="text-sm text-teal-400 hover:text-teal-300 transition-colors duration-200"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center pt-4 border-t border-gray-700">
                <p className="text-gray-400">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={switchMode}
                    className="ml-2 text-teal-400 hover:text-teal-300 font-semibold transition-colors duration-200"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>

              {!isLogin && (
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-teal-400 hover:text-teal-300 transition-colors duration-200">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-teal-400 hover:text-teal-300 transition-colors duration-200">Privacy Policy</a>
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
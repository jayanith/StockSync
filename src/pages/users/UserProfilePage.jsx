
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { User, ArrowLeft, Mail, ShieldCheck, Edit3, Save, KeyRound, CalendarDays, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/context/AuthContext';

const UserProfilePage = () => {
  const { userId } = useParams(); // Can be 'profile' for current user or an ID for other users
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth(); // Get current user from AuthContext
  
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form fields for editing
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  // Add more fields as needed, e.g., phone, department

  // Map backend roles to frontend display roles
  const roleMapping = {
    'admin': 'Admin',
    'manager': 'Manager',
    'employee': 'Employee'
  };

  const userRoles = ["Admin", "Manager", "Employee"];

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // If viewing own profile or no userId specified, use current user from AuthContext
        if (userId === 'profile' || !userId) {
          // First try to get user from localStorage to prevent flicker
          const storedUserInfo = localStorage.getItem('userInfo');
          const loginTime = localStorage.getItem('loginTime');
          
          if (storedUserInfo) {
            const parsedUser = JSON.parse(storedUserInfo);
            // Add account status and login time
            const enhancedUser = {
              ...parsedUser,
              status: 'Active',
              lastLogin: loginTime ? new Date(loginTime).toLocaleString() : new Date().toLocaleString()
            };
            
            setUser(enhancedUser);
            setName(enhancedUser.name);
            setEmail(enhancedUser.email);
            setRole(roleMapping[enhancedUser.role] || enhancedUser.role);
            setIsLoading(false);
            return;
          } else if (currentUser) {
            // Fallback to currentUser from context if localStorage fails
            const enhancedUser = {
              ...currentUser,
              status: 'Active',
              lastLogin: loginTime ? new Date(loginTime).toLocaleString() : new Date().toLocaleString()
            };
            
            setUser(enhancedUser);
            setName(enhancedUser.name);
            setEmail(enhancedUser.email);
            setRole(roleMapping[enhancedUser.role] || enhancedUser.role);
            setIsLoading(false);
            return;
          } else {
            // If not logged in, redirect to login
            toast({ title: "Authentication Required", description: "Please log in to view your profile.", variant: "destructive" });
            navigate('/login');
            return;
          }
        }
        
        // If viewing another user's profile, fetch from API
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast({ title: "Authentication Required", description: "Please log in to view user profiles.", variant: "destructive" });
          navigate('/login');
          return;
        }

        try {
          const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const userData = await response.json();
          if (userData && userData.data) {
            const fetchedUser = userData.data;
            setUser(fetchedUser);
            setName(fetchedUser.name);
            setEmail(fetchedUser.email);
            setRole(roleMapping[fetchedUser.role] || fetchedUser.role);
          } else {
            throw new Error('Invalid user data format');
          }
        } catch (error) {
          console.error('Error fetching user from API:', error);
          // If API fails, try to get admin user from localStorage as fallback
          const allUsers = JSON.parse(localStorage.getItem('inventoryUsers')) || [];
          const adminUser = allUsers.find(u => u.role === 'Admin');
          
          if (adminUser) {
            setUser(adminUser);
            setName(adminUser.name);
            setEmail(adminUser.email);
            setRole(adminUser.role);
          } else {
            throw new Error('User not found');
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast({ title: "Error", description: "User not found or you don't have permission to view this profile.", variant: "destructive" });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate, toast, currentUser]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    // Validate form
    if (!name.trim() || !email.trim() || !role) {
      toast({ title: "Error", description: "All fields are required.", variant: "destructive" });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({ title: "Authentication Required", description: "Please log in to update your profile.", variant: "destructive" });
        return;
      }

      // Convert display role back to backend role format
      const backendRole = Object.keys(roleMapping).find(key => roleMapping[key] === role) || role.toLowerCase();
      
      // Prepare update data
      const updateData = {
        name,
        email,
        role: backendRole
      };

      // Determine if updating own profile or another user
      const endpoint = userId === 'profile' || !userId
        ? 'http://localhost:5000/api/users/profile'
        : `http://localhost:5000/api/users/${user._id}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUserData = await response.json();
      
      // Update local state
      if (updatedUserData && updatedUserData.data) {
        const updatedUser = updatedUserData.data;
        setUser(updatedUser);
        setName(updatedUser.name);
        setEmail(updatedUser.email);
        setRole(roleMapping[updatedUser.role] || updatedUser.role);
      }
      
      setIsEditing(false);
      toast({ title: "Success", description: "Profile updated successfully." });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><User className="h-12 w-12 animate-spin text-sky-500" /></div>;
  }

  if (!user) {
    return <div className="text-center py-10 text-red-500">User not found.</div>;
  }
  
  const DetailItem = ({ label, value, icon, className }) => {
    // Determine if this is the status field and value is 'Active'
    const isActiveStatus = label === 'Account Status' && value === 'Active';
    
    return (
      <div className={className}>
        <Label className="text-sm font-medium text-gray-400 flex items-center">
          {icon && React.cloneElement(icon, { className: "mr-2 h-4 w-4"})}
          {label}
        </Label>
        <p className={`${isActiveStatus ? 'text-green-400 font-medium' : 'text-gray-100'}`}>
          {isActiveStatus ? (
            <span className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              {value}
            </span>
          ) : (value || 'N/A')}
        </p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <Button variant="outline" onClick={() => navigate(userId === 'profile' ? '/' : '/users')} className="mb-6 text-sky-400 border-sky-500 hover:bg-sky-500/10">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <form onSubmit={handleSaveChanges}>
        <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
          <CardHeader className="border-b border-slate-700 pb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex items-center">
                <Avatar className="h-20 w-20 mr-4 border-2 border-sky-500">
                  <AvatarImage src={user.avatarUrl || `https://avatar.vercel.sh/${user.email}.png?size=128`} alt={user.name} />
                  <AvatarFallback className="bg-sky-600 text-white text-2xl">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                    {isEditing ? "Edit Profile" : user.name}
                  </CardTitle>
                  {!isEditing && <CardDescription className="text-gray-400">{user.role}</CardDescription>}
                </div>
              </div>
              <Button type={isEditing ? "submit" : "button"} onClick={() => { if(!isEditing) setIsEditing(true);}} className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md self-start md:self-center">
                {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit3 className="mr-2 h-4 w-4" />}
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
            {isEditing ? (
              <>
                <div>
                  <Label htmlFor="name" className="text-gray-300">Full Name*</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-300">Email Address*</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label htmlFor="role" className="text-gray-300">Role*</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      {userRoles.map(r => <SelectItem key={r} value={r} className="hover:bg-sky-700/50 focus:bg-sky-600">{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {/* Add more editable fields here */}
                <div className="md:col-span-2">
                    <Button type="button" variant="outline" className="text-yellow-400 border-yellow-500 hover:bg-yellow-500/10">
                        <KeyRound className="mr-2 h-4 w-4" /> Change Password (Mock)
                    </Button>
                </div>
              </>
            ) : (
              <>
                <DetailItem label="Full Name" value={user.name} icon={<User />} />
                <DetailItem label="Email Address" value={user.email} icon={<Mail />} />
                <DetailItem label="Role" value={user.role} icon={<ShieldCheck />} />
                <DetailItem label="Last Login" value={user.lastLogin || 'N/A'} icon={<CalendarDays />} />
                <DetailItem label="Account Status" value={user.status || 'N/A'} icon={<CheckCircle />} />
                {/* Add more display fields here */}
              </>
            )}
          </CardContent>
          {isEditing && (
            <CardFooter className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
              <Button type="button" variant="outline" onClick={() => { setIsEditing(false); /* Reset changes */ setName(user.name); setEmail(user.email); setRole(user.role); }} className="text-gray-300 border-slate-600 hover:bg-slate-700">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>
      </form>
    </motion.div>
  );
};

export default UserProfilePage;
  
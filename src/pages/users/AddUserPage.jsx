
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft, Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const AddUserPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState({});

  const userRoles = ["Admin", "Manager", "Warehouse Staff", "Customer"];

  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    if (!role) newErrors.role = 'Role is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ title: "Validation Error", description: "Please fill all required fields correctly.", variant: "destructive" });
      return;
    }

    const newUser = {
      id: `user${Date.now()}`,
      name: fullName,
      email,
      role,
      // In a real app, password would be hashed server-side
      // For mock, we don't store it.
      lastLogin: null, 
      status: 'Active', // Default status
    };

    const existingUsers = JSON.parse(localStorage.getItem('inventoryUsers')) || [];
    localStorage.setItem('inventoryUsers', JSON.stringify([...existingUsers, newUser]));

    toast({ title: "User Added", description: `${fullName} has been successfully added.` });
    navigate('/users');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6 text-sky-400 border-sky-500 hover:bg-sky-500/10">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
      </Button>

      <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent flex items-center">
            <UserPlus className="mr-3 h-7 w-7" /> Add New User
          </CardTitle>
          <CardDescription className="text-gray-400">Create a new user account for the system.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName" className={cn("text-gray-300", errors.fullName && "text-red-400")}>Full Name*</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g., John Smith" className={cn("bg-slate-700 border-slate-600", errors.fullName && "border-red-500")} />
                {errors.fullName && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={14} className="mr-1"/>{errors.fullName}</p>}
              </div>
              <div>
                <Label htmlFor="email" className={cn("text-gray-300", errors.email && "text-red-400")}>Email Address*</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g., john.smith@example.com" className={cn("bg-slate-700 border-slate-600", errors.email && "border-red-500")} />
                {errors.email && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={14} className="mr-1"/>{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="password" className={cn("text-gray-300", errors.password && "text-red-400")}>Password*</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" className={cn("bg-slate-700 border-slate-600", errors.password && "border-red-500")} />
                {errors.password && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={14} className="mr-1"/>{errors.password}</p>}
              </div>
              <div>
                <Label htmlFor="confirmPassword" className={cn("text-gray-300", errors.confirmPassword && "text-red-400")}>Confirm Password*</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className={cn("bg-slate-700 border-slate-600", errors.confirmPassword && "border-red-500")} />
                {errors.confirmPassword && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={14} className="mr-1"/>{errors.confirmPassword}</p>}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="role" className={cn("text-gray-300", errors.role && "text-red-400")}>Role*</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role" className={cn("w-full bg-slate-700 border-slate-600 text-white", errors.role && "border-red-500")}>
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    {userRoles.map(r => (
                      <SelectItem key={r} value={r} className="hover:bg-sky-700/50 focus:bg-sky-600">{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={14} className="mr-1"/>{errors.role}</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
            <Button type="button" variant="outline" onClick={() => navigate('/users')} className="text-gray-300 border-slate-600 hover:bg-slate-700">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
              <UserPlus className="mr-2 h-5 w-5" /> Add User
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default AddUserPage;
  
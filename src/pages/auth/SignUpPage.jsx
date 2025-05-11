
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, AlertCircle, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Full name is required.";
    
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (password && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
       toast({
        title: "Validation Error",
        description: "Please check the fields for errors.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Register user with the AuthContext
      const response = await register({ name, email, password });
      
      console.log('Registration response:', response); // Debug log
      
      toast({
        title: "Sign Up Successful",
        description: "Your account has been created. Redirecting to dashboard...",
      });
      
      // Navigate to dashboard instead of login since we're already logged in
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Registration error:', error); // Debug log
      toast({
        title: "Registration Failed",
        description: error.message || "Could not create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="bg-slate-800/70 border-slate-700 shadow-2xl shadow-sky-500/20">
          <CardHeader className="text-center">
             <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center mb-4"
            >
              <UserPlus className="h-10 w-10 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">Create Account</CardTitle>
            <CardDescription className="text-gray-400">Join InventoryPro today!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name" className={cn("text-gray-300 flex items-center", errors.name && "text-red-400")}>
                  <User className={cn("mr-2 h-4 w-4 text-sky-400", errors.name && "text-red-400")} /> Full Name
                </Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => { setName(e.target.value); if(errors.name) setErrors({...errors, name: null}); }}
                  className={cn("bg-slate-700 border-slate-600 focus:border-sky-500 text-white placeholder-gray-500", errors.name && "border-red-500 focus:border-red-500")}
                  aria-invalid={errors.name ? "true" : "false"}
                />
                {errors.name && <p className="text-xs text-red-400 flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" />{errors.name}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className={cn("text-gray-300 flex items-center", errors.email && "text-red-400")}>
                  <Mail className={cn("mr-2 h-4 w-4 text-sky-400", errors.email && "text-red-400")} /> Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if(errors.email) setErrors({...errors, email: null}); }}
                  className={cn("bg-slate-700 border-slate-600 focus:border-sky-500 text-white placeholder-gray-500", errors.email && "border-red-500 focus:border-red-500")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && <p className="text-xs text-red-400 flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" />{errors.email}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="password" className={cn("text-gray-300 flex items-center", errors.password && "text-red-400")}>
                  <Lock className={cn("mr-2 h-4 w-4 text-sky-400", errors.password && "text-red-400")} /> Password
                </Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if(errors.password) setErrors({...errors, password: null}); }}
                  className={cn("bg-slate-700 border-slate-600 focus:border-sky-500 text-white placeholder-gray-500", errors.password && "border-red-500 focus:border-red-500")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                {errors.password && <p className="text-xs text-red-400 flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" />{errors.password}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className={cn("text-gray-300 flex items-center", errors.confirmPassword && "text-red-400")}>
                  <Lock className={cn("mr-2 h-4 w-4 text-sky-400", errors.confirmPassword && "text-red-400")} /> Confirm Password
                </Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); if(errors.confirmPassword) setErrors({...errors, confirmPassword: null}); }}
                  className={cn("bg-slate-700 border-slate-600 focus:border-sky-500 text-white placeholder-gray-500", errors.confirmPassword && "border-red-500 focus:border-red-500")}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                />
                {errors.confirmPassword && <p className="text-xs text-red-400 flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" />{errors.confirmPassword}</p>}
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 mt-6">
                <UserPlus className="mr-2 h-5 w-5" /> Sign Up
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-3">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-sky-400 hover:underline hover:text-sky-300">
                Log in
              </Link>
            </p>
             <p className="text-xs text-amber-400 text-center px-4">
              Note: After signing up, you'll need to log in with your new credentials.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
  
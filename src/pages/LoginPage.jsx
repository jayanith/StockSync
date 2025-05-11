
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
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

    // Placeholder for login logic
    // IMPORTANT: Supabase integration is not complete.
    // Once Supabase is set up, you would call Supabase auth functions here.
    console.log("Login attempt with:", { email, password });
    toast({
      title: "Login Successful (Mock)",
      description: "You've been 'logged in'. Redirecting to homepage...",
    });
    
    // Simulate successful login and store a mock auth token
    localStorage.setItem('mockAuthToken', 'some-dummy-token');
    
    // Redirect to homepage or dashboard after "login"
    // For now, let's clear form and navigate to home
    setEmail('');
    setPassword('');
    setErrors({});
    setTimeout(() => navigate('/'), 1500); 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center py-12"
    >
      <Card className="w-full max-w-md bg-slate-800/70 border-slate-700 shadow-2xl shadow-purple-500/20">
        <CardHeader className="text-center">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4"
          >
            <LogIn className="h-8 w-8 text-white" />
          </motion.div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Welcome Back!</CardTitle>
          <CardDescription className="text-gray-400">Sign in to access your job tracking dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className={cn("text-gray-300 flex items-center", errors.email && "text-red-400")}>
                <Mail className={cn("mr-2 h-4 w-4 text-purple-400", errors.email && "text-red-400")} /> Email
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); if(errors.email) setErrors({...errors, email: null}); }}
                className={cn("bg-slate-700 border-slate-600 focus:border-purple-500 text-white placeholder-gray-500", errors.email && "border-red-500 focus:border-red-500")}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && <p className="text-xs text-red-400 flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" />{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className={cn("text-gray-300 flex items-center", errors.password && "text-red-400")}>
                <Lock className={cn("mr-2 h-4 w-4 text-purple-400", errors.password && "text-red-400")} /> Password
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if(errors.password) setErrors({...errors, password: null}); }}
                className={cn("bg-slate-700 border-slate-600 focus:border-purple-500 text-white placeholder-gray-500", errors.password && "border-red-500 focus:border-red-500")}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && <p className="text-xs text-red-400 flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" />{errors.password}</p>}
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300">
              <LogIn className="mr-2 h-5 w-5" /> Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-3">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-purple-400 hover:underline hover:text-purple-300">
              Sign up
            </Link>
          </p>
          <p className="text-xs text-amber-400 text-center">
            Note: Login is a simulation. For real authentication, please complete Supabase setup.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LoginPage;
  
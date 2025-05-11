
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

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
      // Use the login function from AuthContext
      const response = await login({ email, password });
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.user.name}! Redirecting to dashboard...`,
      });
      
      // Navigate to the dashboard
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
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
              <Package className="h-10 w-10 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">InventoryPro Login</CardTitle>
            <CardDescription className="text-gray-400">Access your inventory management dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className={cn("text-gray-300 flex items-center", errors.email && "text-red-400")}>
                  <Mail className={cn("mr-2 h-4 w-4 text-sky-400", errors.email && "text-red-400")} /> Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@example.com" 
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if(errors.email) setErrors({...errors, email: null}); }}
                  className={cn("bg-slate-700 border-slate-600 focus:border-sky-500 text-white placeholder-gray-500", errors.email && "border-red-500 focus:border-red-500")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && <p className="text-xs text-red-400 flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" />{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className={cn("text-gray-300 flex items-center", errors.password && "text-red-400")}>
                  <Lock className={cn("mr-2 h-4 w-4 text-sky-400", errors.password && "text-red-400")} /> Password
                </Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if(errors.password) setErrors({...errors, password: null}); }}
                  className={cn("bg-slate-700 border-slate-600 focus:border-sky-500 text-white placeholder-gray-500", errors.password && "border-red-500 focus:border-red-500")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                {errors.password && <p className="text-xs text-red-400 flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" />{errors.password}</p>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {/* Checkbox can be added here if needed */}
                </div>
                <Link to="/forgot-password" className="text-sm text-sky-400 hover:underline hover:text-sky-300">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300">
                <LogIn className="mr-2 h-5 w-5" /> Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-3">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-sky-400 hover:underline hover:text-sky-300">
                Sign up
              </Link>
            </p>
            <p className="text-xs text-amber-400 text-center px-4">
              Note: For testing, you can create an account or use the default admin account once set up.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
  
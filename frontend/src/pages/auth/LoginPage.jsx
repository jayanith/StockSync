import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, Package2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address.";
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
        title: "Incomplete Form",
        description: "Please check your login details.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({ email, password });
      
      toast({
        title: "Welcome Back",
        description: `Signed in as ${response.user?.name || 'Executive'} (${response.user?.role || 'Staff'})`,
      });
      
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Invalid email or password. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0d110f] text-[#f4f1ea]">
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="old-money-card border-[#232b26] rounded-xl shadow-xl overflow-hidden">
          <CardHeader className="text-center pb-4 pt-8 bg-[#101412] border-b border-[#1f2621]">
            <div className="mx-auto w-12 h-12 bg-[#171e1a] border border-[#c5a059]/40 rounded-xl flex items-center justify-center mb-3">
              <Package2 className="h-6 w-6 text-[#c5a059]" />
            </div>
            <CardTitle className="text-2xl font-serif font-bold text-[#f4f1ea] tracking-tight">Enterprise Portal</CardTitle>
            <CardDescription className="text-xs text-[#9e9a8f] mt-1">Sign in with your enterprise credentials to access inventory</CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className={cn("text-xs uppercase tracking-wider font-semibold text-[#c5a059] flex items-center", errors.email && "text-red-400")}>
                  <Mail className="mr-1.5 h-3.5 w-3.5 text-[#c5a059]" /> Email Address
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if(errors.email) setErrors({...errors, email: null}); }}
                  className={cn("bg-[#151a17] border-[#252e29] text-[#f4f1ea] focus:border-[#c5a059] text-xs h-11 rounded-lg", errors.email && "border-red-500")}
                />
                {errors.email && <p className="text-[11px] text-red-400 flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" />{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className={cn("text-xs uppercase tracking-wider font-semibold text-[#c5a059] flex items-center", errors.password && "text-red-400")}>
                  <Lock className="mr-1.5 h-3.5 w-3.5 text-[#c5a059]" /> Password
                </Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if(errors.password) setErrors({...errors, password: null}); }}
                  className={cn("bg-[#151a17] border-[#252e29] text-[#f4f1ea] focus:border-[#c5a059] text-xs h-11 rounded-lg", errors.password && "border-red-500")}
                />
                {errors.password && <p className="text-[11px] text-red-400 flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" />{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#9e9a8f] flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-[#5ea378]" /> Encrypted Session
                </span>
                <Link to="/forgot-password" className="text-xs text-[#c5a059] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full old-money-gold-btn text-xs uppercase tracking-wider py-3 mt-2 rounded-lg">
                <LogIn className="mr-2 h-4 w-4" /> {isLoading ? 'Verifying...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-center p-5 pt-0 border-t border-[#1f2621] bg-[#101412]/50 text-xs">
            <p className="text-[#9e9a8f] mt-3">
              Need a staff account?{' '}
              <Link to="/signup" className="font-semibold text-[#c5a059] hover:underline">
                Create Account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
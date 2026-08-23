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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Full name is required.";
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (password !== confirmPassword) {
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
        description: "Please check the registration fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register({ name, email, password });
      
      toast({
        title: "Account Registered",
        description: `Welcome, ${name}! Your account has been saved in MySQL database.`,
      });
      
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0b110e] text-[#f6f3eb]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <Card className="old-money-card border-[#36493e] rounded-2xl shadow-2xl overflow-hidden">
          <CardHeader className="text-center pb-4 pt-8 bg-[#0f1712]/70 border-b border-[#202f25]">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-[#19271f] border border-[#c5a059]/50 rounded-2xl flex items-center justify-center mb-3 shadow-lg"
            >
              <Package className="h-8 w-8 text-[#c5a059]" />
            </motion.div>
            <span className="text-[11px] uppercase tracking-widest text-[#c5a059] font-medium">New Account</span>
            <CardTitle className="text-2xl font-serif font-bold text-[#f8f6f0] mt-0.5">Register Identity</CardTitle>
            <CardDescription className="text-xs text-[#9ea8a1]">Create your system account stored securely in MySQL</CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className={cn("text-xs uppercase tracking-wider font-medium text-[#c5a059] flex items-center", errors.name && "text-red-400")}>
                  <User className="mr-1.5 h-3.5 w-3.5 text-[#c5a059]" /> Full Name
                </Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="e.g. Lord Alexander Sterling" 
                  value={name}
                  onChange={(e) => { setName(e.target.value); if(errors.name) setErrors({...errors, name: null}); }}
                  className={cn("bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] text-xs h-11", errors.name && "border-red-500")}
                />
                {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className={cn("text-xs uppercase tracking-wider font-medium text-[#c5a059] flex items-center", errors.email && "text-red-400")}>
                  <Mail className="mr-1.5 h-3.5 w-3.5 text-[#c5a059]" /> Corporate Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if(errors.email) setErrors({...errors, email: null}); }}
                  className={cn("bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] text-xs h-11", errors.email && "border-red-500")}
                />
                {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className={cn("text-xs uppercase tracking-wider font-medium text-[#c5a059] flex items-center", errors.password && "text-red-400")}>
                  <Lock className="mr-1.5 h-3.5 w-3.5 text-[#c5a059]" /> Password
                </Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Minimum 6 characters" 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if(errors.password) setErrors({...errors, password: null}); }}
                  className={cn("bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] text-xs h-11", errors.password && "border-red-500")}
                />
                {errors.password && <p className="text-[11px] text-red-400 mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className={cn("text-xs uppercase tracking-wider font-medium text-[#c5a059] flex items-center", errors.confirmPassword && "text-red-400")}>
                  <Lock className="mr-1.5 h-3.5 w-3.5 text-[#c5a059]" /> Confirm Password
                </Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Re-enter password" 
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); if(errors.confirmPassword) setErrors({...errors, confirmPassword: null}); }}
                  className={cn("bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] text-xs h-11", errors.confirmPassword && "border-red-500")}
                />
                {errors.confirmPassword && <p className="text-[11px] text-red-400 mt-1">{errors.confirmPassword}</p>}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full old-money-gold-btn text-xs uppercase tracking-wider py-3 shadow-lg mt-2">
                <UserPlus className="mr-2 h-4 w-4" /> {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-center space-y-2 p-6 pt-0 border-t border-[#202f25] bg-[#0f1712]/50 text-xs">
            <p className="text-[#9ea8a1] mt-3">
              Already possess credentials?{' '}
              <Link to="/login" className="font-medium text-[#c5a059] hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
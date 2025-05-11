
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, KeyRound, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    if (!email) {
      setError("Email is required.");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email address is invalid.");
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: "Validation Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    console.log("Password reset request for:", email);
    // MOCK PASSWORD RESET: In a real app, call Supabase or your backend here
    toast({
      title: "Password Reset Email Sent (Mock)",
      description: `If an account exists for ${email}, a password reset link has been sent.`,
    });
    
    setEmail('');
    setTimeout(() => navigate('/login'), 2500);
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
              <KeyRound className="h-10 w-10 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">Forgot Password?</CardTitle>
            <CardDescription className="text-gray-400">Enter your email to receive a reset link.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className={cn("text-gray-300 flex items-center", error && "text-red-400")}>
                  <Mail className={cn("mr-2 h-4 w-4 text-sky-400", error && "text-red-400")} /> Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if(error) setError(''); }}
                  className={cn("bg-slate-700 border-slate-600 focus:border-sky-500 text-white placeholder-gray-500", error && "border-red-500 focus:border-red-500")}
                  aria-invalid={error ? "true" : "false"}
                />
                {error && <p className="text-xs text-red-400 flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" />{error}</p>}
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300">
                Send Reset Link
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-3">
            <p className="text-sm text-gray-400">
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-sky-400 hover:underline hover:text-sky-300">
                Log in
              </Link>
            </p>
            <p className="text-xs text-amber-400 text-center px-4">
              Note: Password reset is a simulation. For real functionality, Supabase setup is required.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
  
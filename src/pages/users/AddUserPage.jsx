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
import { createUser } from '@/lib/api';

const AddUserPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Manager');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userRoles = ["Admin", "Manager", "Warehouse Staff", "Customer"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      toast({ title: "Validation Error", description: "All fields are required.", variant: "destructive" });
      return;
    }

    if (password.length < 6) {
      toast({ title: "Password Too Short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Validation Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      await createUser({
        name: fullName.trim(),
        email: email.trim(),
        password: password,
        role: role
      });

      toast({ title: "User Created", description: `${fullName} registered in MySQL with role: ${role}.` });
      navigate('/users');
    } catch (error) {
      console.error('Error creating user:', error);
      toast({ title: "Failed", description: error.message || "Failed to create user.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <Button 
        variant="outline" 
        onClick={() => navigate('/users')} 
        className="text-[#c5a059] border-[#3a4d41] hover:bg-[#1f2e25] hover:text-[#f8f6f0]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
      </Button>

      <Card className="old-money-card border-[#2e4034] rounded-xl shadow-2xl">
        <CardHeader className="border-b border-[#202f25] p-6 bg-[#0f1712]/70">
          <CardTitle className="text-2xl font-serif text-[#f8f6f0] flex items-center">
            <UserPlus className="mr-3 h-6 w-6 text-[#c5a059]" /> Register System Account
          </CardTitle>
          <CardDescription className="text-xs text-[#9ea8a1]">
            Create a new identity with tailored role-based access permissions.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 md:p-8 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">Full Legal Name *</Label>
                <Input 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  placeholder="e.g. Victoria Windsor" 
                  className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059]" 
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">Email / Login ID *</Label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="e.g. manager@example.com" 
                  className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059]" 
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">Password *</Label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Minimum 6 characters" 
                  className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059]" 
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">Confirm Password *</Label>
                <Input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Re-enter password" 
                  className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059]" 
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">Access Role *</Label>
                <div className="mt-1.5">
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="w-full bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-11">
                      <SelectValue placeholder="Select access role" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                      {userRoles.map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 p-6 border-t border-[#202f25] bg-[#0f1712]/50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/users')} 
              className="text-[#9ea8a1] border-[#2c3d32] hover:bg-[#18241d] hover:text-[#f8f6f0]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="old-money-gold-btn px-6 py-2"
            >
              <UserPlus className="mr-2 h-4 w-4" /> {isSubmitting ? 'Registering...' : 'Save User'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default AddUserPage;
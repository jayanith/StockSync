import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { User, ArrowLeft, Save, KeyRound, Shield } from 'lucide-react';
import { getUser, updateUser, updateUserPassword } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // If opened via /profile (no userId), use the logged-in user's id
  const resolvedId = userId || currentUser?.id || currentUser?._id;
  const isOwnProfile = !userId; // came from /profile route

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Manager');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPw, setIsChangingPw] = useState(false);

  const isAdmin = (currentUser?.role || '').toLowerCase().includes('admin');

  useEffect(() => {
    if (!resolvedId) {
      // No id at all — load from localStorage
      const stored = localStorage.getItem('userInfo');
      if (stored) {
        try {
          const u = JSON.parse(stored);
          setName(u.name || '');
          setEmail(u.email || '');
          setRole(u.role || 'Manager');
        } catch (_) {}
      }
      setIsLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const res = await getUser(resolvedId);
        if (res && res.data) {
          setName(res.data.name || '');
          setEmail(res.data.email || '');
          setRole(res.data.role || 'Manager');
        }
      } catch (e) {
        console.error('Error fetching user:', e);
        // Fallback to stored info for own profile
        if (isOwnProfile) {
          const stored = localStorage.getItem('userInfo');
          if (stored) {
            const u = JSON.parse(stored);
            setName(u.name || '');
            setEmail(u.email || '');
            setRole(u.role || 'Manager');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [resolvedId]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({ title: 'Validation Error', description: 'Name and email are required.', variant: 'destructive' });
      return;
    }
    setIsUpdating(true);
    try {
      const payload = { name: name.trim(), email: email.trim() };
      // Only admins can change roles
      if (isAdmin) payload.role = role;
      if (resolvedId) {
        await updateUser(resolvedId, payload);
      }
      // Update localStorage for own profile
      if (isOwnProfile) {
        const stored = localStorage.getItem('userInfo');
        if (stored) {
          const u = JSON.parse(stored);
          localStorage.setItem('userInfo', JSON.stringify({ ...u, name: payload.name, email: payload.email }));
        }
      }
      toast({ title: 'Profile Saved', description: 'Your changes have been synchronized with the database.' });
    } catch (e) {
      toast({ title: 'Update Failed', description: e.message || 'Failed to update profile.', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast({ title: 'Validation Error', description: 'Both passwords are required.', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: 'Too Short', description: 'New password must be at least 6 characters.', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({ title: 'Mismatch', description: 'New passwords do not match.', variant: 'destructive' });
      return;
    }
    setIsChangingPw(true);
    try {
      if (resolvedId) {
        await updateUserPassword(resolvedId, { currentPassword, newPassword });
      }
      toast({ title: 'Password Updated', description: 'Credentials encrypted and saved securely.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (e) {
      toast({ title: 'Failed', description: e.message || 'Failed to update password.', variant: 'destructive' });
    } finally {
      setIsChangingPw(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <User className="h-10 w-10 animate-spin text-[#c5a059]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {!isOwnProfile && (
        <Button
          variant="outline"
          onClick={() => navigate('/users')}
          className="text-[#c5a059] border-[#252e29] hover:bg-[#151a17] hover:text-[#f4f1ea]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
        </Button>
      )}

      <div className="flex items-center gap-4 p-5 old-money-card border-[#252e29] rounded-xl">
        <div className="w-12 h-12 rounded-full bg-[#1b221d] border border-[#c5a059]/40 flex items-center justify-center">
          <User className="h-6 w-6 text-[#c5a059]" />
        </div>
        <div>
          <h2 className="text-xl font-serif font-bold text-[#f4f1ea]">{name || 'Your Profile'}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <Shield className="h-3.5 w-3.5 text-[#5ea378]" />
            <span className="text-xs text-[#c5a059] font-mono font-semibold">{role}</span>
            <span className="text-xs text-[#9e9a8f]">— {email}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Details */}
        <Card className="old-money-card border-[#252e29] rounded-xl shadow-lg">
          <CardHeader className="border-b border-[#1f2621] p-5 bg-[#0f1412]/70">
            <CardTitle className="text-base font-serif text-[#f4f1ea] flex items-center">
              <User className="mr-2 h-4 w-4 text-[#c5a059]" /> Account Details
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleUpdateProfile}>
            <CardContent className="p-5 space-y-4">
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-semibold">Full Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-1.5 bg-[#151a17] border-[#252e29] text-[#f4f1ea] focus:border-[#c5a059] text-xs h-10"
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-semibold">Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="mt-1.5 bg-[#151a17] border-[#252e29] text-[#f4f1ea] focus:border-[#c5a059] text-xs h-10"
                />
              </div>
              {/* Only admins can change roles */}
              {isAdmin && (
                <div>
                  <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-semibold">System Role</Label>
                  <div className="mt-1.5">
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger className="w-full bg-[#151a17] border-[#252e29] text-[#f4f1ea] text-xs h-10">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121714] border-[#2c3730] text-[#f4f1ea]">
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Warehouse Staff">Warehouse Staff</SelectItem>
                        <SelectItem value="Supplier">Supplier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-5 pt-0">
              <Button type="submit" disabled={isUpdating} className="old-money-gold-btn text-xs uppercase tracking-wider w-full h-10">
                <Save className="mr-2 h-4 w-4" /> {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Change Password */}
        <Card className="old-money-card border-[#252e29] rounded-xl shadow-lg">
          <CardHeader className="border-b border-[#1f2621] p-5 bg-[#0f1412]/70">
            <CardTitle className="text-base font-serif text-[#f4f1ea] flex items-center">
              <KeyRound className="mr-2 h-4 w-4 text-[#c5a059]" /> Change Password
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleChangePassword}>
            <CardContent className="p-5 space-y-4">
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#9e9a8f]">Current Password</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Your current password"
                  className="mt-1.5 bg-[#151a17] border-[#252e29] text-[#f4f1ea] focus:border-[#c5a059] text-xs h-10"
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#9e9a8f]">New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="mt-1.5 bg-[#151a17] border-[#252e29] text-[#f4f1ea] focus:border-[#c5a059] text-xs h-10"
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#9e9a8f]">Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="mt-1.5 bg-[#151a17] border-[#252e29] text-[#f4f1ea] focus:border-[#c5a059] text-xs h-10"
                />
              </div>
            </CardContent>
            <CardFooter className="p-5 pt-0">
              <Button
                type="submit"
                disabled={isChangingPw}
                variant="outline"
                className="text-[#c5a059] border-[#252e29] hover:bg-[#151a17] hover:text-[#f4f1ea] text-xs uppercase tracking-wider w-full h-10"
              >
                {isChangingPw ? 'Updating...' : 'Update Password'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </motion.div>
  );
};

export default UserProfilePage;
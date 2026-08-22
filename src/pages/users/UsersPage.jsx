import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Users, PlusCircle, Search, Mail, Shield, UserCheck, Trash2, Eye } from 'lucide-react';
import { getUsers, deleteUser } from '@/lib/api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await getUsers();
      if (res && res.data) {
        setUsers(res.data);
      }
    } catch (e) {
      console.error('Error fetching users:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => (u.id || u._id) !== id));
      toast({ title: "User Removed", description: "User account deleted from database." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete user.", variant: "destructive" });
    }
  };

  const getRoleBadge = (role) => {
    const r = (role || '').toLowerCase();
    if (r.includes('admin')) return 'bg-[#332612] text-[#fde047] border-[#55401e]';
    if (r.includes('manager')) return 'bg-[#182833] text-[#7dd3fc] border-[#224458]';
    if (r.includes('staff')) return 'bg-[#173022] text-[#6ee7b7] border-[#225039]';
    return 'bg-[#253028] text-[#d1d5db] border-[#37473c]';
  };

  const filtered = users.filter(u => {
    const name = u.name || '';
    const email = u.email || '';
    const role = u.role || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           role.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 old-money-card border-[#2e4034] rounded-xl shadow-xl">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Access Control</span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#f8f6f0] mt-1 flex items-center">
            <Users className="mr-3 h-7 w-7 text-[#c5a059]" /> System Users & Roles
          </h1>
          <p className="text-xs text-[#9ea8a1] mt-0.5">Admin, Manager, Staff, and Client credential management</p>
        </div>
        <Link to="/users/new">
          <Button className="old-money-gold-btn text-xs uppercase tracking-wider py-2 px-4 shadow-lg">
            <PlusCircle className="mr-2 h-4 w-4" /> Add User Account
          </Button>
        </Link>
      </div>

      <Card className="old-money-card border-[#2e4034] rounded-xl">
        <CardHeader className="p-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#c5a059]" />
            <Input 
              type="text"
              placeholder="Search by full name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] text-xs h-11"
            />
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Users className="h-10 w-10 animate-spin text-[#c5a059]" />
        </div>
      ) : (
        <Card className="old-money-card border-[#2e4034] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-[#d8d3c5]">
              <thead className="text-[11px] uppercase tracking-wider text-[#9ea8a1] bg-[#121b16] border-b border-[#202f25]">
                <tr>
                  <th className="px-6 py-4 font-semibold">User Name</th>
                  <th className="px-6 py-4 font-semibold">Email / Login ID</th>
                  <th className="px-6 py-4 font-semibold">Assigned Role</th>
                  <th className="px-6 py-4 font-semibold">Account Status</th>
                  <th className="px-6 py-4 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2820]">
                {filtered.length > 0 ? (
                  filtered.map((user, idx) => {
                    const uid = user.id || user._id || idx + 1;
                    return (
                      <tr key={uid} className="hover:bg-[#16211a]/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-[#f8f6f0]">{user.name}</td>
                        <td className="px-6 py-4 font-mono text-[#c5a059]">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getRoleBadge(user.role)}`}>
                            {user.role || 'Customer'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[#6ee7b7] font-medium flex items-center gap-1 text-[11px]">
                            <UserCheck className="h-3 w-3" /> {user.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Link to={`/users/${uid}`}>
                              <Button variant="ghost" size="sm" className="h-8 text-xs text-[#c5a059] hover:bg-[#1f2e25] hover:text-[#f8f6f0]">
                                <Eye className="h-3.5 w-3.5 mr-1" /> Profile
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(uid)} 
                              className="h-8 text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-[#9ea8a1]">
                      No user accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default UsersPage;
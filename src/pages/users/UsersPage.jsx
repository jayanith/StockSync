
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Users, PlusCircle, Edit, Trash2, Search, Filter, ShieldCheck, UserCog, User as UserIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { toast } = useToast();

  // Map backend roles to frontend display roles
  const roleMapping = {
    'admin': 'Admin',
    'manager': 'Manager',
    'employee': 'Employee'
  };
  
  const userRoles = ["Admin", "Manager", "Employee"];

  // Fetch users from the backend API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      
      // Transform the data to match the expected format
      const formattedUsers = data.data.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: roleMapping[user.role] || user.role,
        lastLogin: user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'Never',
        status: 'Active'
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: error.message || "Could not fetch users. Make sure you're logged in as admin.",
        variant: "destructive"
      });
      // Fallback to empty array if fetch fails
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Update the local state after successful deletion
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      
      toast({
        title: "User Deleted",
        description: "User has been removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error.message || "Could not delete user.",
        variant: "destructive"
      });
    }
  };

  const getRoleIcon = (role) => {
    if (role === 'Admin') return <ShieldCheck className="h-5 w-5 text-red-400" />;
    if (role === 'Manager') return <UserCog className="h-5 w-5 text-sky-400" />;
    if (role === 'Warehouse Staff') return <UserIcon className="h-5 w-5 text-yellow-400" />;
    return <UserIcon className="h-5 w-5 text-green-400" />;
  };
  
  const filteredUsers = users.filter(user => {
    const matchesSearchTerm = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearchTerm && matchesRole;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Users className="h-10 w-10 animate-spin text-sky-500" /></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 bg-slate-800/50 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent flex items-center">
          <Users className="mr-3 h-8 w-8" /> User Management
        </h1>
        <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New User
        </Button>
      </div>

      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Filter & Search Users</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                type="text"
                placeholder="Search by Name or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 focus:border-sky-500 text-white w-full"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[200px] bg-slate-700 border-slate-600 text-white focus:ring-sky-500">
                <Filter className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all" className="hover:bg-sky-700/50 focus:bg-sky-600">All Roles</SelectItem>
                {userRoles.map(role => (
                  <SelectItem key={role} value={role} className="hover:bg-sky-700/50 focus:bg-sky-600">{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {filteredUsers.length > 0 ? (
        <div className="overflow-x-auto bg-slate-800/70 border border-slate-700 rounded-lg shadow-md">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Last Login</th>
                <th scope="col" className="px-6 py-3 text-center">Status</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-slate-700 hover:bg-slate-700/30"
                >
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 flex items-center">{getRoleIcon(user.role)}<span className="ml-2">{user.role}</span></td>
                  <td className="px-6 py-4">{user.lastLogin}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-600/30 text-green-300' : 'bg-gray-600/30 text-gray-400'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-1">
                    <Link to={`/users/${user.id}`}>
                      <Button variant="ghost" size="icon" className="text-sky-400 hover:text-sky-300 hover:bg-sky-900/30 h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-900/30 h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-800 border-slate-700 text-gray-200">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-400">Confirm Deletion</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to delete user "{user.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="text-gray-300 border-slate-600 hover:bg-slate-700">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-slate-800/50 rounded-xl shadow-xl"
        >
          <Users className="h-20 w-20 text-sky-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">No Users Found</h2>
          <p className="text-gray-400 mb-6">
            {searchTerm || roleFilter !== 'all' ? 'No users match your current filters.' : 'There are no users to display.'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UsersPage;
  
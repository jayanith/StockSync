
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, Bell, UserCircle, LogOut, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = ({ onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Try to get user info from multiple sources
    if (currentUser && currentUser.name) {
      setUserName(currentUser.name);
    } else {
      // Fallback to localStorage if context doesn't have user
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        try {
          const parsedUser = JSON.parse(storedUserInfo);
          setUserName(parsedUser.name || 'User');
        } catch (error) {
          console.error('Error parsing user info:', error);
          setUserName('User');
        }
      } else {
        setUserName('User');
      }
    }
  }, [currentUser]);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="bg-slate-800/80 backdrop-blur-md shadow-lg fixed top-0 left-0 right-0 z-50 h-16 flex items-center"
    >
      <div className="container mx-auto px-4 flex justify-between items-center w-full">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div whileHover={{ rotate: [0, 10, -10, 0], scale: 1.1 }}>
            <Package className="h-8 w-8 text-sky-400" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
            InventoryPro
          </span>
        </Link>
        
        <div className="flex items-center space-x-3 md:space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-slate-700/50">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full text-gray-300 hover:text-white hover:bg-slate-700/50 flex items-center gap-2 px-3">
                <UserCircle className="h-6 w-6" />
                <span className="hidden md:inline text-sm font-medium">{userName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-gray-200" align="end">
              <DropdownMenuLabel className="text-gray-400">
                <div className="flex flex-col">
                  <span className="text-sky-400 font-medium">{userName}</span>
                  <span className="text-xs text-gray-500">Logged in as {currentUser?.role || 'User'}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700"/>
              <DropdownMenuItem className="hover:bg-slate-700/80 focus:bg-slate-700/80 cursor-pointer">
                <Link to="/profile" className="flex items-center w-full">
                  <UserCircle className="mr-2 h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700"/>
              <DropdownMenuItem onClick={onLogout} className="text-red-400 hover:bg-red-700/20 focus:bg-red-700/20 focus:text-red-300 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-gray-300 hover:text-white hover:bg-slate-700/50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      {/* Mobile menu can be implemented here if needed, or integrated with Sidebar toggle */}
    </motion.header>
  );
};

export default Header;
  
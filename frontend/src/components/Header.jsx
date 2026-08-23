import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3, UserCircle, LogOut, Shield } from 'lucide-react';
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
  const { currentUser } = useAuth();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (currentUser && currentUser.name) {
      setUserName(currentUser.name);
    } else {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        try {
          const parsedUser = JSON.parse(storedUserInfo);
          setUserName(parsedUser.name || 'User');
        } catch (error) {
          setUserName('User');
        }
      } else {
        setUserName('Executive');
      }
    }
  }, [currentUser]);

  return (
    <header className="bg-[#101412] border-b border-[#232b26] fixed top-0 left-0 right-0 z-50 h-16 flex items-center shadow-md">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center w-full">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="p-2 rounded-lg bg-[#161c18] border border-[#2c3730] text-[#c5a059]">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-serif font-bold tracking-wide text-[#f4f1ea]">
              Stock<span className="text-[#c5a059]">Sync</span>
            </span>
          </div>
        </Link>
        
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#141916] border border-[#232b26] text-xs text-[#9e9a8f]">
            <Shield className="h-3.5 w-3.5 text-[#5ea378]" />
            <span className="text-[11px] font-medium text-[#c5a059]">JWT Authenticated</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-lg text-[#f4f1ea] hover:bg-[#18201b] border border-[#232b26] flex items-center gap-2.5 px-3 py-1.5 h-auto">
                <UserCircle className="h-4 w-4 text-[#c5a059]" />
                <span className="hidden md:inline text-xs font-medium">{userName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#121714] border-[#2c3730] text-[#f4f1ea] shadow-xl" align="end">
              <DropdownMenuLabel className="text-[#9e9a8f] pb-2">
                <div className="flex flex-col">
                  <span className="text-[#f4f1ea] font-medium text-xs">{userName}</span>
                  <span className="text-[11px] text-[#c5a059] font-mono mt-0.5">Role: {currentUser?.role || 'Staff'}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#1f2621]"/>
              <DropdownMenuItem className="hover:bg-[#18201b] focus:bg-[#18201b] cursor-pointer text-xs">
                <Link to="/profile" className="flex items-center w-full">
                  <UserCircle className="mr-2 h-4 w-4 text-[#c5a059]" /> User Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#1f2621]"/>
              <DropdownMenuItem onClick={onLogout} className="text-red-400 hover:bg-red-950/30 focus:bg-red-950/30 cursor-pointer text-xs">
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
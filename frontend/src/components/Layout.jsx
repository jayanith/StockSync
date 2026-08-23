import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast({
      title: "Signed Out",
      description: "You have been securely signed out.",
    });
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b110e] text-[#f6f3eb]">
      <Header onLogout={handleLogout} />
      <div className="flex flex-1 pt-16">
        <Sidebar onLogout={handleLogout} />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex-grow p-6 md:p-8 ml-0 md:ml-60 overflow-auto min-h-[calc(100vh-4rem)]"
        >
          <Outlet />
        </motion.main>
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;
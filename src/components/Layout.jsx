
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('mockAuthToken');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-gray-100">
      <Header onLogout={handleLogout} />
      <div className="flex flex-1 pt-16">
        <Sidebar onLogout={handleLogout} />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-grow p-6 md:p-8 ml-0 md:ml-64 overflow-auto"
        >
          <Outlet />
        </motion.main>
      </div>
      <Toaster />
      {/* Footer can be added here if needed, or removed if sidebar handles all info */}
    </div>
  );
};

export default Layout;
  
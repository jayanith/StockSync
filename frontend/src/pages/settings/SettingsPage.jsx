
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cog, Building, Bell, Palette, Users, KeyRound, Database, ArrowRight } from 'lucide-react';

const SettingCard = ({ title, description, icon, to, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="bg-slate-800/70 border-slate-700 hover:shadow-lg hover:shadow-sky-500/20 transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <div className="p-3 rounded-full bg-gradient-to-br from-sky-500 to-blue-600">
          {React.cloneElement(icon, { className: "h-6 w-6 text-white" })}
        </div>
        <div>
          <CardTitle className="text-lg font-semibold text-gray-100">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-400">{description}</p>
      </CardContent>
      <CardFooter>
        <Link to={to} className="w-full">
          <Button variant="outline" className="w-full text-sky-400 border-sky-500 hover:bg-sky-500/10 hover:text-sky-300">
            Configure <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  </motion.div>
);

const SettingsPage = () => {
  const settingsOptions = [
    { title: "Company Profile", description: "Manage your company's details, address, and branding.", icon: <Building />, to: "/settings/company", delay: 0.1 },
    { title: "Notification Settings", description: "Configure email and system alerts for various events.", icon: <Bell />, to: "/settings/notifications", delay: 0.2 },
    { title: "User Roles & Permissions", description: "Define roles and access levels for system users.", icon: <Users />, to: "/settings/roles", delay: 0.3 },
    { title: "Security Settings", description: "Manage password policies and multi-factor authentication.", icon: <KeyRound />, to: "/settings/security", delay: 0.4 },
    { title: "Appearance", description: "Customize the look and feel, including themes (dark/light mode).", icon: <Palette />, to: "/settings/appearance", delay: 0.5 },
    { title: "Data Management", description: "Backup, restore, or export your inventory data.", icon: <Database />, to: "/settings/data", delay: 0.6 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="p-6 bg-slate-800/50 rounded-xl shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-purple-500 bg-clip-text text-transparent flex items-center">
          <Cog className="mr-3 h-8 w-8" /> System Settings
        </h1>
        <p className="text-gray-400 mt-1">Configure and customize your InventoryPro application.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsOptions.map(setting => (
          <SettingCard key={setting.title} {...setting} />
        ))}
      </div>
    </motion.div>
  );
};

export default SettingsPage;
  
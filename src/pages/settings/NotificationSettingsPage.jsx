
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch'; // Will create this component
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Bell, ArrowLeft, Save, Mail, MessageSquare } from 'lucide-react';

const NotificationSettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const initialSettings = {
    lowStockAlerts: { email: true, system: true },
    newOrderReceived: { email: true, system: true },
    orderStatusUpdate: { email: false, system: true }, // Customer notifications
    poStatusUpdate: { email: true, system: true }, // Supplier/internal
    deliveryUpdates: { email: false, system: true }, // Customer notifications
  };

  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem('notificationSettings'));
    if (storedSettings) {
      setSettings(prev => ({...prev, ...storedSettings}));
    }
  }, []);

  const handleToggle = (category, type) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    toast({ title: "Settings Saved", description: "Notification preferences updated." });
  };

  const NotificationRow = ({ id, label, description }) => (
    <div className="py-4 border-b border-slate-700 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-gray-100">{label}</h4>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      <div className="flex space-x-8 mt-2">
        <div className="flex items-center space-x-2">
          <Switch
            id={`${id}-email`}
            checked={settings[id]?.email || false}
            onCheckedChange={() => handleToggle(id, 'email')}
          />
          <Label htmlFor={`${id}-email`} className="text-sm text-gray-300 flex items-center"><Mail className="mr-1.5 h-4 w-4 text-sky-400"/>Email</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id={`${id}-system`}
            checked={settings[id]?.system || false}
            onCheckedChange={() => handleToggle(id, 'system')}
          />
          <Label htmlFor={`${id}-system`} className="text-sm text-gray-300 flex items-center"><MessageSquare className="mr-1.5 h-4 w-4 text-sky-400"/>System</Label>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button variant="outline" onClick={() => navigate('/settings')} className="mb-6 text-sky-400 border-sky-500 hover:bg-sky-500/10">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
      </Button>

      <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent flex items-center">
            <Bell className="mr-3 h-7 w-7" /> Notification Settings
          </CardTitle>
          <CardDescription className="text-gray-400">Choose how you want to be notified.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <NotificationRow 
              id="lowStockAlerts" 
              label="Low Stock Alerts" 
              description="Receive alerts when product stock levels fall below threshold."
            />
            <NotificationRow 
              id="newOrderReceived" 
              label="New Customer Order" 
              description="Get notified when a new customer order is placed."
            />
            <NotificationRow 
              id="orderStatusUpdate" 
              label="Order Status Updates (Customer)" 
              description="Notify customers about changes to their order status (e.g., shipped, delivered)."
            />
            <NotificationRow 
              id="poStatusUpdate" 
              label="Purchase Order Updates" 
              description="Notifications for purchase order status changes (e.g., approved, received)."
            />
            <NotificationRow 
              id="deliveryUpdates" 
              label="Delivery Updates (Customer)" 
              description="Notify customers about delivery status (e.g., out for delivery, delivered)."
            />
          </CardContent>
          <CardFooter className="flex justify-end pt-6 border-t border-slate-700">
            <Button type="submit" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
              <Save className="mr-2 h-5 w-5" /> Save Preferences
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default NotificationSettingsPage;
  
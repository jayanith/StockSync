
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Layers, Users, ArrowRight, PlusCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

const StatCard = ({ title, value, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="bg-slate-800/70 border-slate-700 hover:shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        {React.cloneElement(icon, { className: `h-5 w-5 ${color}` })}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <p className="text-xs text-gray-400">Mock data</p>
      </CardContent>
    </Card>
  </motion.div>
);

const ActionButton = ({ to, title, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay }}
  >
    <Link to={to}>
      <Button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 py-6 text-base">
        {React.cloneElement(icon, { className: "mr-2 h-5 w-5"})}
        {title}
      </Button>
    </Link>
  </motion.div>
);

const HomePage = () => {
  const userName = "Admin"; // Placeholder, fetch from auth context later

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-slate-800/50 rounded-xl shadow-xl"
      >
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Welcome, {userName}!
          </span>
        </h1>
        <p className="text-gray-400 mt-1">Here's an overview of your inventory system.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Products" value="1,250" icon={<Package />} color="text-sky-400" delay={0.1} />
        <StatCard title="Total Orders" value="350" icon={<ShoppingCart />} color="text-green-400" delay={0.2} />
        <StatCard title="Out-of-Stock Items" value="15" icon={<Layers />} color="text-red-400" delay={0.3} />
        <StatCard title="Users Online" value="8" icon={<Users />} color="text-yellow-400" delay={0.4} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ActionButton to="/products/new" title="Add New Product" icon={<PlusCircle />} delay={0.5} />
        <ActionButton to="/orders/new" title="Create New Order" icon={<PlusCircle />} delay={0.6} />
        <ActionButton to="/inventory" title="View Inventory Status" icon={<ArrowRight />} delay={0.7} />
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Recent Orders (Mock Data)</CardTitle>
            <CardDescription className="text-gray-400">Displaying the last 5 mock orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Order ID</th>
                    <th scope="col" className="px-6 py-3">Customer</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="px-6 py-4 font-medium text-white">ORD-2025-00{123 + i}</td>
                      <td className="px-6 py-4">Customer {String.fromCharCode(65 + i)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          i % 3 === 0 ? 'bg-green-600/30 text-green-300' : 
                          i % 3 === 1 ? 'bg-yellow-600/30 text-yellow-300' : 
                                        'bg-blue-600/30 text-blue-300'
                        }`}>
                          {i % 3 === 0 ? 'Delivered' : i % 3 === 1 ? 'Pending' : 'Processing'}
                        </span>
                      </td>
                      <td className="px-6 py-4">${(Math.random() * 200 + 50).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default HomePage;
  
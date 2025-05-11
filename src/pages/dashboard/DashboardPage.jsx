
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Layers, Users, ArrowRight, PlusCircle, BarChartBig, Truck, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const StatCard = ({ title, value, icon, color, delay, unit }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="h-full"
  >
    <Card className="bg-slate-800/70 border-slate-700 hover:shadow-lg hover:shadow-sky-500/20 transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        {React.cloneElement(icon, { className: `h-5 w-5 ${color}` })}
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-3xl font-bold text-white">{value}{unit && <span className="text-lg ml-1">{unit}</span>}</div>
        <p className="text-xs text-gray-400">Mock data for demonstration</p>
      </CardContent>
    </Card>
  </motion.div>
);

const ActionButton = ({ to, title, icon, delay, description }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay }}
    className="h-full"
  >
    <Link to={to} className="h-full block">
      <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700/80 transition-all duration-300 h-full flex flex-col justify-between p-6 text-center hover:shadow-xl hover:shadow-sky-500/20">
        <div>
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full mb-3 mx-auto">
            {React.cloneElement(icon, { className: "h-6 w-6 text-white"})}
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>
        <Button variant="link" className="text-sky-400 mt-3 p-0 hover:text-sky-300">
          Go <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </Card>
    </Link>
  </motion.div>
);

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [userName, setUserName] = useState('User');
  
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
      }
    }
  }, [currentUser]);

  const mockRecentOrders = [
    { id: "ORD-2025-00123", customer: "Tech Solutions Inc.", status: "Delivered", total: 1250.00, date: "2025-05-01" },
    { id: "ORD-2025-00124", customer: "Gadget Galaxy", status: "Processing", total: 875.50, date: "2025-05-03" },
    { id: "ORD-2025-00125", customer: "Office Supplies Co.", status: "Pending Payment", total: 320.75, date: "2025-05-05" },
    { id: "ORD-2025-00126", customer: "Home Goods Ltd.", status: "Shipped", total: 150.00, date: "2025-05-06" },
    { id: "ORD-2025-00127", customer: "Innovate Systems", status: "Delivered", total: 2400.00, date: "2025-05-08" },
  ];

  const getStatusColor = (status) => {
    if (status === "Delivered") return "bg-green-600/30 text-green-300";
    if (status === "Processing" || status === "Shipped") return "bg-blue-600/30 text-blue-300";
    if (status === "Pending Payment") return "bg-yellow-600/30 text-yellow-300";
    return "bg-gray-600/30 text-gray-300";
  };


  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-slate-800/50 rounded-xl shadow-xl flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Welcome, {userName.charAt(0).toUpperCase() + userName.slice(1)}!
            </span>
          </h1>
          <p className="text-gray-400 mt-1">Your inventory control center.</p>
        </div>
        <div className="space-x-3">
            <Link to="/products/new">
                <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </Link>
            <Link to="/orders/new">
                <Button variant="outline" className="border-sky-500 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300">
                    <PlusCircle className="mr-2 h-4 w-4" /> New Order
                </Button>
            </Link>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Products" value="1,250" icon={<Package />} color="text-sky-400" delay={0.1} />
        <StatCard title="Pending Orders" value="42" icon={<ShoppingCart />} color="text-yellow-400" delay={0.2} />
        <StatCard title="Low Stock Items" value="15" icon={<Layers />} color="text-red-400" delay={0.3} />
        <StatCard title="Revenue (Month)" value="12.5k" unit="$" icon={<BarChartBig />} color="text-green-400" delay={0.4} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ActionButton to="/products" title="Manage Products" icon={<Package />} delay={0.5} description="View, edit, and add products." />
        <ActionButton to="/orders" title="Manage Orders" icon={<ShoppingCart />} delay={0.6} description="Track and process customer orders." />
        <ActionButton to="/inventory" title="Inventory Status" icon={<BarChartBig />} delay={0.7} description="Check stock levels and movements." />
        <ActionButton to="/deliveries" title="Track Deliveries" icon={<Truck />} delay={0.8} description="Monitor ongoing and completed deliveries." />
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Recent Orders</CardTitle>
            <CardDescription className="text-gray-400">Displaying the last 5 orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Order ID</th>
                    <th scope="col" className="px-6 py-3">Customer</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{order.id}</td>
                      <td className="px-6 py-4">{order.customer}</td>
                      <td className="px-6 py-4">{order.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">${order.total.toFixed(2)}</td>
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

export default DashboardPage;
  
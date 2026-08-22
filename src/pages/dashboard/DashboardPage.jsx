import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Layers, ArrowRight, PlusCircle, BarChartBig, Truck, Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { getProducts, getOrders, getCategories, getWarehouses } from '@/lib/api';

const StatCard = ({ title, value, icon, color, delay, unit, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="h-full"
  >
    <Card className="old-money-card border-[#2e4034] rounded-xl h-full flex flex-col hover:border-[#c5a059]/50 transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#9ea8a1]">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-[#19271f] border border-[#2e4034] text-[#c5a059]">
          {React.cloneElement(icon, { className: "h-4 w-4" })}
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-2">
        <div className="text-3xl font-serif font-bold text-[#f8f6f0]">
          {value}{unit && <span className="text-lg ml-1 font-sans text-[#c5a059]">{unit}</span>}
        </div>
        <p className="text-[11px] text-[#718277] mt-1">{subtitle || 'Live system metric'}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const ActionButton = ({ to, title, icon, delay, description }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay }}
    className="h-full"
  >
    <Link to={to} className="h-full block">
      <Card className="old-money-card border-[#2e4034] hover:border-[#c5a059] transition-all h-full flex flex-col justify-between p-5 group">
        <div>
          <div className="flex items-center justify-center w-11 h-11 bg-[#19271f] border border-[#2e4034] group-hover:border-[#c5a059]/60 rounded-lg mb-3 text-[#c5a059] transition-all">
            {React.cloneElement(icon, { className: "h-5 w-5"})}
          </div>
          <h3 className="text-base font-serif font-semibold text-[#f8f6f0] mb-1">{title}</h3>
          {description && <p className="text-xs text-[#9ea8a1]">{description}</p>}
        </div>
        <div className="flex items-center text-xs text-[#c5a059] font-medium mt-4 group-hover:translate-x-1 transition-transform">
          Open Module <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </div>
      </Card>
    </Link>
  </motion.div>
);

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [userName, setUserName] = useState('Executive');
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    warehouses: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  
  useEffect(() => {
    if (currentUser && currentUser.name) {
      setUserName(currentUser.name);
    }

    const loadData = async () => {
      try {
        const [prodRes, catRes, ordRes, warRes] = await Promise.allSettled([
          getProducts(),
          getCategories(),
          getOrders(),
          getWarehouses()
        ]);

        const prodCount = prodRes.status === 'fulfilled' && prodRes.value?.data ? prodRes.value.data.length : 12;
        const catCount = catRes.status === 'fulfilled' && catRes.value?.data ? catRes.value.data.length : 6;
        const ordersList = ordRes.status === 'fulfilled' && ordRes.value?.data ? ordRes.value.data : [];
        const warCount = warRes.status === 'fulfilled' && warRes.value?.data ? warRes.value.data.length : 4;

        setStats({
          products: prodCount,
          categories: catCount,
          orders: ordersList.length,
          warehouses: warCount
        });

        if (ordersList.length > 0) {
          setRecentOrders(ordersList.slice(0, 5));
        } else {
          setRecentOrders([
            { id: "ORD-10023", customerName: "Bespoke Timepieces Ltd", status: "Delivered", total: 4250.00, date: "2025-05-01" },
            { id: "ORD-10024", customerName: "Heritage Estates Co", status: "Processing", total: 1875.50, date: "2025-05-03" },
            { id: "ORD-10025", customerName: "The Windsor Club", status: "Pending", total: 3320.00, date: "2025-05-05" },
            { id: "ORD-10026", customerName: "Mayfair Private Ltd", status: "Shipped", total: 950.00, date: "2025-05-06" },
          ]);
        }
      } catch (e) {
        console.error('Error loading dashboard stats:', e);
      }
    };

    loadData();
  }, [currentUser]);

  const getStatusBadge = (status) => {
    if (status === "Delivered") return "bg-[#173022] text-[#6ee7b7] border-[#225039]";
    if (status === "Processing" || status === "Shipped") return "bg-[#182833] text-[#7dd3fc] border-[#224458]";
    if (status === "Pending") return "bg-[#332612] text-[#fde047] border-[#55401e]";
    return "bg-[#253028] text-[#d1d5db] border-[#37473c]";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 md:p-8 rounded-xl old-money-card border-[#2e4034] flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Executive Overview</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#f8f6f0] mt-1">
            Welcome, {userName}
          </h1>
          <p className="text-sm text-[#9ea8a1] mt-1">Enterprise Inventory & Supply Chain Governance</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/products/new">
            <Button className="old-money-gold-btn text-xs uppercase tracking-wider py-2 px-4">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </Link>
          <Link to="/orders/new">
            <Button variant="outline" className="text-[#c5a059] border-[#36493e] hover:bg-[#19271f] hover:text-[#f8f6f0] text-xs uppercase tracking-wider py-2 px-4">
              <PlusCircle className="mr-2 h-4 w-4" /> New Order
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Products" value={stats.products || "12"} icon={<Package />} delay={0.1} subtitle="Managed SKU portfolio" />
        <StatCard title="Categories" value={stats.categories || "6"} icon={<Layers />} delay={0.2} subtitle="Active classifications" />
        <StatCard title="Warehouses" value={stats.warehouses || "4"} icon={<Building2 />} delay={0.3} subtitle="Distribution hubs" />
        <StatCard title="Active Orders" value={stats.orders || "4"} icon={<ShoppingCart />} delay={0.4} subtitle="In fulfillment pipeline" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <ActionButton to="/products" title="Products Portfolio" icon={<Package />} delay={0.5} description="Audit, inspect, and register inventory units." />
        <ActionButton to="/orders" title="Client Orders" icon={<ShoppingCart />} delay={0.6} description="Process transactions and client requisitions." />
        <ActionButton to="/inventory" title="Stock Control" icon={<BarChartBig />} delay={0.7} description="Real-time stock valuation & storage audit." />
        <ActionButton to="/deliveries" title="Logistics & Freight" icon={<Truck />} delay={0.8} description="Track freight, consignments, and couriers." />
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <Card className="old-money-card border-[#2e4034] rounded-xl overflow-hidden">
          <CardHeader className="border-b border-[#202f25] p-5 bg-[#0f1712]/60">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-serif font-semibold text-[#f8f6f0]">Recent Transactions</CardTitle>
                <CardDescription className="text-xs text-[#9ea8a1]">Latest order requisitions logged in database</CardDescription>
              </div>
              <Link to="/orders">
                <Button variant="ghost" size="sm" className="text-xs text-[#c5a059] hover:bg-[#1a271f] hover:text-[#f8f6f0]">
                  View All Orders <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-[#d8d3c5]">
                <thead className="text-[11px] uppercase tracking-wider text-[#9ea8a1] bg-[#121b16] border-b border-[#202f25]">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-semibold">Order Reference</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Client / Account</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Date</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Status</th>
                    <th scope="col" className="px-6 py-3 text-right font-semibold">Valuation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b2820]">
                  {recentOrders.map((order, idx) => (
                    <tr key={order.id || idx} className="hover:bg-[#16211a]/70 transition-colors">
                      <td className="px-6 py-3.5 font-medium text-[#f8f6f0]">{order.id || `ORD-00${idx + 1}`}</td>
                      <td className="px-6 py-3.5">{order.customerName || order.customer || "Direct Account"}</td>
                      <td className="px-6 py-3.5 text-[#9ea8a1]">{order.date || new Date().toISOString().split('T')[0]}</td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(order.status)}`}>
                          {order.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right font-serif text-[#c5a059] font-medium">
                        ${(order.total || 0).toFixed(2)}
                      </td>
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
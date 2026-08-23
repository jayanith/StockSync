
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, BarChartBig, FileText, Users, ShoppingCart, Package, ArrowRight } from 'lucide-react';

const ReportCard = ({ title, description, icon, to, delay, active = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className={`${active ? 'bg-slate-800/70' : 'bg-slate-800/30'} border-slate-700 hover:shadow-lg ${active ? 'hover:shadow-sky-500/20' : 'hover:shadow-slate-500/10'} transition-shadow duration-300 h-full flex flex-col`}>
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <div className={`p-3 rounded-full ${active ? 'bg-gradient-to-br from-sky-500 to-blue-600' : 'bg-gradient-to-br from-slate-500 to-slate-600'}`}>
          {React.cloneElement(icon, { className: "h-6 w-6 text-white" })}
        </div>
        <div className="flex items-center space-x-2">
          <CardTitle className={`text-lg font-semibold ${active ? 'text-gray-100' : 'text-gray-400'}`}>{title}</CardTitle>
          {!active && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-400">Coming Soon</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-400">{description}</p>
      </CardContent>
      <CardFooter>
        {active ? (
          <Link to={to} className="w-full">
            <Button variant="outline" className="w-full text-sky-400 border-sky-500 hover:bg-sky-500/10 hover:text-sky-300">
              View Report <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" disabled className="w-full text-slate-500 border-slate-600 cursor-not-allowed opacity-70">
            Coming Soon <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  </motion.div>
);

const ReportsPage = () => {
  const reports = [
    { title: "Sales Report", description: "Analyze sales trends, revenue, and top-selling products.", icon: <LineChart />, to: "/reports/sales", delay: 0.1, active: true },
    { title: "Inventory Valuation", description: "Get current valuation of your stock across all warehouses.", icon: <BarChartBig />, to: "/reports/inventory-valuation", delay: 0.2, active: true },
    { title: "Stock Movement Report", description: "Track product movements between warehouses and stock adjustments.", icon: <Package />, to: "/reports/stock-movement", delay: 0.3, active: true },
    { title: "Purchase Order Summary", description: "Overview of all purchase orders, their statuses, and values.", icon: <FileText />, to: "/reports/po-summary", delay: 0.4, active: true },
    { title: "Customer Order Summary", description: "Summary of customer orders, fulfillment rates, and values.", icon: <ShoppingCart />, to: "/reports/customer-order-summary", delay: 0.5, active: true },
    { title: "Supplier Performance", description: "Analyze supplier reliability, lead times, and costs.", icon: <Users />, to: "/reports/supplier-performance", delay: 0.6, active: true },
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
          <LineChart className="mr-3 h-8 w-8" /> Reports & Analytics
        </h1>
        <p className="text-gray-400 mt-1">Gain insights into your inventory and business operations.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map(report => (
          <ReportCard key={report.title} {...report} />
        ))}
      </div>
       <Card className="bg-slate-800/70 border-slate-700 mt-8">
        <CardHeader>
            <CardTitle className="text-xl text-gray-200">Custom Report (Placeholder)</CardTitle>
            <CardDescription className="text-gray-400">Future: Build and save custom report configurations.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
            <FileText className="h-16 w-16 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">Custom report generation feature coming soon.</p>
        </CardContent>
       </Card>
    </motion.div>
  );
};

export default ReportsPage;
  
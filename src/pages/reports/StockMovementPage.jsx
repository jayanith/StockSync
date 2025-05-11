import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowDownUp, Download, Filter as FilterIcon, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const StockMovementPage = () => {
  const navigate = useNavigate();

  // Placeholder data
  const movementData = {
    totalInflow: 8250,
    totalOutflow: 6750,
    netChange: 1500,
    movementByType: [
      { type: "Purchase", value: 5500, direction: "in" },
      { type: "Sales", value: 4200, direction: "out" },
      { type: "Returns", value: 750, direction: "in" },
      { type: "Transfers", value: 2000, direction: "in" },
      { type: "Adjustments", value: 550, direction: "out" },
      { type: "Damages", value: 2000, direction: "out" }
    ],
    movementOverTime: [
      { month: "Jan", inflow: 1200, outflow: 1000 },
      { month: "Feb", inflow: 1300, outflow: 1100 },
      { month: "Mar", inflow: 1500, outflow: 1200 },
      { month: "Apr", inflow: 1350, outflow: 1150 },
      { month: "May", inflow: 1400, outflow: 1100 },
      { month: "Jun", inflow: 1500, outflow: 1200 }
    ],
    topMovedProducts: [
      { name: "Wireless Mouse X2000", inflow: 350, outflow: 300 },
      { name: "Bluetooth Headphones Pro", inflow: 250, outflow: 200 },
      { name: "Organic Cotton T-Shirt", inflow: 500, outflow: 450 },
      { name: "Smartphone Case", inflow: 600, outflow: 550 },
      { name: "USB-C Cable", inflow: 800, outflow: 700 }
    ],
    warehouseTransfers: [
      { from: "Main Warehouse", to: "Downtown Hub", quantity: 850 },
      { from: "Main Warehouse", to: "North Depot", quantity: 750 },
      { from: "Downtown Hub", to: "Main Warehouse", quantity: 250 },
      { from: "North Depot", to: "Downtown Hub", quantity: 150 }
    ]
  };
  
  // Chart references
  const movementChartRef = useRef(null);
  const typeChartRef = useRef(null);
  const productChartRef = useRef(null);
  const transferChartRef = useRef(null);
  
  // Initialize charts
  useEffect(() => {
    // Movement over time chart
    const movementCtx = movementChartRef.current.getContext('2d');
    const movementChart = new Chart(movementCtx, {
      type: 'line',
      data: {
        labels: movementData.movementOverTime.map(item => item.month),
        datasets: [
          {
            label: 'Inflow',
            data: movementData.movementOverTime.map(item => item.inflow),
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          },
          {
            label: 'Outflow',
            data: movementData.movementOverTime.map(item => item.outflow),
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#e2e8f0',
              font: { size: 12 }
            }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#e2e8f0',
            bodyColor: '#e2e8f0',
            borderColor: '#475569',
            borderWidth: 1,
            padding: 12
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(51, 65, 85, 0.4)',
              drawBorder: false,
            },
            ticks: { color: '#94a3b8' }
          },
          y: {
            grid: {
              color: 'rgba(51, 65, 85, 0.4)',
              drawBorder: false,
            },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    });
    
    // Movement by type chart
    const typeCtx = typeChartRef.current.getContext('2d');
    const typeChart = new Chart(typeCtx, {
      type: 'bar',
      data: {
        labels: movementData.movementByType.map(item => item.type),
        datasets: [{
          label: 'Movement Volume',
          data: movementData.movementByType.map(item => item.direction === 'in' ? item.value : -item.value),
          backgroundColor: movementData.movementByType.map(item => 
            item.direction === 'in' ? 'rgba(14, 165, 233, 0.7)' : 'rgba(244, 63, 94, 0.7)'
          ),
          borderColor: movementData.movementByType.map(item => 
            item.direction === 'in' ? 'rgba(14, 165, 233, 1)' : 'rgba(244, 63, 94, 1)'
          ),
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#e2e8f0',
            bodyColor: '#e2e8f0',
            borderColor: '#475569',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function(context) {
                const value = Math.abs(context.parsed.y);
                const direction = context.parsed.y >= 0 ? 'Inflow' : 'Outflow';
                return `${direction}: ${value} units`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(51, 65, 85, 0.4)',
              drawBorder: false,
            },
            ticks: { color: '#94a3b8' }
          },
          y: {
            grid: {
              color: 'rgba(51, 65, 85, 0.4)',
              drawBorder: false,
            },
            ticks: { 
              color: '#94a3b8',
              callback: function(value) {
                return Math.abs(value);
              }
            },
            afterFit: function(scaleInstance) {
              scaleInstance.width = 100;
            }
          }
        }
      }
    });
    
    // Top moved products chart
    const productCtx = productChartRef.current.getContext('2d');
    const productChart = new Chart(productCtx, {
      type: 'bar',
      data: {
        labels: movementData.topMovedProducts.map(item => item.name),
        datasets: [
          {
            label: 'Inflow',
            data: movementData.topMovedProducts.map(item => item.inflow),
            backgroundColor: 'rgba(14, 165, 233, 0.7)',
            borderColor: 'rgba(14, 165, 233, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Outflow',
            data: movementData.topMovedProducts.map(item => item.outflow),
            backgroundColor: 'rgba(244, 63, 94, 0.7)',
            borderColor: 'rgba(244, 63, 94, 1)',
            borderWidth: 1,
            borderRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#e2e8f0',
              font: { size: 12 }
            }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#e2e8f0',
            bodyColor: '#e2e8f0',
            borderColor: '#475569',
            borderWidth: 1,
            padding: 12
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(51, 65, 85, 0.4)',
              drawBorder: false,
            },
            ticks: { color: '#94a3b8' }
          },
          y: {
            grid: {
              color: 'rgba(51, 65, 85, 0.4)',
              drawBorder: false,
            },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    });
    
    // Warehouse transfers chart
    const transferCtx = transferChartRef.current.getContext('2d');
    const transferChart = new Chart(transferCtx, {
      type: 'sankey',
      data: {
        datasets: [{
          data: movementData.warehouseTransfers.map(item => ({
            from: item.from,
            to: item.to,
            flow: item.quantity
          })),
          colorFrom: 'rgba(14, 165, 233, 0.7)',
          colorTo: 'rgba(168, 85, 247, 0.7)',
          colorMode: 'gradient',
          labels: {
            color: '#e2e8f0',
            font: { size: 12 }
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#e2e8f0',
            bodyColor: '#e2e8f0',
            borderColor: '#475569',
            borderWidth: 1,
            padding: 12
          }
        }
      }
    });
    
    // Cleanup on component unmount
    return () => {
      movementChart.destroy();
      typeChart.destroy();
      productChart.destroy();
      try {
        transferChart.destroy();
      } catch (error) {
        console.warn('Sankey chart not supported in this version of Chart.js');
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <Button variant="outline" onClick={() => navigate('/reports')} className="mb-6 text-sky-400 border-sky-500 hover:bg-sky-500/10">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 bg-slate-800/50 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent flex items-center">
          <ArrowDownUp className="mr-3 h-8 w-8" /> Stock Movement Report
        </h1>
        <div className="flex gap-2">
            <Button variant="outline" className="text-gray-300 border-slate-600 hover:bg-slate-700">
                <Calendar className="mr-2 h-4 w-4" /> Date Range
            </Button>
            <Button variant="outline" className="text-gray-300 border-slate-600 hover:bg-slate-700">
                <FilterIcon className="mr-2 h-4 w-4" /> Filters
            </Button>
            <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                <Download className="mr-2 h-4 w-4" /> Export
            </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Stock Inflow" 
          value={`${movementData.totalInflow.toLocaleString()} units`}
          icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
          color="emerald"
        />
        <StatCard 
          title="Total Stock Outflow" 
          value={`${movementData.totalOutflow.toLocaleString()} units`}
          icon={<TrendingDown className="h-5 w-5 text-rose-400" />}
          color="rose"
        />
        <StatCard 
          title="Net Stock Change" 
          value={`${movementData.netChange > 0 ? '+' : ''}${movementData.netChange.toLocaleString()} units`}
          icon={<ArrowDownUp className="h-5 w-5 text-sky-400" />}
          color={movementData.netChange >= 0 ? "sky" : "rose"}
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Stock Movement Over Time</CardTitle>
            <CardDescription className="text-gray-400">Monthly inflow vs outflow comparison</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <canvas ref={movementChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Movement by Type</CardTitle>
            <CardDescription className="text-gray-400">Stock movement categorized by transaction type</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <canvas ref={typeChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Top Products by Movement Volume</CardTitle>
          <CardDescription className="text-gray-400">Products with highest combined inflow and outflow</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <canvas ref={productChartRef} className="w-full h-full"></canvas>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Warehouse Transfers</CardTitle>
          <CardDescription className="text-gray-400">Stock movement between warehouses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3">From</th>
                  <th scope="col" className="px-6 py-3">To</th>
                  <th scope="col" className="px-6 py-3 text-right">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {movementData.warehouseTransfers.map((transfer, index) => (
                  <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="px-6 py-4 font-medium text-white">{transfer.from}</td>
                    <td className="px-6 py-4">{transfer.to}</td>
                    <td className="px-6 py-4 text-right">{transfer.quantity} units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colorMap = {
    sky: "text-sky-400",
    emerald: "text-emerald-400",
    rose: "text-rose-400"
  };
  
  return (
    <Card className="bg-slate-700/50 border-slate-600">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardDescription className="text-sm text-gray-400">{title}</CardDescription>
          {icon}
        </div>
        <CardTitle className={`text-3xl font-bold ${colorMap[color] || "text-sky-400"}`}>{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default StockMovementPage;

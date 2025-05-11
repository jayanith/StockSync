import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChartBig, Download, Filter as FilterIcon, Warehouse, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const InventoryValuationPage = () => {
  const navigate = useNavigate();

  // Placeholder data
  const valuationData = {
    totalValue: 750320.75,
    totalItems: 12500,
    averageItemValue: 60.03,
    valueByWarehouse: [
      { name: "Main Warehouse", value: 450100.25, items: 7500 },
      { name: "Downtown Hub", value: 150050.00, items: 2500 },
      { name: "North Depot", value: 150170.50, items: 2500 },
    ],
    valueByCategory: [
      { name: "Electronics", value: 300000, items: 3000 },
      { name: "Clothing", value: 200000, items: 5000 },
      { name: "Home & Kitchen", value: 150320.75, items: 2000 },
      { name: "Books", value: 100000, items: 2500 },
    ],
    valueOverTime: [
      { month: "Jan", value: 620000 },
      { month: "Feb", value: 650000 },
      { month: "Mar", value: 680000 },
      { month: "Apr", value: 710000 },
      { month: "May", value: 730000 },
      { month: "Jun", value: 750320.75 }
    ],
    topValuedProducts: [
      { name: "4K Smart TV", value: 45000, quantity: 30 },
      { name: "Gaming Laptop", value: 36000, quantity: 12 },
      { name: "Designer Handbag", value: 28500, quantity: 19 },
      { name: "Smartphone Pro Max", value: 24000, quantity: 16 },
      { name: "Wireless Headphones", value: 18000, quantity: 60 }
    ]
  };
  
  // Chart references
  const warehouseChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  const trendChartRef = useRef(null);
  const productChartRef = useRef(null);
  
  // Initialize charts
  useEffect(() => {
    // Warehouse distribution chart
    const warehouseCtx = warehouseChartRef.current.getContext('2d');
    const warehouseChart = new Chart(warehouseCtx, {
      type: 'pie',
      data: {
        labels: valuationData.valueByWarehouse.map(item => item.name),
        datasets: [{
          data: valuationData.valueByWarehouse.map(item => item.value),
          backgroundColor: [
            'rgba(14, 165, 233, 0.8)',  // sky-500
            'rgba(59, 130, 246, 0.8)',  // blue-500
            'rgba(99, 102, 241, 0.8)',  // indigo-500
          ],
          borderColor: '#1e293b',
          borderWidth: 2,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#e2e8f0',
              font: { size: 12 },
              generateLabels: function(chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const value = valuationData.valueByWarehouse[i].value;
                    const formattedValue = new Intl.NumberFormat('en-US', { 
                      style: 'currency', 
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(value);
                    const percentage = Math.round((value / valuationData.totalValue) * 100);
                    
                    return {
                      text: `${label}: ${formattedValue} (${percentage}%)`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      hidden: false,
                      index: i
                    };
                  });
                }
                return [];
              }
            }
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
                const value = valuationData.valueByWarehouse[context.dataIndex].value;
                const formattedValue = new Intl.NumberFormat('en-US', { 
                  style: 'currency', 
                  currency: 'USD' 
                }).format(value);
                const percentage = Math.round((value / valuationData.totalValue) * 100);
                return `${formattedValue} (${percentage}% of total)`;
              }
            }
          }
        }
      }
    });
    
    // Category distribution chart
    const categoryCtx = categoryChartRef.current.getContext('2d');
    const categoryChart = new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: valuationData.valueByCategory.map(item => item.name),
        datasets: [{
          data: valuationData.valueByCategory.map(item => item.value),
          backgroundColor: [
            'rgba(14, 165, 233, 0.8)',  // sky-500
            'rgba(168, 85, 247, 0.8)',  // purple-500
            'rgba(236, 72, 153, 0.8)',  // pink-500
            'rgba(34, 197, 94, 0.8)',   // green-500
          ],
          borderColor: '#1e293b',
          borderWidth: 2,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#e2e8f0',
              font: { size: 12 },
              padding: 20,
              generateLabels: function(chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const value = valuationData.valueByCategory[i].value;
                    const formattedValue = new Intl.NumberFormat('en-US', { 
                      style: 'currency', 
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(value);
                    const percentage = Math.round((value / valuationData.totalValue) * 100);
                    
                    return {
                      text: `${label}: ${formattedValue} (${percentage}%)`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      hidden: false,
                      index: i
                    };
                  });
                }
                return [];
              }
            }
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
                const value = valuationData.valueByCategory[context.dataIndex].value;
                const formattedValue = new Intl.NumberFormat('en-US', { 
                  style: 'currency', 
                  currency: 'USD' 
                }).format(value);
                const percentage = Math.round((value / valuationData.totalValue) * 100);
                return `${formattedValue} (${percentage}% of total)`;
              }
            }
          }
        }
      }
    });
    
    // Inventory value trend chart
    const trendCtx = trendChartRef.current.getContext('2d');
    const trendChart = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: valuationData.valueOverTime.map(item => item.month),
        datasets: [{
          label: 'Inventory Value',
          data: valuationData.valueOverTime.map(item => item.value),
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
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
                const value = context.parsed.y;
                return 'Inventory Value: ' + new Intl.NumberFormat('en-US', { 
                  style: 'currency', 
                  currency: 'USD' 
                }).format(value);
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
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
    
    // Top valued products chart
    const productCtx = productChartRef.current.getContext('2d');
    const productChart = new Chart(productCtx, {
      type: 'bar',
      data: {
        labels: valuationData.topValuedProducts.map(item => item.name),
        datasets: [{
          label: 'Inventory Value',
          data: valuationData.topValuedProducts.map(item => item.value),
          backgroundColor: 'rgba(14, 165, 233, 0.7)',
          borderColor: 'rgba(14, 165, 233, 1)',
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
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
                const value = context.parsed.x;
                const quantity = valuationData.topValuedProducts[context.dataIndex].quantity;
                return [
                  'Value: ' + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value),
                  'Quantity: ' + quantity + ' units'
                ];
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
            ticks: {
              color: '#94a3b8',
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
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
    
    // Cleanup on component unmount
    return () => {
      warehouseChart.destroy();
      categoryChart.destroy();
      trendChart.destroy();
      productChart.destroy();
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
          <BarChartBig className="mr-3 h-8 w-8" /> Inventory Valuation Report
        </h1>
        <div className="flex gap-2">
            <Button variant="outline" className="text-gray-300 border-slate-600 hover:bg-slate-700">
                <Warehouse className="mr-2 h-4 w-4" /> Filter by Warehouse
            </Button>
            <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                <Download className="mr-2 h-4 w-4" /> Export
            </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Total Inventory Value" value={`$${valuationData.totalValue.toLocaleString()}`} />
        <StatCard title="Total Items" value={valuationData.totalItems.toLocaleString()} />
        <StatCard title="Avg. Item Value" value={`$${valuationData.averageItemValue.toLocaleString()}`} />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Inventory Value by Warehouse</CardTitle>
            <CardDescription className="text-gray-400">Distribution across storage locations</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <canvas ref={warehouseChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Inventory Value by Category</CardTitle>
            <CardDescription className="text-gray-400">Distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <canvas ref={categoryChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Inventory Value Trend</CardTitle>
            <CardDescription className="text-gray-400">6-month historical valuation</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <canvas ref={trendChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Top Valued Products</CardTitle>
            <CardDescription className="text-gray-400">Highest value items in inventory</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <canvas ref={productChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Top Valued Products Details</CardTitle>
          <CardDescription className="text-gray-400">Detailed breakdown of highest value inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3">Product</th>
                  <th scope="col" className="px-6 py-3 text-center">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {valuationData.topValuedProducts.map(product => (
                  <tr key={product.name} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                    <td className="px-6 py-4 text-center">{product.quantity}</td>
                    <td className="px-6 py-4 text-right">${product.value.toLocaleString()}</td>
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

const StatCard = ({ title, value }) => (
  <Card className="bg-slate-700/50 border-slate-600">
    <CardHeader className="pb-2">
      <CardDescription className="text-sm text-gray-400">{title}</CardDescription>
      <CardTitle className="text-3xl font-bold text-sky-400">{value}</CardTitle>
    </CardHeader>
  </Card>
);

export default InventoryValuationPage;

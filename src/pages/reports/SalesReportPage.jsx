
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LineChart as LineChartIcon, Calendar, Filter as FilterIcon, Download, PieChart, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const SalesReportPage = () => {
  const navigate = useNavigate();

  // Placeholder data - in a real app, this would come from state/API
  const salesData = {
    totalRevenue: 125830.50,
    totalOrders: 350,
    averageOrderValue: 359.52,
    topProducts: [
      { name: "Wireless Mouse X2000", unitsSold: 150, revenue: 4498.50 },
      { name: "Bluetooth Headphones Pro", unitsSold: 95, revenue: 9499.05 },
      { name: "Organic Cotton T-Shirt", unitsSold: 250, revenue: 4997.50 },
      { name: "Mechanical Keyboard", unitsSold: 85, revenue: 8499.15 },
      { name: "Smartphone Case", unitsSold: 320, revenue: 3199.80 },
    ],
    salesByMonth: [
      { month: "Jan", revenue: 15000, orders: 42 }, 
      { month: "Feb", revenue: 18000, orders: 51 },
      { month: "Mar", revenue: 22000, orders: 63 }, 
      { month: "Apr", revenue: 19500, orders: 55 },
      { month: "May", revenue: 25000, orders: 72 }, 
      { month: "Jun", revenue: 26330.50, orders: 67 }
    ],
    salesByCategory: [
      { category: "Electronics", revenue: 45250.30, percentage: 36 },
      { category: "Clothing", revenue: 32500.75, percentage: 26 },
      { category: "Home & Kitchen", revenue: 28079.45, percentage: 22 },
      { category: "Office Supplies", revenue: 20000.00, percentage: 16 }
    ]
  };
  
  // Chart references
  const salesChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  const productChartRef = useRef(null);
  
  // Initialize charts
  useEffect(() => {
    // Sales over time chart
    const salesCtx = salesChartRef.current.getContext('2d');
    const salesChart = new Chart(salesCtx, {
      type: 'line',
      data: {
        labels: salesData.salesByMonth.map(item => item.month),
        datasets: [
          {
            label: 'Revenue ($)',
            data: salesData.salesByMonth.map(item => item.revenue),
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Orders',
            data: salesData.salesByMonth.map(item => item.orders),
            borderColor: '#a855f7',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            yAxisID: 'y1'
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
            padding: 12,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.y !== null) {
                  if (context.dataset.yAxisID === 'y') {
                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                  } else {
                    label += context.parsed.y;
                  }
                }
                return label;
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
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Revenue ($)',
              color: '#94a3b8'
            },
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
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Orders',
              color: '#94a3b8'
            },
            grid: {
              drawOnChartArea: false,
            },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    });
    
    // Category pie chart
    const categoryCtx = categoryChartRef.current.getContext('2d');
    const categoryChart = new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: salesData.salesByCategory.map(item => item.category),
        datasets: [{
          data: salesData.salesByCategory.map(item => item.percentage),
          backgroundColor: [
            'rgba(14, 165, 233, 0.8)',  // sky-500
            'rgba(168, 85, 247, 0.8)',  // purple-500
            'rgba(59, 130, 246, 0.8)',  // blue-500
            'rgba(236, 72, 153, 0.8)'   // pink-500
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
                    const value = salesData.salesByCategory[i].revenue;
                    const formattedValue = new Intl.NumberFormat('en-US', { 
                      style: 'currency', 
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(value);
                    
                    return {
                      text: `${label}: ${formattedValue} (${data.datasets[0].data[i]}%)`,
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
                const value = salesData.salesByCategory[context.dataIndex].revenue;
                const formattedValue = new Intl.NumberFormat('en-US', { 
                  style: 'currency', 
                  currency: 'USD' 
                }).format(value);
                return `${formattedValue} (${context.parsed}% of total)`;
              }
            }
          }
        }
      }
    });
    
    // Product bar chart
    const productCtx = productChartRef.current.getContext('2d');
    const productChart = new Chart(productCtx, {
      type: 'bar',
      data: {
        labels: salesData.topProducts.map(item => item.name),
        datasets: [
          {
            label: 'Units Sold',
            data: salesData.topProducts.map(item => item.unitsSold),
            backgroundColor: 'rgba(14, 165, 233, 0.7)',
            borderColor: 'rgba(14, 165, 233, 1)',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y'
          },
          {
            label: 'Revenue ($)',
            data: salesData.topProducts.map(item => item.revenue),
            backgroundColor: 'rgba(168, 85, 247, 0.7)',
            borderColor: 'rgba(168, 85, 247, 1)',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y1'
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
            padding: 12,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.x !== null) {
                  if (context.dataset.yAxisID === 'y1') {
                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.x);
                  } else {
                    label += context.parsed.x;
                  }
                }
                return label;
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
            ticks: { color: '#94a3b8' }
          },
          y1: {
            position: 'right',
            grid: {
              display: false,
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
    
    // Cleanup on component unmount
    return () => {
      salesChart.destroy();
      categoryChart.destroy();
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
          <LineChartIcon className="mr-3 h-8 w-8" /> Sales Report
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
        <StatCard title="Total Revenue" value={`$${salesData.totalRevenue.toLocaleString()}`} />
        <StatCard title="Total Orders" value={salesData.totalOrders.toLocaleString()} />
        <StatCard title="Avg. Order Value" value={`$${salesData.averageOrderValue.toLocaleString()}`} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Sales Over Time</CardTitle>
            <CardDescription className="text-gray-400">Revenue and order volume trends</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <canvas ref={salesChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Sales by Category</CardTitle>
            <CardDescription className="text-gray-400">Revenue distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <canvas ref={categoryChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-1 gap-6">
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Top Selling Products</CardTitle>
            <CardDescription className="text-gray-400">Units sold vs revenue generated</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <canvas ref={productChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Top Selling Products Details</CardTitle>
          <CardDescription className="text-gray-400">Detailed breakdown of best performers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3">Product Name</th>
                  <th scope="col" className="px-6 py-3 text-center">Units Sold</th>
                  <th scope="col" className="px-6 py-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {salesData.topProducts.map(product => (
                  <tr key={product.name} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                    <td className="px-6 py-4 text-center">{product.unitsSold}</td>
                    <td className="px-6 py-4 text-right">${product.revenue.toLocaleString()}</td>
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

export default SalesReportPage;
  
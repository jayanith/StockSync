import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Filter as FilterIcon, Calendar, ShoppingCart, TrendingUp, Users, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const CustomerOrderSummaryPage = () => {
  const navigate = useNavigate();

  // Placeholder data
  const orderData = {
    totalOrders: 1250,
    totalValue: 450750.25,
    averageOrderValue: 360.60,
    fulfillmentRate: 92,
    orderByStatus: [
      { status: "Delivered", count: 950, value: 342570.25 },
      { status: "Shipped", count: 150, value: 54090.00 },
      { status: "Processing", count: 100, value: 36060.00 },
      { status: "Pending", count: 50, value: 18030.00 }
    ],
    orderOverTime: [
      { month: "Jan", count: 180, value: 64908.00 },
      { month: "Feb", count: 195, value: 70317.00 },
      { month: "Mar", count: 210, value: 75726.00 },
      { month: "Apr", count: 225, value: 81135.00 },
      { month: "May", count: 215, value: 77529.00 },
      { month: "Jun", count: 225, value: 81135.25 }
    ],
    orderByRegion: [
      { region: "North", count: 375, value: 135225.00 },
      { region: "South", count: 325, value: 117195.00 },
      { region: "East", count: 300, value: 108180.00 },
      { region: "West", count: 250, value: 90150.25 }
    ],
    topCustomers: [
      { name: "Acme Corporation", orders: 45, value: 16227.00, region: "North" },
      { name: "Globex Industries", orders: 38, value: 13702.80, region: "South" },
      { name: "Wayne Enterprises", orders: 35, value: 12621.00, region: "East" },
      { name: "Stark Industries", orders: 32, value: 11539.20, region: "West" },
      { name: "Umbrella Corp", orders: 30, value: 10818.00, region: "North" }
    ],
    recentOrders: [
      { id: "ORD-2025-1246", customer: "Acme Corporation", date: "2025-05-08", status: "Processing", value: 720.50 },
      { id: "ORD-2025-1247", customer: "Globex Industries", date: "2025-05-07", status: "Processing", value: 540.75 },
      { id: "ORD-2025-1248", customer: "Wayne Enterprises", date: "2025-05-06", status: "Shipped", value: 825.25 },
      { id: "ORD-2025-1249", customer: "Stark Industries", date: "2025-05-05", status: "Shipped", value: 650.00 },
      { id: "ORD-2025-1250", customer: "Umbrella Corp", date: "2025-05-04", status: "Shipped", value: 775.50 }
    ]
  };
  
  // Chart references
  const statusChartRef = useRef(null);
  const trendChartRef = useRef(null);
  const regionChartRef = useRef(null);
  const customerChartRef = useRef(null);
  
  // Status color mapping
  const statusColors = {
    "Delivered": "rgba(34, 197, 94, 0.7)",    // green-500
    "Shipped": "rgba(14, 165, 233, 0.7)",     // sky-500
    "Processing": "rgba(168, 85, 247, 0.7)",  // purple-500
    "Pending": "rgba(245, 158, 11, 0.7)"      // amber-500
  };
  
  const statusBorderColors = {
    "Delivered": "rgba(34, 197, 94, 1)",    // green-500
    "Shipped": "rgba(14, 165, 233, 1)",     // sky-500
    "Processing": "rgba(168, 85, 247, 1)",  // purple-500
    "Pending": "rgba(245, 158, 11, 1)"      // amber-500
  };
  
  // Region color mapping
  const regionColors = {
    "North": "rgba(14, 165, 233, 0.7)",     // sky-500
    "South": "rgba(236, 72, 153, 0.7)",     // pink-500
    "East": "rgba(34, 197, 94, 0.7)",       // green-500
    "West": "rgba(168, 85, 247, 0.7)"       // purple-500
  };
  
  const regionBorderColors = {
    "North": "rgba(14, 165, 233, 1)",     // sky-500
    "South": "rgba(236, 72, 153, 1)",     // pink-500
    "East": "rgba(34, 197, 94, 1)",       // green-500
    "West": "rgba(168, 85, 247, 1)"       // purple-500
  };
  
  // Initialize charts
  useEffect(() => {
    // Order Status chart
    const statusCtx = statusChartRef.current.getContext('2d');
    const statusChart = new Chart(statusCtx, {
      type: 'doughnut',
      data: {
        labels: orderData.orderByStatus.map(item => item.status),
        datasets: [{
          data: orderData.orderByStatus.map(item => item.count),
          backgroundColor: orderData.orderByStatus.map(item => statusColors[item.status]),
          borderColor: orderData.orderByStatus.map(item => statusBorderColors[item.status]),
          borderWidth: 1,
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
                    const count = orderData.orderByStatus[i].count;
                    const value = orderData.orderByStatus[i].value;
                    const formattedValue = new Intl.NumberFormat('en-US', { 
                      style: 'currency', 
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(value);
                    const percentage = Math.round((count / orderData.totalOrders) * 100);
                    
                    return {
                      text: `${label}: ${count} (${percentage}%)`,
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
                const count = orderData.orderByStatus[context.dataIndex].count;
                const value = orderData.orderByStatus[context.dataIndex].value;
                const formattedValue = new Intl.NumberFormat('en-US', { 
                  style: 'currency', 
                  currency: 'USD' 
                }).format(value);
                const percentage = Math.round((count / orderData.totalOrders) * 100);
                return [
                  `Orders: ${count} (${percentage}% of total)`,
                  `Value: ${formattedValue}`
                ];
              }
            }
          }
        }
      }
    });
    
    // Order Trend chart
    const trendCtx = trendChartRef.current.getContext('2d');
    const trendChart = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: orderData.orderOverTime.map(item => item.month),
        datasets: [
          {
            label: 'Order Value',
            data: orderData.orderOverTime.map(item => item.value),
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Order Count',
            data: orderData.orderOverTime.map(item => item.count),
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
                    label += context.parsed.y + ' orders';
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
              text: 'Value ($)',
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
              text: 'Count',
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
    
    // Region chart
    const regionCtx = regionChartRef.current.getContext('2d');
    const regionChart = new Chart(regionCtx, {
      type: 'pie',
      data: {
        labels: orderData.orderByRegion.map(item => item.region),
        datasets: [{
          data: orderData.orderByRegion.map(item => item.value),
          backgroundColor: orderData.orderByRegion.map(item => regionColors[item.region]),
          borderColor: orderData.orderByRegion.map(item => regionBorderColors[item.region]),
          borderWidth: 1,
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
                    const count = orderData.orderByRegion[i].count;
                    const value = orderData.orderByRegion[i].value;
                    const formattedValue = new Intl.NumberFormat('en-US', { 
                      style: 'currency', 
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(value);
                    const percentage = Math.round((value / orderData.totalValue) * 100);
                    
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
                const count = orderData.orderByRegion[context.dataIndex].count;
                const value = orderData.orderByRegion[context.dataIndex].value;
                const formattedValue = new Intl.NumberFormat('en-US', { 
                  style: 'currency', 
                  currency: 'USD' 
                }).format(value);
                const percentage = Math.round((value / orderData.totalValue) * 100);
                return [
                  `Value: ${formattedValue} (${percentage}% of total)`,
                  `Orders: ${count}`
                ];
              }
            }
          }
        }
      }
    });
    
    // Top Customers chart
    const customerCtx = customerChartRef.current.getContext('2d');
    const customerChart = new Chart(customerCtx, {
      type: 'bar',
      data: {
        labels: orderData.topCustomers.map(item => item.name),
        datasets: [{
          label: 'Order Value',
          data: orderData.topCustomers.map(item => item.value),
          backgroundColor: orderData.topCustomers.map(item => regionColors[item.region]),
          borderColor: orderData.topCustomers.map(item => regionBorderColors[item.region]),
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
                const customer = orderData.topCustomers[context.dataIndex];
                const formattedValue = new Intl.NumberFormat('en-US', { 
                  style: 'currency', 
                  currency: 'USD' 
                }).format(customer.value);
                return [
                  `Value: ${formattedValue}`,
                  `Orders: ${customer.orders}`,
                  `Region: ${customer.region}`
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
      statusChart.destroy();
      trendChart.destroy();
      regionChart.destroy();
      customerChart.destroy();
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
          <ShoppingCart className="mr-3 h-8 w-8" /> Customer Order Summary
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

      <div className="grid md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Orders" 
          value={orderData.totalOrders.toLocaleString()}
          icon={<ShoppingCart className="h-5 w-5 text-sky-400" />}
          color="sky"
        />
        <StatCard 
          title="Total Value" 
          value={`$${orderData.totalValue.toLocaleString()}`}
          icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
          color="emerald"
        />
        <StatCard 
          title="Avg. Order Value" 
          value={`$${orderData.averageOrderValue.toLocaleString()}`}
          icon={<TrendingUp className="h-5 w-5 text-purple-400" />}
          color="purple"
        />
        <StatCard 
          title="Fulfillment Rate" 
          value={`${orderData.fulfillmentRate}%`}
          icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
          color="emerald"
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Orders by Status</CardTitle>
            <CardDescription className="text-gray-400">Distribution of orders by current status</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <canvas ref={statusChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Order Trends</CardTitle>
            <CardDescription className="text-gray-400">Monthly order value and count</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <canvas ref={trendChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Orders by Region</CardTitle>
            <CardDescription className="text-gray-400">Geographic distribution of orders</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <canvas ref={regionChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Top Customers</CardTitle>
            <CardDescription className="text-gray-400">Customers with highest order value</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <canvas ref={customerChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Recent Orders</CardTitle>
          <CardDescription className="text-gray-400">Latest customer orders</CardDescription>
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
                  <th scope="col" className="px-6 py-3 text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {orderData.recentOrders.map((order, index) => (
                  <tr key={order.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium
                          ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : ''}
                          ${order.status === 'Shipped' ? 'bg-sky-500/20 text-sky-400' : ''}
                          ${order.status === 'Processing' ? 'bg-purple-500/20 text-purple-400' : ''}
                          ${order.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' : ''}
                        `}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">${order.value.toLocaleString()}</td>
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
    amber: "text-amber-400",
    purple: "text-purple-400"
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

export default CustomerOrderSummaryPage;

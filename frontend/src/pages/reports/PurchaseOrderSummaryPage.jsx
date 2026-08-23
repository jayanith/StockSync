import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Filter as FilterIcon, Calendar, ShoppingBag, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const PurchaseOrderSummaryPage = () => {
  const navigate = useNavigate();

  // Placeholder data
  const poData = {
    totalPOs: 245,
    totalValue: 875450.25,
    completedPOs: 178,
    pendingPOs: 67,
    poByStatus: [
      { status: "Completed", count: 178, value: 650320.50 },
      { status: "In Transit", count: 32, value: 125750.75 },
      { status: "Processing", count: 25, value: 85230.00 },
      { status: "Pending", count: 10, value: 14150.00 }
    ],
    poOverTime: [
      { month: "Jan", count: 35, value: 125000 },
      { month: "Feb", count: 38, value: 135000 },
      { month: "Mar", count: 42, value: 150000 },
      { month: "Apr", count: 45, value: 155000 },
      { month: "May", count: 40, value: 145000 },
      { month: "Jun", count: 45, value: 165450.25 }
    ],
    topSuppliers: [
      { name: "Tech Solutions Inc.", count: 45, value: 225000, onTimeDelivery: 95 },
      { name: "Global Distributors", count: 38, value: 185000, onTimeDelivery: 87 },
      { name: "Quality Products Co.", count: 35, value: 165000, onTimeDelivery: 92 },
      { name: "Reliable Supplies", count: 32, value: 155000, onTimeDelivery: 89 },
      { name: "Prime Manufacturing", count: 25, value: 145450.25, onTimeDelivery: 94 }
    ],
    recentPOs: [
      { id: "PO-2025-0241", supplier: "Tech Solutions Inc.", date: "2025-05-08", status: "Processing", value: 12500 },
      { id: "PO-2025-0242", supplier: "Global Distributors", date: "2025-05-07", status: "Processing", value: 8750 },
      { id: "PO-2025-0243", supplier: "Quality Products Co.", date: "2025-05-06", status: "In Transit", value: 15250 },
      { id: "PO-2025-0244", supplier: "Reliable Supplies", date: "2025-05-05", status: "In Transit", value: 9500 },
      { id: "PO-2025-0245", supplier: "Prime Manufacturing", date: "2025-05-04", status: "In Transit", value: 11250 }
    ]
  };
  
  // Chart references
  const statusChartRef = useRef(null);
  const trendChartRef = useRef(null);
  const supplierChartRef = useRef(null);
  
  // Status color mapping
  const statusColors = {
    "Completed": "rgba(34, 197, 94, 0.7)",    // green-500
    "In Transit": "rgba(14, 165, 233, 0.7)",  // sky-500
    "Processing": "rgba(168, 85, 247, 0.7)",  // purple-500
    "Pending": "rgba(245, 158, 11, 0.7)"      // amber-500
  };
  
  const statusBorderColors = {
    "Completed": "rgba(34, 197, 94, 1)",    // green-500
    "In Transit": "rgba(14, 165, 233, 1)",  // sky-500
    "Processing": "rgba(168, 85, 247, 1)",  // purple-500
    "Pending": "rgba(245, 158, 11, 1)"      // amber-500
  };
  
  // Initialize charts
  useEffect(() => {
    // PO Status chart
    const statusCtx = statusChartRef.current.getContext('2d');
    const statusChart = new Chart(statusCtx, {
      type: 'doughnut',
      data: {
        labels: poData.poByStatus.map(item => item.status),
        datasets: [{
          data: poData.poByStatus.map(item => item.value),
          backgroundColor: poData.poByStatus.map(item => statusColors[item.status]),
          borderColor: poData.poByStatus.map(item => statusBorderColors[item.status]),
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
                    const value = poData.poByStatus[i].value;
                    const count = poData.poByStatus[i].count;
                    const formattedValue = new Intl.NumberFormat('en-US', { 
                      style: 'currency', 
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(value);
                    const percentage = Math.round((value / poData.totalValue) * 100);
                    
                    return {
                      text: `${label}: ${formattedValue} (${count} POs)`,
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
                const value = poData.poByStatus[context.dataIndex].value;
                const count = poData.poByStatus[context.dataIndex].count;
                const formattedValue = new Intl.NumberFormat('en-US', { 
                  style: 'currency', 
                  currency: 'USD' 
                }).format(value);
                const percentage = Math.round((value / poData.totalValue) * 100);
                return [
                  `Value: ${formattedValue} (${percentage}% of total)`,
                  `Count: ${count} purchase orders`
                ];
              }
            }
          }
        }
      }
    });
    
    // PO Trend chart
    const trendCtx = trendChartRef.current.getContext('2d');
    const trendChart = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: poData.poOverTime.map(item => item.month),
        datasets: [
          {
            label: 'PO Value',
            data: poData.poOverTime.map(item => item.value),
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'PO Count',
            data: poData.poOverTime.map(item => item.count),
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
                    label += context.parsed.y + ' POs';
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
    
    // Top Suppliers chart
    const supplierCtx = supplierChartRef.current.getContext('2d');
    const supplierChart = new Chart(supplierCtx, {
      type: 'bar',
      data: {
        labels: poData.topSuppliers.map(item => item.name),
        datasets: [
          {
            label: 'PO Value',
            data: poData.topSuppliers.map(item => item.value),
            backgroundColor: 'rgba(14, 165, 233, 0.7)',
            borderColor: 'rgba(14, 165, 233, 1)',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y'
          },
          {
            label: 'On-Time Delivery %',
            data: poData.topSuppliers.map(item => item.onTimeDelivery),
            backgroundColor: 'rgba(34, 197, 94, 0.7)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 1,
            borderRadius: 4,
            type: 'line',
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
                  if (context.dataset.yAxisID === 'y') {
                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.x);
                  } else {
                    label += context.parsed.x + '%';
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
            ticks: { 
              color: '#94a3b8',
              callback: function(value, index, values) {
                if (this.id === 'y') {
                  return '$' + value.toLocaleString();
                }
                return value;
              }
            }
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
            min: 0,
            max: 100,
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              color: '#94a3b8',
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });
    
    // Cleanup on component unmount
    return () => {
      statusChart.destroy();
      trendChart.destroy();
      supplierChart.destroy();
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
          <ShoppingBag className="mr-3 h-8 w-8" /> Purchase Order Summary
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
          title="Total Purchase Orders" 
          value={poData.totalPOs.toLocaleString()}
          icon={<ShoppingBag className="h-5 w-5 text-sky-400" />}
          color="sky"
        />
        <StatCard 
          title="Total PO Value" 
          value={`$${poData.totalValue.toLocaleString()}`}
          icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
          color="emerald"
        />
        <StatCard 
          title="Completed POs" 
          value={`${poData.completedPOs}/${poData.totalPOs} (${Math.round((poData.completedPOs / poData.totalPOs) * 100)}%)`}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />}
          color="emerald"
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Purchase Orders by Status</CardTitle>
            <CardDescription className="text-gray-400">Distribution of POs by current status</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <canvas ref={statusChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Purchase Order Trends</CardTitle>
            <CardDescription className="text-gray-400">Monthly PO value and count</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <canvas ref={trendChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Top Suppliers by PO Value</CardTitle>
          <CardDescription className="text-gray-400">PO value and on-time delivery performance</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <canvas ref={supplierChartRef} className="w-full h-full"></canvas>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Recent Purchase Orders</CardTitle>
          <CardDescription className="text-gray-400">Latest purchase orders created</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3">PO ID</th>
                  <th scope="col" className="px-6 py-3">Supplier</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3 text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {poData.recentPOs.map((po, index) => (
                  <tr key={po.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="px-6 py-4 font-medium text-white">{po.id}</td>
                    <td className="px-6 py-4">{po.supplier}</td>
                    <td className="px-6 py-4">{new Date(po.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium
                          ${po.status === 'Completed' ? 'bg-green-500/20 text-green-400' : ''}
                          ${po.status === 'In Transit' ? 'bg-sky-500/20 text-sky-400' : ''}
                          ${po.status === 'Processing' ? 'bg-purple-500/20 text-purple-400' : ''}
                          ${po.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' : ''}
                        `}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">${po.value.toLocaleString()}</td>
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

export default PurchaseOrderSummaryPage;

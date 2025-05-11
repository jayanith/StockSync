import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Filter as FilterIcon, Calendar, Users, Clock, TrendingUp, BadgeCheck, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const SupplierPerformancePage = () => {
  const navigate = useNavigate();

  // Placeholder data
  const supplierData = {
    totalSuppliers: 25,
    avgLeadTime: 12.5,
    avgOnTimeDelivery: 87,
    avgQualityScore: 92,
    supplierPerformance: [
      { name: "Tech Solutions Inc.", leadTime: 8, onTimeDelivery: 95, qualityScore: 97, responseTime: 1.2, costIndex: 95 },
      { name: "Global Distributors", leadTime: 14, onTimeDelivery: 87, qualityScore: 90, responseTime: 2.5, costIndex: 88 },
      { name: "Quality Products Co.", leadTime: 10, onTimeDelivery: 92, qualityScore: 95, responseTime: 1.5, costIndex: 92 },
      { name: "Reliable Supplies", leadTime: 15, onTimeDelivery: 85, qualityScore: 88, responseTime: 2.8, costIndex: 85 },
      { name: "Prime Manufacturing", leadTime: 9, onTimeDelivery: 94, qualityScore: 96, responseTime: 1.3, costIndex: 90 }
    ],
    performanceOverTime: [
      { month: "Jan", avgLeadTime: 14.2, avgOnTimeDelivery: 82, avgQualityScore: 88 },
      { month: "Feb", avgLeadTime: 13.8, avgOnTimeDelivery: 84, avgQualityScore: 89 },
      { month: "Mar", avgLeadTime: 13.2, avgOnTimeDelivery: 85, avgQualityScore: 90 },
      { month: "Apr", avgLeadTime: 12.8, avgOnTimeDelivery: 86, avgQualityScore: 91 },
      { month: "May", avgLeadTime: 12.5, avgOnTimeDelivery: 87, avgQualityScore: 92 },
      { month: "Jun", avgLeadTime: 12.0, avgOnTimeDelivery: 89, avgQualityScore: 93 }
    ],
    supplierIssues: [
      { type: "Late Delivery", count: 45, percentage: 38 },
      { type: "Quality Issues", count: 32, percentage: 27 },
      { type: "Incomplete Orders", count: 25, percentage: 21 },
      { type: "Documentation Errors", count: 18, percentage: 14 }
    ],
    suppliersByCategory: [
      { category: "Electronics", count: 8, avgPerformance: 91 },
      { category: "Raw Materials", count: 6, avgPerformance: 88 },
      { category: "Packaging", count: 5, avgPerformance: 90 },
      { category: "Office Supplies", count: 4, avgPerformance: 93 },
      { category: "Miscellaneous", count: 2, avgPerformance: 85 }
    ]
  };
  
  // Chart references
  const performanceChartRef = useRef(null);
  const trendChartRef = useRef(null);
  const issuesChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  
  // Initialize charts
  useEffect(() => {
    // Supplier Performance Radar chart
    const performanceCtx = performanceChartRef.current.getContext('2d');
    const performanceChart = new Chart(performanceCtx, {
      type: 'radar',
      data: {
        labels: ['Lead Time', 'On-Time Delivery', 'Quality Score', 'Response Time', 'Cost Index'],
        datasets: supplierData.supplierPerformance.slice(0, 5).map((supplier, index) => ({
          label: supplier.name,
          data: [
            // Normalize lead time (lower is better, so invert the scale)
            100 - ((supplier.leadTime / 20) * 100), // Assuming 20 days is the worst case
            supplier.onTimeDelivery,
            supplier.qualityScore,
            // Normalize response time (lower is better, so invert the scale)
            100 - ((supplier.responseTime / 5) * 100), // Assuming 5 days is the worst case
            supplier.costIndex
          ],
          backgroundColor: [
            'rgba(14, 165, 233, 0.2)',
            'rgba(168, 85, 247, 0.2)',
            'rgba(34, 197, 94, 0.2)',
            'rgba(236, 72, 153, 0.2)',
            'rgba(245, 158, 11, 0.2)'
          ][index],
          borderColor: [
            'rgba(14, 165, 233, 1)',
            'rgba(168, 85, 247, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(245, 158, 11, 1)'
          ][index],
          borderWidth: 2,
          pointBackgroundColor: [
            'rgba(14, 165, 233, 1)',
            'rgba(168, 85, 247, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(245, 158, 11, 1)'
          ][index],
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: [
            'rgba(14, 165, 233, 1)',
            'rgba(168, 85, 247, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(245, 158, 11, 1)'
          ][index]
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              color: '#94a3b8',
              backdropColor: 'transparent',
              showLabelBackdrop: false
            },
            grid: {
              color: 'rgba(51, 65, 85, 0.4)',
            },
            angleLines: {
              color: 'rgba(51, 65, 85, 0.4)',
            },
            pointLabels: {
              color: '#e2e8f0',
              font: {
                size: 12
              }
            }
          }
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
                const supplier = supplierData.supplierPerformance[context.datasetIndex];
                const metric = context.label;
                let value;
                
                switch(metric) {
                  case 'Lead Time':
                    value = `${supplier.leadTime} days`;
                    break;
                  case 'On-Time Delivery':
                    value = `${supplier.onTimeDelivery}%`;
                    break;
                  case 'Quality Score':
                    value = `${supplier.qualityScore}%`;
                    break;
                  case 'Response Time':
                    value = `${supplier.responseTime} days`;
                    break;
                  case 'Cost Index':
                    value = `${supplier.costIndex}%`;
                    break;
                  default:
                    value = context.formattedValue;
                }
                
                return `${supplier.name}: ${value}`;
              }
            }
          }
        }
      }
    });
    
    // Performance Trend chart
    const trendCtx = trendChartRef.current.getContext('2d');
    const trendChart = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: supplierData.performanceOverTime.map(item => item.month),
        datasets: [
          {
            label: 'Avg. Lead Time (days)',
            data: supplierData.performanceOverTime.map(item => item.avgLeadTime),
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'On-Time Delivery (%)',
            data: supplierData.performanceOverTime.map(item => item.avgOnTimeDelivery),
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            yAxisID: 'y1'
          },
          {
            label: 'Quality Score (%)',
            data: supplierData.performanceOverTime.map(item => item.avgQualityScore),
            borderColor: '#a855f7',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            borderWidth: 2,
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
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Lead Time (days)',
              color: '#94a3b8'
            },
            grid: {
              color: 'rgba(51, 65, 85, 0.4)',
              drawBorder: false,
            },
            ticks: { color: '#94a3b8' },
            // Invert the scale (lower is better)
            reverse: true
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Percentage (%)',
              color: '#94a3b8'
            },
            min: 80,
            max: 100,
            grid: {
              drawOnChartArea: false,
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
    
    // Supplier Issues chart
    const issuesCtx = issuesChartRef.current.getContext('2d');
    const issuesChart = new Chart(issuesCtx, {
      type: 'doughnut',
      data: {
        labels: supplierData.supplierIssues.map(item => item.type),
        datasets: [{
          data: supplierData.supplierIssues.map(item => item.count),
          backgroundColor: [
            'rgba(244, 63, 94, 0.7)',  // rose-500
            'rgba(245, 158, 11, 0.7)', // amber-500
            'rgba(168, 85, 247, 0.7)',  // purple-500
            'rgba(59, 130, 246, 0.7)'   // blue-500
          ],
          borderColor: [
            'rgba(244, 63, 94, 1)',  // rose-500
            'rgba(245, 158, 11, 1)', // amber-500
            'rgba(168, 85, 247, 1)',  // purple-500
            'rgba(59, 130, 246, 1)'   // blue-500
          ],
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
                    const count = supplierData.supplierIssues[i].count;
                    const percentage = supplierData.supplierIssues[i].percentage;
                    
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
                const count = supplierData.supplierIssues[context.dataIndex].count;
                const percentage = supplierData.supplierIssues[context.dataIndex].percentage;
                return [
                  `Count: ${count} issues`,
                  `Percentage: ${percentage}% of total issues`
                ];
              }
            }
          }
        }
      }
    });
    
    // Supplier Category chart
    const categoryCtx = categoryChartRef.current.getContext('2d');
    const categoryChart = new Chart(categoryCtx, {
      type: 'bar',
      data: {
        labels: supplierData.suppliersByCategory.map(item => item.category),
        datasets: [
          {
            label: 'Number of Suppliers',
            data: supplierData.suppliersByCategory.map(item => item.count),
            backgroundColor: 'rgba(14, 165, 233, 0.7)',
            borderColor: 'rgba(14, 165, 233, 1)',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y'
          },
          {
            label: 'Avg. Performance Score',
            data: supplierData.suppliersByCategory.map(item => item.avgPerformance),
            backgroundColor: 'rgba(34, 197, 94, 0.7)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Number of Suppliers',
              color: '#94a3b8'
            },
            grid: {
              color: 'rgba(51, 65, 85, 0.4)',
              drawBorder: false,
            },
            ticks: { color: '#94a3b8' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Performance Score',
              color: '#94a3b8'
            },
            min: 80,
            max: 100,
            grid: {
              drawOnChartArea: false,
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
      performanceChart.destroy();
      trendChart.destroy();
      issuesChart.destroy();
      categoryChart.destroy();
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
          <Users className="mr-3 h-8 w-8" /> Supplier Performance
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
          title="Total Suppliers" 
          value={supplierData.totalSuppliers.toString()}
          icon={<Users className="h-5 w-5 text-sky-400" />}
          color="sky"
        />
        <StatCard 
          title="Avg. Lead Time" 
          value={`${supplierData.avgLeadTime} days`}
          icon={<Clock className="h-5 w-5 text-amber-400" />}
          color="amber"
        />
        <StatCard 
          title="On-Time Delivery" 
          value={`${supplierData.avgOnTimeDelivery}%`}
          icon={<BadgeCheck className="h-5 w-5 text-emerald-400" />}
          color="emerald"
        />
        <StatCard 
          title="Quality Score" 
          value={`${supplierData.avgQualityScore}%`}
          icon={<TrendingUp className="h-5 w-5 text-purple-400" />}
          color="purple"
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Top Supplier Performance Comparison</CardTitle>
            <CardDescription className="text-gray-400">Radar chart comparing key performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <canvas ref={performanceChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Performance Trends</CardTitle>
            <CardDescription className="text-gray-400">6-month performance metrics trend</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <canvas ref={trendChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Supplier Issues Breakdown</CardTitle>
            <CardDescription className="text-gray-400">Distribution of supplier-related issues</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <canvas ref={issuesChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Suppliers by Category</CardTitle>
            <CardDescription className="text-gray-400">Count and performance by supplier category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <canvas ref={categoryChartRef} className="w-full h-full"></canvas>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Supplier Performance Details</CardTitle>
          <CardDescription className="text-gray-400">Detailed metrics for top suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3">Supplier</th>
                  <th scope="col" className="px-6 py-3 text-center">Lead Time</th>
                  <th scope="col" className="px-6 py-3 text-center">On-Time Delivery</th>
                  <th scope="col" className="px-6 py-3 text-center">Quality Score</th>
                  <th scope="col" className="px-6 py-3 text-center">Response Time</th>
                  <th scope="col" className="px-6 py-3 text-center">Cost Index</th>
                </tr>
              </thead>
              <tbody>
                {supplierData.supplierPerformance.map((supplier, index) => (
                  <tr key={supplier.name} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="px-6 py-4 font-medium text-white">{supplier.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${supplier.leadTime <= 10 ? 'bg-green-500/20 text-green-400' : supplier.leadTime <= 15 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {supplier.leadTime} days
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${supplier.onTimeDelivery >= 90 ? 'bg-green-500/20 text-green-400' : supplier.onTimeDelivery >= 80 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {supplier.onTimeDelivery}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${supplier.qualityScore >= 95 ? 'bg-green-500/20 text-green-400' : supplier.qualityScore >= 85 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {supplier.qualityScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${supplier.responseTime <= 1.5 ? 'bg-green-500/20 text-green-400' : supplier.responseTime <= 2.5 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {supplier.responseTime} days
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${supplier.costIndex >= 90 ? 'bg-green-500/20 text-green-400' : supplier.costIndex >= 85 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {supplier.costIndex}%
                      </span>
                    </td>
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

export default SupplierPerformancePage;

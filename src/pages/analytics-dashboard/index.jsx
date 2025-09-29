import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [exportFormat, setExportFormat] = useState('pdf');

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Mock data for KPIs
  const kpis = [
    {
      title: 'Total Documents Processed',
      value: '2,847',
      change: '+15.3%',
      changeType: 'increase',
      icon: 'FileText',
      color: 'primary'
    },
    {
      title: 'AI Usage Statistics',
      value: '1,923',
      change: '+24.8%',
      changeType: 'increase',
      icon: 'Brain',
      color: 'accent'
    },
    {
      title: 'Compliance Score',
      value: '98.7%',
      change: '+2.1%',
      changeType: 'increase',
      icon: 'Shield',
      color: 'success'
    },
    {
      title: 'Team Productivity',
      value: '94.2%',
      change: '+8.5%',
      changeType: 'increase',
      icon: 'TrendingUp',
      color: 'warning'
    }
  ];

  // Mock data for documentation volume chart
  const documentVolumeData = [
    { month: 'Jan', documents: 245, aiGenerated: 89 },
    { month: 'Feb', documents: 312, aiGenerated: 134 },
    { month: 'Mar', documents: 298, aiGenerated: 156 },
    { month: 'Apr', documents: 389, aiGenerated: 198 },
    { month: 'May', documents: 456, aiGenerated: 234 },
    { month: 'Jun', documents: 523, aiGenerated: 298 }
  ];

  // Mock data for template usage patterns
  const templateUsageData = [
    { name: 'Physical Therapy', value: 35, color: '#0ea5e9' },
    { name: 'Speech Therapy', value: 25, color: '#10b981' },
    { name: 'Occupational Therapy', value: 20, color: '#f59e0b' },
    { name: 'Mental Health', value: 15, color: '#ef4444' },
    { name: 'Discharge Summary', value: 5, color: '#8b5cf6' }
  ];

  // Mock data for team performance
  const teamPerformanceData = [
    { name: 'Dr. Sarah Chen', documents: 89, quality: 96, efficiency: 94 },
    { name: 'Mike Rodriguez', documents: 72, quality: 92, efficiency: 88 },
    { name: 'Lisa Park', documents: 68, quality: 98, efficiency: 91 },
    { name: 'James Wilson', documents: 54, quality: 89, efficiency: 85 },
    { name: 'Emma Davis', documents: 43, quality: 93, efficiency: 87 }
  ];

  // Mock data for detailed analytics
  const analyticsTableData = [
    {
      id: 1,
      documentType: 'Physical Therapy Assessment',
      avgProcessingTime: '12.5 min',
      qualityScore: 95,
      complianceRate: 98,
      aiUsage: 78,
      totalCount: 342
    },
    {
      id: 2,
      documentType: 'Speech Therapy Progress Note',
      avgProcessingTime: '8.3 min',
      qualityScore: 92,
      complianceRate: 96,
      aiUsage: 85,
      totalCount: 256
    },
    {
      id: 3,
      documentType: 'Occupational Therapy Evaluation',
      avgProcessingTime: '15.2 min',
      qualityScore: 94,
      complianceRate: 97,
      aiUsage: 72,
      totalCount: 189
    },
    {
      id: 4,
      documentType: 'Mental Health Assessment',
      avgProcessingTime: '18.7 min',
      qualityScore: 96,
      complianceRate: 99,
      aiUsage: 68,
      totalCount: 124
    },
    {
      id: 5,
      documentType: 'Discharge Summary',
      avgProcessingTime: '6.8 min',
      qualityScore: 91,
      complianceRate: 95,
      aiUsage: 89,
      totalCount: 98
    }
  ];

  // Mock data for insights and recommendations
  const insights = [
    {
      id: 1,
      type: 'trend',
      title: 'AI Usage Increasing',
      description: 'AI-generated content has increased by 24.8% this month, improving documentation speed.',
      severity: 'positive'
    },
    {
      id: 2,
      type: 'alert',
      title: 'Quality Score Variance',
      description: 'Speech therapy notes showing slight quality score decrease. Review recommended.',
      severity: 'warning'
    },
    {
      id: 3,
      type: 'optimization',
      title: 'Template Optimization',
      description: 'Physical therapy templates could be streamlined to reduce processing time by 15%.',
      severity: 'info'
    }
  ];

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Analytics Dashboard', href: '/analytics-dashboard' }
  ];

  const handleExport = () => {
    alert(`Exporting analytics report in ${exportFormat?.toUpperCase()} format...`);
  };

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'positive': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={handleSidebarToggle} 
      />
      <main className={`pt-16 transition-clinical ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <div className="p-6">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground">
                Comprehensive healthcare documentation insights and performance metrics
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e?.target?.value)}
                className="px-3 py-2 border border-border rounded-md bg-card text-foreground"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <select 
                value={exportFormat} 
                onChange={(e) => setExportFormat(e?.target?.value)}
                className="px-3 py-2 border border-border rounded-md bg-card text-foreground"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
              
              <Button onClick={handleExport} className="flex items-center gap-2">
                <Icon name="Download" size={16} />
                Export Report
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {kpis?.map((kpi, index) => (
              <div key={index} className="bg-card rounded-lg p-6 border border-border shadow-clinical">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-${kpi?.color}/10`}>
                    <Icon name={kpi?.icon} size={24} className={`text-${kpi?.color}`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    kpi?.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi?.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">{kpi?.value}</h3>
                <p className="text-sm text-muted-foreground">{kpi?.title}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Documentation Volume Chart */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-clinical">
              <h3 className="text-lg font-semibold text-foreground mb-4">Documentation Volume Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={documentVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="documents" stroke="#0ea5e9" strokeWidth={2} name="Total Documents" />
                  <Line type="monotone" dataKey="aiGenerated" stroke="#10b981" strokeWidth={2} name="AI Generated" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Template Usage Patterns */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-clinical">
              <h3 className="text-lg font-semibold text-foreground mb-4">Template Usage Patterns</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={templateUsageData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                  >
                    {templateUsageData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Team Performance Chart */}
          <div className="bg-card rounded-lg p-6 border border-border shadow-clinical mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Team Performance Metrics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="documents" fill="#0ea5e9" name="Documents Created" />
                <Bar dataKey="quality" fill="#10b981" name="Quality Score" />
                <Bar dataKey="efficiency" fill="#f59e0b" name="Efficiency Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Analytics Table */}
          <div className="bg-card rounded-lg border border-border shadow-clinical mb-8 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Detailed Analytics by Document Type</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Document Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Avg Processing Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Quality Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Compliance Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      AI Usage %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Total Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {analyticsTableData?.map((item) => (
                    <tr key={item?.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        {item?.documentType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {item?.avgProcessingTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${getScoreColor(item?.qualityScore)}`}>
                          {item?.qualityScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${getScoreColor(item?.complianceRate)}`}>
                          {item?.complianceRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {item?.aiUsage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {item?.totalCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Insights and Recommendations */}
          <div className="bg-card rounded-lg p-6 border border-border shadow-clinical">
            <h3 className="text-lg font-semibold text-foreground mb-4">AI-Powered Insights & Recommendations</h3>
            <div className="space-y-4">
              {insights?.map((insight) => (
                <div 
                  key={insight?.id} 
                  className={`p-4 rounded-lg border ${getSeverityColor(insight?.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon 
                      name={insight?.type === 'trend' ? 'TrendingUp' : insight?.type === 'alert' ? 'AlertTriangle' : 'Lightbulb'} 
                      size={20} 
                    />
                    <div>
                      <h4 className="font-medium mb-1">{insight?.title}</h4>
                      <p className="text-sm opacity-90">{insight?.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
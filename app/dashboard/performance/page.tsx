'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Clock, 
  Users, 
  Target, 
  Award, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Calendar, 
  Download,
  RefreshCw,
  Filter,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info,
  MonitorSpeaker,
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  Gauge,
  Server,
  Database,
  Globe,
  Shield
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface PerformanceMetric {
  id: string
  name: string
  value: number
  previousValue: number
  change: number
  changeType: 'positive' | 'negative' | 'neutral'
  unit: string
  category: 'system' | 'business' | 'user' | 'technical'
  status: 'healthy' | 'warning' | 'critical'
  lastUpdated: Date
}

interface SystemHealth {
  cpu: number
  memory: number
  disk: number
  network: number
  uptime: number
  responseTime: number
  errorRate: number
  throughput: number
}

interface AlertRule {
  id: string
  name: string
  metric: string
  condition: 'above' | 'below' | 'equals'
  threshold: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  isActive: boolean
  lastTriggered?: Date
  actionUrl?: string
}

export default function PerformancePage() {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [activeTab, setActiveTab] = useState<'overview' | 'system' | 'business' | 'alerts'>('overview')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Real-time performance metrics
  const [metrics] = useState<PerformanceMetric[]>([])

  // System health data
  const [systemHealth] = useState<SystemHealth>({
    cpu: 45,
    memory: 68,
    disk: 32,
    network: 85,
    uptime: 99.9,
    responseTime: 120,
    errorRate: 0.2,
    throughput: 1250
  })

  // Performance trends data
  const performanceTrends = [
    { time: '00:00', cpu: 25, memory: 45, response: 100, requests: 800 },
    { time: '04:00', cpu: 30, memory: 50, response: 110, requests: 950 },
    { time: '08:00', cpu: 65, memory: 70, response: 150, requests: 1800 },
    { time: '12:00', cpu: 80, memory: 85, response: 180, requests: 2200 },
    { time: '16:00', cpu: 75, memory: 80, response: 165, requests: 2000 },
    { time: '20:00', cpu: 55, memory: 65, response: 130, requests: 1400 },
    { time: '24:00', cpu: 35, memory: 55, response: 115, requests: 1000 }
  ]

  const businessMetrics = [
    { name: 'Revenue', value: 125000, target: 150000, color: '#10B981' },
    { name: 'Users', value: 8500, target: 10000, color: '#3B82F6' },
    { name: 'Conversion', value: 3.2, target: 4.0, color: '#8B5CF6' },
    { name: 'Retention', value: 85, target: 90, color: '#F59E0B' }
  ]

  const errorDistribution = [
    { name: '4xx Errors', value: 65, color: '#F59E0B' },
    { name: '5xx Errors', value: 25, color: '#EF4444' },
    { name: 'Timeouts', value: 10, color: '#8B5CF6' }
  ]

  const [alerts] = useState<AlertRule[]>([])

  const getStatusColor = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-slate-600'
    }
  }

  const getStatusIcon = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle size={16} />
      case 'warning': return <AlertTriangle size={16} />
      case 'critical': return <AlertTriangle size={16} />
      default: return <Info size={16} />
    }
  }

  const getHealthColor = (value: number, isInverted = false) => {
    if (isInverted) {
      if (value < 30) return 'text-green-600'
      if (value < 70) return 'text-yellow-600'
      return 'text-red-600'
    } else {
      if (value > 70) return 'text-green-600'
      if (value > 40) return 'text-yellow-600'
      return 'text-red-600'
    }
  }

  const refreshData = () => {
    setLastRefresh(new Date())
    toast.success('Performance data refreshed')
  }

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refreshData, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Performance Dashboard
          </h1>
          <p className="text-slate-600 mt-2">Monitor system health, business metrics, and application performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Clock size={16} />
            <span>Last updated: {format(lastRefresh, 'h:mm:ss a')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
            >
              <RefreshCw size={18} className={autoRefresh ? 'animate-spin' : ''} />
            </button>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 bg-white text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <button
              onClick={refreshData}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 text-sm"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">System Uptime</p>
              <p className="text-3xl font-bold">{systemHealth.uptime}%</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Server className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Response Time</p>
              <p className="text-3xl font-bold">{systemHealth.responseTime}ms</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Zap className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Throughput</p>
              <p className="text-3xl font-bold">{systemHealth.throughput}</p>
              <p className="text-purple-200 text-xs">req/min</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Activity className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Error Rate</p>
              <p className="text-3xl font-bold">{systemHealth.errorRate}%</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <AlertTriangle className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
        <div className="flex border-b border-slate-200">
          {(['overview', 'system', 'business', 'alerts'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-cyan-600 border-b-2 border-cyan-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Performance Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">System Resources</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceTrends}>
                      <defs>
                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="cpu" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCpu)" name="CPU %" />
                      <Area type="monotone" dataKey="memory" stroke="#10B981" fillOpacity={1} fill="url(#colorMemory)" name="Memory %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Response Time & Requests</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={performanceTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="response" stroke="#8B5CF6" strokeWidth={3} name="Response Time (ms)" />
                      <Line yAxisId="right" type="monotone" dataKey="requests" stroke="#F59E0B" strokeWidth={3} name="Requests/hour" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Resource Usage */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Cpu className="text-blue-500" size={24} />
                    <div>
                      <h4 className="font-medium text-slate-800">CPU Usage</h4>
                      <p className="text-2xl font-bold text-slate-900">{systemHealth.cpu}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${systemHealth.cpu}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Database className="text-green-500" size={24} />
                    <div>
                      <h4 className="font-medium text-slate-800">Memory</h4>
                      <p className="text-2xl font-bold text-slate-900">{systemHealth.memory}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-500 transition-all duration-300"
                      style={{ width: `${systemHealth.memory}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <HardDrive className="text-purple-500" size={24} />
                    <div>
                      <h4 className="font-medium text-slate-800">Disk Usage</h4>
                      <p className="text-2xl font-bold text-slate-900">{systemHealth.disk}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-purple-500 transition-all duration-300"
                      style={{ width: `${systemHealth.disk}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Wifi className="text-orange-500" size={24} />
                    <div>
                      <h4 className="font-medium text-slate-800">Network</h4>
                      <p className="text-2xl font-bold text-slate-900">{systemHealth.network}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-orange-500 transition-all duration-300"
                      style={{ width: `${systemHealth.network}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* System Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">System Health Scores</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'CPU Performance', value: 85, color: '#3B82F6' },
                      { name: 'Memory Efficiency', value: 72, color: '#10B981' },
                      { name: 'Disk I/O', value: 90, color: '#8B5CF6' },
                      { name: 'Network Latency', value: 78, color: '#F59E0B' }
                    ].map((metric) => (
                      <div key={metric.name} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <span className="font-medium text-slate-800">{metric.name}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-slate-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ width: `${metric.value}%`, backgroundColor: metric.color }}
                            />
                          </div>
                          <span className="font-bold text-slate-900 w-12 text-right">{metric.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Error Distribution */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Error Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPieChart>
                      <Pie
                        data={errorDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {errorDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detailed System Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h4 className="font-medium text-slate-800 mb-4 flex items-center space-x-2">
                    <Server size={20} />
                    <span>Server Info</span>
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">OS</span>
                      <span className="font-medium">Ubuntu 22.04 LTS</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Architecture</span>
                      <span className="font-medium">x86_64</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Cores</span>
                      <span className="font-medium">8 vCPU</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">RAM</span>
                      <span className="font-medium">16 GB</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h4 className="font-medium text-slate-800 mb-4 flex items-center space-x-2">
                    <Globe size={20} />
                    <span>Network</span>
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Bandwidth</span>
                      <span className="font-medium">1 Gbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Latency</span>
                      <span className="font-medium">12ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Packets Lost</span>
                      <span className="font-medium">0.01%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Data Transfer</span>
                      <span className="font-medium">2.4 TB/month</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h4 className="font-medium text-slate-800 mb-4 flex items-center space-x-2">
                    <Shield size={20} />
                    <span>Security</span>
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">SSL Certificate</span>
                      <span className="font-medium text-green-600">Valid</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Firewall</span>
                      <span className="font-medium text-green-600">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Intrusion Detection</span>
                      <span className="font-medium text-green-600">Enabled</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Security Scan</span>
                      <span className="font-medium">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="space-y-8">
              {/* Business KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {businessMetrics.map((metric) => (
                  <div key={metric.name} className="bg-white border border-slate-200 rounded-xl p-6">
                    <h4 className="font-medium text-slate-800 mb-2">{metric.name}</h4>
                    <div className="flex items-end space-x-2 mb-3">
                      <span className="text-2xl font-bold text-slate-900">
                        {metric.name === 'Revenue' ? `$${(metric.value / 1000).toFixed(0)}k` : 
                         metric.name === 'Users' ? metric.value.toLocaleString() :
                         metric.name === 'Conversion' ? `${metric.value}%` :
                         `${metric.value}%`}
                      </span>
                      <span className="text-sm text-slate-500">
                        / {metric.name === 'Revenue' ? `$${(metric.target / 1000).toFixed(0)}k` : 
                            metric.name === 'Users' ? metric.target.toLocaleString() :
                            `${metric.target}%`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((metric.value / metric.target) * 100, 100)}%`, 
                          backgroundColor: metric.color 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">User Growth</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={[
                      { month: 'Jan', users: 5200, activeUsers: 4800, newUsers: 400 },
                      { month: 'Feb', users: 5800, activeUsers: 5400, newUsers: 600 },
                      { month: 'Mar', users: 6500, activeUsers: 6100, newUsers: 700 },
                      { month: 'Apr', users: 7200, activeUsers: 6800, newUsers: 700 },
                      { month: 'May', users: 7900, activeUsers: 7500, newUsers: 700 },
                      { month: 'Jun', users: 8500, activeUsers: 8100, newUsers: 600 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="users" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="activeUsers" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { month: 'Jan', revenue: 85000, profit: 25000 },
                      { month: 'Feb', revenue: 92000, profit: 28000 },
                      { month: 'Mar', revenue: 105000, profit: 32000 },
                      { month: 'Apr', revenue: 118000, profit: 38000 },
                      { month: 'May', revenue: 125000, profit: 42000 },
                      { month: 'Jun', revenue: 132000, profit: 45000 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                      <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
                      <Bar dataKey="profit" fill="#10B981" name="Profit" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Performance Alerts</h3>
                <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  Create Alert Rule
                </button>
              </div>

              {alerts.length === 0 ? (
                <div className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">No alert rules configured</h3>
                  <p className="text-slate-600 mb-6">Set up performance monitoring alerts to stay informed about system issues</p>
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-200">
                    Create First Alert
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="border border-slate-200 rounded-xl p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800">{alert.name}</h4>
                          <p className="text-sm text-slate-600">
                            Alert when {alert.metric} is {alert.condition} {alert.threshold}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {alert.severity}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            alert.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {alert.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
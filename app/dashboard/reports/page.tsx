'use client'

import { useState } from 'react'
import { TrendingUp, Download, BarChart3, Target, Users, Clock, Award, Calendar, Eye, FileText, Activity, Zap } from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const COLORS = ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

interface ReportData {
  name: string
  completed: number
  started: number
  productivity: number
}

interface TeamMember {
  name: string
  tasks: number
  hours: number
  efficiency: number
}

interface ProjectStatus {
  name: string
  value: number
  color: string
}

interface TimeTracking {
  name: string
  hours: number
  percentage: number
}

interface MonthlyTrend {
  month: string
  tasks: number
  projects: number
  efficiency: number
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('overview')
  const [dateRange, setDateRange] = useState('7d')

  // Sample data for demonstration
  const productivityData: ReportData[] = [
    { name: 'Mon', completed: 12, started: 15, productivity: 80 },
    { name: 'Tue', completed: 19, started: 22, productivity: 86 },
    { name: 'Wed', completed: 14, started: 18, productivity: 78 },
    { name: 'Thu', completed: 22, started: 24, productivity: 92 },
    { name: 'Fri', completed: 18, started: 20, productivity: 90 },
    { name: 'Sat', completed: 8, started: 10, productivity: 80 },
    { name: 'Sun', completed: 5, started: 6, productivity: 83 }
  ]

  const teamPerformanceData: TeamMember[] = [
    { name: 'John Smith', tasks: 45, hours: 38, efficiency: 92 },
    { name: 'Emily Davis', tasks: 38, hours: 35, efficiency: 88 },
    { name: 'Michael Chen', tasks: 42, hours: 40, efficiency: 85 },
    { name: 'Sarah Wilson', tasks: 35, hours: 32, efficiency: 91 }
  ]

  const projectStatusData: ProjectStatus[] = [
    { name: 'In Progress', value: 45, color: '#667eea' },
    { name: 'Completed', value: 30, color: '#10b981' },
    { name: 'On Hold', value: 15, color: '#f59e0b' },
    { name: 'Cancelled', value: 10, color: '#ef4444' }
  ]

  const timeTrackingData: TimeTracking[] = [
    { name: 'Development', hours: 32, percentage: 40 },
    { name: 'Meetings', hours: 16, percentage: 20 },
    { name: 'Design', hours: 12, percentage: 15 },
    { name: 'Testing', hours: 10, percentage: 12.5 },
    { name: 'Documentation', hours: 8, percentage: 10 },
    { name: 'Other', hours: 2, percentage: 2.5 }
  ]

  const monthlyTrendsData: MonthlyTrend[] = [
    { month: 'Jan', tasks: 145, projects: 12, efficiency: 85 },
    { month: 'Feb', tasks: 168, projects: 15, efficiency: 88 },
    { month: 'Mar', tasks: 192, projects: 18, efficiency: 90 },
    { month: 'Apr', tasks: 185, projects: 16, efficiency: 92 },
    { month: 'May', tasks: 210, projects: 20, efficiency: 89 },
    { month: 'Jun', tasks: 248, projects: 22, efficiency: 94 }
  ]

  const reportTypes = [
    { id: 'overview', name: 'Overview', icon: BarChart3, description: 'General performance metrics' },
    { id: 'productivity', name: 'Productivity', icon: TrendingUp, description: 'Task completion and efficiency' },
    { id: 'team', name: 'Team Performance', icon: Users, description: 'Individual and team analytics' },
    { id: 'projects', name: 'Project Insights', icon: Target, description: 'Project status and timelines' },
    { id: 'time', name: 'Time Analysis', icon: Clock, description: 'Time tracking and allocation' }
  ]

  return (
    <div>
      <div className="section-header">
        <h2>
          <BarChart3 size={40} />
          Reports & Analytics
        </h2>
        <p>Comprehensive insights and performance analytics for your team</p>
        <div style={{ marginTop: '20px' }}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              padding: '12px 15px',
              background: '#333333',
              border: '1px solid #404040',
              borderRadius: '10px',
              color: 'white',
              fontSize: '0.9rem',
              marginRight: '15px'
            }}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={() => toast.success('Report exported successfully!')}
            className="nav-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={20} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="analytics-grid">
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <Target size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Total Tasks</div>
              <div className="member-rating">
                <div className="rating-value">248</div>
                <div className="rating-rank">+12% this month</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <Award size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Completion Rate</div>
              <div className="member-rating">
                <div className="rating-value">87%</div>
                <div className="rating-rank">+5% improvement</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <Users size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Team Efficiency</div>
              <div className="member-rating">
                <div className="rating-value">92%</div>
                <div className="rating-rank">+8% growth</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              <Clock size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Hours Tracked</div>
              <div className="member-rating">
                <div className="rating-value">1,247</div>
                <div className="rating-rank">+15% increase</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="analytics-row">
        {/* Report Content */}
        <div className="chart-container large">
          {/* Tabs */}
          <div className="filters" style={{ marginBottom: '25px' }}>
            {reportTypes.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={selectedReport === report.id ? 'filter-btn active' : 'filter-btn'}
              >
                {report.name}
              </button>
            ))}
          </div>

          {selectedReport === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* Monthly Trends Chart */}
              <div style={{ background: '#2a2a2a', borderRadius: '15px', padding: '25px', border: '1px solid #404040' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <TrendingUp size={20} />
                  Monthly Performance Trends
                </h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrendsData}>
                      <defs>
                        <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                      <XAxis dataKey="month" stroke="#ccc" />
                      <YAxis stroke="#ccc" />
                      <Tooltip 
                        contentStyle={{ 
                          background: '#2a2a2a', 
                          border: '1px solid #404040', 
                          borderRadius: '10px',
                          color: '#ccc'
                        }} 
                      />
                      <Area type="monotone" dataKey="tasks" stroke="#667eea" fillOpacity={1} fill="url(#colorTasks)" name="Tasks" />
                      <Area type="monotone" dataKey="efficiency" stroke="#10b981" fillOpacity={1} fill="url(#colorEfficiency)" name="Efficiency %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="analytics-grid">
                <div className="team-card" style={{ padding: '20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fbbf24', marginBottom: '8px' }}>94%</div>
                    <div style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '5px' }}>Overall Efficiency</div>
                    <div style={{ fontSize: '0.8rem', color: '#10b981' }}>↗ +3% from last month</div>
                  </div>
                </div>
                
                <div className="team-card" style={{ padding: '20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fbbf24', marginBottom: '8px' }}>22</div>
                    <div style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '5px' }}>Active Projects</div>
                    <div style={{ fontSize: '0.8rem', color: '#10b981' }}>↗ +2 new projects</div>
                  </div>
                </div>
                
                <div className="team-card" style={{ padding: '20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fbbf24', marginBottom: '8px' }}>4.2</div>
                    <div style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '5px' }}>Avg Task Rating</div>
                    <div style={{ fontSize: '0.8rem', color: '#10b981' }}>↗ +0.3 improvement</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'productivity' && (
            <div style={{ background: '#2a2a2a', borderRadius: '15px', padding: '25px', border: '1px solid #404040' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Activity size={20} />
                Weekly Productivity Analysis
              </h3>
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                    <XAxis dataKey="name" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip 
                      contentStyle={{ 
                        background: '#2a2a2a', 
                        border: '1px solid #404040', 
                        borderRadius: '10px',
                        color: '#ccc'
                      }} 
                    />
                    <Bar dataKey="completed" fill="#10b981" name="Completed Tasks" />
                    <Bar dataKey="started" fill="#667eea" name="Started Tasks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {selectedReport === 'team' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={20} />
                Team Performance Overview
              </h3>
              
              {teamPerformanceData.map((member) => (
                <div key={member.name} className="team-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div className="avatar">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fbbf24', marginBottom: '5px' }}>
                          {member.name}
                        </h4>
                        <p style={{ fontSize: '0.9rem', color: '#ccc' }}>
                          {member.tasks} tasks completed • {member.hours}h tracked
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fbbf24' }}>{member.efficiency}%</div>
                      <div style={{ fontSize: '0.8rem', color: '#999' }}>Efficiency Score</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedReport === 'projects' && (
            <div style={{ background: '#2a2a2a', borderRadius: '15px', padding: '25px', border: '1px solid #404040' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Target size={20} />
                Project Status Distribution
              </h3>
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: '#2a2a2a', 
                        border: '1px solid #404040', 
                        borderRadius: '10px',
                        color: '#ccc'
                      }} 
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {selectedReport === 'time' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={20} />
                Time Allocation Analysis
              </h3>
              
              <div style={{ background: '#2a2a2a', borderRadius: '15px', padding: '25px', border: '1px solid #404040' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {timeTrackingData.map((category, index) => (
                    <div key={category.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          borderRadius: '50%', 
                          background: COLORS[index] 
                        }} />
                        <span style={{ fontWeight: 600, color: '#ccc', fontSize: '0.95rem' }}>{category.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ 
                          width: '200px', 
                          height: '8px', 
                          background: '#333333', 
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            height: '8px', 
                            background: COLORS[index],
                            width: `${category.percentage}%`,
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.9rem', color: '#fbbf24', fontWeight: 600, minWidth: '50px', textAlign: 'right' }}>
                          {category.hours}h
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Quick Stats */}
          <div className="chart-container">
            <h3>
              <Eye size={20} />
              Key Insights
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>Best Performer</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>John Smith</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>Peak Day</span>
                <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>Thursday</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>Growth Rate</span>
                <span style={{ fontWeight: 'bold', color: '#667eea' }}>+12.5%</span>
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="chart-container">
            <h3>
              <FileText size={20} />
              Recent Reports
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
              {[
                { name: 'Weekly Summary', date: new Date(Date.now() - 86400000), type: 'Weekly' },
                { name: 'Monthly Review', date: new Date(Date.now() - 7 * 86400000), type: 'Monthly' },
                { name: 'Q1 Analysis', date: new Date(Date.now() - 14 * 86400000), type: 'Quarterly' }
              ].map((report, index) => (
                <div key={index} className="team-card" style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="avatar" style={{ width: '30px', height: '30px', fontSize: '0.75rem' }}>
                      <FileText size={14} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.85rem', color: '#ccc', display: 'block' }}>{report.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#999' }}>
                        {format(report.date, 'MMM d, yyyy')} • {report.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="chart-container">
            <h3>
              <Zap size={20} />
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => toast.success('Custom report generated')}
              >
                <BarChart3 size={16} />
                <span>Generate Custom Report</span>
              </button>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => toast.success('Data exported')}
              >
                <Download size={16} />
                <span>Export Data</span>
              </button>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => toast.success('Report scheduled')}
              >
                <Calendar size={16} />
                <span>Schedule Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
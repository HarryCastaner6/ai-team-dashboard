'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { TrendingUp, Users, CheckCircle, Clock, Calendar } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function AnalyticsPage() {
  const [taskData, setTaskData] = useState([])
  const [teamStats, setTeamStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    teamMembers: 0
  })
  const [weeklyData, setWeeklyData] = useState([])
  const [statusData, setStatusData] = useState([])
  const [departmentData, setDepartmentData] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/analytics')
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics')
        }
        
        const data = await response.json()
        
        setTeamStats(data.teamStats)
        setWeeklyData(data.weeklyData)
        setStatusData(data.statusDistribution)
        setDepartmentData(data.departmentPerformance)
        setRecentActivity(data.recentActivity)
        
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <div>
      <div className="section-header">
        <h2><Calendar size={40} />Analytics Dashboard</h2>
        <p>Comprehensive data analysis and performance metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="analytics-grid">
        <div className="team-card">
          <div className="card-header">
            <div className="avatar">📊</div>
            <div className="member-info">
              <div className="member-name">Total Tasks</div>
              <div className="member-email">{teamStats.totalTasks}</div>
              <div className="member-rating">
                <div className="rating-value">+12%</div>
                <div className="rating-rank">from last week</div>
              </div>
            </div>
          </div>
        </div>

        <div className="team-card">
          <div className="card-header">
            <div className="avatar">✅</div>
            <div className="member-info">
              <div className="member-name">Completed</div>
              <div className="member-email">{teamStats.completedTasks}</div>
              <div className="member-rating">
                <div className="rating-value">+8%</div>
                <div className="rating-rank">completion rate</div>
              </div>
            </div>
          </div>
        </div>

        <div className="team-card">
          <div className="card-header">
            <div className="avatar">🔄</div>
            <div className="member-info">
              <div className="member-name">In Progress</div>
              <div className="member-email">{teamStats.inProgressTasks}</div>
              <div className="member-rating">
                <div className="rating-rank">Active tasks</div>
              </div>
            </div>
          </div>
        </div>

        <div className="team-card">
          <div className="card-header">
            <div className="avatar">👥</div>
            <div className="member-info">
              <div className="member-name">Team Members</div>
              <div className="member-email">{teamStats.teamMembers}</div>
              <div className="member-rating">
                <div className="rating-rank">Active contributors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="analytics-grid">
        {/* Weekly Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Weekly Progress</h3>
          {loading ? (
            <div className="loading-placeholder">
              <i>⟳</i>
              <p>Loading...</p>
            </div>
          ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasks" fill="#8884d8" name="Total Tasks" />
              <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
          )}
        </div>

        {/* Task Status Distribution */}
        <div className="chart-container">
          <h3><i className="🥧"></i>Task Status Distribution</h3>
          {loading ? (
            <div className="loading-placeholder">
              <i>⟳</i>
              <p>Loading...</p>
            </div>
          ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          )}
        </div>

        {/* Department Performance */}
        <div className="chart-container large">
          <h3><i className="📈"></i>Department Performance</h3>
          {loading ? (
            <div className="loading-placeholder">
              <i>⟳</i>
              <p>Loading...</p>
            </div>
          ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="tasks" fill="#8884d8" name="Total Tasks" />
              <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="chart-container">
        <h3><i className="🔔"></i>Recent Activity</h3>
        <div className="space-y-4">
          {loading ? (
            <div className="loading-placeholder">
              <i>⟳</i>
              <p>Loading recent activity...</p>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="loading-placeholder">
              <p>No recent activity found</p>
            </div>
          ) : (
            recentActivity.map((activity, index) => (
              <div key={index} className="team-card">
                <div className="card-header">
                  <div className="avatar">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="member-info">
                    <div className="member-name">{activity.user}</div>
                    <div className="member-email">{activity.action} "{activity.task}"</div>
                    <div className="member-role">{activity.time}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
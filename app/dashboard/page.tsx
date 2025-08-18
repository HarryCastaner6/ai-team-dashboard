'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  FolderOpen, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Activity,
  Calendar,
  Target
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface DashboardStats {
  totalUsers: number
  activeProjects: number
  completedTasks: number
  pendingTasks: number
  teamProductivity: number
  weeklyProgress: number[]
  taskDistribution: {
    todo: number
    inProgress: number
    review: number
    done: number
  }
  departmentPerformance: {
    department: string
    completed: number
    pending: number
  }[]
  recentActivity: {
    type: string
    message: string
    timestamp: string
  }[]
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeProjects: 0,
    completedTasks: 0,
    pendingTasks: 0,
    teamProductivity: 0,
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
    taskDistribution: {
      todo: 0,
      inProgress: 0,
      review: 0,
      done: 0
    },
    departmentPerformance: [],
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  // Client-side auth check
  useEffect(() => {
    console.log('Dashboard - Session status:', status, 'Session:', !!session)
    if (status === 'unauthenticated') {
      console.log('Not authenticated, redirecting to login')
      router.push('/login')
    }
  }, [status, session, router])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Team Members',
      value: stats.totalUsers,
      icon: Users,
      change: stats.totalUsers > 0 ? `${stats.totalUsers} total` : 'No data',
      color: 'bg-blue-500'
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: FolderOpen,
      change: stats.activeProjects > 0 ? `${stats.activeProjects} active` : 'No projects',
      color: 'bg-purple-500'
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks,
      icon: CheckCircle,
      change: stats.completedTasks > 0 ? `${stats.completedTasks} done` : 'No tasks completed',
      color: 'bg-green-500'
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks,
      icon: Clock,
      change: stats.pendingTasks > 0 ? `${stats.pendingTasks} pending` : 'No pending tasks',
      color: 'bg-orange-500'
    }
  ]

  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Team Productivity',
        data: stats.weeklyProgress,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4
      }
    ]
  }

  const barChartData = {
    labels: stats.departmentPerformance.length > 0 
      ? stats.departmentPerformance.map(dept => dept.department)
      : ['No Departments'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: stats.departmentPerformance.length > 0
          ? stats.departmentPerformance.map(dept => dept.completed)
          : [0],
        backgroundColor: 'rgba(147, 51, 234, 0.8)'
      },
      {
        label: 'Tasks Pending',
        data: stats.departmentPerformance.length > 0
          ? stats.departmentPerformance.map(dept => dept.pending)
          : [0],
        backgroundColor: 'rgba(236, 72, 153, 0.8)'
      }
    ]
  }

  const doughnutChartData = {
    labels: ['To Do', 'In Progress', 'In Review', 'Done'],
    datasets: [
      {
        data: [
          stats.taskDistribution.todo,
          stats.taskDistribution.inProgress,
          stats.taskDistribution.review,
          stats.taskDistribution.done
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    }
  }

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="loading-placeholder">
        <i>⟳</i>
        <p>Checking authentication...</p>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="loading-placeholder">
        <i>⟳</i>
        <p>Redirecting to login...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="loading-placeholder">
        <i>⟳</i>
        <p>Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="section-header">
        <h2>
          <Activity size={40} />
          Team Dashboard
        </h2>
        <p>Welcome back! Here's your team overview with live data</p>
      </div>

      <div className="analytics-grid">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className="chart-container">
              <div className="card-header">
                <div className="avatar">
                  <Icon size={24} />
                </div>
                <div className="member-info">
                  <div className="member-name">{card.value.toLocaleString()}</div>
                  <div className="member-niche">{card.title}</div>
                  <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '5px' }}>
                    {card.change}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="analytics-row">
        <div className="chart-container">
          <h3>
            <TrendingUp size={20} />
            Weekly Progress
          </h3>
          <div style={{ height: '300px' }}>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container">
          <h3>
            <Activity size={20} />
            Task Distribution
          </h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={doughnutChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="chart-container large">
        <h3>
          <Target size={20} />
          Department Performance
        </h3>
        <div style={{ height: '400px' }}>
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-container" style={{ 
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '20px' 
          }}>
            <Activity size={32} />
            <span style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.teamProductivity}%</span>
          </div>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>Team Productivity</h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '20px' }}>
            Up 5% from last week
          </p>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.2)', 
            borderRadius: '10px', 
            height: '8px' 
          }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '10px', 
              height: '8px',
              width: `${stats.teamProductivity}%`,
              transition: 'all 0.5s ease'
            }} />
          </div>
        </div>

        <div className="chart-container">
          <h3>
            <Activity size={20} />
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%',
                    background: activity.type === 'completed' ? '#10b981' : '#667eea'
                  }} />
                  <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{activity.message}</p>
                </div>
              ))
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%',
                  background: '#94a3b8'
                }} />
                <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        <div className="chart-container">
          <h3>
            <Calendar size={20} />
            Upcoming Deadlines
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} style={{ color: '#ef4444' }} />
                <p style={{ fontSize: '0.9rem' }}>Website Redesign</p>
              </div>
              <span className="rating-value" style={{ background: '#ef4444', fontSize: '0.75rem' }}>
                Today
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} style={{ color: '#f59e0b' }} />
                <p style={{ fontSize: '0.9rem' }}>API Integration</p>
              </div>
              <span className="rating-value" style={{ background: '#f59e0b', fontSize: '0.75rem' }}>
                Tomorrow
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} style={{ color: '#667eea' }} />
                <p style={{ fontSize: '0.9rem' }}>Mobile App MVP</p>
              </div>
              <span className="rating-value" style={{ fontSize: '0.75rem' }}>
                In 3 days
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} style={{ color: '#94a3b8' }} />
                <p style={{ fontSize: '0.9rem' }}>Q4 Review</p>
              </div>
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                Next week
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
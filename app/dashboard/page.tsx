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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 118, 117, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 200, 87, 0.3) 0%, transparent 50%)',
        animation: 'float 20s ease-in-out infinite',
        zIndex: 0
      }} />

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Enhanced Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '32px 40px',
          marginBottom: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          animation: 'slideInDown 0.8s ease-out'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '16px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
              borderRadius: '16px',
              padding: '16px',
              animation: 'pulse 2s infinite'
            }}>
              <Activity size={40} color="white" />
            </div>
            <div>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                margin: 0,
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}>
                Team Dashboard
              </h1>
              <p style={{
                fontSize: '1.2rem',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                fontWeight: '300'
              }}>
                Welcome back! Here's your team overview with live data ✨
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <div 
                key={index} 
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  animation: `slideInUp 0.8s ease-out ${index * 0.1}s both`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(135deg, ${card.color === 'bg-blue-500' ? '#3b82f6' : card.color === 'bg-purple-500' ? '#8b5cf6' : card.color === 'bg-green-500' ? '#10b981' : '#f59e0b'} 0%, transparent 100%)`,
                  opacity: 0.1,
                  borderRadius: '20px'
                }} />
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <div style={{
                    background: `linear-gradient(135deg, ${card.color === 'bg-blue-500' ? '#3b82f6' : card.color === 'bg-purple-500' ? '#8b5cf6' : card.color === 'bg-green-500' ? '#10b981' : '#f59e0b'}, ${card.color === 'bg-blue-500' ? '#1d4ed8' : card.color === 'bg-purple-500' ? '#7c3aed' : card.color === 'bg-green-500' ? '#059669' : '#d97706'})`,
                    borderRadius: '16px',
                    padding: '16px',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    animation: 'bounce 2s infinite'
                  }}>
                    <Icon size={32} color="white" />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '2.5rem',
                      fontWeight: '700',
                      color: 'white',
                      marginBottom: '8px',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      {card.value.toLocaleString()}
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      {card.title}
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '400'
                    }}>
                      {card.change}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Enhanced Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '32px',
          marginBottom: '40px'
        }}>
          {/* Weekly Progress Chart */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            animation: 'slideInLeft 1s ease-out 0.4s both',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Chart Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #00d4aa, #00a991)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 6px 12px rgba(0, 212, 170, 0.3)'
              }}>
                <TrendingUp size={24} color="white" />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: 'white',
                margin: 0,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}>
                Weekly Progress
              </h3>
            </div>
            <div style={{ 
              height: '320px',
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '16px'
            }}>
              <Line data={lineChartData} options={{
                ...chartOptions,
                animation: {
                  duration: 2000,
                  easing: 'easeInOutCubic'
                },
                elements: {
                  line: {
                    tension: 0.4
                  },
                  point: {
                    radius: 6,
                    hoverRadius: 8
                  }
                }
              }} />
            </div>
          </div>

          {/* Task Distribution Chart */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            animation: 'slideInRight 1s ease-out 0.6s both',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Chart Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 6px 12px rgba(255, 107, 107, 0.3)'
              }}>
                <Activity size={24} color="white" />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: 'white',
                margin: 0,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}>
                Task Distribution
              </h3>
            </div>
            <div style={{ 
              height: '320px',
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '16px'
            }}>
              <Doughnut data={doughnutChartData} options={{
                ...chartOptions,
                animation: {
                  duration: 2000,
                  easing: 'easeInOutCubic'
                }
              }} />
            </div>
          </div>
        </div>

        {/* Department Performance Chart - Full Width */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          marginBottom: '40px',
          animation: 'slideInUp 1s ease-out 0.8s both'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 6px 12px rgba(124, 58, 237, 0.3)'
            }}>
              <Target size={24} color="white" />
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'white',
              margin: 0,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              Department Performance
            </h3>
          </div>
          <div style={{ 
            height: '400px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '16px'
          }}>
            <Bar data={barChartData} options={{
              ...chartOptions,
              animation: {
                duration: 2000,
                easing: 'easeInOutCubic'
              }
            }} />
          </div>
        </div>

        {/* Bottom Grid - Enhanced */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px'
        }}>
          {/* Team Productivity Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            color: 'white',
            animation: 'slideInLeft 1s ease-out 1s both',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Animated background pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              animation: 'pulse 3s infinite'
            }} />
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '24px',
              position: 'relative',
              zIndex: 1
            }}>
              <Activity size={40} style={{ 
                filter: 'drop-shadow(0 4px 8px rgba(255,255,255,0.3))',
                animation: 'rotate 4s linear infinite'
              }} />
              <span style={{ 
                fontSize: '3rem', 
                fontWeight: '700',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                animation: 'countUp 2s ease-out'
              }}>
                {stats.teamProductivity}%
              </span>
            </div>
            <h3 style={{ 
              color: 'white', 
              marginBottom: '12px',
              fontSize: '1.5rem',
              fontWeight: '600',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              Team Productivity
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              opacity: 0.9, 
              marginBottom: '24px',
              fontWeight: '300'
            }}>
              📈 Up 5% from last week
            </p>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: '12px', 
              height: '12px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                background: 'linear-gradient(90deg, #ffffff, #f0f0f0)', 
                borderRadius: '12px', 
                height: '12px',
                width: `${stats.teamProductivity}%`,
                transition: 'all 1.5s ease-out',
                animation: 'fillBar 2s ease-out 1.5s both',
                boxShadow: '0 2px 4px rgba(255,255,255,0.3)'
              }} />
            </div>
          </div>

          {/* Recent Activity Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            animation: 'slideInRight 1s ease-out 1.2s both',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 6px 12px rgba(240, 147, 251, 0.3)'
              }}>
                <Activity size={24} color="white" />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: 'white',
                margin: 0,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}>
                Recent Activity
              </h3>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '20px'
            }}>
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '16px',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1 + 1.5}s both`
                    }}
                  >
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%',
                      background: activity.type === 'completed' ? 
                        'linear-gradient(135deg, #10b981, #059669)' : 
                        'linear-gradient(135deg, #667eea, #764ba2)',
                      boxShadow: `0 0 10px ${activity.type === 'completed' ? '#10b981' : '#667eea'}`,
                      animation: 'pulse 2s infinite'
                    }} />
                    <p style={{ 
                      fontSize: '0.95rem', 
                      flex: 1,
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: '400'
                    }}>
                      {activity.message}
                    </p>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontWeight: '300'
                    }}>
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ 
                  opacity: 0.7, 
                  fontStyle: 'italic',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  padding: '20px'
                }}>
                  No recent activity
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS Animations */}
      <style jsx>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }

        @keyframes fillBar {
          from {
            width: 0%;
          }
          to {
            width: ${stats.teamProductivity}%;
          }
        }

        @keyframes countUp {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
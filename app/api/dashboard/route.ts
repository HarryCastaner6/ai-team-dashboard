import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock dashboard data for deployment
    const dashboardData = {
      totalUsers: 5,
      activeProjects: 3,
      completedTasks: 12,
      pendingTasks: 8,
      teamProductivity: 75,
      weeklyProgress: [65, 70, 72, 68, 75, 78, 75],
      taskDistribution: {
        todo: 3,
        inProgress: 3,
        review: 2,
        done: 12
      },
      departmentPerformance: [
        { department: 'Engineering', completed: 8, pending: 4 },
        { department: 'Design', completed: 3, pending: 2 },
        { department: 'Marketing', completed: 1, pending: 2 }
      ],
      recentActivity: [
        {
          type: 'completed',
          message: 'Task "Fix login bug" completed by John Doe',
          timestamp: new Date().toISOString()
        },
        {
          type: 'created',
          message: 'New task "Update documentation" created by Jane Smith',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'completed',
          message: 'Task "Design review" completed by Mike Johnson',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'created',
          message: 'New task "Implement feature X" created by Sarah Wilson',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ]
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
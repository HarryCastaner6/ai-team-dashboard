import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock analytics data for deployment
    const analytics = {
      teamStats: {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        todoTasks: 0,
        teamMembers: 0
      },
      statusDistribution: [],
      departmentPerformance: [],
      weeklyData: [],
      recentActivity: []
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
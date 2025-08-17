import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get basic task statistics
    const totalTasks = await prisma.task.count({
      where: { isArchived: false }
    })

    const completedTasks = await prisma.task.count({
      where: { 
        status: 'DONE',
        isArchived: false
      }
    })

    const inProgressTasks = await prisma.task.count({
      where: { 
        status: 'IN_PROGRESS',
        isArchived: false
      }
    })

    const todoTasks = await prisma.task.count({
      where: { 
        status: 'TODO',
        isArchived: false
      }
    })

    const teamMembers = await prisma.user.count()

    // Get task status distribution
    const statusData = await prisma.task.groupBy({
      by: ['status'],
      _count: { id: true },
      where: { isArchived: false }
    })

    const statusDistribution = statusData.map(item => ({
      name: item.status.replace('_', ' '),
      value: item._count.id,
      color: item.status === 'TODO' ? '#FF8042' : 
             item.status === 'IN_PROGRESS' ? '#FFBB28' : 
             item.status === 'IN_REVIEW' ? '#00C49F' : 
             item.status === 'DONE' ? '#0088FE' : '#8884d8'
    }))

    // Get department performance
    const departmentData = await prisma.user.groupBy({
      by: ['department'],
      _count: { id: true },
      where: { 
        department: { not: null },
        tasks: { some: { isArchived: false } }
      }
    })

    const departmentPerformance = await Promise.all(
      departmentData.map(async (dept) => {
        const deptTasks = await prisma.task.count({
          where: {
            creator: { department: dept.department },
            isArchived: false
          }
        })

        const deptCompleted = await prisma.task.count({
          where: {
            creator: { department: dept.department },
            status: 'DONE',
            isArchived: false
          }
        })

        return {
          name: dept.department || 'Unknown',
          tasks: deptTasks,
          completed: deptCompleted
        }
      })
    )

    // Get weekly data (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const weeklyTasks = await prisma.task.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        isArchived: false
      },
      select: {
        createdAt: true,
        status: true,
        completedAt: true
      }
    })

    // Group by day
    const weeklyData = []
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))

      const dayTasks = weeklyTasks.filter(task => 
        task.createdAt >= dayStart && task.createdAt <= dayEnd
      ).length

      const dayCompleted = weeklyTasks.filter(task => 
        task.completedAt && task.completedAt >= dayStart && task.completedAt <= dayEnd
      ).length

      weeklyData.push({
        name: days[date.getDay()],
        tasks: dayTasks,
        completed: dayCompleted
      })
    }

    // Get recent activity
    const recentTasks = await prisma.task.findMany({
      where: { isArchived: false },
      include: {
        creator: { select: { name: true } }
      },
      orderBy: { updatedAt: 'desc' },
      take: 5
    })

    const recentActivity = recentTasks.map(task => {
      let action = 'created task'
      if (task.status === 'DONE') action = 'completed task'
      else if (task.status === 'IN_PROGRESS') action = 'started working on'
      else if (task.status === 'IN_REVIEW') action = 'moved to review'

      const timeDiff = Date.now() - task.updatedAt.getTime()
      const hours = Math.floor(timeDiff / (1000 * 60 * 60))
      const timeAgo = hours < 1 ? 'Just now' : 
                     hours === 1 ? '1 hour ago' : 
                     `${hours} hours ago`

      return {
        user: task.creator.name,
        action,
        task: task.title,
        time: timeAgo
      }
    })

    return NextResponse.json({
      teamStats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        teamMembers
      },
      statusDistribution,
      departmentPerformance,
      weeklyData,
      recentActivity
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
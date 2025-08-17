import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Archive tasks that have been in To Do for more than 24 hours
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

    const tasksToArchive = await prisma.task.findMany({
      where: {
        status: 'TODO',
        todoAddedAt: {
          lte: twentyFourHoursAgo
        },
        isArchived: false
      }
    })

    if (tasksToArchive.length > 0) {
      await prisma.task.updateMany({
        where: {
          id: {
            in: tasksToArchive.map(task => task.id)
          }
        },
        data: {
          isArchived: true,
          archivedAt: new Date()
        }
      })
    }

    return NextResponse.json({ 
      message: `Archived ${tasksToArchive.length} tasks`,
      archivedCount: tasksToArchive.length
    })
  } catch (error) {
    console.error('Error archiving tasks:', error)
    return NextResponse.json({ error: 'Failed to archive tasks' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get archived tasks grouped by date
    const archivedTasks = await prisma.task.findMany({
      where: {
        isArchived: true,
        OR: [
          { creator: { id: user.id } },
          { assignees: { some: { userId: user.id } } }
        ]
      },
      include: {
        creator: {
          select: { name: true, email: true }
        },
        assignees: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        }
      },
      orderBy: {
        archivedAt: 'desc'
      }
    })

    // Group tasks by archive date
    const groupedTasks = archivedTasks.reduce((groups, task) => {
      const date = task.archivedAt?.toISOString().split('T')[0] || 'unknown'
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(task)
      return groups
    }, {} as Record<string, typeof archivedTasks>)

    return NextResponse.json(groupedTasks)
  } catch (error) {
    console.error('Error fetching archived tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch archived tasks' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
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
      message: `Auto-archived ${tasksToArchive.length} tasks that were in To Do for 24+ hours`,
      archivedCount: tasksToArchive.length,
      archivedTasks: tasksToArchive.map(task => ({
        id: task.id,
        title: task.title,
        todoAddedAt: task.todoAddedAt
      }))
    })
  } catch (error) {
    console.error('Error auto-archiving tasks:', error)
    return NextResponse.json({ error: 'Failed to auto-archive tasks' }, { status: 500 })
  }
}
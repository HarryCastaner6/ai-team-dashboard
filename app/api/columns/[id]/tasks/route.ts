import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const columnId = params.id
    const { title, description, priority, status } = await request.json()

    // Get the column to determine task count for position
    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: {
        _count: {
          select: { tasks: true }
        }
      }
    })

    if (!column) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 })
    }

    // Determine if this is a To Do column
    let todoAddedAt: Date | null = null
    if (column.name.toLowerCase().includes('to do') || column.name.toLowerCase().includes('todo')) {
      todoAddedAt = new Date()
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        columnId,
        creatorId: user.id,
        priority: priority || 'MEDIUM',
        status: status || 'TODO',
        position: column._count.tasks,
        todoAddedAt,
        tags: []
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
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
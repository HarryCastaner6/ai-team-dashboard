import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
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

    const { columnId } = await request.json()
    const taskId = params.id

    // Get the target column to determine status
    const targetColumn = await prisma.column.findUnique({
      where: { id: columnId }
    })

    if (!targetColumn) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 })
    }

    // Determine task status based on column name
    let status: 'TODO' | 'IN_PROGRESS' | 'DONE' = 'TODO'
    let completedAt: Date | null = null
    let todoAddedAt: Date | null = null

    const columnName = targetColumn.name.toLowerCase()
    if (columnName.includes('progress') || columnName.includes('doing')) {
      status = 'IN_PROGRESS'
    } else if (columnName.includes('done') || columnName.includes('complete')) {
      status = 'DONE'
      completedAt = new Date()
    } else if (columnName.includes('to do') || columnName.includes('todo')) {
      status = 'TODO'
      todoAddedAt = new Date()
    }

    // Update the task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        columnId,
        status,
        completedAt,
        todoAddedAt,
        updatedAt: new Date()
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

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error moving task:', error)
    return NextResponse.json({ error: 'Failed to move task' }, { status: 500 })
  }
}
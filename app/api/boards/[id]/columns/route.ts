import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const boardId = params.id

    const columns = await prisma.column.findMany({
      where: { boardId },
      include: {
        tasks: {
          where: { isArchived: false },
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
          orderBy: { position: 'asc' }
        }
      },
      orderBy: { position: 'asc' }
    })

    return NextResponse.json(columns)
  } catch (error) {
    console.error('Error fetching columns:', error)
    return NextResponse.json({ error: 'Failed to fetch columns' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const boardId = params.id
    const { name, position } = await request.json()

    const column = await prisma.column.create({
      data: {
        name,
        boardId,
        position: position || 0,
        color: '#6366f1' // Default color
      }
    })

    return NextResponse.json(column)
  } catch (error) {
    console.error('Error creating column:', error)
    return NextResponse.json({ error: 'Failed to create column' }, { status: 500 })
  }
}
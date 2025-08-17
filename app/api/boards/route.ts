import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

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

    const boards = await prisma.board.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          { boardAccess: { some: { userId: user.id } } },
          { isPublic: true }
        ]
      },
      include: {
        owner: {
          select: { name: true, email: true }
        },
        boardAccess: {
          select: { userId: true, canEdit: true }
        },
        _count: {
          select: { columns: true }
        }
      }
    })

    const boardsWithAccess = boards.map(board => ({
      ...board,
      canEdit: board.ownerId === user.id || 
               board.boardAccess?.some(access => 
                 access.userId === user.id && access.canEdit
               )
    }))

    return NextResponse.json(boardsWithAccess)
  } catch (error) {
    console.error('Error fetching boards:', error)
    return NextResponse.json({ error: 'Failed to fetch boards' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const { name, description, isPublic } = await request.json()

    const board = await prisma.board.create({
      data: {
        name,
        description,
        isPublic: isPublic || false,
        ownerId: user.id,
        columns: {
          create: [
            { name: 'To Do', position: 0, color: '#ef4444' },
            { name: 'In Progress', position: 1, color: '#f59e0b' },
            { name: 'Done', position: 2, color: '#22c55e' }
          ]
        }
      },
      include: {
        columns: true
      }
    })

    return NextResponse.json(board)
  } catch (error) {
    console.error('Error creating board:', error)
    return NextResponse.json({ error: 'Failed to create board' }, { status: 500 })
  }
}
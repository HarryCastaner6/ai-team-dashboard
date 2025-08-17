import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, context } = await request.json()

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // For now, return a simple generated description without OpenAI
    const fallbackDescription = `Complete the task: ${title}. Please provide detailed implementation and ensure all requirements are met.`
    
    return NextResponse.json({ 
      description: fallbackDescription,
      fallback: true 
    })
  } catch (error) {
    console.error('Error generating description:', error)
    
    return NextResponse.json({ 
      error: 'Failed to generate description' 
    }, { status: 500 })
  }
}
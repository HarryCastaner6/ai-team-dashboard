import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    const { title, context } = await request.json()

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const prompt = `You are a helpful AI assistant for a task management system. 

Given the task title: "${title}"
Context: ${context || 'General task management'}

Generate a clear, concise, and actionable task description that includes:
- What needs to be done
- Any important considerations or requirements
- Expected deliverables or outcomes

Keep it professional and under 150 words. Focus on being specific and actionable.

Task Description:`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system", 
          content: "You are a helpful AI assistant that generates clear, actionable task descriptions for project management."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    })

    const description = completion.choices[0]?.message?.content?.trim()

    if (!description) {
      return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 })
    }

    return NextResponse.json({ description })
  } catch (error) {
    console.error('Error generating description:', error)
    
    // Fallback to a simple description if AI fails
    const { title } = await request.json()
    const fallbackDescription = `Complete the task: ${title}. Please provide detailed implementation and ensure all requirements are met.`
    
    return NextResponse.json({ 
      description: fallbackDescription,
      fallback: true 
    })
  }
}
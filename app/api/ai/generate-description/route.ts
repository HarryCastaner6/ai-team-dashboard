import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title } = await request.json()

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY

    if (openaiApiKey) {
      try {
        // Use OpenAI API to generate description
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant that generates detailed task descriptions for project management. Create clear, actionable descriptions that include specific steps and requirements.'
              },
              {
                role: 'user',
                content: `Generate a detailed task description for: "${title}". Include specific steps, requirements, and acceptance criteria.`
              }
            ],
            max_tokens: 300,
            temperature: 0.7
          })
        })

        if (openaiResponse.ok) {
          const data = await openaiResponse.json()
          const description = data.choices[0]?.message?.content || `Complete the task: ${title}. Please provide detailed implementation and ensure all requirements are met.`
          return NextResponse.json({ description })
        }
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError)
      }
    }

    // Fallback description when no API key or API fails
    const description = `Complete the task: ${title}. Please provide detailed implementation and ensure all requirements are met. (To enable AI-generated descriptions, add your OPENAI_API_KEY environment variable in Vercel settings.)`

    return NextResponse.json({ description })
  } catch (error) {
    console.error('Generate description error:', error)
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 })
  }
}
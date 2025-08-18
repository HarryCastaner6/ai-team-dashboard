import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message } = await request.json()

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY

    if (openaiApiKey) {
      try {
        // Use OpenAI API
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
                content: 'You are a helpful AI assistant for a team productivity dashboard. Help users with task management, team coordination, and productivity insights.'
              },
              {
                role: 'user',
                content: message
              }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        })

        if (openaiResponse.ok) {
          const data = await openaiResponse.json()
          const response = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
          return NextResponse.json({ response })
        }
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError)
      }
    }

    // Fallback response when no API key or API fails
    const response = `Thanks for your message: "${message}". To enable AI responses, please add your OPENAI_API_KEY environment variable in Vercel settings.`

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 })
  }
}
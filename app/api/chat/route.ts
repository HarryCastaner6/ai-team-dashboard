import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '@/lib/prisma'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

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

    const { message, model, history } = await request.json()

    let response = ''

    if (model === 'chatgpt') {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant for a project management team.' },
          ...history.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          { role: 'user', content: message }
        ],
        max_tokens: 500
      })
      
      response = completion.choices[0]?.message?.content || 'No response'
    } else if (model === 'gemini') {
      const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' })
      
      const chat = geminiModel.startChat({
        history: history.map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))
      })
      
      const result = await chat.sendMessage(message)
      response = result.response.text()
    }

    await prisma.message.create({
      data: {
        content: message,
        userId: user.id,
        role: 'user',
        model
      }
    })

    await prisma.message.create({
      data: {
        content: response,
        userId: user.id,
        role: 'assistant',
        model
      }
    })

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 })
  }
}
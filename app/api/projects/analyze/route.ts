import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { description } = await request.json()

    const prompt = `
    Analyze the following project description and provide a detailed breakdown:
    "${description}"
    
    Please provide:
    1. A suitable project name
    2. Estimated timeline (start date, end date, total duration in days)
    3. Project phases with tasks, assignees, and time estimates
    4. Team allocation with roles and responsibilities
    5. Key milestones
    6. Potential risks
    
    Format the response as a structured JSON object.
    `

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'You are a project management expert. Analyze projects and break them down into actionable tasks with realistic timelines and team allocations.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.7
    })

    const response = completion.choices[0]?.message?.content || ''
    
    try {
      const breakdown = JSON.parse(response)
      return NextResponse.json(breakdown)
    } catch (parseError) {
      // Return a mock breakdown if parsing fails
      return NextResponse.json({
        projectName: "Project Analysis",
        description: description,
        timeline: {
          start: new Date().toISOString().split('T')[0],
          end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          duration: 90
        },
        phases: [
          {
            name: "Planning",
            duration: 14,
            tasks: [
              {
                id: "1",
                name: "Requirements Analysis",
                assignee: "Project Manager",
                timeEstimate: 5,
                description: "Analyze and document requirements",
                priority: "HIGH"
              },
              {
                id: "2",
                name: "Technical Design",
                assignee: "Tech Lead",
                timeEstimate: 7,
                description: "Create technical architecture",
                priority: "HIGH"
              }
            ]
          },
          {
            name: "Development",
            duration: 60,
            tasks: [
              {
                id: "3",
                name: "Core Development",
                assignee: "Development Team",
                timeEstimate: 45,
                description: "Build core functionality",
                priority: "HIGH"
              },
              {
                id: "4",
                name: "Testing",
                assignee: "QA Team",
                timeEstimate: 15,
                description: "Test and validate features",
                priority: "MEDIUM"
              }
            ]
          },
          {
            name: "Deployment",
            duration: 16,
            tasks: [
              {
                id: "5",
                name: "Deployment Setup",
                assignee: "DevOps",
                timeEstimate: 8,
                description: "Setup deployment infrastructure",
                priority: "HIGH"
              },
              {
                id: "6",
                name: "Go Live",
                assignee: "Full Team",
                timeEstimate: 8,
                description: "Launch and monitor",
                priority: "HIGH"
              }
            ]
          }
        ],
        teamAllocation: [
          {
            member: "Project Manager",
            role: "Project Management",
            allocation: 50,
            tasks: ["Planning", "Coordination", "Reporting"]
          },
          {
            member: "Development Team",
            role: "Development",
            allocation: 100,
            tasks: ["Coding", "Testing", "Documentation"]
          },
          {
            member: "QA Team",
            role: "Quality Assurance",
            allocation: 75,
            tasks: ["Testing", "Bug Reporting", "Validation"]
          }
        ],
        risks: [
          "Timeline delays due to scope changes",
          "Resource availability issues",
          "Technical challenges"
        ],
        milestones: [
          { name: "Planning Complete", date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
          { name: "Development Complete", date: new Date(Date.now() + 74 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
          { name: "Go Live", date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
        ]
      })
    }
  } catch (error) {
    console.error('Project analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze project' }, { status: 500 })
  }
}
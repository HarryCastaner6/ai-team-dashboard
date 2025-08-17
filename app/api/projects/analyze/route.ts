import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { description } = await request.json()

    // Simple fallback analysis for deployment
    const analysis = {
      objectives: ["Complete project tasks", "Meet deadlines", "Deliver quality results"],
      resources: ["Team members", "Development tools", "Project management tools"],
      timeline: "Based on project scope",
      risks: ["Resource availability", "Timeline constraints", "Technical challenges"],
      recommendations: ["Regular progress reviews", "Clear communication", "Risk mitigation planning"]
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze project' }, { status: 500 })
  }
}
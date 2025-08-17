import { NextRequest, NextResponse } from 'next/server'
import { claudeIntegration } from '@/lib/claude-integration'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'json'
    const issueId = searchParams.get('id')

    // Clean up old issues
    claudeIntegration.cleanupOldIssues()

    if (issueId) {
      // Get specific issue
      const issue = claudeIntegration.getIssue(issueId)
      if (!issue) {
        return NextResponse.json({ error: 'Issue not found' }, { status: 404 })
      }
      return NextResponse.json(issue)
    }

    if (format === 'report') {
      // Return formatted text report for Claude
      const report = claudeIntegration.generateIssueReport()
      return new NextResponse(report, {
        headers: { 'Content-Type': 'text/plain' }
      })
    }

    // Return JSON data
    return NextResponse.json(claudeIntegration.getIssuesForApi())
  } catch (error) {
    console.error('Claude issues API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Claude issues' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, issueId, response } = body

    switch (action) {
      case 'resolve':
        if (!issueId || !response) {
          return NextResponse.json(
            { error: 'Issue ID and response are required' },
            { status: 400 }
          )
        }

        const resolved = claudeIntegration.resolveIssue(issueId, response)
        if (!resolved) {
          return NextResponse.json(
            { error: 'Issue not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Issue resolved successfully'
        })

      case 'start':
        if (!issueId) {
          return NextResponse.json(
            { error: 'Issue ID is required' },
            { status: 400 }
          )
        }

        const started = claudeIntegration.markInProgress(issueId)
        if (!started) {
          return NextResponse.json(
            { error: 'Issue not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Issue marked as in progress'
        })

      case 'add':
        // Allow Claude to add issues manually
        const { type, severity, title, description, context } = body
        if (!type || !title || !description) {
          return NextResponse.json(
            { error: 'Type, title, and description are required' },
            { status: 400 }
          )
        }

        const issueId = claudeIntegration.addIssue({
          type,
          severity: severity || 'medium',
          title,
          description,
          context,
          autoFixAttempted: false
        })

        return NextResponse.json({
          success: true,
          issueId,
          message: 'Issue added to queue'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Claude issues POST error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
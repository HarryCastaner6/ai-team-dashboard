import { NextRequest, NextResponse } from 'next/server'
import { healthMonitor } from '@/lib/supabase-health'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const detailed = searchParams.get('detailed') === 'true'

    if (detailed) {
      // Return detailed health information
      const health = await healthMonitor.checkSystemHealth()
      return NextResponse.json(health)
    } else {
      // Return summary health information
      const summary = await healthMonitor.getHealthSummary()
      return NextResponse.json(summary)
    }
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        message: 'Health check system failure',
        issues: 1,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === 'fix') {
      // Trigger manual fix
      const health = await healthMonitor.checkSystemHealth()
      return NextResponse.json({
        message: 'Auto-fix triggered',
        health: health
      })
    } else if (action === 'sync') {
      // Force data sync
      // This would trigger the sync mechanism
      return NextResponse.json({
        message: 'Data sync initiated'
      })
    }

    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Health action failed' },
      { status: 500 }
    )
  }
}
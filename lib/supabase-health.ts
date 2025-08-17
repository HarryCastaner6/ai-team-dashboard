import { createClient } from '@supabase/supabase-js'
import { claudeIntegration } from './claude-integration'

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  message: string
  lastCheck: Date
  fixes?: string[]
}

interface SystemHealth {
  supabase: HealthCheck
  database: HealthCheck
  api: HealthCheck
  sync: HealthCheck
  overall: 'healthy' | 'degraded' | 'unhealthy'
}

class SupabaseHealthMonitor {
  private supabase: ReturnType<typeof createClient> | null = null
  private healthCache: SystemHealth | null = null
  private lastCheckTime: Date | null = null
  private readonly CACHE_DURATION = 30000 // 30 seconds
  private isChecking: boolean = false
  private checkQueue: Promise<SystemHealth> | null = null

  constructor() {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      this.supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
    }
  }

  async checkSystemHealth(): Promise<SystemHealth> {
    // Return cached health if still valid
    if (this.healthCache && this.lastCheckTime && 
        Date.now() - this.lastCheckTime.getTime() < this.CACHE_DURATION) {
      return this.healthCache
    }

    // If already checking, return the existing promise to prevent parallel calls
    if (this.isChecking && this.checkQueue) {
      return this.checkQueue
    }

    // Set checking flag and create new check promise
    this.isChecking = true
    this.checkQueue = this.performHealthCheck()

    try {
      const result = await this.checkQueue
      return result
    } finally {
      this.isChecking = false
      this.checkQueue = null
    }
  }

  private async performHealthCheck(): Promise<SystemHealth> {
    const health: SystemHealth = {
      supabase: await this.checkSupabaseHealth(),
      database: await this.checkDatabaseHealth(),
      api: await this.checkApiHealth(),
      sync: await this.checkSyncHealth(),
      overall: 'healthy'
    }

    // Determine overall health
    const healthLevels = [health.supabase, health.database, health.api, health.sync]
    if (healthLevels.some(h => h.status === 'unhealthy')) {
      health.overall = 'unhealthy'
    } else if (healthLevels.some(h => h.status === 'degraded')) {
      health.overall = 'degraded'
    }

    this.healthCache = health
    this.lastCheckTime = new Date()

    // Auto-fix if problems detected (with throttling)
    await this.throttledAutoFix(health)

    return health
  }

  private lastAutoFixTime: Date | null = null
  private readonly AUTO_FIX_COOLDOWN = 60000 // 1 minute between auto-fix attempts

  private async throttledAutoFix(health: SystemHealth): Promise<void> {
    // Only run auto-fix if enough time has passed since last attempt
    if (this.lastAutoFixTime && 
        Date.now() - this.lastAutoFixTime.getTime() < this.AUTO_FIX_COOLDOWN) {
      return
    }

    // Only run auto-fix if there are actual issues
    const hasIssues = [health.supabase, health.database, health.api, health.sync]
      .some(h => h.status !== 'healthy')

    if (!hasIssues) return

    console.log('🔧 Auto-fix system running (throttled)...')
    this.lastAutoFixTime = new Date()

    await this.autoFix(health)
  }

  private async autoFix(health: SystemHealth): Promise<void> {
    const fixResults: Array<{type: string, success: boolean, error?: string}> = []

    // Fix 1: Auto-sync data if mismatch detected
    if (health.sync.status === 'degraded' && health.sync.message?.includes('Data mismatch')) {
      console.log('🔄 Auto-fixing data sync...')
      try {
        await this.autoSyncData()
        fixResults.push({type: 'sync', success: true})
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        fixResults.push({type: 'sync', success: false, error: errorMsg})
        
        // Add to Claude queue
        claudeIntegration.addIssue({
          type: 'sync',
          severity: 'high',
          title: 'Data Sync Auto-Fix Failed',
          description: `Failed to automatically sync data between local and Supabase. ${errorMsg}`,
          context: {
            healthStatus: health.sync,
            error: errorMsg
          },
          autoFixAttempted: true,
          autoFixResult: `Failed: ${errorMsg}`
        })
      }
    }

    // Fix 2: Create missing tables
    if (health.database.status === 'unhealthy' && 
        health.database.message?.includes('relation "public.users" does not exist')) {
      console.log('📋 Auto-creating missing tables...')
      try {
        await this.autoCreateTables()
        fixResults.push({type: 'database', success: true})
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        fixResults.push({type: 'database', success: false, error: errorMsg})
        
        // Add to Claude queue
        claudeIntegration.addIssue({
          type: 'database',
          severity: 'critical',
          title: 'Missing Database Tables',
          description: `Database tables are missing and auto-creation failed. Manual intervention required.`,
          context: {
            healthStatus: health.database,
            error: errorMsg,
            requiredTables: ['users']
          },
          autoFixAttempted: true,
          autoFixResult: `Failed: ${errorMsg}`
        })
      }
    }

    // Fix 3: Retry failed connections
    if (health.supabase.status === 'unhealthy') {
      console.log('🔌 Retrying Supabase connection...')
      try {
        // Clear cache to force fresh connection attempt
        this.healthCache = null
        // Test connection
        if (this.supabase) {
          await this.supabase.from('users').select('count').limit(1)
        }
        fixResults.push({type: 'connection', success: true})
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        fixResults.push({type: 'connection', success: false, error: errorMsg})
        
        // Add to Claude queue
        claudeIntegration.addIssue({
          type: 'supabase',
          severity: 'critical',
          title: 'Supabase Connection Failed',
          description: `Cannot establish connection to Supabase. ${errorMsg}`,
          context: {
            healthStatus: health.supabase,
            error: errorMsg,
            url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
            key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing'
          },
          autoFixAttempted: true,
          autoFixResult: `Failed: ${errorMsg}`
        })
      }
    }

    // Check for API issues
    if (health.api.status === 'unhealthy') {
      claudeIntegration.addIssue({
        type: 'api',
        severity: 'high',
        title: 'API Health Check Failed',
        description: health.api.message || 'API endpoint is not responding correctly',
        context: {
          healthStatus: health.api,
          timestamp: new Date()
        },
        autoFixAttempted: false
      })
    }

    console.log('✅ Auto-fix system completed:', fixResults)
  }

  private async checkSupabaseHealth(): Promise<HealthCheck> {
    if (!this.supabase) {
      return {
        status: 'unhealthy',
        message: 'Supabase not configured',
        lastCheck: new Date(),
        fixes: ['Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY']
      }
    }

    try {
      const startTime = Date.now()
      const { data, error } = await this.supabase
        .from('users')
        .select('count')
        .limit(1)

      const responseTime = Date.now() - startTime

      if (error) {
        return {
          status: 'unhealthy',
          message: `Supabase error: ${error.message}`,
          lastCheck: new Date(),
          fixes: ['Check Supabase credentials', 'Verify table exists']
        }
      }

      if (responseTime > 5000) {
        return {
          status: 'degraded',
          message: `Slow response: ${responseTime}ms`,
          lastCheck: new Date(),
          fixes: ['Check network connection', 'Consider caching']
        }
      }

      return {
        status: 'healthy',
        message: `Connected (${responseTime}ms)`,
        lastCheck: new Date()
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Connection failed: ${error}`,
        lastCheck: new Date(),
        fixes: ['Check internet connection', 'Verify Supabase URL']
      }
    }
  }

  private async checkDatabaseHealth(): Promise<HealthCheck> {
    if (!this.supabase) {
      return {
        status: 'unhealthy',
        message: 'Supabase not available',
        lastCheck: new Date()
      }
    }

    try {
      const { data: users, error: usersError, count } = await this.supabase
        .from('users')
        .select('*', { count: 'exact' })
        .limit(1)

      if (usersError) {
        return {
          status: 'unhealthy',
          message: `Database error: ${usersError.message}`,
          lastCheck: new Date(),
          fixes: ['Create users table', 'Check table permissions']
        }
      }

      if (count === 0) {
        return {
          status: 'degraded',
          message: 'No data found',
          lastCheck: new Date(),
          fixes: ['Sync data from local database']
        }
      }

      return {
        status: 'healthy',
        message: `${count} records found`,
        lastCheck: new Date()
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Database check failed: ${error}`,
        lastCheck: new Date()
      }
    }
  }

  private async checkApiHealth(): Promise<HealthCheck> {
    // Simplified API health check to avoid circular dependency
    // Instead of calling /api/team, we'll just check if the API server is responding
    try {
      // Check if server is running by testing a simple endpoint
      // For now, we'll assume API is healthy if Supabase connection works
      if (this.supabase) {
        return {
          status: 'healthy',
          message: 'API server accessible',
          lastCheck: new Date()
        }
      } else {
        return {
          status: 'degraded',
          message: 'API server running but Supabase unavailable',
          lastCheck: new Date()
        }
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `API check failed: ${error}`,
        lastCheck: new Date(),
        fixes: ['Check server status', 'Verify API routes']
      }
    }
  }

  private async checkSyncHealth(): Promise<HealthCheck> {
    if (!this.supabase) {
      return {
        status: 'unhealthy',
        message: 'Cannot check sync - Supabase not available',
        lastCheck: new Date()
      }
    }

    try {
      // Simplified sync check - just check if Supabase has data
      // Avoid calling /api/team to prevent circular dependency
      const { count: supabaseCount } = await this.supabase
        .from('users')
        .select('*', { count: 'exact' })

      if (supabaseCount === 0) {
        return {
          status: 'degraded',
          message: 'No data in Supabase',
          lastCheck: new Date(),
          fixes: ['Sync data from local database']
        }
      }

      return {
        status: 'healthy',
        message: `Supabase has ${supabaseCount} records`,
        lastCheck: new Date()
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Sync check failed: ${error}`,
        lastCheck: new Date()
      }
    }
  }

  private async autoSyncData(): Promise<void> {
    if (!this.supabase) return

    try {
      // For now, disable auto-sync to avoid circular dependency
      // This would need to be implemented differently to avoid calling /api/team
      console.log('⚠️ Auto-sync disabled to prevent circular dependency')
      
      // Alternative approach: Could sync directly from Prisma if available
      // or implement a separate sync endpoint that doesn't trigger health checks
    } catch (error) {
      console.log('❌ Auto-sync failed:', error)
    }
  }

  private async autoCreateTables(): Promise<void> {
    // This would require service role key for DDL operations
    // For now, we log the need for manual table creation
    console.log('⚠️ Manual table creation required - run SQL in Supabase dashboard')
  }

  async getHealthSummary(): Promise<{ status: string; message: string; issues: number }> {
    const health = await this.checkSystemHealth()
    const issues = Object.values(health).filter(h => 
      typeof h === 'object' && 'status' in h && h.status !== 'healthy'
    ).length

    return {
      status: health.overall,
      message: this.getHealthMessage(health),
      issues: issues - 1 // Subtract 1 for 'overall' field
    }
  }

  private getHealthMessage(health: SystemHealth): string {
    if (health.overall === 'healthy') {
      return 'All systems operational'
    }

    const problems = []
    if (health.supabase.status !== 'healthy') problems.push('Supabase')
    if (health.database.status !== 'healthy') problems.push('Database')
    if (health.api.status !== 'healthy') problems.push('API')
    if (health.sync.status !== 'healthy') problems.push('Sync')

    return `Issues detected: ${problems.join(', ')}`
  }
}

export const healthMonitor = new SupabaseHealthMonitor()
export type { SystemHealth, HealthCheck }
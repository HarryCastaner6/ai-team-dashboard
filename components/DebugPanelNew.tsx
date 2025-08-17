'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Database, Activity, Users, RefreshCw, Eye, EyeOff, Wrench, AlertTriangle, CheckCircle, Bot, List } from 'lucide-react'

interface DebugStats {
  totalUsers: number
  lastUpdate: string
  connectionStatus: 'connected' | 'disconnected' | 'error'
  recentActivity: string[]
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  message: string
  issues: number
}

interface ClaudeIssuesSummary {
  total: number
  pending: number
  inProgress: number
  resolved: number
  failed: number
  criticalCount: number
}

export default function DebugPanel() {
  const [isVisible, setIsVisible] = useState(false)
  const [stats, setStats] = useState<DebugStats>({
    totalUsers: 0,
    lastUpdate: '',
    connectionStatus: 'disconnected',
    recentActivity: []
  })
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    message: 'System starting...',
    issues: 0
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isFixing, setIsFixing] = useState(false)
  const [claudeIssues, setClaudeIssues] = useState<ClaudeIssuesSummary>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    failed: 0,
    criticalCount: 0
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

  const fetchSystemHealth = async () => {
    try {
      const response = await fetch('/api/health')
      if (response.ok) {
        const health = await response.json()
        setSystemHealth(health)
      }
    } catch (error) {
      setSystemHealth({
        status: 'unhealthy',
        message: 'Health check failed',
        issues: 1
      })
    }
  }

  const triggerAutoFix = async () => {
    setIsFixing(true)
    try {
      const response = await fetch('/api/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fix' })
      })
      
      if (response.ok) {
        setStats(prev => ({
          ...prev,
          recentActivity: [
            'Auto-fix triggered at ' + new Date().toLocaleTimeString(),
            ...prev.recentActivity.slice(0, 4)
          ]
        }))
        
        // Refresh health and stats after fix
        setTimeout(() => {
          fetchSystemHealth()
          fetchStats()
        }, 2000)
      }
    } catch (error) {
      console.log('Auto-fix failed:', error)
    } finally {
      setIsFixing(false)
    }
  }

  const fetchClaudeIssues = async () => {
    try {
      const response = await fetch('/api/claude-issues')
      if (response.ok) {
        const data = await response.json()
        setClaudeIssues(data.summary)
      }
    } catch (error) {
      console.log('Failed to fetch Claude issues:', error)
    }
  }

  const fetchStats = async () => {
    if (!supabase) {
      setStats(prev => ({ ...prev, connectionStatus: 'error' }))
      return
    }

    setIsRefreshing(true)
    
    try {
      const { data: users, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        setStats(prev => ({ 
          ...prev, 
          connectionStatus: 'error',
          recentActivity: [`Error: ${error.message}`, ...prev.recentActivity.slice(0, 4)]
        }))
      } else {
        const recentActivity = users?.map(user => 
          `User: ${user.name} (${user.department || 'No dept'})`
        ) || []

        setStats({
          totalUsers: count || 0,
          lastUpdate: new Date().toLocaleTimeString(),
          connectionStatus: 'connected',
          recentActivity: [
            `Refreshed at ${new Date().toLocaleTimeString()}`,
            ...recentActivity.slice(0, 4)
          ]
        })
      }
    } catch (error) {
      setStats(prev => ({ 
        ...prev, 
        connectionStatus: 'error',
        recentActivity: [`Connection failed: ${error}`, ...prev.recentActivity.slice(0, 4)]
      }))
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    // Initial health check only when panel becomes visible
    if (isVisible) {
      fetchSystemHealth()
      fetchClaudeIssues()
    }
    
    if (supabase) {
      if (isVisible) {
        fetchStats()
      }
      
      // Set up real-time subscription
      const subscription = supabase
        .channel('users-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'users' }, 
          (payload) => {
            const action = payload.eventType
            const user = payload.new || payload.old
            
            setStats(prev => ({
              ...prev,
              recentActivity: [
                `${action.toUpperCase()}: ${user?.name || 'Unknown'} at ${new Date().toLocaleTimeString()}`,
                ...prev.recentActivity.slice(0, 4)
              ]
            }))
            
            // Only refresh if visible and throttle more aggressively
            if (isVisible) {
              setTimeout(() => {
                fetchStats()
                // Remove automatic health check on data changes
                // fetchSystemHealth()
              }, 2000)
            }
          }
        )
        .subscribe()

      // Completely disable automatic health checks for now
      // let healthInterval: NodeJS.Timeout | null = null
      
      // if (isVisible) {
      //   healthInterval = setInterval(() => {
      //     fetchSystemHealth()
      //   }, 120000) // Every 2 minutes
      // }

      return () => {
        subscription.unsubscribe()
        // if (healthInterval) {
        //   clearInterval(healthInterval)
        // }
      }
    }
  }, [supabase, isVisible])

  if (!supabaseUrl || !supabaseKey) {
    return null // Supabase not configured
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg transition-all ${
          systemHealth.status === 'healthy' 
            ? 'bg-green-600 hover:bg-green-700' 
            : systemHealth.status === 'degraded'
            ? 'bg-yellow-600 hover:bg-yellow-700'
            : 'bg-red-600 hover:bg-red-700'
        } text-white`}
        title="System Health & Debug Panel"
      >
        <Database className="w-5 h-5" />
        {systemHealth.issues > 0 && (
          <span className="text-xs bg-white bg-opacity-20 px-1 rounded">
            {systemHealth.issues}
          </span>
        )}
        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>System Health</span>
            </h3>
            <div className="flex space-x-2">
              {systemHealth.issues > 0 && (
                <button
                  onClick={triggerAutoFix}
                  disabled={isFixing}
                  className="p-1 text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-200"
                  title="Auto-fix detected issues"
                >
                  <Wrench className={`w-4 h-4 ${isFixing ? 'animate-spin' : ''}`} />
                </button>
              )}
              <button
                onClick={() => {
                  fetchStats()
                  fetchSystemHealth()
                  fetchClaudeIssues()
                }}
                disabled={isRefreshing}
                className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* System Health Status */}
          <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center space-x-2 mb-2">
              {systemHealth.status === 'healthy' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              )}
              <span className="font-medium text-gray-900 dark:text-white">
                {systemHealth.status === 'healthy' ? 'All Systems Operational' : 
                 systemHealth.status === 'degraded' ? 'Issues Detected' : 'System Problems'}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {systemHealth.message}
            </p>
            {systemHealth.issues > 0 && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-orange-600 dark:text-orange-400">
                  {systemHealth.issues} issue{systemHealth.issues !== 1 ? 's' : ''} found
                </span>
                <button
                  onClick={triggerAutoFix}
                  disabled={isFixing}
                  className="text-xs bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/20 dark:hover:bg-orange-800/20 text-orange-700 dark:text-orange-300 px-2 py-1 rounded flex items-center space-x-1"
                >
                  <Wrench className={`w-3 h-3 ${isFixing ? 'animate-spin' : ''}`} />
                  <span>{isFixing ? 'Fixing...' : 'Auto-fix'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Connection Status */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${
                stats.connectionStatus === 'connected' ? 'bg-green-500' :
                stats.connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stats.connectionStatus === 'connected' ? 'Connected' :
                 stats.connectionStatus === 'error' ? 'Error' : 'Connecting...'}
              </span>
            </div>
            {stats.lastUpdate && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last update: {stats.lastUpdate}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Users: {stats.totalUsers}
                </span>
              </div>
            </div>
          </div>

          {/* Claude Issues Integration */}
          <div className="mb-4 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center space-x-2 mb-2">
              <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Claude Integration
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                <span className={`font-medium ${claudeIssues.pending > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {claudeIssues.pending}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Critical:</span>
                <span className={`font-medium ${claudeIssues.criticalCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {claudeIssues.criticalCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">In Progress:</span>
                <span className="font-medium text-blue-600">
                  {claudeIssues.inProgress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Resolved:</span>
                <span className="font-medium text-green-600">
                  {claudeIssues.resolved}
                </span>
              </div>
            </div>

            {claudeIssues.pending > 0 && (
              <div className="mt-2 pt-2 border-t border-purple-200 dark:border-purple-700">
                <button
                  onClick={() => window.open('/api/claude-issues?format=report', '_blank')}
                  className="w-full text-xs bg-purple-100 hover:bg-purple-200 dark:bg-purple-800/20 dark:hover:bg-purple-700/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded flex items-center justify-center space-x-1"
                >
                  <List className="w-3 h-3" />
                  <span>View Issues for Claude</span>
                </button>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
              <Activity className="w-4 h-4" />
              <span>Recent Activity</span>
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <p key={index} className="text-xs text-gray-600 dark:text-gray-400 p-1 bg-gray-50 dark:bg-gray-700/50 rounded">
                    {activity}
                  </p>
                ))
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                  No recent activity
                </p>
              )}
            </div>
          </div>

          {/* Debug Info */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              🔗 Connected to: {supabaseUrl?.split('//')[1]?.split('.')[0]}
            </p>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => window.open(`${supabaseUrl}`, '_blank')}
                className="text-xs bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-800/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded"
              >
                Open Supabase
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify({
                    url: supabaseUrl,
                    anonKey: supabaseKey,
                    stats: stats
                  }, null, 2))
                }}
                className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
              >
                Copy Debug Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
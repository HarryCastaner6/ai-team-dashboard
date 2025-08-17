'use client'

import { useState, useEffect } from 'react'
import { Database, Users, Activity, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { supabase, isSupabaseConfigured, subscribeToChanges } from '@/lib/supabase'

interface DebugPanelProps {
  onRefresh?: () => void
}

export default function DebugPanel({ onRefresh }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dbStats, setDbStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    totalProjects: 0,
    lastUpdate: new Date().toISOString()
  })
  const [realTimeActivity, setRealTimeActivity] = useState<string[]>([])
  const [supabaseStatus, setSupabaseStatus] = useState(isSupabaseConfigured())

  useEffect(() => {
    if (isOpen) {
      fetchStats()
      
      // Set up real-time monitoring if Supabase is configured
      if (supabaseStatus) {
        const subscription = subscribeToChanges('users', (payload) => {
          const activity = `${new Date().toLocaleTimeString()}: User ${payload.eventType} - ${payload.new?.name || payload.old?.name || 'Unknown'}`
          setRealTimeActivity(prev => [activity, ...prev].slice(0, 10))
        })

        return () => {
          if (subscription) subscription.unsubscribe()
        }
      }
    }
  }, [isOpen, supabaseStatus])

  const fetchStats = async () => {
    try {
      const responses = await Promise.all([
        fetch('/api/team'),
        fetch('/api/dashboard')
      ])

      const [teamResponse, dashboardResponse] = responses
      
      if (teamResponse.ok && dashboardResponse.ok) {
        const teamData = await teamResponse.json()
        const dashboardData = await dashboardResponse.json()
        
        setDbStats({
          totalUsers: teamData.length || dashboardData.totalUsers || 0,
          totalTasks: dashboardData.completedTasks + dashboardData.pendingTasks || 0,
          totalProjects: dashboardData.activeProjects || 0,
          lastUpdate: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error fetching debug stats:', error)
    }
  }

  const handleRefresh = () => {
    fetchStats()
    if (onRefresh) onRefresh()
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition"
          title="Debug Panel"
        >
          <Database size={20} />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl w-80 max-h-96 overflow-hidden">
      <div className="bg-purple-600 text-white p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database size={18} />
          <span className="font-semibold">Debug Panel</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200"
        >
          <EyeOff size={18} />
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
        {/* Database Stats */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Database Stats</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-blue-50 p-2 rounded text-center">
              <Users size={14} className="mx-auto mb-1 text-blue-600" />
              <div className="font-semibold">{dbStats.totalUsers}</div>
              <div className="text-gray-600">Users</div>
            </div>
            <div className="bg-green-50 p-2 rounded text-center">
              <Activity size={14} className="mx-auto mb-1 text-green-600" />
              <div className="font-semibold">{dbStats.totalTasks}</div>
              <div className="text-gray-600">Tasks</div>
            </div>
            <div className="bg-orange-50 p-2 rounded text-center">
              <Database size={14} className="mx-auto mb-1 text-orange-600" />
              <div className="font-semibold">{dbStats.totalProjects}</div>
              <div className="text-gray-600">Projects</div>
            </div>
          </div>
        </div>

        {/* Supabase Status */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Supabase Status</h4>
          <div className={`p-2 rounded text-xs ${supabaseStatus ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
            {supabaseStatus ? '✅ Connected & Monitoring' : '⚠️ Not Configured'}
          </div>
        </div>

        {/* Real-time Activity */}
        {supabaseStatus && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Live Activity</h4>
            <div className="bg-gray-50 rounded p-2 text-xs max-h-32 overflow-y-auto">
              {realTimeActivity.length > 0 ? (
                realTimeActivity.map((activity, index) => (
                  <div key={index} className="text-gray-600 mb-1">{activity}</div>
                ))
              ) : (
                <div className="text-gray-500">No recent activity</div>
              )}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-xs hover:bg-blue-700 transition flex items-center justify-center space-x-1"
          >
            <RefreshCw size={12} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Last Update */}
        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date(dbStats.lastUpdate).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
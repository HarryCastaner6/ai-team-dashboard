'use client'

import { useState } from 'react'
import { 
  Shield, 
  Lock, 
  Unlock, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  Download, 
  Upload, 
  RefreshCw, 
  Clock, 
  Database, 
  Server, 
  Globe, 
  Smartphone, 
  Wifi, 
  FileText, 
  Users, 
  Activity, 
  Settings, 
  Bell, 
  Search, 
  Filter,
  MoreVertical,
  Play,
  Pause,
  Trash2,
  Copy,
  ExternalLink,
  Monitor,
  UserCheck,
  Ban,
  Archive,
  Calendar,
  MapPin,
  Chrome,
  Plus
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

interface BackupJob {
  id: string
  name: string
  type: 'full' | 'incremental' | 'differential'
  status: 'running' | 'completed' | 'failed' | 'scheduled'
  progress: number
  size: number
  startTime: Date
  endTime?: Date
  nextRun?: Date
  retentionDays: number
  destination: string
  isEncrypted: boolean
  isAutomatic: boolean
}

interface SecurityEvent {
  id: string
  type: 'login' | 'logout' | 'failed_login' | 'password_change' | 'permission_change' | 'suspicious_activity' | 'data_export'
  severity: 'low' | 'medium' | 'high' | 'critical'
  user: string
  ip: string
  location: string
  device: string
  timestamp: Date
  description: string
  resolved: boolean
}

interface AccessToken {
  id: string
  name: string
  scopes: string[]
  lastUsed?: Date
  createdAt: Date
  expiresAt?: Date
  isActive: boolean
  permissions: string[]
}

interface SecuritySetting {
  id: string
  name: string
  description: string
  category: 'authentication' | 'access' | 'encryption' | 'monitoring'
  enabled: boolean
  value?: string | number | boolean
  options?: string[]
}

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<'backup' | 'security' | 'access' | 'monitoring'>('backup')
  const [showCreateBackup, setShowCreateBackup] = useState(false)
  const [showCreateToken, setShowCreateToken] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('all')

  const [backupJobs, setBackupJobs] = useState<BackupJob[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [accessTokens, setAccessTokens] = useState<AccessToken[]>([])
  
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    {
      id: '1',
      name: 'Two-Factor Authentication',
      description: 'Require 2FA for all user accounts',
      category: 'authentication',
      enabled: true
    },
    {
      id: '2',
      name: 'Password Complexity',
      description: 'Enforce strong password requirements',
      category: 'authentication',
      enabled: true
    },
    {
      id: '3',
      name: 'Session Timeout',
      description: 'Automatically log out inactive users',
      category: 'access',
      enabled: true,
      value: 30
    },
    {
      id: '4',
      name: 'IP Whitelisting',
      description: 'Restrict access to specific IP addresses',
      category: 'access',
      enabled: false
    },
    {
      id: '5',
      name: 'Data Encryption at Rest',
      description: 'Encrypt all stored data',
      category: 'encryption',
      enabled: true
    },
    {
      id: '6',
      name: 'Audit Logging',
      description: 'Log all user activities and system events',
      category: 'monitoring',
      enabled: true
    }
  ])

  const [newBackup, setNewBackup] = useState({
    name: '',
    type: 'incremental' as BackupJob['type'],
    retentionDays: 30,
    destination: 'cloud',
    isEncrypted: true,
    isAutomatic: true,
    schedule: 'daily'
  })

  const [newToken, setNewToken] = useState({
    name: '',
    scopes: [] as string[],
    expiresIn: '30',
    permissions: [] as string[]
  })

  const availableScopes = [
    'read:users',
    'write:users',
    'read:projects',
    'write:projects',
    'read:files',
    'write:files',
    'admin:system',
    'admin:users'
  ]

  const availablePermissions = [
    'View Dashboard',
    'Manage Users',
    'Edit Projects',
    'Access Files',
    'System Administration',
    'Backup Management',
    'Security Settings'
  ]

  const getStatusColor = (status: BackupJob['status']) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'scheduled': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const createBackupJob = () => {
    if (!newBackup.name) {
      toast.error('Please enter a backup name')
      return
    }

    const backup: BackupJob = {
      id: Date.now().toString(),
      name: newBackup.name,
      type: newBackup.type,
      status: 'scheduled',
      progress: 0,
      size: Math.floor(Math.random() * 10000000000), // Random size for demo
      startTime: new Date(),
      retentionDays: newBackup.retentionDays,
      destination: newBackup.destination,
      isEncrypted: newBackup.isEncrypted,
      isAutomatic: newBackup.isAutomatic,
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000) // Next day
    }

    setBackupJobs(prev => [...prev, backup])
    setNewBackup({
      name: '',
      type: 'incremental',
      retentionDays: 30,
      destination: 'cloud',
      isEncrypted: true,
      isAutomatic: true,
      schedule: 'daily'
    })
    setShowCreateBackup(false)
    toast.success('Backup job created successfully!')
  }

  const createAccessToken = () => {
    if (!newToken.name) {
      toast.error('Please enter a token name')
      return
    }

    const token: AccessToken = {
      id: Date.now().toString(),
      name: newToken.name,
      scopes: newToken.scopes,
      createdAt: new Date(),
      expiresAt: newToken.expiresIn !== 'never' ? new Date(Date.now() + parseInt(newToken.expiresIn) * 24 * 60 * 60 * 1000) : undefined,
      isActive: true,
      permissions: newToken.permissions
    }

    setAccessTokens(prev => [...prev, token])
    setNewToken({
      name: '',
      scopes: [],
      expiresIn: '30',
      permissions: []
    })
    setShowCreateToken(false)
    toast.success('Access token created successfully!')
  }

  const toggleSetting = (settingId: string) => {
    setSecuritySettings(prev => prev.map(setting => 
      setting.id === settingId 
        ? { ...setting, enabled: !setting.enabled }
        : setting
    ))
    toast.success('Security setting updated!')
  }

  const runBackup = (backupId: string) => {
    setBackupJobs(prev => prev.map(backup => 
      backup.id === backupId 
        ? { ...backup, status: 'running', progress: 0, startTime: new Date() }
        : backup
    ))
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupJobs(prev => prev.map(backup => {
        if (backup.id === backupId && backup.status === 'running') {
          const newProgress = backup.progress + Math.random() * 20
          if (newProgress >= 100) {
            clearInterval(interval)
            return { ...backup, status: 'completed', progress: 100, endTime: new Date() }
          }
          return { ...backup, progress: newProgress }
        }
        return backup
      }))
    }, 1000)
    
    toast.success('Backup started!')
  }

  const revokeToken = (tokenId: string) => {
    setAccessTokens(prev => prev.map(token => 
      token.id === tokenId 
        ? { ...token, isActive: false }
        : token
    ))
    toast.success('Access token revoked!')
  }

  const filteredEvents = securityEvents.filter(event => {
    if (filterSeverity !== 'all' && event.severity !== filterSeverity) return false
    return event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
           event.type.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const criticalEvents = securityEvents.filter(e => e.severity === 'critical' && !e.resolved).length
  const activeTokens = accessTokens.filter(t => t.isActive).length
  const runningBackups = backupJobs.filter(b => b.status === 'running').length
  const enabledSettings = securitySettings.filter(s => s.enabled).length

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Backup & Security Center
          </h1>
          <p className="text-slate-600 mt-2">Protect your data and monitor security across your organization</p>
        </div>
        <div className="flex items-center space-x-3">
          {activeTab === 'backup' && (
            <button
              onClick={() => setShowCreateBackup(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              <span className="font-medium">New Backup</span>
            </button>
          )}
          {activeTab === 'access' && (
            <button
              onClick={() => setShowCreateToken(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              <span className="font-medium">New Token</span>
            </button>
          )}
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Critical Events</p>
              <p className="text-3xl font-bold">{criticalEvents}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <AlertTriangle className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Active Tokens</p>
              <p className="text-3xl font-bold">{activeTokens}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Key className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Running Backups</p>
              <p className="text-3xl font-bold">{runningBackups}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Database className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Security Settings</p>
              <p className="text-3xl font-bold">{enabledSettings}/{securitySettings.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Shield className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
        <div className="flex border-b border-slate-200">
          {(['backup', 'security', 'access', 'monitoring'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Backup Jobs ({backupJobs.length})</h3>
              </div>

              {backupJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">No backup jobs configured</h3>
                  <p className="text-slate-600 mb-6">Create your first backup job to protect your data</p>
                  <button
                    onClick={() => setShowCreateBackup(true)}
                    className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-200"
                  >
                    Create Backup Job
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {backupJobs.map((backup) => (
                    <div key={backup.id} className="border border-slate-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800">{backup.name}</h4>
                          <p className="text-sm text-slate-600">
                            {backup.type} backup • {formatFileSize(backup.size)} • {backup.destination}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                            {backup.status}
                          </span>
                          <button className="p-1 hover:bg-slate-100 rounded">
                            <MoreVertical size={16} className="text-slate-400" />
                          </button>
                        </div>
                      </div>

                      {backup.status === 'running' && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-700">Progress</span>
                            <span className="text-sm text-slate-500">{Math.round(backup.progress)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300"
                              style={{ width: `${backup.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-slate-500">Last Run</p>
                          <p className="font-semibold">{format(backup.startTime, 'MMM d, h:mm a')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Next Run</p>
                          <p className="font-semibold">
                            {backup.nextRun ? format(backup.nextRun, 'MMM d, h:mm a') : 'Manual'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Retention</p>
                          <p className="font-semibold">{backup.retentionDays} days</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Encryption</p>
                          <p className="font-semibold flex items-center space-x-1">
                            {backup.isEncrypted ? (
                              <>
                                <Lock size={14} className="text-green-500" />
                                <span>Enabled</span>
                              </>
                            ) : (
                              <>
                                <Unlock size={14} className="text-red-500" />
                                <span>Disabled</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {backup.status !== 'running' && (
                          <button
                            onClick={() => runBackup(backup.id)}
                            className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs hover:bg-green-200 transition-colors"
                          >
                            Run Now
                          </button>
                        )}
                        <button className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs hover:bg-blue-200 transition-colors">
                          Configure
                        </button>
                        <button className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs hover:bg-slate-200 transition-colors">
                          View Logs
                        </button>
                        <button className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs hover:bg-red-200 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800">Security Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['authentication', 'access', 'encryption', 'monitoring'].map((category) => (
                  <div key={category} className="border border-slate-200 rounded-xl p-6">
                    <h4 className="font-medium text-slate-800 mb-4 capitalize">{category}</h4>
                    <div className="space-y-3">
                      {securitySettings
                        .filter(setting => setting.category === category)
                        .map((setting) => (
                          <div key={setting.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                            <div className="flex-1">
                              <h5 className="font-medium text-slate-800">{setting.name}</h5>
                              <p className="text-sm text-slate-600">{setting.description}</p>
                              {setting.value && (
                                <p className="text-xs text-slate-500 mt-1">
                                  Current value: {setting.value}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => toggleSetting(setting.id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                setting.enabled ? 'bg-green-500' : 'bg-slate-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  setting.enabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'access' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Access Tokens ({accessTokens.length})</h3>
              </div>

              {accessTokens.length === 0 ? (
                <div className="text-center py-12">
                  <Key className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">No access tokens</h3>
                  <p className="text-slate-600 mb-6">Create API tokens to enable integrations and automation</p>
                  <button
                    onClick={() => setShowCreateToken(true)}
                    className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-200"
                  >
                    Create Access Token
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {accessTokens.map((token) => (
                    <div key={token.id} className="border border-slate-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800">{token.name}</h4>
                          <p className="text-sm text-slate-600">
                            Created {format(token.createdAt, 'MMM d, yyyy')}
                            {token.expiresAt && ` • Expires ${format(token.expiresAt, 'MMM d, yyyy')}`}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            token.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {token.isActive ? 'Active' : 'Revoked'}
                          </span>
                          <button className="p-1 hover:bg-slate-100 rounded">
                            <MoreVertical size={16} className="text-slate-400" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-slate-500 mb-2">Scopes</p>
                          <div className="flex flex-wrap gap-1">
                            {token.scopes.map((scope) => (
                              <span key={scope} className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">
                                {scope}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-2">Permissions</p>
                          <div className="flex flex-wrap gap-1">
                            {token.permissions.slice(0, 3).map((permission) => (
                              <span key={permission} className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">
                                {permission}
                              </span>
                            ))}
                            {token.permissions.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-500 text-xs">
                                +{token.permissions.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                          {token.lastUsed ? (
                            <span>Last used {formatDistanceToNow(token.lastUsed, { addSuffix: true })}</span>
                          ) : (
                            <span>Never used</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs hover:bg-blue-200 transition-colors">
                            <Copy size={12} className="inline mr-1" />
                            Copy Token
                          </button>
                          {token.isActive ? (
                            <button
                              onClick={() => revokeToken(token.id)}
                              className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs hover:bg-red-200 transition-colors"
                            >
                              Revoke
                            </button>
                          ) : (
                            <button className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs hover:bg-green-200 transition-colors">
                              Regenerate
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search security events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-80 pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900 bg-white"
                    />
                  </div>
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900 bg-white"
                  >
                    <option value="all">All Severities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-800">Security Events ({filteredEvents.length})</h3>

              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">No security events found</h3>
                  <p className="text-slate-600">Your system is secure and all activities are being monitored</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="border border-slate-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            event.severity === 'critical' ? 'bg-red-100' :
                            event.severity === 'high' ? 'bg-orange-100' :
                            event.severity === 'medium' ? 'bg-yellow-100' :
                            'bg-blue-100'
                          }`}>
                            {event.type === 'login' && <UserCheck size={16} />}
                            {event.type === 'logout' && <UserCheck size={16} />}
                            {event.type === 'failed_login' && <Ban size={16} />}
                            {event.type === 'password_change' && <Key size={16} />}
                            {event.type === 'permission_change' && <Settings size={16} />}
                            {event.type === 'suspicious_activity' && <AlertTriangle size={16} />}
                            {event.type === 'data_export' && <Download size={16} />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-800">{event.description}</h4>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                              <span className="flex items-center space-x-1">
                                <Users size={14} />
                                <span>{event.user}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Globe size={14} />
                                <span>{event.ip}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MapPin size={14} />
                                <span>{event.location}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Monitor size={14} />
                                <span>{event.device}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                            {event.severity}
                          </span>
                          <span className="text-sm text-slate-500">
                            {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      
                      {!event.resolved && event.severity !== 'low' && (
                        <div className="flex items-center space-x-2">
                          <button className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs hover:bg-green-200 transition-colors">
                            Mark Resolved
                          </button>
                          <button className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs hover:bg-blue-200 transition-colors">
                            Investigate
                          </button>
                          <button className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs hover:bg-red-200 transition-colors">
                            Block User
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Backup Modal */}
      {showCreateBackup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Create Backup Job</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Backup Name *</label>
                <input
                  type="text"
                  value={newBackup.name}
                  onChange={(e) => setNewBackup({ ...newBackup, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900 bg-white"
                  placeholder="Daily Database Backup"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Backup Type</label>
                <select
                  value={newBackup.type}
                  onChange={(e) => setNewBackup({ ...newBackup, type: e.target.value as BackupJob['type'] })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900 bg-white"
                >
                  <option value="full">Full Backup</option>
                  <option value="incremental">Incremental Backup</option>
                  <option value="differential">Differential Backup</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Destination</label>
                <select
                  value={newBackup.destination}
                  onChange={(e) => setNewBackup({ ...newBackup, destination: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900 bg-white"
                >
                  <option value="cloud">Cloud Storage</option>
                  <option value="local">Local Storage</option>
                  <option value="external">External Drive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Retention Period (days)</label>
                <input
                  type="number"
                  value={newBackup.retentionDays}
                  onChange={(e) => setNewBackup({ ...newBackup, retentionDays: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900 bg-white"
                  min="1"
                  max="365"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Schedule</label>
                <select
                  value={newBackup.schedule}
                  onChange={(e) => setNewBackup({ ...newBackup, schedule: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900 bg-white"
                >
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="manual">Manual Only</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="encrypted"
                    checked={newBackup.isEncrypted}
                    onChange={(e) => setNewBackup({ ...newBackup, isEncrypted: e.target.checked })}
                    className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="encrypted" className="text-sm text-slate-700">Enable encryption</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="automatic"
                    checked={newBackup.isAutomatic}
                    onChange={(e) => setNewBackup({ ...newBackup, isAutomatic: e.target.checked })}
                    className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="automatic" className="text-sm text-slate-700">Automatic scheduling</label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setShowCreateBackup(false)}
                className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createBackupJob}
                className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Create Backup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Token Modal */}
      {showCreateToken && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Create Access Token</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Token Name *</label>
                <input
                  type="text"
                  value={newToken.name}
                  onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900 bg-white"
                  placeholder="My API Token"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Expiration</label>
                <select
                  value={newToken.expiresIn}
                  onChange={(e) => setNewToken({ ...newToken, expiresIn: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900 bg-white"
                >
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                  <option value="never">Never</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Scopes</label>
                <div className="max-h-40 overflow-y-auto border border-slate-300 rounded-xl p-3">
                  {availableScopes.map((scope) => (
                    <div key={scope} className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        id={scope}
                        checked={newToken.scopes.includes(scope)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewToken({ ...newToken, scopes: [...newToken.scopes, scope] })
                          } else {
                            setNewToken({ ...newToken, scopes: newToken.scopes.filter(s => s !== scope) })
                          }
                        }}
                        className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <label htmlFor={scope} className="text-sm text-slate-700">{scope}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Permissions</label>
                <div className="max-h-40 overflow-y-auto border border-slate-300 rounded-xl p-3">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        id={permission}
                        checked={newToken.permissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewToken({ ...newToken, permissions: [...newToken.permissions, permission] })
                          } else {
                            setNewToken({ ...newToken, permissions: newToken.permissions.filter(p => p !== permission) })
                          }
                        }}
                        className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <label htmlFor={permission} className="text-sm text-slate-700">{permission}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setShowCreateToken(false)}
                className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createAccessToken}
                className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Create Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
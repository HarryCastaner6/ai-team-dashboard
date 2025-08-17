'use client'

import { useState } from 'react'
import { 
  Zap, 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  Copy, 
  Eye, 
  EyeOff,
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Globe, 
  Key, 
  Database, 
  Code, 
  Activity,
  Search,
  Filter,
  MoreVertical,
  Webhook,
  RefreshCw,
  BarChart3,
  Shield,
  ExternalLink,
  Download,
  Upload,
  MessageSquare,
  Mail,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Cloud,
  Smartphone
} from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Integration {
  id: string
  name: string
  description: string
  category: 'communication' | 'productivity' | 'analytics' | 'payment' | 'storage' | 'development' | 'marketing' | 'crm'
  provider: string
  status: 'active' | 'inactive' | 'error' | 'configuring'
  lastSync: Date
  apiCalls: number
  monthlyLimit: number
  config: {
    apiKey?: string
    webhookUrl?: string
    settings: Record<string, any>
  }
  endpoints: APIEndpoint[]
  logs: IntegrationLog[]
  icon: string
  version: string
  isOfficial: boolean
}

interface APIEndpoint {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  description: string
  lastCalled?: Date
  responseTime?: number
  successRate: number
  isActive: boolean
}

interface IntegrationLog {
  id: string
  timestamp: Date
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  endpoint?: string
  responseCode?: number
  duration?: number
}

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  secret: string
  isActive: boolean
  lastTriggered?: Date
  totalTriggers: number
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [activeTab, setActiveTab] = useState<'integrations' | 'webhooks' | 'logs' | 'analytics'>('integrations')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showWebhookModal, setShowWebhookModal] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)

  const [newIntegration, setNewIntegration] = useState({
    name: '',
    description: '',
    category: 'productivity' as Integration['category'],
    provider: '',
    apiKey: '',
    baseUrl: ''
  })

  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[],
    secret: ''
  })

  const availableProviders = [
    { id: 'slack', name: 'Slack', category: 'communication', icon: '💬', description: 'Team messaging and collaboration' },
    { id: 'google-workspace', name: 'Google Workspace', category: 'productivity', icon: '📧', description: 'Email, calendar, and documents' },
    { id: 'github', name: 'GitHub', category: 'development', icon: '🐙', description: 'Code repository management' },
    { id: 'stripe', name: 'Stripe', category: 'payment', icon: '💳', description: 'Payment processing' },
    { id: 'salesforce', name: 'Salesforce', category: 'crm', icon: '☁️', description: 'Customer relationship management' },
    { id: 'zapier', name: 'Zapier', category: 'productivity', icon: '⚡', description: 'Workflow automation' },
    { id: 'google-analytics', name: 'Google Analytics', category: 'analytics', icon: '📊', description: 'Web analytics and reporting' },
    { id: 'mailchimp', name: 'Mailchimp', category: 'marketing', icon: '🐵', description: 'Email marketing campaigns' },
    { id: 'dropbox', name: 'Dropbox', category: 'storage', icon: '📦', description: 'Cloud file storage' },
    { id: 'trello', name: 'Trello', category: 'productivity', icon: '📋', description: 'Project management boards' }
  ]

  const webhookEvents = [
    'user.created',
    'user.updated',
    'user.deleted',
    'project.created',
    'project.updated',
    'project.completed',
    'task.created',
    'task.updated',
    'task.completed',
    'payment.succeeded',
    'payment.failed',
    'invoice.created',
    'invoice.paid'
  ]

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'configuring': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'active': return <CheckCircle size={14} />
      case 'inactive': return <Pause size={14} />
      case 'error': return <AlertTriangle size={14} />
      case 'configuring': return <Clock size={14} />
      default: return <Clock size={14} />
    }
  }

  const getCategoryIcon = (category: Integration['category']) => {
    switch (category) {
      case 'communication': return <MessageSquare size={20} className="text-blue-500" />
      case 'productivity': return <Zap size={20} className="text-green-500" />
      case 'analytics': return <BarChart3 size={20} className="text-purple-500" />
      case 'payment': return <DollarSign size={20} className="text-yellow-500" />
      case 'storage': return <Database size={20} className="text-indigo-500" />
      case 'development': return <Code size={20} className="text-orange-500" />
      case 'marketing': return <Users size={20} className="text-pink-500" />
      case 'crm': return <Users size={20} className="text-teal-500" />
      default: return <Globe size={20} className="text-slate-500" />
    }
  }

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: integration.status === 'active' ? 'inactive' : 'active' }
        : integration
    ))
    toast.success('Integration status updated!')
  }

  const deleteIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.filter(integration => integration.id !== integrationId))
    toast.success('Integration deleted successfully!')
  }

  const createIntegration = () => {
    if (!newIntegration.name || !newIntegration.provider) {
      toast.error('Please fill in all required fields')
      return
    }

    const integration: Integration = {
      id: Date.now().toString(),
      name: newIntegration.name,
      description: newIntegration.description,
      category: newIntegration.category,
      provider: newIntegration.provider,
      status: 'configuring',
      lastSync: new Date(),
      apiCalls: 0,
      monthlyLimit: 10000,
      config: {
        apiKey: newIntegration.apiKey,
        settings: {}
      },
      endpoints: [],
      logs: [],
      icon: '🔗',
      version: '1.0.0',
      isOfficial: true
    }

    setIntegrations(prev => [...prev, integration])
    setNewIntegration({
      name: '',
      description: '',
      category: 'productivity',
      provider: '',
      apiKey: '',
      baseUrl: ''
    })
    setShowCreateModal(false)
    toast.success('Integration created successfully!')
  }

  const createWebhook = () => {
    if (!newWebhook.name || !newWebhook.url) {
      toast.error('Please fill in all required fields')
      return
    }

    const webhook: Webhook = {
      id: Date.now().toString(),
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events,
      secret: newWebhook.secret || Math.random().toString(36).substring(2, 15),
      isActive: true,
      totalTriggers: 0
    }

    setWebhooks(prev => [...prev, webhook])
    setNewWebhook({
      name: '',
      url: '',
      events: [],
      secret: ''
    })
    setShowWebhookModal(false)
    toast.success('Webhook created successfully!')
  }

  const filteredIntegrations = integrations
    .filter(integration => {
      if (statusFilter !== 'all' && integration.status !== statusFilter) return false
      if (categoryFilter !== 'all' && integration.category !== categoryFilter) return false
      return integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             integration.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
             integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    })

  const activeIntegrations = integrations.filter(i => i.status === 'active').length
  const totalApiCalls = integrations.reduce((sum, i) => sum + i.apiCalls, 0)
  const errorCount = integrations.filter(i => i.status === 'error').length

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            API Integration Hub
          </h1>
          <p className="text-slate-600 mt-2">Connect and manage third-party services and APIs</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowWebhookModal(true)}
            className="flex items-center space-x-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <Webhook size={18} />
            <span>New Webhook</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            <span className="font-medium">New Integration</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-sm font-medium">Active Integrations</p>
              <p className="text-3xl font-bold">{activeIntegrations}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Zap className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">API Calls (Monthly)</p>
              <p className="text-3xl font-bold">{totalApiCalls.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Activity className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Webhooks</p>
              <p className="text-3xl font-bold">{webhooks.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Webhook className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Errors</p>
              <p className="text-3xl font-bold">{errorCount}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <AlertTriangle className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
        <div className="flex border-b border-slate-200">
          {(['integrations', 'webhooks', 'logs', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-violet-600 border-b-2 border-violet-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'integrations' && (
          <div className="p-6">
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search integrations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80 pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-900 bg-white"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-900 bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="communication">Communication</option>
                  <option value="productivity">Productivity</option>
                  <option value="analytics">Analytics</option>
                  <option value="payment">Payment</option>
                  <option value="storage">Storage</option>
                  <option value="development">Development</option>
                  <option value="marketing">Marketing</option>
                  <option value="crm">CRM</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-900 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="error">Error</option>
                  <option value="configuring">Configuring</option>
                </select>
              </div>
            </div>

            {/* Integrations Grid */}
            {filteredIntegrations.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No integrations found</h3>
                <p className="text-slate-600 mb-6">Connect your first integration to start automating workflows</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-200"
                >
                  Create Integration
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIntegrations.map((integration) => (
                  <div key={integration.id} className="group border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getCategoryIcon(integration.category)}
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">{integration.name}</h3>
                          <p className="text-sm text-slate-500">{integration.provider}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                          {getStatusIcon(integration.status)}
                          <span className="capitalize">{integration.status}</span>
                        </span>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded">
                          <MoreVertical size={16} className="text-slate-400" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{integration.description}</p>

                    {/* Usage Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-slate-500">API Calls</p>
                        <p className="font-semibold">{integration.apiCalls.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Last Sync</p>
                        <p className="font-semibold">{format(integration.lastSync, 'MMM d')}</p>
                      </div>
                    </div>

                    {/* Usage Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-500">Monthly Usage</span>
                        <span className="text-xs text-slate-500">
                          {Math.round((integration.apiCalls / integration.monthlyLimit) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300"
                          style={{ width: `${Math.min((integration.apiCalls / integration.monthlyLimit) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setSelectedIntegration(integration)}
                        className="flex items-center space-x-1 bg-violet-100 text-violet-700 px-3 py-1.5 rounded-lg text-xs hover:bg-violet-200 transition-colors"
                      >
                        <Settings size={12} />
                        <span>Configure</span>
                      </button>
                      <button
                        onClick={() => toggleIntegration(integration.id)}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          integration.status === 'active'
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {integration.status === 'active' ? <Pause size={12} /> : <Play size={12} />}
                        <span>{integration.status === 'active' ? 'Pause' : 'Activate'}</span>
                      </button>
                      <button
                        onClick={() => deleteIntegration(integration.id)}
                        className="flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'webhooks' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Webhooks ({webhooks.length})</h3>
            </div>

            {webhooks.length === 0 ? (
              <div className="text-center py-12">
                <Webhook className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No webhooks configured</h3>
                <p className="text-slate-600 mb-6">Create webhooks to receive real-time notifications</p>
                <button
                  onClick={() => setShowWebhookModal(true)}
                  className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-200"
                >
                  Create Webhook
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="border border-slate-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-800">{webhook.name}</h4>
                        <p className="text-sm text-slate-600">{webhook.url}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          webhook.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {webhook.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button className="p-1 hover:bg-slate-100 rounded">
                          <MoreVertical size={16} className="text-slate-400" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-500">Events</p>
                        <p className="font-semibold">{webhook.events.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Total Triggers</p>
                        <p className="font-semibold">{webhook.totalTriggers}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Last Triggered</p>
                        <p className="font-semibold">
                          {webhook.lastTriggered ? format(webhook.lastTriggered, 'MMM d, h:mm a') : 'Never'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {webhook.events.slice(0, 3).map((event) => (
                        <span key={event} className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">
                          {event}
                        </span>
                      ))}
                      {webhook.events.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-500 text-xs">
                          +{webhook.events.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="bg-violet-100 text-violet-700 px-3 py-1.5 rounded-lg text-xs hover:bg-violet-200 transition-colors">
                        Test Webhook
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

        {(activeTab === 'logs' || activeTab === 'analytics') && (
          <div className="p-6">
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {activeTab === 'logs' ? 'Integration Logs' : 'Analytics Dashboard'}
              </h3>
              <p className="text-slate-600">
                {activeTab === 'logs' 
                  ? 'View detailed logs and monitoring data for your integrations'
                  : 'Comprehensive analytics and insights for your API usage'
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Integration Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Create New Integration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Integration Name *</label>
                <input
                  type="text"
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-900 bg-white"
                  placeholder="My Custom Integration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Provider *</label>
                <select
                  value={newIntegration.provider}
                  onChange={(e) => setNewIntegration({ ...newIntegration, provider: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-900 bg-white"
                >
                  <option value="">Select a provider</option>
                  {availableProviders.map((provider) => (
                    <option key={provider.id} value={provider.name}>
                      {provider.icon} {provider.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  value={newIntegration.category}
                  onChange={(e) => setNewIntegration({ ...newIntegration, category: e.target.value as Integration['category'] })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-900 bg-white"
                >
                  <option value="communication">Communication</option>
                  <option value="productivity">Productivity</option>
                  <option value="analytics">Analytics</option>
                  <option value="payment">Payment</option>
                  <option value="storage">Storage</option>
                  <option value="development">Development</option>
                  <option value="marketing">Marketing</option>
                  <option value="crm">CRM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={newIntegration.description}
                  onChange={(e) => setNewIntegration({ ...newIntegration, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-900 bg-white"
                  rows={3}
                  placeholder="Describe what this integration does"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">API Key</label>
                <input
                  type="password"
                  value={newIntegration.apiKey}
                  onChange={(e) => setNewIntegration({ ...newIntegration, apiKey: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-900 bg-white"
                  placeholder="Your API key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Base URL</label>
                <input
                  type="url"
                  value={newIntegration.baseUrl}
                  onChange={(e) => setNewIntegration({ ...newIntegration, baseUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-900 bg-white"
                  placeholder="https://api.example.com"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createIntegration}
                className="px-6 py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition-colors"
              >
                Create Integration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Webhook Modal */}
      {showWebhookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Create New Webhook</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Webhook Name *</label>
                <input
                  type="text"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-900 bg-white"
                  placeholder="My Webhook"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Webhook URL *</label>
                <input
                  type="url"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-900 bg-white"
                  placeholder="https://your-app.com/webhooks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Events</label>
                <div className="max-h-40 overflow-y-auto border border-slate-300 rounded-xl p-3">
                  {webhookEvents.map((event) => (
                    <div key={event} className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        id={event}
                        checked={newWebhook.events.includes(event)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewWebhook({ ...newWebhook, events: [...newWebhook.events, event] })
                          } else {
                            setNewWebhook({ ...newWebhook, events: newWebhook.events.filter(e => e !== event) })
                          }
                        }}
                        className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                      />
                      <label htmlFor={event} className="text-sm text-slate-700">{event}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Secret (optional)</label>
                <input
                  type="text"
                  value={newWebhook.secret}
                  onChange={(e) => setNewWebhook({ ...newWebhook, secret: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-900 bg-white"
                  placeholder="Webhook secret for verification"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setShowWebhookModal(false)}
                className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createWebhook}
                className="px-6 py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition-colors"
              >
                Create Webhook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { 
  Share2, 
  Lock, 
  Unlock, 
  Eye, 
  Download, 
  MessageCircle, 
  Calendar, 
  FileText, 
  Image, 
  Video, 
  Clock, 
  User, 
  Globe, 
  Link, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Filter,
  Search,
  MoreVertical,
  ExternalLink,
  Folder,
  UserPlus,
  Settings,
  Shield,
  Activity
} from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface ClientProject {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'on-hold' | 'planning'
  progress: number
  client: {
    name: string
    email: string
    avatar?: string
    company: string
  }
  sharedAssets: SharedAsset[]
  lastUpdated: Date
  dueDate: Date
  isPublic: boolean
  accessLink: string
  collaborators: Collaborator[]
  messages: ProjectMessage[]
}

interface SharedAsset {
  id: string
  name: string
  type: 'file' | 'image' | 'video' | 'document' | 'link'
  url: string
  size?: number
  uploadedAt: Date
  uploadedBy: string
  description?: string
  isPublic: boolean
  downloadCount: number
}

interface Collaborator {
  id: string
  name: string
  email: string
  role: 'client' | 'team_member' | 'external'
  permissions: ('view' | 'comment' | 'edit' | 'admin')[]
  avatar?: string
  lastActive: Date
}

interface ProjectMessage {
  id: string
  content: string
  author: string
  timestamp: Date
  attachments?: string[]
  isInternal: boolean
}

export default function ClientPortalPage() {
  const [projects, setProjects] = useState<ClientProject[]>([])
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'messages' | 'access'>('overview')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    dueDate: '',
    isPublic: false
  })

  const getStatusColor = (status: ClientProject['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'on-hold': return 'bg-yellow-100 text-yellow-800'
      case 'planning': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: ClientProject['status']) => {
    switch (status) {
      case 'active': return <Activity size={14} />
      case 'completed': return <CheckCircle size={14} />
      case 'on-hold': return <AlertCircle size={14} />
      case 'planning': return <Clock size={14} />
      default: return <Clock size={14} />
    }
  }

  const getAssetIcon = (type: SharedAsset['type']) => {
    switch (type) {
      case 'image': return <Image size={20} className="text-green-500" />
      case 'video': return <Video size={20} className="text-purple-500" />
      case 'document': return <FileText size={20} className="text-red-500" />
      case 'link': return <Link size={20} className="text-blue-500" />
      default: return <FileText size={20} className="text-slate-500" />
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const generateAccessLink = () => {
    return `${window.location.origin}/client-access/${Math.random().toString(36).substring(2, 15)}`
  }

  const createProject = () => {
    if (!newProject.name || !newProject.clientName || !newProject.clientEmail) {
      toast.error('Please fill in all required fields')
      return
    }

    const project: ClientProject = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      status: 'planning',
      progress: 0,
      client: {
        name: newProject.clientName,
        email: newProject.clientEmail,
        company: newProject.clientCompany
      },
      sharedAssets: [],
      lastUpdated: new Date(),
      dueDate: new Date(newProject.dueDate),
      isPublic: newProject.isPublic,
      accessLink: generateAccessLink(),
      collaborators: [
        {
          id: 'client-1',
          name: newProject.clientName,
          email: newProject.clientEmail,
          role: 'client',
          permissions: ['view', 'comment'],
          lastActive: new Date()
        }
      ],
      messages: []
    }

    setProjects(prev => [...prev, project])
    setNewProject({
      name: '',
      description: '',
      clientName: '',
      clientEmail: '',
      clientCompany: '',
      dueDate: '',
      isPublic: false
    })
    setShowCreateModal(false)
    toast.success('Client project created successfully!')
  }

  const copyAccessLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast.success('Access link copied to clipboard!')
  }

  const toggleProjectVisibility = (projectId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, isPublic: !project.isPublic }
        : project
    ))
    toast.success('Project visibility updated!')
  }

  const filteredProjects = projects
    .filter(project => {
      if (statusFilter !== 'all' && project.status !== statusFilter) return false
      return project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             project.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             project.client.company.toLowerCase().includes(searchTerm.toLowerCase())
    })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Client Portal & Project Sharing
          </h1>
          <p className="text-slate-600 mt-2">Share projects securely with clients and manage collaboration</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          <span className="font-medium">New Client Project</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Active Projects</p>
              <p className="text-3xl font-bold">{projects.filter(p => p.status === 'active').length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Activity className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Clients</p>
              <p className="text-3xl font-bold">{new Set(projects.map(p => p.client.email)).size}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <User className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Shared Assets</p>
              <p className="text-3xl font-bold">{projects.reduce((sum, p) => sum + p.sharedAssets.length, 0)}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Share2 className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Public Projects</p>
              <p className="text-3xl font-bold">{projects.filter(p => p.isPublic).length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Globe className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search projects or clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 bg-white"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No client projects found</h3>
            <p className="text-slate-600 mb-6">Create your first client project to start sharing and collaborating</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200"
            >
              Create Client Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="group border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{project.name}</h3>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{project.description}</p>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        <span className="capitalize">{project.status}</span>
                      </span>
                      {project.isPublic ? (
                        <Globe size={16} className="text-emerald-500" title="Public project" />
                      ) : (
                        <Lock size={16} className="text-slate-400" title="Private project" />
                      )}
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded">
                    <MoreVertical size={16} className="text-slate-400" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Progress</span>
                    <span className="text-sm text-slate-500">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Client Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {project.client.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">{project.client.name}</p>
                    <p className="text-xs text-slate-500 truncate">{project.client.company}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span>{project.sharedAssets.length} assets</span>
                  <span>{project.collaborators.length} collaborators</span>
                  <span>{project.messages.length} messages</span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center space-x-1 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-200 transition-colors"
                  >
                    <Eye size={12} />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => copyAccessLink(project.accessLink)}
                    className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs hover:bg-blue-200 transition-colors"
                  >
                    <Link size={12} />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => toggleProjectVisibility(project.id)}
                    className="flex items-center space-x-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs hover:bg-slate-200 transition-colors"
                  >
                    {project.isPublic ? <Lock size={12} /> : <Unlock size={12} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Create Client Project</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Name *</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 bg-white"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 bg-white"
                  rows={3}
                  placeholder="Project description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Client Name *</label>
                  <input
                    type="text"
                    value={newProject.clientName}
                    onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 bg-white"
                    placeholder="Client name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Client Email *</label>
                  <input
                    type="email"
                    value={newProject.clientEmail}
                    onChange={(e) => setNewProject({ ...newProject, clientEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 bg-white"
                    placeholder="client@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Client Company</label>
                <input
                  type="text"
                  value={newProject.clientCompany}
                  onChange={(e) => setNewProject({ ...newProject, clientCompany: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 bg-white"
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={newProject.dueDate}
                  onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 bg-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newProject.isPublic}
                  onChange={(e) => setNewProject({ ...newProject, isPublic: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="isPublic" className="text-sm text-slate-700">Make project publicly accessible</label>
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
                onClick={createProject}
                className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">{selectedProject.name}</h3>
                <p className="text-sm text-slate-600">{selectedProject.client.company}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="flex border-b border-slate-200">
              {(['overview', 'assets', 'messages', 'access'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Project Description</h4>
                    <p className="text-slate-600">{selectedProject.description || 'No description provided'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-slate-800 mb-2">Progress</h4>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                            style={{ width: `${selectedProject.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{selectedProject.progress}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-800 mb-2">Status</h4>
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProject.status)}`}>
                        {getStatusIcon(selectedProject.status)}
                        <span className="capitalize">{selectedProject.status}</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Collaborators ({selectedProject.collaborators.length})</h4>
                    <div className="space-y-2">
                      {selectedProject.collaborators.map((collaborator) => (
                        <div key={collaborator.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {collaborator.name[0]}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-800 text-sm">{collaborator.name}</p>
                            <p className="text-xs text-slate-500">{collaborator.email} • {collaborator.role}</p>
                          </div>
                          <span className="text-xs text-slate-400">
                            {format(collaborator.lastActive, 'MMM d')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'assets' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-800">Shared Assets ({selectedProject.sharedAssets.length})</h4>
                    <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-600 transition-colors">
                      Upload Asset
                    </button>
                  </div>
                  
                  {selectedProject.sharedAssets.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">No assets shared yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedProject.sharedAssets.map((asset) => (
                        <div key={asset.id} className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          {getAssetIcon(asset.type)}
                          <div className="flex-1">
                            <h5 className="font-medium text-slate-800">{asset.name}</h5>
                            <p className="text-sm text-slate-500">
                              {formatFileSize(asset.size)} • Uploaded {format(asset.uploadedAt, 'MMM d, yyyy')} by {asset.uploadedBy}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 hover:bg-slate-200 rounded">
                              <Eye size={16} className="text-slate-600" />
                            </button>
                            <button className="p-2 hover:bg-slate-200 rounded">
                              <Download size={16} className="text-slate-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-800">Project Messages ({selectedProject.messages.length})</h4>
                  </div>
                  
                  {selectedProject.messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">No messages yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedProject.messages.map((message) => (
                        <div key={message.id} className="p-4 border border-slate-200 rounded-lg">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {message.author[0]}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800 text-sm">{message.author}</p>
                              <p className="text-xs text-slate-500">{format(message.timestamp, 'MMM d, h:mm a')}</p>
                            </div>
                          </div>
                          <p className="text-slate-700">{message.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'access' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-slate-800 mb-4">Project Access</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {selectedProject.isPublic ? (
                            <Globe className="text-emerald-500" size={20} />
                          ) : (
                            <Lock className="text-slate-500" size={20} />
                          )}
                          <div>
                            <p className="font-medium text-slate-800">
                              {selectedProject.isPublic ? 'Public Access' : 'Private Access'}
                            </p>
                            <p className="text-sm text-slate-500">
                              {selectedProject.isPublic 
                                ? 'Anyone with the link can view this project'
                                : 'Only invited collaborators can access this project'
                              }
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleProjectVisibility(selectedProject.id)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          {selectedProject.isPublic ? 'Make Private' : 'Make Public'}
                        </button>
                      </div>

                      <div className="p-4 border border-slate-200 rounded-lg">
                        <h5 className="font-medium text-slate-800 mb-2">Access Link</h5>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={selectedProject.accessLink}
                            readOnly
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 text-sm"
                          />
                          <button
                            onClick={() => copyAccessLink(selectedProject.accessLink)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1"
                          >
                            <Copy size={14} />
                            <span>Copy</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
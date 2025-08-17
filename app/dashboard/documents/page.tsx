'use client'

import { useState, useRef } from 'react'
import { 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Share, 
  Star, 
  Folder, 
  File, 
  Image, 
  FileText, 
  Archive, 
  Video, 
  Music,
  Plus,
  MoreVertical,
  Grid,
  List,
  Eye,
  Trash2,
  Move,
  Edit,
  FolderPlus,
  Clock,
  User,
  Tag,
  SortAsc,
  HardDrive,
  Files,
  BarChart3
} from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Document {
  id: string
  name: string
  type: 'folder' | 'file'
  fileType?: 'pdf' | 'doc' | 'image' | 'video' | 'audio' | 'other'
  size?: number
  lastModified: Date
  owner: string
  shared: boolean
  starred: boolean
  tags: string[]
  path: string
  thumbnail?: string
  description?: string
  version?: number
}

interface Activity {
  id: string
  action: string
  user: string
  fileName: string
  timestamp: Date
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Project Proposal.pdf',
      type: 'file',
      fileType: 'pdf',
      size: 2048576,
      lastModified: new Date(Date.now() - 3600000),
      owner: 'John Smith',
      shared: true,
      starred: true,
      tags: ['important', 'proposal'],
      path: '/',
      version: 2
    },
    {
      id: '2',
      name: 'Team Photos',
      type: 'folder',
      lastModified: new Date(Date.now() - 86400000),
      owner: 'Sarah Johnson',
      shared: false,
      starred: false,
      tags: [],
      path: '/',
      description: 'Team event photos and memories'
    },
    {
      id: '3',
      name: 'Meeting Notes.docx',
      type: 'file',
      fileType: 'doc',
      size: 524288,
      lastModified: new Date(Date.now() - 1800000),
      owner: 'You',
      shared: false,
      starred: false,
      tags: ['notes', 'meetings'],
      path: '/',
      version: 1
    },
    {
      id: '4',
      name: 'Dashboard Design.png',
      type: 'file',
      fileType: 'image',
      size: 1048576,
      lastModified: new Date(Date.now() - 7200000),
      owner: 'Emily Davis',
      shared: true,
      starred: false,
      tags: ['design', 'ui'],
      path: '/',
      version: 3
    }
  ])
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentPath, setCurrentPath] = useState('/')
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('name')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [recentActivity] = useState<Activity[]>([
    {
      id: '1',
      action: 'uploaded',
      user: 'John Smith',
      fileName: 'Project Proposal.pdf',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      action: 'shared',
      user: 'Emily Davis',
      fileName: 'Dashboard Design.png',
      timestamp: new Date(Date.now() - 7200000)
    },
    {
      id: '3',
      action: 'created folder',
      user: 'Sarah Johnson',
      fileName: 'Team Photos',
      timestamp: new Date(Date.now() - 86400000)
    }
  ])

  const [storageUsed] = useState(2.4)
  const [storageTotal] = useState(10)

  const getFileIcon = (document: Document) => {
    if (document.type === 'folder') return <Folder size={24} style={{ color: '#667eea' }} />
    
    switch (document.fileType) {
      case 'pdf':
      case 'doc':
        return <FileText size={24} style={{ color: '#ef4444' }} />
      case 'image':
        return <Image size={24} style={{ color: '#10b981' }} />
      case 'video':
        return <Video size={24} style={{ color: '#8b5cf6' }} />
      case 'audio':
        return <Music size={24} style={{ color: '#f59e0b' }} />
      default:
        return <File size={24} style={{ color: '#6b7280' }} />
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const newDocument: Document = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: 'file',
          fileType: getFileType(file.name),
          size: file.size,
          lastModified: new Date(),
          owner: 'You',
          shared: false,
          starred: false,
          tags: [],
          path: currentPath,
          version: 1
        }
        setDocuments(prev => [...prev, newDocument])
      })
      toast.success(`${files.length} file(s) uploaded successfully!`)
    }
  }

  const getFileType = (fileName: string): Document['fileType'] => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension || '')) return 'image'
    if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) return 'video'
    if (['mp3', 'wav', 'flac', 'm4a'].includes(extension || '')) return 'audio'
    if (['pdf'].includes(extension || '')) return 'pdf'
    if (['doc', 'docx', 'txt'].includes(extension || '')) return 'doc'
    return 'other'
  }

  const createFolder = () => {
    if (!newFolderName.trim()) return
    
    const newFolder: Document = {
      id: Date.now().toString(),
      name: newFolderName,
      type: 'folder',
      lastModified: new Date(),
      owner: 'You',
      shared: false,
      starred: false,
      tags: [],
      path: currentPath
    }
    
    setDocuments(prev => [...prev, newFolder])
    setNewFolderName('')
    setShowCreateFolder(false)
    toast.success('Folder created successfully!')
  }

  const toggleStar = (id: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, starred: !doc.starred } : doc
    ))
  }

  const toggleShare = (id: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, shared: !doc.shared } : doc
    ))
    toast.success('Sharing settings updated!')
  }

  const filteredDocuments = documents
    .filter(doc => {
      if (selectedFilter === 'starred') return doc.starred
      if (selectedFilter === 'shared') return doc.shared
      if (selectedFilter === 'folders') return doc.type === 'folder'
      if (selectedFilter === 'files') return doc.type === 'file'
      return true
    })
    .filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name)
        case 'date': return b.lastModified.getTime() - a.lastModified.getTime()
        case 'size': return (b.size || 0) - (a.size || 0)
        case 'type': return (a.fileType || '').localeCompare(b.fileType || '')
        default: return 0
      }
    })

  return (
    <div>
      <div className="section-header">
        <h2>
          <Files size={40} />
          Document Management
        </h2>
        <p>Organize, store, and share your team documents securely</p>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setShowCreateFolder(true)}
            className="nav-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '15px' }}
          >
            <FolderPlus size={20} />
            <span>New Folder</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="nav-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Upload size={20} />
            <span>Upload Files</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Document Overview Cards */}
      <div className="analytics-grid">
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <Files size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Total Files</div>
              <div className="member-rating">
                <div className="rating-value">{documents.filter(d => d.type === 'file').length}</div>
                <div className="rating-rank">Documents</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <Folder size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Folders</div>
              <div className="member-rating">
                <div className="rating-value">{documents.filter(d => d.type === 'folder').length}</div>
                <div className="rating-rank">Organized</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <Share size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Shared Files</div>
              <div className="member-rating">
                <div className="rating-value">{documents.filter(d => d.shared).length}</div>
                <div className="rating-rank">Collaborative</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              <HardDrive size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Storage Used</div>
              <div className="member-rating">
                <div className="rating-value">{storageUsed}GB</div>
                <div className="rating-rank">of {storageTotal}GB</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Storage Usage */}
      <div className="chart-container" style={{ marginBottom: '30px' }}>
        <h3>
          <HardDrive size={20} />
          Storage Usage
        </h3>
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#ccc' }}>Used: {storageUsed} GB</span>
            <span style={{ color: '#ccc' }}>Available: {storageTotal - storageUsed} GB</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '12px', 
            background: '#333333', 
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              height: '12px', 
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              width: `${(storageUsed / storageTotal) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="analytics-row">
        {/* Documents List */}
        <div className="chart-container large">
          {/* Search and Filters */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px', 
            marginBottom: '25px',
            flexWrap: 'wrap'
          }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
              <Search size={16} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#999' 
              }} />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px 12px 40px',
                  background: '#333333',
                  border: '1px solid #404040',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#404040'}
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              style={{
                padding: '12px 15px',
                background: '#333333',
                border: '1px solid #404040',
                borderRadius: '10px',
                color: 'white',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">All Files</option>
              <option value="folders">Folders</option>
              <option value="files">Files</option>
              <option value="starred">Starred</option>
              <option value="shared">Shared</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              style={{
                padding: '12px 15px',
                background: '#333333',
                border: '1px solid #404040',
                borderRadius: '10px',
                color: 'white',
                fontSize: '0.9rem'
              }}
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="size">Sort by Size</option>
              <option value="type">Sort by Type</option>
            </select>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'filter-btn active' : 'filter-btn'}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'filter-btn active' : 'filter-btn'}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Documents Display */}
          {filteredDocuments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Folder size={64} style={{ color: '#667eea', margin: '0 auto 20px', opacity: 0.7 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24', marginBottom: '10px' }}>
                No documents found
              </h3>
              <p style={{ color: '#ccc', marginBottom: '30px' }}>
                Upload your first file or create a folder to get started
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="nav-btn"
              >
                Upload Files
              </button>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                  gap: '20px' 
                }}>
                  {filteredDocuments.map((document) => (
                    <div key={document.id} className="team-card" style={{ padding: '20px', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                        {getFileIcon(document)}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => toggleStar(document.id)}
                            className="action-btn"
                            style={{ padding: '4px' }}
                          >
                            <Star size={14} style={{ 
                              color: document.starred ? '#f59e0b' : '#999',
                              fill: document.starred ? '#f59e0b' : 'none'
                            }} />
                          </button>
                          <button className="action-btn" style={{ padding: '4px' }}>
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </div>
                      <h4 style={{ 
                        fontWeight: 600, 
                        color: '#fbbf24', 
                        fontSize: '0.9rem', 
                        marginBottom: '8px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {document.name}
                      </h4>
                      <div style={{ fontSize: '0.75rem', color: '#999', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div>{formatFileSize(document.size)}</div>
                        <div>{format(document.lastModified, 'MMM d, yyyy')}</div>
                        <div>by {document.owner}</div>
                      </div>
                      {(document.shared || document.starred) && (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                          {document.shared && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.7rem',
                              background: '#10b981',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '8px'
                            }}>
                              <Share size={8} />
                              Shared
                            </span>
                          )}
                          {document.starred && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.7rem',
                              background: '#f59e0b',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '8px'
                            }}>
                              <Star size={8} />
                              Starred
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* List Header */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 120px 150px 80px 120px', 
                    gap: '15px',
                    padding: '15px 20px',
                    background: '#333333',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#fbbf24'
                  }}>
                    <div>Name</div>
                    <div>Owner</div>
                    <div>Modified</div>
                    <div>Size</div>
                    <div>Actions</div>
                  </div>
                  {/* List Items */}
                  {filteredDocuments.map((document) => (
                    <div key={document.id} style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 120px 150px 80px 120px', 
                      gap: '15px',
                      padding: '15px 20px',
                      background: '#2a2a2a',
                      borderRadius: '10px',
                      border: '1px solid #404040',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {getFileIcon(document)}
                        <span style={{ fontWeight: 600, color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {document.name}
                        </span>
                        {document.starred && (
                          <Star size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                        )}
                        {document.shared && (
                          <Share size={14} style={{ color: '#10b981' }} />
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#999' }}>
                        {document.owner}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#999' }}>
                        {format(document.lastModified, 'MMM d, yyyy')}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#999' }}>
                        {formatFileSize(document.size)}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="action-btn">
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => toggleShare(document.id)}
                          className="action-btn"
                        >
                          <Share size={14} />
                        </button>
                        <button className="action-btn">
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Quick Actions */}
          <div className="chart-container">
            <h3>
              <Plus size={20} />
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} />
                <span>Upload File</span>
              </button>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => setShowCreateFolder(true)}
              >
                <FolderPlus size={16} />
                <span>New Folder</span>
              </button>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => toast.success('Scan documents clicked')}
              >
                <Eye size={16} />
                <span>Scan Documents</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="chart-container">
            <h3>
              <Clock size={20} />
              Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
              {recentActivity.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  <Clock size={32} style={{ opacity: 0.5, margin: '0 auto 10px' }} />
                  <p style={{ fontSize: '0.85rem' }}>No recent activity</p>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="team-card" style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="avatar" style={{ width: '30px', height: '30px', fontSize: '0.75rem' }}>
                        {activity.user[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.8rem', color: '#ccc' }}>
                          <span style={{ fontWeight: 600 }}>{activity.user}</span> {activity.action}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#999' }}>
                          {activity.fileName}
                        </p>
                        <p style={{ fontSize: '0.7rem', color: '#666' }}>
                          {format(activity.timestamp, 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* File Statistics */}
          <div className="chart-container">
            <h3>
              <BarChart3 size={20} />
              Statistics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>PDF Files</span>
                <span style={{ fontWeight: 'bold', color: '#ef4444' }}>
                  {documents.filter(d => d.fileType === 'pdf').length}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>Images</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>
                  {documents.filter(d => d.fileType === 'image').length}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>Documents</span>
                <span style={{ fontWeight: 'bold', color: '#667eea' }}>
                  {documents.filter(d => d.fileType === 'doc').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50, 
          padding: '20px' 
        }}>
          <div style={{ 
            background: '#2a2a2a', 
            borderRadius: '15px', 
            padding: '30px', 
            width: '100%', 
            maxWidth: '500px',
            border: '1px solid #404040'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24', marginBottom: '20px' }}>
              Create New Folder
            </h3>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#ccc', marginBottom: '8px' }}>
                Folder Name
              </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  background: '#333333',
                  border: '1px solid #404040',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
                onKeyPress={(e) => e.key === 'Enter' && createFolder()}
              />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => {
                  setShowCreateFolder(false)
                  setNewFolderName('')
                }}
                className="filter-btn"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={createFolder}
                disabled={!newFolderName.trim()}
                className="nav-btn"
                style={{ 
                  flex: 1,
                  opacity: !newFolderName.trim() ? 0.5 : 1,
                  cursor: !newFolderName.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
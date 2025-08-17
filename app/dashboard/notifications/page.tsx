'use client'

import { useState, useEffect } from 'react'
import { 
  Bell, 
  Check, 
  X, 
  Archive, 
  Star, 
  Clock, 
  User, 
  MessageCircle, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Zap,
  Settings,
  Filter,
  Search,
  MoreVertical,
  Mail,
  Smartphone,
  Globe,
  Volume2,
  VolumeX,
  Trash2,
  RotateCcw,
  ExternalLink
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error' | 'mention' | 'deadline' | 'system'
  category: 'task' | 'message' | 'system' | 'meeting' | 'reminder' | 'update'
  isRead: boolean
  isStarred: boolean
  isArchived: boolean
  timestamp: Date
  source: string
  actionUrl?: string
  metadata?: {
    sender?: string
    projectId?: string
    taskId?: string
    priority?: 'low' | 'medium' | 'high' | 'urgent'
  }
}

interface NotificationPreferences {
  email: boolean
  push: boolean
  desktop: boolean
  sound: boolean
  categories: {
    [key: string]: boolean
  }
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'starred' | 'archived'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    push: true,
    desktop: false,
    sound: true,
    categories: {
      task: true,
      message: true,
      system: true,
      meeting: true,
      reminder: true,
      update: false
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  })

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info': return <Info className="text-blue-500" size={20} />
      case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />
      case 'success': return <CheckCircle className="text-green-500" size={20} />
      case 'error': return <X className="text-red-500" size={20} />
      case 'mention': return <MessageCircle className="text-purple-500" size={20} />
      case 'deadline': return <Clock className="text-orange-500" size={20} />
      case 'system': return <Zap className="text-indigo-500" size={20} />
      default: return <Bell className="text-slate-500" size={20} />
    }
  }

  const getCategoryIcon = (category: Notification['category']) => {
    switch (category) {
      case 'task': return <CheckCircle size={16} />
      case 'message': return <MessageCircle size={16} />
      case 'system': return <Zap size={16} />
      case 'meeting': return <Calendar size={16} />
      case 'reminder': return <Clock size={16} />
      case 'update': return <Info size={16} />
      default: return <Bell size={16} />
    }
  }

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'info': return 'border-l-blue-500'
      case 'warning': return 'border-l-yellow-500'
      case 'success': return 'border-l-green-500'
      case 'error': return 'border-l-red-500'
      case 'mention': return 'border-l-purple-500'
      case 'deadline': return 'border-l-orange-500'
      case 'system': return 'border-l-indigo-500'
      default: return 'border-l-slate-500'
    }
  }

  const markAsRead = (notificationIds: string[]) => {
    setNotifications(prev => prev.map(notification => 
      notificationIds.includes(notification.id) 
        ? { ...notification, isRead: true }
        : notification
    ))
    toast.success(`${notificationIds.length} notification(s) marked as read`)
  }

  const markAsUnread = (notificationIds: string[]) => {
    setNotifications(prev => prev.map(notification => 
      notificationIds.includes(notification.id) 
        ? { ...notification, isRead: false }
        : notification
    ))
    toast.success(`${notificationIds.length} notification(s) marked as unread`)
  }

  const toggleStar = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isStarred: !notification.isStarred }
        : notification
    ))
  }

  const archiveNotifications = (notificationIds: string[]) => {
    setNotifications(prev => prev.map(notification => 
      notificationIds.includes(notification.id) 
        ? { ...notification, isArchived: true }
        : notification
    ))
    toast.success(`${notificationIds.length} notification(s) archived`)
  }

  const unarchiveNotifications = (notificationIds: string[]) => {
    setNotifications(prev => prev.map(notification => 
      notificationIds.includes(notification.id) 
        ? { ...notification, isArchived: false }
        : notification
    ))
    toast.success(`${notificationIds.length} notification(s) unarchived`)
  }

  const deleteNotifications = (notificationIds: string[]) => {
    setNotifications(prev => prev.filter(notification => 
      !notificationIds.includes(notification.id)
    ))
    toast.success(`${notificationIds.length} notification(s) deleted`)
  }

  const markAllAsRead = () => {
    const unreadIds = filteredNotifications
      .filter(n => !n.isRead)
      .map(n => n.id)
    if (unreadIds.length > 0) {
      markAsRead(unreadIds)
    }
  }

  const filteredNotifications = notifications
    .filter(notification => {
      if (filter === 'unread') return !notification.isRead && !notification.isArchived
      if (filter === 'read') return notification.isRead && !notification.isArchived
      if (filter === 'starred') return notification.isStarred && !notification.isArchived
      if (filter === 'archived') return notification.isArchived
      return !notification.isArchived
    })
    .filter(notification => {
      if (categoryFilter !== 'all') return notification.category === categoryFilter
      return true
    })
    .filter(notification => {
      if (!searchTerm) return true
      return notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
             notification.source.toLowerCase().includes(searchTerm.toLowerCase())
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length
  const starredCount = notifications.filter(n => n.isStarred && !n.isArchived).length
  const archivedCount = notifications.filter(n => n.isArchived).length

  const toggleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id))
    }
  }

  const toggleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Notification Center
          </h1>
          <p className="text-slate-600 mt-2">Manage your notifications and communication preferences</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Notifications</p>
              <p className="text-3xl font-bold">{notifications.filter(n => !n.isArchived).length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Bell className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Unread</p>
              <p className="text-3xl font-bold">{unreadCount}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Mail className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Starred</p>
              <p className="text-3xl font-bold">{starredCount}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Star className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Archived</p>
              <p className="text-3xl font-bold">{archivedCount}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Archive className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 bg-white"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 bg-white"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="starred">Starred</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="task">Tasks</option>
              <option value="message">Messages</option>
              <option value="system">System</option>
              <option value="meeting">Meetings</option>
              <option value="reminder">Reminders</option>
              <option value="update">Updates</option>
            </select>
          </div>
          
          {unreadCount > 0 && filter !== 'read' && filter !== 'archived' && (
            <button
              onClick={markAllAsRead}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm transition-colors"
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">
              {selectedNotifications.length} notification(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => markAsRead(selectedNotifications)}
                className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs hover:bg-green-200 transition-colors"
              >
                Mark Read
              </button>
              <button
                onClick={() => markAsUnread(selectedNotifications)}
                className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs hover:bg-blue-200 transition-colors"
              >
                Mark Unread
              </button>
              <button
                onClick={() => archiveNotifications(selectedNotifications)}
                className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg text-xs hover:bg-yellow-200 transition-colors"
              >
                Archive
              </button>
              <button
                onClick={() => deleteNotifications(selectedNotifications)}
                className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedNotifications([])}
                className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs hover:bg-slate-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No notifications found</h3>
            <p className="text-slate-600">
              {filter === 'unread' && 'You have no unread notifications'}
              {filter === 'starred' && 'You have no starred notifications'}
              {filter === 'archived' && 'You have no archived notifications'}
              {filter === 'all' && 'You have no notifications'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {/* Select All Header */}
            <div className="p-4 bg-slate-50">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">
                  Select all ({filteredNotifications.length})
                </span>
              </div>
            </div>

            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-slate-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : ''
                } border-l-4 ${getTypeColor(notification.type)}`}
              >
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => toggleSelectNotification(notification.id)}
                    className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-medium ${!notification.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          {notification.isStarred && (
                            <Star size={14} className="text-yellow-500 fill-current" />
                          )}
                          <span className="inline-flex items-center space-x-1 px-2 py-1 rounded text-xs bg-slate-100 text-slate-600">
                            {getCategoryIcon(notification.category)}
                            <span className="capitalize">{notification.category}</span>
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>{notification.source}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(notification.timestamp, { addSuffix: true })}</span>
                          <span>•</span>
                          <span>{format(notification.timestamp, 'MMM d, h:mm a')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => toggleStar(notification.id)}
                          className="p-1 hover:bg-slate-200 rounded transition-colors"
                        >
                          <Star 
                            size={16} 
                            className={notification.isStarred ? 'text-yellow-500 fill-current' : 'text-slate-400'}
                          />
                        </button>
                        
                        {!notification.isRead ? (
                          <button
                            onClick={() => markAsRead([notification.id])}
                            className="p-1 hover:bg-slate-200 rounded transition-colors"
                            title="Mark as read"
                          >
                            <Check size={16} className="text-slate-400" />
                          </button>
                        ) : (
                          <button
                            onClick={() => markAsUnread([notification.id])}
                            className="p-1 hover:bg-slate-200 rounded transition-colors"
                            title="Mark as unread"
                          >
                            <Mail size={16} className="text-slate-400" />
                          </button>
                        )}
                        
                        {filter === 'archived' ? (
                          <button
                            onClick={() => unarchiveNotifications([notification.id])}
                            className="p-1 hover:bg-slate-200 rounded transition-colors"
                            title="Unarchive"
                          >
                            <RotateCcw size={16} className="text-slate-400" />
                          </button>
                        ) : (
                          <button
                            onClick={() => archiveNotifications([notification.id])}
                            className="p-1 hover:bg-slate-200 rounded transition-colors"
                            title="Archive"
                          >
                            <Archive size={16} className="text-slate-400" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotifications([notification.id])}
                          className="p-1 hover:bg-slate-200 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-slate-400" />
                        </button>
                        
                        {notification.actionUrl && (
                          <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                            <ExternalLink size={16} className="text-slate-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800">Notification Preferences</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Delivery Methods */}
              <div>
                <h4 className="font-medium text-slate-800 mb-4">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="text-blue-500" size={20} />
                      <div>
                        <p className="font-medium text-slate-800">Email Notifications</p>
                        <p className="text-sm text-slate-500">Receive notifications via email</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.email}
                      onChange={(e) => setPreferences(prev => ({ ...prev, email: e.target.checked }))}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="text-green-500" size={20} />
                      <div>
                        <p className="font-medium text-slate-800">Push Notifications</p>
                        <p className="text-sm text-slate-500">Receive push notifications on mobile</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.push}
                      onChange={(e) => setPreferences(prev => ({ ...prev, push: e.target.checked }))}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="text-purple-500" size={20} />
                      <div>
                        <p className="font-medium text-slate-800">Desktop Notifications</p>
                        <p className="text-sm text-slate-500">Show browser notifications</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.desktop}
                      onChange={(e) => setPreferences(prev => ({ ...prev, desktop: e.target.checked }))}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {preferences.sound ? (
                        <Volume2 className="text-orange-500" size={20} />
                      ) : (
                        <VolumeX className="text-slate-400" size={20} />
                      )}
                      <div>
                        <p className="font-medium text-slate-800">Sound Notifications</p>
                        <p className="text-sm text-slate-500">Play sound for notifications</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.sound}
                      onChange={(e) => setPreferences(prev => ({ ...prev, sound: e.target.checked }))}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-medium text-slate-800 mb-4">Notification Categories</h4>
                <div className="space-y-3">
                  {Object.entries(preferences.categories).map(([category, enabled]) => (
                    <div key={category} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getCategoryIcon(category as Notification['category'])}
                        <div>
                          <p className="font-medium text-slate-800 capitalize">{category}</p>
                          <p className="text-sm text-slate-500">
                            {category === 'task' && 'Task updates and assignments'}
                            {category === 'message' && 'New messages and mentions'}
                            {category === 'system' && 'System updates and maintenance'}
                            {category === 'meeting' && 'Meeting reminders and invites'}
                            {category === 'reminder' && 'Custom reminders and deadlines'}
                            {category === 'update' && 'Product updates and announcements'}
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          categories: { ...prev.categories, [category]: e.target.checked }
                        }))}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quiet Hours */}
              <div>
                <h4 className="font-medium text-slate-800 mb-4">Quiet Hours</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="quietHours"
                      checked={preferences.quietHours.enabled}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, enabled: e.target.checked }
                      }))}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="quietHours" className="text-sm text-slate-700">
                      Enable quiet hours (no notifications during these times)
                    </label>
                  </div>
                  
                  {preferences.quietHours.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
                        <input
                          type="time"
                          value={preferences.quietHours.start}
                          onChange={(e) => setPreferences(prev => ({
                            ...prev,
                            quietHours: { ...prev.quietHours, start: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
                        <input
                          type="time"
                          value={preferences.quietHours.end}
                          onChange={(e) => setPreferences(prev => ({
                            ...prev,
                            quietHours: { ...prev.quietHours, end: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setShowSettings(false)}
                className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSettings(false)
                  toast.success('Notification preferences saved!')
                }}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
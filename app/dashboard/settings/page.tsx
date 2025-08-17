'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Palette, 
  Globe, 
  Shield, 
  Save,
  Eye,
  EyeOff,
  Database
} from 'lucide-react'
import toast from 'react-hot-toast'
import SupabaseSetup from '@/components/SupabaseSetup'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    avatar: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    taskReminders: true,
    weeklyReports: false,
    mentionNotifications: true
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    compactMode: false,
    sidebarCollapsed: false
  })

  // Load appearance settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    const savedCompactMode = localStorage.getItem('compactMode') === 'true'
    const savedSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true'
    
    setAppearanceSettings({
      theme: savedTheme,
      compactMode: savedCompactMode,
      sidebarCollapsed: savedSidebarCollapsed
    })

    // Apply current theme
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Handle theme change
  const handleThemeChange = (newTheme: string) => {
    setAppearanceSettings({ ...appearanceSettings, theme: newTheme })
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    toast.success(`Theme changed to ${newTheme} mode`)
  }

  // Handle compact mode change
  const handleCompactModeChange = (enabled: boolean) => {
    setAppearanceSettings({ ...appearanceSettings, compactMode: enabled })
    localStorage.setItem('compactMode', enabled.toString())
    
    if (enabled) {
      document.documentElement.classList.add('compact')
    } else {
      document.documentElement.classList.remove('compact')
    }
    
    toast.success(`Compact mode ${enabled ? 'enabled' : 'disabled'}`)
  }

  // Handle sidebar collapsed change
  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    setAppearanceSettings({ ...appearanceSettings, sidebarCollapsed: collapsed })
    localStorage.setItem('sidebarCollapsed', collapsed.toString())
    
    // Emit custom event for sidebar component to listen to
    window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { collapsed } }))
    
    toast.success(`Sidebar will ${collapsed ? 'start collapsed' : 'start expanded'}`)
  }

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || '',
        email: session.user.email || '',
        department: '',
        position: '',
        avatar: session.user.image || ''
      })
    }
  }, [session])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        toast.success('Profile updated successfully!')
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (response.ok) {
        toast.success('Password updated successfully!')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        toast.error('Failed to update password')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'supabase', label: 'Supabase', icon: Database },
  ]

  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>
                  
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        <select
                          value={profileData.department}
                          onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        >
                          <option value="">Select Department</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Design">Design</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Sales">Sales</option>
                          <option value="Support">Support</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Position
                        </label>
                        <input
                          type="text"
                          value={profileData.position}
                          onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                          placeholder="e.g. Senior Developer"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h2>
                  
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        <Lock className="w-4 h-4" />
                        <span>{isLoading ? 'Updating...' : 'Update Password'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-4 border-b border-gray-200">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {key === 'emailNotifications' && 'Email Notifications'}
                            {key === 'taskReminders' && 'Task Reminders'}
                            {key === 'weeklyReports' && 'Weekly Reports'}
                            {key === 'mentionNotifications' && 'Mention Notifications'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                            {key === 'taskReminders' && 'Get reminded about upcoming task deadlines'}
                            {key === 'weeklyReports' && 'Receive weekly progress reports'}
                            {key === 'mentionNotifications' && 'Get notified when someone mentions you'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              [key]: e.target.checked
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Appearance Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Theme</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {['light', 'dark'].map((theme) => (
                          <button
                            key={theme}
                            onClick={() => handleThemeChange(theme)}
                            className={`p-4 border-2 rounded-lg transition ${
                              appearanceSettings.theme === theme
                                ? 'border-blue-500 bg-blue-50 dark:bg-gray-800 dark:border-blue-400'
                                : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                            }`}
                          >
                            <div className={`w-full h-20 rounded mb-2 border ${
                              theme === 'light' 
                                ? 'bg-white border-gray-200' 
                                : 'bg-gray-800 border-gray-700'
                            }`}>
                              <div className="p-2 space-y-1">
                                <div className={`h-2 rounded ${
                                  theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                                }`}></div>
                                <div className={`h-2 rounded w-3/4 ${
                                  theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                                }`}></div>
                              </div>
                            </div>
                            <span className="font-medium capitalize dark:text-gray-200">{theme} Mode</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Compact Mode</h3>
                          <p className="text-sm text-gray-500">Reduce spacing for more content</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={appearanceSettings.compactMode}
                            onChange={(e) => handleCompactModeChange(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Collapsed Sidebar</h3>
                          <p className="text-sm text-gray-500">Start with sidebar collapsed</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={appearanceSettings.sidebarCollapsed}
                            onChange={(e) => handleSidebarCollapsedChange(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Supabase Tab */}
              {activeTab === 'supabase' && (
                <div className="p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Supabase Integration</h2>
                  <SupabaseSetup />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
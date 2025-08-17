'use client'

import { useState } from 'react'
import { Zap, Plus, Play, Pause, Settings, Clock, Target, ArrowRight, CheckCircle, AlertTriangle, Bot, Cpu, Timer, Activity } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Automation {
  id: string
  name: string
  description: string
  trigger: string
  action: string
  status: 'active' | 'paused' | 'error'
  runsCount: number
  lastRun?: Date
  category: 'task' | 'notification' | 'integration' | 'report'
}

interface AutomationTemplate {
  id: string
  name: string
  description: string
  category: string
  trigger: string
  action: string
  icon: string
}

export default function AutomationPage() {
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: '1',
      name: 'Task Assignment Notification',
      description: 'Automatically notify team members when tasks are assigned',
      trigger: 'When task is assigned',
      action: 'Send email notification',
      status: 'active',
      runsCount: 47,
      lastRun: new Date(Date.now() - 3600000),
      category: 'notification'
    },
    {
      id: '2',
      name: 'Deadline Alert System',
      description: 'Send alerts 24 hours before task deadlines',
      trigger: '1 day before deadline',
      action: 'Send push notification',
      status: 'active',
      runsCount: 23,
      lastRun: new Date(Date.now() - 86400000),
      category: 'notification'
    },
    {
      id: '3',
      name: 'Project Status Sync',
      description: 'Update project status when all tasks are completed',
      trigger: 'When all tasks completed',
      action: 'Mark project as complete',
      status: 'paused',
      runsCount: 12,
      lastRun: new Date(Date.now() - 172800000),
      category: 'task'
    }
  ])

  const [templates] = useState<AutomationTemplate[]>([
    {
      id: '1',
      name: 'Task Assignment Notification',
      description: 'Notify team members when tasks are assigned to them',
      category: 'Notifications',
      trigger: 'When task is assigned',
      action: 'Send email notification',
      icon: '📧'
    },
    {
      id: '2',
      name: 'Deadline Approaching Alert',
      description: 'Alert assignees when task deadlines are approaching',
      category: 'Notifications',
      trigger: '1 day before deadline',
      action: 'Send push notification',
      icon: '⏰'
    },
    {
      id: '3',
      name: 'Project Status Sync',
      description: 'Update project status based on task completion',
      category: 'Task Management',
      trigger: 'When all tasks completed',
      action: 'Mark project as complete',
      icon: '✅'
    },
    {
      id: '4',
      name: 'Time Tracking Reminder',
      description: 'Remind users to start time tracking for active tasks',
      category: 'Time Management',
      trigger: 'When task status changes to "In Progress"',
      action: 'Show time tracking prompt',
      icon: '⏱️'
    },
    {
      id: '5',
      name: 'Weekly Digest Email',
      description: 'Send weekly summary of team activities',
      category: 'Reports',
      trigger: 'Every Friday at 5 PM',
      action: 'Send digest email',
      icon: '📊'
    },
    {
      id: '6',
      name: 'Milestone Celebration',
      description: 'Celebrate when project milestones are reached',
      category: 'Team Engagement',
      trigger: 'When milestone is completed',
      action: 'Send celebration message',
      icon: '🎉'
    }
  ])

  const [activeTab, setActiveTab] = useState<'automations' | 'templates' | 'workflows' | 'settings'>('automations')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const getStatusColor = (status: Automation['status']) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'paused': return '#f59e0b'
      case 'error': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: Automation['status']) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />
      case 'paused': return <Pause size={16} />
      case 'error': return <AlertTriangle size={16} />
      default: return <CheckCircle size={16} />
    }
  }

  const getCategoryIcon = (category: Automation['category']) => {
    switch (category) {
      case 'task': return <Target size={16} />
      case 'notification': return <Activity size={16} />
      case 'integration': return <Cpu size={16} />
      case 'report': return <Bot size={16} />
      default: return <Zap size={16} />
    }
  }

  const toggleAutomation = (id: string) => {
    setAutomations(automations.map(automation => 
      automation.id === id 
        ? { ...automation, status: automation.status === 'active' ? 'paused' : 'active' }
        : automation
    ))
    toast.success('Automation status updated!')
  }

  const activeAutomations = automations.filter(a => a.status === 'active').length
  const totalRuns = automations.reduce((sum, a) => sum + a.runsCount, 0)

  return (
    <div>
      <div className="section-header">
        <h2>
          <Zap size={40} />
          Workflow Automation
        </h2>
        <p>Automate repetitive tasks and streamline your team's workflow</p>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setShowCreateModal(true)}
            className="nav-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} />
            <span>Create Automation</span>
          </button>
        </div>
      </div>

      {/* Automation Overview Cards */}
      <div className="analytics-grid">
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <Zap size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Active Automations</div>
              <div className="member-rating">
                <div className="rating-value">{activeAutomations}</div>
                <div className="rating-rank">Running workflows</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <Play size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Total Runs</div>
              <div className="member-rating">
                <div className="rating-value">{totalRuns}</div>
                <div className="rating-rank">Executions</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <Clock size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Time Saved</div>
              <div className="member-rating">
                <div className="rating-value">47h</div>
                <div className="rating-rank">This month</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              <Target size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Success Rate</div>
              <div className="member-rating">
                <div className="rating-value">98%</div>
                <div className="rating-rank">Reliability</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="analytics-row">
        {/* Automation Content */}
        <div className="chart-container large">
          {/* Tabs */}
          <div className="filters" style={{ marginBottom: '25px' }}>
            <button
              onClick={() => setActiveTab('automations')}
              className={activeTab === 'automations' ? 'filter-btn active' : 'filter-btn'}
            >
              Active Automations <span style={{ marginLeft: '8px', background: '#404040', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{automations.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={activeTab === 'templates' ? 'filter-btn active' : 'filter-btn'}
            >
              Templates <span style={{ marginLeft: '8px', background: '#404040', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{templates.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('workflows')}
              className={activeTab === 'workflows' ? 'filter-btn active' : 'filter-btn'}
            >
              Workflows
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={activeTab === 'settings' ? 'filter-btn active' : 'filter-btn'}
            >
              Settings
            </button>
          </div>

          {activeTab === 'automations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24' }}>Your Active Automations</h3>
                <button 
                  className="nav-btn"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create New
                </button>
              </div>
              
              {automations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <Zap size={64} style={{ color: '#667eea', margin: '0 auto 20px', opacity: 0.7 }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24', marginBottom: '10px' }}>
                    No automations yet
                  </h3>
                  <p style={{ color: '#ccc', marginBottom: '30px' }}>
                    Create your first automation to streamline workflows
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="nav-btn"
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                automations.map((automation) => (
                  <div key={automation.id} className="team-card" style={{ padding: '25px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ 
                          width: '50px', 
                          height: '50px', 
                          background: '#333333', 
                          borderRadius: '12px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: '#667eea'
                        }}>
                          {getCategoryIcon(automation.category)}
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 600, fontSize: '1.2rem', color: '#fbbf24', marginBottom: '5px' }}>
                            {automation.name}
                          </h4>
                          <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '8px' }}>
                            {automation.description}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: getStatusColor(automation.status),
                              color: 'white',
                              textTransform: 'capitalize'
                            }}>
                              {getStatusIcon(automation.status)}
                              {automation.status}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#999', textTransform: 'capitalize' }}>
                              {automation.category} automation
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => toggleAutomation(automation.id)}
                          className="action-btn"
                        >
                          {automation.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button className="action-btn">
                          <Settings size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Automation Details */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '20px',
                      paddingTop: '20px',
                      borderTop: '1px solid #404040'
                    }}>
                      <div>
                        <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '5px' }}>Trigger</p>
                        <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{automation.trigger}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '5px' }}>Action</p>
                        <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{automation.action}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '5px' }}>Runs</p>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fbbf24' }}>{automation.runsCount}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '5px' }}>Last Run</p>
                        <p style={{ fontSize: '0.9rem', color: '#ccc' }}>
                          {automation.lastRun ? format(automation.lastRun, 'MMM d, h:mm a') : 'Never'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'templates' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24' }}>Automation Templates</h3>
                <button 
                  className="filter-btn"
                  onClick={() => toast.success('All templates shown')}
                >
                  View All Categories
                </button>
              </div>
              
              <div className="analytics-grid">
                {templates.map((template) => (
                  <div key={template.id} className="team-card" style={{ padding: '20px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <div style={{ fontSize: '2rem' }}>{template.icon}</div>
                      <span style={{
                        fontSize: '0.7rem',
                        background: '#404040',
                        color: '#ccc',
                        padding: '2px 6px',
                        borderRadius: '8px'
                      }}>
                        {template.category}
                      </span>
                    </div>
                    
                    <h4 style={{ fontWeight: 600, fontSize: '1rem', color: '#fbbf24', marginBottom: '8px' }}>
                      {template.name}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '15px' }}>
                      {template.description}
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: '#999' }}>
                        <span style={{ minWidth: '50px', fontWeight: 600 }}>When:</span>
                        <span style={{ flex: 1 }}>{template.trigger}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: '#999' }}>
                        <span style={{ minWidth: '50px', fontWeight: 600 }}>Then:</span>
                        <span style={{ flex: 1 }}>{template.action}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => toast.success('Template selected! Configure your automation.')}
                      className="nav-btn"
                      style={{ width: '100%', fontSize: '0.85rem' }}
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'workflows' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Bot size={64} style={{ color: '#667eea', margin: '0 auto 20px', opacity: 0.7 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24', marginBottom: '10px' }}>
                Advanced Workflows
              </h3>
              <p style={{ color: '#ccc', marginBottom: '30px' }}>
                Create complex multi-step workflows with conditional logic
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => toast.success('Workflow builder opened')}
                  className="nav-btn"
                >
                  Open Workflow Builder
                </button>
                <button 
                  onClick={() => toast.success('Workflow imported')}
                  className="filter-btn"
                >
                  Import Workflow
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24' }}>Automation Settings</h3>
              
              <div style={{ background: '#2a2a2a', borderRadius: '15px', padding: '25px', border: '1px solid #404040' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#fbbf24', marginBottom: '20px' }}>Global Settings</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.9rem', color: '#ccc', display: 'block' }}>Enable Notifications</span>
                      <span style={{ fontSize: '0.8rem', color: '#999' }}>Receive alerts for automation events</span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#10b981' }}>Enabled</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.9rem', color: '#ccc', display: 'block' }}>Auto-retry Failed Runs</span>
                      <span style={{ fontSize: '0.8rem', color: '#999' }}>Automatically retry failed automations</span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#10b981' }}>On</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.9rem', color: '#ccc', display: 'block' }}>Execution Timeout</span>
                      <span style={{ fontSize: '0.8rem', color: '#999' }}>Maximum time for automation execution</span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#667eea' }}>5 minutes</span>
                  </div>
                </div>
              </div>
            </div>
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
                onClick={() => toast.success('Notification automation created')}
              >
                <Activity size={16} />
                <span>Create Notification</span>
              </button>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => toast.success('Task automation created')}
              >
                <Target size={16} />
                <span>Automate Tasks</span>
              </button>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => toast.success('Time automation created')}
              >
                <Timer size={16} />
                <span>Time Triggers</span>
              </button>
            </div>
          </div>

          {/* Automation Stats */}
          <div className="chart-container">
            <h3>
              <Bot size={20} />
              Performance
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>Success Rate</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>98.5%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>Avg Runtime</span>
                <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>2.3s</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>Weekly Runs</span>
                <span style={{ fontWeight: 'bold', color: '#667eea' }}>1,247</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="chart-container">
            <h3>
              <Clock size={20} />
              Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
              {[
                { automation: 'Task Assignment', time: new Date(Date.now() - 3600000), status: 'success' },
                { automation: 'Deadline Alert', time: new Date(Date.now() - 7200000), status: 'success' },
                { automation: 'Status Sync', time: new Date(Date.now() - 86400000), status: 'error' }
              ].map((activity, index) => (
                <div key={index} className="team-card" style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: activity.status === 'success' ? '#10b981' : '#ef4444'
                    }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.85rem', color: '#ccc', display: 'block' }}>{activity.automation}</span>
                      <span style={{ fontSize: '0.75rem', color: '#999' }}>
                        {format(activity.time, 'h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Automation Modal */}
      {showCreateModal && (
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #404040'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24', marginBottom: '20px' }}>
              Create New Automation
            </h3>
            
            <div style={{ textAlign: 'center', padding: '40px 20px', border: '2px dashed #404040', borderRadius: '10px', marginBottom: '25px' }}>
              <Zap size={48} style={{ color: '#667eea', margin: '0 auto 15px', opacity: 0.7 }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24', marginBottom: '10px' }}>
                Choose a Template
              </h4>
              <p style={{ color: '#ccc', marginBottom: '20px', fontSize: '0.9rem' }}>
                Select from our pre-built automation templates or create a custom one
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => {
                    setShowCreateModal(false)
                    setActiveTab('templates')
                    toast.success('Browse templates')
                  }}
                  className="nav-btn"
                >
                  Browse Templates
                </button>
                <button 
                  onClick={() => toast.success('Custom automation builder opened')}
                  className="filter-btn"
                >
                  Start from Scratch
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                className="filter-btn"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  toast.success('Automation created successfully!')
                }}
                className="nav-btn"
                style={{ flex: 1 }}
              >
                Create Automation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
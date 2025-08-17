'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, Square, Clock, Calendar, TrendingUp, Target, Plus, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface TimeEntry {
  id: string
  projectName: string
  taskName: string
  startTime: Date
  endTime?: Date
  duration: number
  description?: string
  tags: string[]
}

interface Project {
  id: string
  name: string
  color: string
  totalHours: number
}

export default function TimeTrackingPage() {
  const [isTracking, setIsTracking] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<Partial<TimeEntry>>({
    projectName: '',
    taskName: '',
    description: '',
    tags: []
  })
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTracking, startTime])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const startTracking = () => {
    if (!currentEntry.projectName || !currentEntry.taskName) {
      toast.error('Please enter project and task name')
      return
    }
    
    setStartTime(new Date())
    setIsTracking(true)
    setElapsedTime(0)
    toast.success('Timer started!')
  }

  const pauseTracking = () => {
    setIsTracking(false)
    toast.info('Timer paused')
  }

  const stopTracking = () => {
    if (!startTime) return
    
    const endTime = new Date()
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
    
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      projectName: currentEntry.projectName || '',
      taskName: currentEntry.taskName || '',
      startTime,
      endTime,
      duration,
      description: currentEntry.description,
      tags: currentEntry.tags || []
    }
    
    setTimeEntries([newEntry, ...timeEntries])
    setIsTracking(false)
    setStartTime(null)
    setElapsedTime(0)
    setCurrentEntry({ projectName: '', taskName: '', description: '', tags: [] })
    toast.success('Time entry saved!')
  }

  const todayEntries = timeEntries.filter(entry => 
    format(entry.startTime, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  )

  const todayTotal = todayEntries.reduce((sum, entry) => sum + entry.duration, 0)

  return (
    <div>
      <div className="section-header">
        <h2>
          <Clock size={40} />
          Time Tracking
        </h2>
        <p>Track your time and boost productivity with precise time management</p>
      </div>

      {/* Main Content */}
      <div className="analytics-row">
        {/* Timer Section */}
        <div className="chart-container large">
          <h3>
            <Clock size={24} />
            Active Timer
          </h3>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ 
              fontSize: '3.5rem', 
              fontFamily: 'monospace', 
              fontWeight: 700, 
              color: '#fbbf24', 
              marginBottom: '20px' 
            }}>
              {formatTime(elapsedTime)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              {!isTracking ? (
                <button
                  onClick={startTracking}
                  className="nav-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Play size={20} />
                  <span>Start</span>
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    onClick={pauseTracking}
                    className="filter-btn"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)'
                    }}
                  >
                    <Pause size={20} />
                    <span>Pause</span>
                  </button>
                  <button
                    onClick={stopTracking}
                    className="filter-btn"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)'
                    }}
                  >
                    <Square size={20} />
                    <span>Stop</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px',
            marginTop: '30px'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: '#fbbf24', 
                marginBottom: '8px' 
              }}>
                Project Name *
              </label>
              <input
                type="text"
                value={currentEntry.projectName}
                onChange={(e) => setCurrentEntry({ ...currentEntry, projectName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  background: '#333333',
                  border: '1px solid #404040',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
                placeholder="Enter project name"
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#404040'}
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: '#fbbf24', 
                marginBottom: '8px' 
              }}>
                Task Name *
              </label>
              <input
                type="text"
                value={currentEntry.taskName}
                onChange={(e) => setCurrentEntry({ ...currentEntry, taskName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  background: '#333333',
                  border: '1px solid #404040',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
                placeholder="Enter task name"
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#404040'}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: '#fbbf24', 
                marginBottom: '8px' 
              }}>
                Description
              </label>
              <textarea
                value={currentEntry.description}
                onChange={(e) => setCurrentEntry({ ...currentEntry, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  background: '#333333',
                  border: '1px solid #404040',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.9rem',
                  minHeight: '80px',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#404040'}
                rows={3}
                placeholder="What are you working on?"
              />
            </div>
          </div>
        </div>

        {/* Side Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Today's Stats */}
          <div className="chart-container">
            <h3>
              <Clock size={20} />
              Today's Progress
            </h3>
            <div style={{ marginTop: '20px' }}>
              <div className="team-card" style={{ padding: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fbbf24', marginBottom: '5px' }}>
                    {formatTime(todayTotal)}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#999' }}>Total Today</div>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Overview */}
          <div className="chart-container">
            <h3>
              <TrendingUp size={20} />
              Weekly Stats
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8 }}>This Week</span>
                <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>42:15:30</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8 }}>Productivity</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>98%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8 }}>Efficiency</span>
                <span style={{ fontWeight: 'bold', color: '#667eea' }}>High</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="chart-container">
            <h3>
              <Target size={20} />
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
              <button className="action-btn" style={{ width: '100%' }}>
                <Plus size={16} />
                <span>New Project</span>
              </button>
              <button className="action-btn" style={{ width: '100%' }}>
                <Calendar size={16} />
                <span>View Reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="analytics-grid">
        <div className="team-card">
          <div className="card-header">
            <div className="avatar">
              <Clock size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Today's Total</div>
              <div className="member-rating">
                <div className="rating-value">{formatTime(todayTotal)}</div>
                <div className="rating-rank">Hours Tracked</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar">
              <Calendar size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">This Week</div>
              <div className="member-rating">
                <div className="rating-value">42:15:30</div>
                <div className="rating-rank">Weekly Total</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar">
              <TrendingUp size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Productivity</div>
              <div className="member-rating">
                <div className="rating-value">98%</div>
                <div className="rating-rank">Efficiency Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Overview */}
      <div className="chart-container large">
        <h3>
          <Target size={24} />
          Projects Overview
        </h3>
        {projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.6 }}>
            <Target size={48} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
            <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>No projects yet</p>
            <p style={{ fontSize: '0.9rem' }}>Start tracking time to see project statistics</p>
          </div>
        ) : (
          <div className="analytics-grid" style={{ marginTop: '20px' }}>
            {projects.map((project) => (
              <div key={project.id} className="team-card">
                <div className="card-header">
                  <div className="avatar" style={{ background: project.color || '#667eea' }}>
                    <Target size={20} />
                  </div>
                  <div className="member-info">
                    <div className="member-name">{project.name}</div>
                    <div className="member-rating">
                      <div className="rating-value">{formatTime(project.totalHours * 3600)}</div>
                      <div className="rating-rank">Total Hours</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Entries */}
      <div className="chart-container large">
        <h3>
          <Clock size={24} />
          Recent Entries
        </h3>
        {timeEntries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.6 }}>
            <Clock size={48} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
            <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>No time entries yet</p>
            <p style={{ fontSize: '0.9rem' }}>Start tracking to see your entries here!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            {timeEntries.slice(0, 10).map((entry) => (
              <div key={entry.id} className="team-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fbbf24', marginBottom: '5px' }}>
                      {entry.taskName}
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '5px' }}>
                      {entry.projectName}
                    </p>
                    {entry.description && (
                      <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '8px' }}>
                        {entry.description}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', marginLeft: '20px' }}>
                    <p style={{ 
                      fontFamily: 'monospace', 
                      fontWeight: 700, 
                      fontSize: '1.2rem', 
                      color: '#fbbf24',
                      marginBottom: '5px'
                    }}>
                      {formatTime(entry.duration)}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#999' }}>
                      {format(entry.startTime, 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
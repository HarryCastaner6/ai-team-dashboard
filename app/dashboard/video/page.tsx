'use client'

import { useState, useEffect } from 'react'
import { Video, Plus, Phone, Users, Calendar, Clock, Settings, Mic, MicOff, VideoOff, Monitor, MessageSquare, VolumeX, Volume2, Play, Pause, PhoneCall } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Meeting {
  id: string
  title: string
  description: string
  startTime: Date
  endTime: Date
  duration: number
  host: string
  participants: Participant[]
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  meetingId: string
  password?: string
  recordingEnabled: boolean
  isRecurring: boolean
  meetingLink: string
}

interface Participant {
  id: string
  name: string
  email: string
  role: 'host' | 'co-host' | 'participant'
  status: 'invited' | 'accepted' | 'declined' | 'joined' | 'left'
  joinTime?: Date
  avatar?: string
}

interface CallLog {
  id: string
  type: 'video' | 'audio'
  title: string
  duration: number
  participants: number
  startTime: Date
  endTime: Date
  quality: 'excellent' | 'good' | 'fair' | 'poor'
}

export default function VideoPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Weekly Team Standup',
      description: 'Weekly sync meeting with the development team',
      startTime: new Date('2024-01-15T10:00:00'),
      endTime: new Date('2024-01-15T11:00:00'),
      duration: 60,
      host: 'Sarah Johnson',
      participants: [
        {
          id: '1',
          name: 'John Smith',
          email: 'john@company.com',
          role: 'participant',
          status: 'accepted'
        },
        {
          id: '2',
          name: 'Emily Davis',
          email: 'emily@company.com',
          role: 'participant',
          status: 'joined'
        }
      ],
      status: 'scheduled',
      meetingId: 'MTG-001-2024',
      recordingEnabled: true,
      isRecurring: true,
      meetingLink: 'https://meet.company.com/MTG-001-2024'
    },
    {
      id: '2',
      title: 'Client Presentation',
      description: 'Q1 results presentation to ABC Corp',
      startTime: new Date('2024-01-16T14:00:00'),
      endTime: new Date('2024-01-16T15:30:00'),
      duration: 90,
      host: 'Mike Chen',
      participants: [
        {
          id: '3',
          name: 'Alex Johnson',
          email: 'alex@abccorp.com',
          role: 'participant',
          status: 'invited'
        }
      ],
      status: 'scheduled',
      meetingId: 'MTG-002-2024',
      recordingEnabled: false,
      isRecurring: false,
      meetingLink: 'https://meet.company.com/MTG-002-2024'
    }
  ])

  const [callLogs] = useState<CallLog[]>([
    {
      id: '1',
      type: 'video',
      title: 'Project Discussion',
      duration: 45,
      participants: 5,
      startTime: new Date('2024-01-10T09:00:00'),
      endTime: new Date('2024-01-10T09:45:00'),
      quality: 'excellent'
    },
    {
      id: '2',
      type: 'audio',
      title: 'Quick Check-in',
      duration: 15,
      participants: 2,
      startTime: new Date('2024-01-09T15:30:00'),
      endTime: new Date('2024-01-09T15:45:00'),
      quality: 'good'
    }
  ])

  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'settings' | 'instant'>('upcoming')
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [isInCall, setIsInCall] = useState(false)
  const [callControls, setCallControls] = useState({
    videoEnabled: true,
    audioEnabled: true,
    screenSharing: false,
    recording: false,
    muted: false
  })

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    duration: 60,
    participants: '',
    recordingEnabled: false,
    password: ''
  })

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled': return '#667eea'
      case 'in-progress': return '#10b981'
      case 'completed': return '#6b7280'
      case 'cancelled': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getParticipantStatusColor = (status: Participant['status']) => {
    switch (status) {
      case 'joined': return '#10b981'
      case 'accepted': return '#667eea'
      case 'invited': return '#f59e0b'
      case 'declined': return '#ef4444'
      case 'left': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getQualityColor = (quality: CallLog['quality']) => {
    switch (quality) {
      case 'excellent': return '#10b981'
      case 'good': return '#667eea'
      case 'fair': return '#f59e0b'
      case 'poor': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const upcomingMeetings = meetings.filter(m => m.status === 'scheduled' || m.status === 'in-progress')
  const completedMeetings = meetings.filter(m => m.status === 'completed')
  const totalMinutes = callLogs.reduce((sum, call) => sum + call.duration, 0)
  const totalCalls = callLogs.length

  const handleCreateMeeting = () => {
    if (!newMeeting.title || !newMeeting.startDate || !newMeeting.startTime) {
      toast.error('Please fill in required fields')
      return
    }

    const startDateTime = new Date(`${newMeeting.startDate}T${newMeeting.startTime}`)
    const endDateTime = new Date(startDateTime.getTime() + newMeeting.duration * 60000)

    const meeting: Meeting = {
      id: Date.now().toString(),
      ...newMeeting,
      startTime: startDateTime,
      endTime: endDateTime,
      host: 'Current User',
      participants: newMeeting.participants.split(',').map((email, index) => ({
        id: (index + 1).toString(),
        name: email.trim().split('@')[0],
        email: email.trim(),
        role: 'participant' as const,
        status: 'invited' as const
      })),
      status: 'scheduled',
      meetingId: `MTG-${String(meetings.length + 1).padStart(3, '0')}-2024`,
      isRecurring: false,
      meetingLink: `https://meet.company.com/MTG-${String(meetings.length + 1).padStart(3, '0')}-2024`
    }

    setMeetings([meeting, ...meetings])
    setNewMeeting({
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      duration: 60,
      participants: '',
      recordingEnabled: false,
      password: ''
    })
    setShowMeetingModal(false)
    toast.success('Meeting scheduled successfully!')
  }

  const joinMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    setIsInCall(true)
    toast.success(`Joined ${meeting.title}`)
  }

  const leaveMeeting = () => {
    setIsInCall(false)
    setSelectedMeeting(null)
    setCallControls({
      videoEnabled: true,
      audioEnabled: true,
      screenSharing: false,
      recording: false,
      muted: false
    })
    toast.success('Left the meeting')
  }

  const toggleControl = (control: keyof typeof callControls) => {
    setCallControls(prev => ({
      ...prev,
      [control]: !prev[control]
    }))
  }

  const startInstantMeeting = () => {
    const instantMeeting: Meeting = {
      id: 'instant-' + Date.now(),
      title: 'Instant Meeting',
      description: 'Quick meeting started now',
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60000),
      duration: 60,
      host: 'Current User',
      participants: [],
      status: 'in-progress',
      meetingId: `INSTANT-${Date.now()}`,
      recordingEnabled: false,
      isRecurring: false,
      meetingLink: `https://meet.company.com/INSTANT-${Date.now()}`
    }
    
    setSelectedMeeting(instantMeeting)
    setIsInCall(true)
    toast.success('Instant meeting started!')
  }

  return (
    <div>
      <div className="section-header">
        <h2>
          <Video size={40} />
          Video Conferencing
        </h2>
        <p>Schedule meetings, manage video calls, and collaborate with your team</p>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={startInstantMeeting}
            className="nav-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '15px' }}
          >
            <Video size={20} />
            <span>Start Instant Meeting</span>
          </button>
          <button
            onClick={() => setShowMeetingModal(true)}
            className="nav-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* Video Overview Cards */}
      <div className="analytics-grid">
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <Calendar size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Upcoming Meetings</div>
              <div className="member-rating">
                <div className="rating-value">{upcomingMeetings.length}</div>
                <div className="rating-rank">Scheduled</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <PhoneCall size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Total Calls</div>
              <div className="member-rating">
                <div className="rating-value">{totalCalls}</div>
                <div className="rating-rank">This month</div>
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
              <div className="member-name">Meeting Minutes</div>
              <div className="member-rating">
                <div className="rating-value">{totalMinutes}</div>
                <div className="rating-rank">Total time</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              <Users size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Participants</div>
              <div className="member-rating">
                <div className="rating-value">{meetings.reduce((sum, m) => sum + m.participants.length, 0)}</div>
                <div className="rating-rank">Total attendees</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* In-Call Interface */}
      {isInCall && selectedMeeting && (
        <div style={{ 
          background: '#000000', 
          borderRadius: '15px', 
          padding: '25px', 
          color: 'white', 
          marginBottom: '30px',
          border: '1px solid #404040'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24' }}>{selectedMeeting.title}</h3>
              <p style={{ color: '#ccc', fontSize: '0.9rem' }}>Meeting ID: {selectedMeeting.meetingId}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
              <span>Live</span>
            </div>
          </div>

          {/* Video Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px', 
            marginBottom: '25px' 
          }}>
            {selectedMeeting.participants.slice(0, 6).map((participant) => (
              <div key={participant.id} style={{ 
                background: '#333333', 
                borderRadius: '12px', 
                padding: '15px', 
                aspectRatio: '16/9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '1.2rem' }}>
                  {participant.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ 
                  position: 'absolute', 
                  bottom: '8px', 
                  left: '8px', 
                  background: 'rgba(0,0,0,0.7)', 
                  padding: '4px 8px', 
                  borderRadius: '6px',
                  fontSize: '0.75rem'
                }}>
                  {participant.name}
                </div>
                {participant.status === 'joined' && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '8px', 
                    right: '8px', 
                    width: '12px', 
                    height: '12px', 
                    background: '#10b981', 
                    borderRadius: '50%' 
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Call Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
            <button
              onClick={() => toggleControl('audioEnabled')}
              className="action-btn"
              style={{ 
                background: callControls.audioEnabled ? '#333333' : '#ef4444',
                padding: '15px',
                borderRadius: '50%'
              }}
            >
              {callControls.audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            
            <button
              onClick={() => toggleControl('videoEnabled')}
              className="action-btn"
              style={{ 
                background: callControls.videoEnabled ? '#333333' : '#ef4444',
                padding: '15px',
                borderRadius: '50%'
              }}
            >
              {callControls.videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>

            <button
              onClick={() => toggleControl('screenSharing')}
              className="action-btn"
              style={{ 
                background: callControls.screenSharing ? '#667eea' : '#333333',
                padding: '15px',
                borderRadius: '50%'
              }}
            >
              <Monitor size={20} />
            </button>

            <button
              onClick={() => toggleControl('recording')}
              className="action-btn"
              style={{ 
                background: callControls.recording ? '#ef4444' : '#333333',
                padding: '15px',
                borderRadius: '50%'
              }}
            >
              <span style={{ fontSize: '20px' }}>
                {callControls.recording ? '⏹️' : '⏺️'}
              </span>
            </button>

            <button 
              className="action-btn"
              style={{ padding: '15px', borderRadius: '50%' }}
            >
              <MessageSquare size={20} />
            </button>

            <button
              onClick={leaveMeeting}
              className="action-btn"
              style={{ 
                background: '#ef4444',
                padding: '15px',
                borderRadius: '50%'
              }}
            >
              <Phone size={20} style={{ transform: 'rotate(135deg)' }} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isInCall && (
        <div className="analytics-row">
          {/* Tab Content */}
          <div className="chart-container large">
            <div className="filters" style={{ marginBottom: '20px' }}>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={activeTab === 'upcoming' ? 'filter-btn active' : 'filter-btn'}
              >
                Upcoming <span style={{ marginLeft: '8px', background: '#404040', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{upcomingMeetings.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={activeTab === 'history' ? 'filter-btn active' : 'filter-btn'}
              >
                History <span style={{ marginLeft: '8px', background: '#404040', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{completedMeetings.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('instant')}
                className={activeTab === 'instant' ? 'filter-btn active' : 'filter-btn'}
              >
                Quick Actions
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={activeTab === 'settings' ? 'filter-btn active' : 'filter-btn'}
              >
                Settings
              </button>
            </div>

            {activeTab === 'upcoming' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24' }}>Upcoming Meetings</h3>
                  <button 
                    className="nav-btn"
                    onClick={() => setShowMeetingModal(true)}
                  >
                    Schedule Meeting
                  </button>
                </div>
                
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="team-card" style={{ padding: '25px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ 
                          width: '50px', 
                          height: '50px', 
                          background: '#333333', 
                          borderRadius: '12px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center'
                        }}>
                          <Video size={24} style={{ color: '#667eea' }} />
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 600, fontSize: '1.2rem', color: '#fbbf24', marginBottom: '5px' }}>
                            {meeting.title}
                          </h4>
                          <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '8px' }}>
                            {meeting.description}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{
                              display: 'inline-flex',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: getStatusColor(meeting.status),
                              color: 'white',
                              textTransform: 'capitalize'
                            }}>
                              {meeting.status.replace('-', ' ')}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#999' }}>
                              Host: {meeting.host}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '1rem', fontWeight: 600, color: '#fbbf24', marginBottom: '5px' }}>
                          {format(meeting.startTime, 'MMM d, yyyy')}
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '5px' }}>
                          {format(meeting.startTime, 'h:mm a')} - {format(meeting.endTime, 'h:mm a')}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                          <button 
                            className="action-btn"
                            onClick={() => joinMeeting(meeting)}
                            style={{ background: '#10b981' }}
                          >
                            <Video size={16} />
                          </button>
                          <button className="action-btn">
                            <Settings size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Meeting Participants */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '15px',
                      paddingTop: '20px',
                      borderTop: '1px solid #404040'
                    }}>
                      {meeting.participants.map((participant) => (
                        <div key={participant.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="avatar" style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}>
                            {participant.name[0]}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.85rem', color: '#ccc', fontWeight: 600 }}>{participant.name}</p>
                            <span style={{
                              fontSize: '0.7rem',
                              padding: '2px 6px',
                              borderRadius: '8px',
                              background: getParticipantStatusColor(participant.status),
                              color: 'white'
                            }}>
                              {participant.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24' }}>Call History</h3>
                  <button 
                    className="nav-btn"
                    onClick={() => toast.success('Export history clicked')}
                  >
                    Export History
                  </button>
                </div>
                
                {callLogs.map((call) => (
                  <div key={call.id} className="team-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ 
                          padding: '12px', 
                          borderRadius: '12px', 
                          background: call.type === 'video' ? '#667eea' : '#10b981'
                        }}>
                          {call.type === 'video' ? <Video size={20} /> : <Phone size={20} />}
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fbbf24', marginBottom: '5px' }}>
                            {call.title}
                          </h4>
                          <p style={{ fontSize: '0.9rem', color: '#ccc' }}>
                            {format(call.startTime, 'MMM d, yyyy h:mm a')} • {call.duration} min • {call.participants} participants
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: getQualityColor(call.quality)
                        }}>
                          {call.quality} quality
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'instant' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div 
                  onClick={startInstantMeeting}
                  className="team-card"
                  style={{ 
                    padding: '30px', 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    border: '2px dashed #404040',
                    background: 'transparent'
                  }}
                >
                  <Video size={48} style={{ color: '#667eea', margin: '0 auto 15px' }} />
                  <h3 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '8px' }}>Start Video Call</h3>
                  <p style={{ fontSize: '0.85rem', color: '#ccc' }}>Begin an instant video meeting</p>
                </div>

                <div 
                  className="team-card"
                  style={{ 
                    padding: '30px', 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    border: '2px dashed #404040',
                    background: 'transparent'
                  }}
                >
                  <Phone size={48} style={{ color: '#10b981', margin: '0 auto 15px' }} />
                  <h3 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '8px' }}>Audio Call</h3>
                  <p style={{ fontSize: '0.85rem', color: '#ccc' }}>Start an audio-only call</p>
                </div>

                <div 
                  className="team-card"
                  style={{ 
                    padding: '30px', 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    border: '2px dashed #404040',
                    background: 'transparent'
                  }}
                >
                  <Monitor size={48} style={{ color: '#f59e0b', margin: '0 auto 15px' }} />
                  <h3 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '8px' }}>Screen Share</h3>
                  <p style={{ fontSize: '0.85rem', color: '#ccc' }}>Share your screen instantly</p>
                </div>

                <div 
                  onClick={() => setShowMeetingModal(true)}
                  className="team-card"
                  style={{ 
                    padding: '30px', 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    border: '2px dashed #404040',
                    background: 'transparent'
                  }}
                >
                  <Calendar size={48} style={{ color: '#667eea', margin: '0 auto 15px' }} />
                  <h3 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '8px' }}>Schedule Meeting</h3>
                  <p style={{ fontSize: '0.85rem', color: '#ccc' }}>Plan a future meeting</p>
                </div>

                <div 
                  className="team-card"
                  style={{ 
                    padding: '30px', 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    border: '2px dashed #404040',
                    background: 'transparent'
                  }}
                >
                  <MessageSquare size={48} style={{ color: '#ef4444', margin: '0 auto 15px' }} />
                  <h3 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '8px' }}>Team Chat</h3>
                  <p style={{ fontSize: '0.85rem', color: '#ccc' }}>Start a group conversation</p>
                </div>

                <div 
                  className="team-card"
                  style={{ 
                    padding: '30px', 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    border: '2px dashed #404040',
                    background: 'transparent'
                  }}
                >
                  <Users size={48} style={{ color: '#8b5cf6', margin: '0 auto 15px' }} />
                  <h3 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '8px' }}>Join Meeting</h3>
                  <p style={{ fontSize: '0.85rem', color: '#ccc' }}>Enter a meeting ID to join</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Settings size={64} style={{ color: '#667eea', margin: '0 auto 20px', opacity: 0.7 }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24', marginBottom: '10px' }}>Meeting Settings</h3>
                <p style={{ color: '#ccc', marginBottom: '30px' }}>Configure your video conferencing preferences</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => toast.success('Audio settings opened')}
                    className="nav-btn"
                  >
                    Audio & Video
                  </button>
                  <button 
                    onClick={() => toast.success('Recording settings opened')}
                    className="filter-btn"
                  >
                    Recording Options
                  </button>
                  <button 
                    onClick={() => toast.success('Privacy settings opened')}
                    className="filter-btn"
                  >
                    Privacy Settings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Quick Stats */}
            <div className="chart-container">
              <h3>
                <Video size={20} />
                Meeting Stats
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ opacity: 0.8 }}>Avg Duration</span>
                  <span style={{ fontWeight: 'bold', color: '#10b981' }}>{Math.round(totalMinutes / totalCalls) || 0}min</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ opacity: 0.8 }}>Success Rate</span>
                  <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>98%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ opacity: 0.8 }}>Active Rooms</span>
                  <span style={{ fontWeight: 'bold', color: '#667eea' }}>2</span>
                </div>
              </div>
            </div>

            {/* Recent Meetings */}
            <div className="chart-container">
              <h3>
                <Clock size={20} />
                Recent Meetings
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                {upcomingMeetings.slice(0, 3).map((meeting, index) => (
                  <div key={meeting.id} className="team-card" style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getStatusColor(meeting.status)
                      }} />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.85rem', color: '#ccc', display: 'block' }}>{meeting.title}</span>
                        <span style={{ fontSize: '0.75rem', color: '#999' }}>
                          {format(meeting.startTime, 'MMM d, h:mm a')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                  onClick={startInstantMeeting}
                >
                  <Video size={16} />
                  <span>Start Meeting</span>
                </button>
                <button 
                  className="action-btn" 
                  style={{ width: '100%' }}
                  onClick={() => toast.success('Join meeting clicked')}
                >
                  <Phone size={16} />
                  <span>Join by ID</span>
                </button>
                <button 
                  className="action-btn" 
                  style={{ width: '100%' }}
                  onClick={() => setShowMeetingModal(true)}
                >
                  <Calendar size={16} />
                  <span>Schedule</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {showMeetingModal && (
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fbbf24' }}>
                Schedule New Meeting
              </h2>
              <button
                onClick={() => setShowMeetingModal(false)}
                style={{ 
                  color: '#999', 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '1.5rem', 
                  cursor: 'pointer',
                  padding: '0'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#fbbf24', marginBottom: '8px' }}>
                  Meeting Title *
                </label>
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Meeting title"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#fbbf24', marginBottom: '8px' }}>
                  Description
                </label>
                <textarea
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Meeting description"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: '#fbbf24', marginBottom: '8px' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newMeeting.startDate}
                    onChange={(e) => setNewMeeting({ ...newMeeting, startDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: '#fbbf24', marginBottom: '8px' }}>
                    Time *
                  </label>
                  <input
                    type="time"
                    value={newMeeting.startTime}
                    onChange={(e) => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#fbbf24', marginBottom: '8px' }}>
                  Duration (minutes)
                </label>
                <select
                  value={newMeeting.duration}
                  onChange={(e) => setNewMeeting({ ...newMeeting, duration: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#fbbf24', marginBottom: '8px' }}>
                  Participants (comma separated emails)
                </label>
                <input
                  type="text"
                  value={newMeeting.participants}
                  onChange={(e) => setNewMeeting({ ...newMeeting, participants: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="user1@company.com, user2@company.com"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="recording"
                  checked={newMeeting.recordingEnabled}
                  onChange={(e) => setNewMeeting({ ...newMeeting, recordingEnabled: e.target.checked })}
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    accentColor: '#667eea'
                  }}
                />
                <label htmlFor="recording" style={{ color: '#ccc', fontSize: '0.9rem' }}>
                  Enable automatic recording
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button className="filter-btn" style={{ flex: 1 }} onClick={() => setShowMeetingModal(false)}>
                Cancel
              </button>
              <button className="nav-btn" style={{ flex: 1 }} onClick={handleCreateMeeting}>
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
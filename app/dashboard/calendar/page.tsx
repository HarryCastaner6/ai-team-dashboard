'use client'

import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, Clock, Users, Plus, ChevronLeft, ChevronRight, Video, MapPin, Bell, TrendingUp } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns'
import toast from 'react-hot-toast'

interface Event {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  type: 'meeting' | 'task' | 'reminder' | 'deadline'
  attendees: string[]
  location?: string
  isOnline: boolean
  color: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  
  const [events, setEvents] = useState<Event[]>([])

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: 'meeting' as Event['type'],
    attendees: '',
    location: '',
    isOnline: false
  })

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.startTime, day))
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      toast.error('Please fill in all required fields')
      return
    }

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      startTime: new Date(newEvent.startTime),
      endTime: new Date(newEvent.endTime),
      type: newEvent.type,
      attendees: newEvent.attendees.split(',').map(a => a.trim()).filter(Boolean),
      location: newEvent.location,
      isOnline: newEvent.isOnline,
      color: newEvent.type === 'meeting' ? 'bg-blue-500' : 
             newEvent.type === 'task' ? 'bg-green-500' :
             newEvent.type === 'reminder' ? 'bg-yellow-500' : 'bg-red-500'
    }

    setEvents([...events, event])
    setNewEvent({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      type: 'meeting',
      attendees: '',
      location: '',
      isOnline: false
    })
    setShowEventModal(false)
    toast.success('Event created successfully!')
  }

  const getEventTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'meeting': return <Users size={14} />
      case 'task': return <CalendarIcon size={14} />
      case 'reminder': return <Bell size={14} />
      case 'deadline': return <Clock size={14} />
      default: return <CalendarIcon size={14} />
    }
  }

  const upcomingEvents = events
    .filter(event => event.startTime >= new Date())
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(0, 5)

  return (
    <div>
      <div className="section-header">
        <h2>
          <CalendarIcon size={40} />
          Calendar & Scheduling
        </h2>
        <p>Manage your schedule and team meetings with intelligent calendar views</p>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setShowEventModal(true)}
            className="nav-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} />
            <span>New Event</span>
          </button>
        </div>
      </div>

      <div className="analytics-row">
        {/* Main Calendar */}
        <div className="chart-container large">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '20px' 
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fbbf24' }}>
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div className="filters">
                <button
                  onClick={() => setView('month')}
                  className={view === 'month' ? 'filter-btn active' : 'filter-btn'}
                >
                  Month
                </button>
                <button
                  onClick={() => setView('week')}
                  className={view === 'week' ? 'filter-btn active' : 'filter-btn'}
                >
                  Week
                </button>
                <button
                  onClick={() => setView('day')}
                  className={view === 'day' ? 'filter-btn active' : 'filter-btn'}
                >
                  Day
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={prevMonth}
                  className="action-btn"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextMonth}
                  className="action-btn"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '8px',
            marginTop: '20px'
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{
                padding: '12px',
                textAlign: 'center',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#fbbf24',
                background: '#333333',
                borderRadius: '8px'
              }}>
                {day}
              </div>
            ))}
            
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDay(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isToday = isSameDay(day, new Date())
              const isSelected = isSameDay(day, selectedDate)
              
              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  style={{
                    minHeight: '120px',
                    padding: '10px',
                    background: isToday ? 'linear-gradient(135deg, #667eea, #764ba2)' : 
                               isSelected ? '#333333' : '#2a2a2a',
                    border: isSelected ? '2px solid #fbbf24' : '1px solid #404040',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: isCurrentMonth ? 1 : 0.5
                  }}
                >
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    marginBottom: '8px',
                    color: isToday ? 'white' : '#fbbf24'
                  }}>
                    {format(day, 'd')}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {dayEvents.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedEvent(event)
                        }}
                        style={{
                          fontSize: '0.75rem',
                          padding: '4px 6px',
                          borderRadius: '6px',
                          background: event.color || '#10b981',
                          color: 'white',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Today's Schedule */}
          <div className="chart-container">
            <h3>
              <Clock size={20} />
              Today's Schedule
            </h3>
            {getEventsForDay(new Date()).length === 0 ? (
              <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>No events today</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                {getEventsForDay(new Date()).map(event => (
                  <div key={event.id} className="team-card" style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: event.color || '#10b981',
                        marginTop: '6px',
                        flexShrink: 0
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ 
                          fontWeight: 600, 
                          fontSize: '0.9rem', 
                          color: '#fbbf24',
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {event.title}
                        </h4>
                        <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '4px' }}>
                          {format(event.startTime, 'h:mm a')} - {format(event.endTime, 'h:mm a')}
                        </p>
                        {event.isOnline && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Video size={12} style={{ color: '#667eea' }} />
                            <span style={{ fontSize: '0.75rem', color: '#667eea' }}>Online</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="chart-container">
            <h3>
              <Bell size={20} />
              Upcoming Events
            </h3>
            {upcomingEvents.length === 0 ? (
              <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>No upcoming events</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                {upcomingEvents.map(event => (
                  <div key={event.id} className="team-card" style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ flexShrink: 0, marginTop: '2px' }}>
                        {getEventTypeIcon(event.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ 
                          fontWeight: 600, 
                          fontSize: '0.9rem', 
                          color: '#fbbf24',
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {event.title}
                        </h4>
                        <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                          {format(event.startTime, 'MMM d, h:mm a')}
                        </p>
                        {event.attendees.length > 0 && (
                          <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '4px' }}>
                            {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="chart-container">
            <h3>
              <TrendingUp size={20} />
              This Week
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8 }}>Meetings</span>
                <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>{events.filter(e => e.type === 'meeting').length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8 }}>Total Events</span>
                <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>{events.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8 }}>Upcoming</span>
                <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>{upcomingEvents.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {showEventModal && (
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
            maxWidth: '500px', 
            width: '100%', 
            maxHeight: '90vh', 
            overflowY: 'auto', 
            padding: '30px',
            border: '1px solid #404040'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24', marginBottom: '20px' }}>Create New Event</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  color: '#fbbf24', 
                  marginBottom: '8px' 
                }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Event title"
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
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
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
                  rows={3}
                  placeholder="Event description"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.9rem', 
                    fontWeight: 600, 
                    color: '#fbbf24', 
                    marginBottom: '8px' 
                  }}>
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
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
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.9rem', 
                    fontWeight: 600, 
                    color: '#fbbf24', 
                    marginBottom: '8px' 
                  }}>
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
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
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  color: '#fbbf24', 
                  marginBottom: '8px' 
                }}>
                  Type
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as Event['type'] })}
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
                  <option value="meeting">Meeting</option>
                  <option value="task">Task</option>
                  <option value="reminder">Reminder</option>
                  <option value="deadline">Deadline</option>
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  color: '#fbbf24', 
                  marginBottom: '8px' 
                }}>
                  Attendees
                </label>
                <input
                  type="text"
                  value={newEvent.attendees}
                  onChange={(e) => setNewEvent({ ...newEvent, attendees: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Comma-separated list of attendees"
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
                  Location
                </label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Meeting location"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="isOnline"
                  checked={newEvent.isOnline}
                  onChange={(e) => setNewEvent({ ...newEvent, isOnline: e.target.checked })}
                  style={{ accentColor: '#667eea' }}
                />
                <label htmlFor="isOnline" style={{ fontSize: '0.9rem', color: 'white' }}>Online meeting</label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px' }}>
              <button
                onClick={() => setShowEventModal(false)}
                className="filter-btn"
                style={{ background: '#404040' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="nav-btn"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
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
            maxWidth: '400px', 
            width: '100%', 
            padding: '30px',
            border: '1px solid #404040'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24' }}>{selectedEvent.title}</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{ 
                  color: '#999', 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '1.5rem', 
                  cursor: 'pointer',
                  padding: '0'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {selectedEvent.description && (
                <p style={{ color: '#ccc', fontSize: '0.9rem' }}>{selectedEvent.description}</p>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc' }}>
                <Clock size={16} />
                <span>{format(selectedEvent.startTime, 'MMM d, h:mm a')} - {format(selectedEvent.endTime, 'h:mm a')}</span>
              </div>

              {selectedEvent.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc' }}>
                  <MapPin size={16} />
                  <span>{selectedEvent.location}</span>
                </div>
              )}

              {selectedEvent.isOnline && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#667eea' }}>
                  <Video size={16} />
                  <span>Online meeting</span>
                </div>
              )}

              {selectedEvent.attendees.length > 0 && (
                <div>
                  <h4 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '10px' }}>Attendees</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {selectedEvent.attendees.map((attendee, index) => (
                      <div key={index} style={{ fontSize: '0.85rem', color: '#ccc' }}>{attendee}</div>
                    ))}
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
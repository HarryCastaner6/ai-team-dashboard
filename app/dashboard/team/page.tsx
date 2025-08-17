'use client'

import { useState, useEffect } from 'react'
import { Star, TrendingUp, Award, Briefcase, Mail, Shield, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
  department?: string
  position?: string
  location?: string
  avatar?: string
  overallRating: number
  skills?: {
    name: string
    level: number
  }[]
  stats?: {
    tasksCompleted: number
    projectsActive: number
    hoursLogged: number
  }
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'USER' as 'ADMIN' | 'USER',
    department: '',
    position: '',
    location: '',
    overallRating: 70,
    skills: [] as { name: string; level: number }[]
  })
  const [newSkill, setNewSkill] = useState({ name: '', level: 50 })

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team')
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data)
      }
    } catch (error) {
      toast.error('Failed to fetch team members')
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 90) return 'text-purple-600 bg-purple-100'
    if (rating >= 80) return 'text-blue-600 bg-blue-100'
    if (rating >= 70) return 'text-green-600 bg-green-100'
    if (rating >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getRatingLabel = (rating: number) => {
    if (rating >= 90) return 'Elite'
    if (rating >= 80) return 'Expert'
    if (rating >= 70) return 'Proficient'
    if (rating >= 60) return 'Developing'
    return 'Beginner'
  }

  const addTeamMember = async () => {
    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember)
      })

      if (response.ok) {
        toast.success('Team member added successfully')
        setShowAddForm(false)
        setNewMember({
          name: '',
          email: '',
          role: 'USER',
          department: '',
          position: '',
          location: '',
          overallRating: 70,
          skills: []
        })
        fetchTeamMembers()
      } else {
        toast.error('Failed to add team member')
      }
    } catch (error) {
      toast.error('Failed to add team member')
    }
  }

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setNewMember({
        ...newMember,
        skills: [...newMember.skills, { ...newSkill }]
      })
      setNewSkill({ name: '', level: 50 })
    }
  }

  const removeSkill = (index: number) => {
    const updatedSkills = newMember.skills.filter((_, i) => i !== index)
    setNewMember({ ...newMember, skills: updatedSkills })
  }

  return (
    <div>
      <div className="section-header">
        <h2>
          <Briefcase size={40} />
          Team Members
        </h2>
        <p>View and manage your team's NBA 2K-style performance ratings</p>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setShowAddForm(true)}
            className="nav-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      <div className="team-grid">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="team-card"
            onClick={() => setSelectedMember(member)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-header">
              <div className="avatar">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="member-info">
                <div className="member-name">{member.name}</div>
                <div className="member-role">{member.position || 'Team Member'}</div>
                <div className="member-niche">{member.department}</div>
                {member.location && (
                  <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '3px' }}>
                    📍 {member.location}
                  </p>
                )}
              </div>
            </div>

            <div className="card-body">
              <div className="member-rating">
                <div className="rating-value">{member.overallRating}</div>
                <div className="rating-rank">{getRatingLabel(member.overallRating)}</div>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '3px', 
                marginTop: '10px' 
              }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    style={{ 
                      color: i < Math.floor(member.overallRating / 20) ? '#fbbf24' : '#6b7280',
                      fill: i < Math.floor(member.overallRating / 20) ? '#fbbf24' : 'none'
                    }}
                  />
                ))}
              </div>

              {member.role === 'ADMIN' && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    padding: '4px 10px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    fontSize: '0.75rem',
                    borderRadius: '12px',
                    fontWeight: 600
                  }}>
                    <Shield size={12} />
                    Admin
                  </span>
                </div>
              )}

              {member.stats && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '10px', 
                  marginTop: '15px', 
                  paddingTop: '15px', 
                  borderTop: '1px solid #404040' 
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24' }}>
                      {member.stats.tasksCompleted}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#999' }}>Tasks</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24' }}>
                      {member.stats.projectsActive}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#999' }}>Projects</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24' }}>
                      {member.stats.hoursLogged}h
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#999' }}>Hours</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedMember && (
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
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fbbf24', marginBottom: '5px' }}>
                  {selectedMember.name}
                </h2>
                <p style={{ color: '#ccc' }}>{selectedMember.position}</p>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '25px' }}>
              <div style={{ background: '#333333', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Mail size={16} style={{ color: '#667eea' }} />
                  <span style={{ fontSize: '0.9rem', color: '#fbbf24' }}>Email</span>
                </div>
                <p style={{ fontWeight: 600, color: '#ccc' }}>{selectedMember.email}</p>
              </div>
              <div style={{ background: '#333333', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Briefcase size={16} style={{ color: '#667eea' }} />
                  <span style={{ fontSize: '0.9rem', color: '#fbbf24' }}>Department</span>
                </div>
                <p style={{ fontWeight: 600, color: '#ccc' }}>{selectedMember.department || 'Not assigned'}</p>
              </div>
            </div>

            {selectedMember.skills && selectedMember.skills.length > 0 && (
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24', marginBottom: '20px' }}>Skills</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {selectedMember.skills.map((skill, index) => (
                    <div key={index}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ccc' }}>
                          {skill.name}
                        </span>
                        <span style={{ fontSize: '0.9rem', color: '#999' }}>
                          {skill.level}%
                        </span>
                      </div>
                      <div style={{ width: '100%', background: '#333333', borderRadius: '10px', height: '8px' }}>
                        <div
                          style={{ 
                            background: 'linear-gradient(90deg, #667eea, #764ba2)', 
                            height: '8px', 
                            borderRadius: '10px', 
                            transition: 'width 0.5s ease',
                            width: `${skill.level}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                className="nav-btn" 
                style={{ flex: 1 }}
              >
                View Profile
              </button>
              <button 
                className="filter-btn" 
                style={{ flex: 1 }}
              >
                Assign Task
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
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
            maxWidth: '700px', 
            maxHeight: '90vh', 
            overflowY: 'auto',
            border: '1px solid #404040'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fbbf24' }}>Add Team Member</h2>
              <button
                onClick={() => setShowAddForm(false)}
                style={{ 
                  color: '#999', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.9rem', 
                    fontWeight: 600, 
                    color: '#fbbf24', 
                    marginBottom: '8px' 
                  }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="John Doe"
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
                    Email *
                  </label>
                  <input
                    type="email"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="john@example.com"
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#404040'}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.9rem', 
                    fontWeight: 600, 
                    color: '#fbbf24', 
                    marginBottom: '8px' 
                  }}>
                    Position
                  </label>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    value={newMember.position}
                    onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                    placeholder="Software Engineer"
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
                    Department
                  </label>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    value={newMember.department}
                    onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                    placeholder="Engineering"
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#404040'}
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
                  Location
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  value={newMember.location}
                  onChange={(e) => setNewMember({ ...newMember, location: e.target.value })}
                  placeholder="City, State"
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#404040'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.9rem', 
                    fontWeight: 600, 
                    color: '#fbbf24', 
                    marginBottom: '8px' 
                  }}>
                    Role
                  </label>
                  <select
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value as 'ADMIN' | 'USER' })}
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
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
                    Overall Rating (0-99)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    value={newMember.overallRating}
                    onChange={(e) => setNewMember({ ...newMember, overallRating: parseInt(e.target.value) || 70 })}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#404040'}
                  />
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  color: '#fbbf24', 
                  marginBottom: '12px' 
                }}>
                  Skills
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {newMember.skills.map((skill, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      background: '#333333', 
                      padding: '12px', 
                      borderRadius: '10px' 
                    }}>
                      <span style={{ flex: 1, color: '#ccc' }}>{skill.name}</span>
                      <span style={{ fontSize: '0.85rem', color: '#999' }}>{skill.level}%</span>
                      <button
                        onClick={() => removeSkill(index)}
                        style={{ 
                          color: '#ef4444', 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Skill name"
                      style={{
                        flex: 1,
                        padding: '12px 15px',
                        background: '#333333',
                        border: '1px solid #404040',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '0.9rem'
                      }}
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#404040'}
                    />
                    <input
                      type="number"
                      placeholder="Level"
                      min="0"
                      max="100"
                      style={{
                        width: '80px',
                        padding: '12px 15px',
                        background: '#333333',
                        border: '1px solid #404040',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '0.9rem'
                      }}
                      value={newSkill.level}
                      onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) || 50 })}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#404040'}
                    />
                    <button
                      onClick={addSkill}
                      className="action-btn"
                      style={{ padding: '12px' }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button
                onClick={addTeamMember}
                disabled={!newMember.name.trim() || !newMember.email.trim()}
                className="nav-btn"
                style={{ 
                  flex: 1,
                  opacity: (!newMember.name.trim() || !newMember.email.trim()) ? 0.5 : 1,
                  cursor: (!newMember.name.trim() || !newMember.email.trim()) ? 'not-allowed' : 'pointer'
                }}
              >
                Add Team Member
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setNewMember({
                    name: '',
                    email: '',
                    role: 'USER',
                    department: '',
                    position: '',
                    location: '',
                    overallRating: 70,
                    skills: []
                  })
                }}
                className="filter-btn"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
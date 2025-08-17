'use client'

import { useState, useEffect } from 'react'
import { Target, Plus, TrendingUp, Calendar, Users, Award, CheckCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Goal {
  id: string
  title: string
  description: string
  type: 'OKR' | 'Goal' | 'KPI'
  progress: number
  target: number
  current: number
  unit: string
  deadline: Date
  assignee: string
  status: 'active' | 'completed' | 'at-risk' | 'overdue'
  keyResults?: KeyResult[]
}

interface KeyResult {
  id: string
  title: string
  progress: number
  target: number
  current: number
  unit: string
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    type: 'Goal' as Goal['type'],
    target: 100,
    unit: '%',
    deadline: '',
    assignee: ''
  })

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'active': return '#667eea'
      case 'completed': return '#10b981'
      case 'at-risk': return '#f59e0b'
      case 'overdue': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />
      case 'at-risk':
      case 'overdue': return <AlertCircle size={16} />
      default: return <Target size={16} />
    }
  }

  const overallProgress = goals.length > 0 ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length : 0

  return (
    <div>
      <div className="section-header">
        <h2>
          <Target size={40} />
          Goals & OKRs
        </h2>
        <p>Track objectives and key results for your team</p>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setShowCreateModal(true)}
            className="nav-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} />
            <span>New Goal</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="analytics-grid">
        <div className="team-card">
          <div className="card-header">
            <div className="avatar">
              <Target size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Overall Progress</div>
              <div className="member-rating">
                <div className="rating-value">{Math.round(overallProgress)}%</div>
                <div className="rating-rank">Average completion</div>
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
              <div className="member-name">Active Goals</div>
              <div className="member-rating">
                <div className="rating-value">{goals.filter(g => g.status === 'active').length}</div>
                <div className="rating-rank">In progress</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar">
              <Award size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Completed</div>
              <div className="member-rating">
                <div className="rating-value">{goals.filter(g => g.status === 'completed').length}</div>
                <div className="rating-rank">Achieved goals</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar">
              <Users size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Team Members</div>
              <div className="member-rating">
                <div className="rating-value">12</div>
                <div className="rating-rank">Contributors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="analytics-row">
        <div className="chart-container large">
          <h3>
            <Target size={24} />
            Active Objectives
          </h3>
          
          {goals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.6 }}>
              <Target size={48} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
              <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>No goals set yet</p>
              <p style={{ fontSize: '0.9rem' }}>Click "New Goal" to create your first objective</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
              {goals.map((goal) => (
                <div key={goal.id} className="team-card" style={{ padding: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24' }}>{goal.title}</h4>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          background: getStatusColor(goal.status),
                          color: 'white'
                        }}>
                          {getStatusIcon(goal.status)}
                          <span style={{ textTransform: 'capitalize' }}>{goal.status}</span>
                        </span>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          background: '#404040',
                          color: '#ccc'
                        }}>
                          {goal.type}
                        </span>
                      </div>
                      <p style={{ color: '#ccc', marginBottom: '15px', fontSize: '0.9rem' }}>{goal.description}</p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '30px', fontSize: '0.85rem', color: '#999' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={14} />
                          <span>Due {format(goal.deadline, 'MMM d, yyyy')}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Users size={14} />
                          <span>{goal.assignee}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fbbf24', marginBottom: '5px' }}>
                        {goal.current}{goal.unit}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#999' }}>
                        of {goal.target}{goal.unit}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fbbf24' }}>Progress</span>
                      <span style={{ fontSize: '0.9rem', color: '#ccc' }}>{goal.progress}%</span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      background: '#333333', 
                      borderRadius: '10px', 
                      height: '12px',
                      overflow: 'hidden'
                    }}>
                      <div 
                        style={{ 
                          height: '12px', 
                          borderRadius: '10px', 
                          background: 'linear-gradient(90deg, #667eea, #764ba2)',
                          transition: 'width 0.3s ease',
                          width: `${goal.progress}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Key Results */}
                  {goal.keyResults && goal.keyResults.length > 0 && (
                    <div>
                      <h5 style={{ fontSize: '1rem', fontWeight: 600, color: '#fbbf24', marginBottom: '15px' }}>Key Results</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                        {goal.keyResults.map((kr) => (
                          <div key={kr.id} style={{ 
                            padding: '15px', 
                            background: '#333333', 
                            borderRadius: '10px',
                            border: '1px solid #404040'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                              <span style={{ fontWeight: 600, color: '#ccc', fontSize: '0.9rem' }}>{kr.title}</span>
                              <span style={{ fontSize: '0.8rem', color: '#999' }}>
                                {kr.current} / {kr.target} {kr.unit}
                              </span>
                            </div>
                            <div style={{ 
                              width: '100%', 
                              background: '#2a2a2a', 
                              borderRadius: '5px', 
                              height: '6px',
                              overflow: 'hidden'
                            }}>
                              <div 
                                style={{ 
                                  height: '6px', 
                                  borderRadius: '5px', 
                                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                                  transition: 'width 0.3s ease',
                                  width: `${kr.progress}%`
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Performance Chart */}
          <div className="chart-container">
            <h3>
              <TrendingUp size={20} />
              Performance Trends
            </h3>
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ opacity: 0.8 }}>This Week</span>
                  <span style={{ fontWeight: 'bold', color: '#10b981' }}>+12%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ opacity: 0.8 }}>This Month</span>
                  <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>+28%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ opacity: 0.8 }}>This Quarter</span>
                  <span style={{ fontWeight: 'bold', color: '#667eea' }}>+45%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="chart-container">
            <h3>
              <Award size={20} />
              Top Performers
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              {['Sarah Chen', 'Mike Johnson', 'Alex Rivera'].map((name, index) => (
                <div key={name} className="team-card" style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: index === 0 ? '#fbbf24' : index === 1 ? '#c0c0c0' : '#cd7f32',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#fbbf24', fontSize: '0.9rem' }}>{name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#999' }}>{5 - index} goals completed</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Goal Modal */}
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
            maxWidth: '500px', 
            width: '100%', 
            maxHeight: '90vh', 
            overflowY: 'auto', 
            padding: '30px',
            border: '1px solid #404040'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24', marginBottom: '20px' }}>Create New Goal</h3>
            
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
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Goal title"
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
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
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
                  placeholder="Goal description"
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
                    Type
                  </label>
                  <select
                    value={newGoal.type}
                    onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as Goal['type'] })}
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
                    <option value="Goal">Goal</option>
                    <option value="OKR">OKR</option>
                    <option value="KPI">KPI</option>
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
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.9rem', 
                    fontWeight: 600, 
                    color: '#fbbf24', 
                    marginBottom: '8px' 
                  }}>
                    Target Value
                  </label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
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
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    placeholder="%, tasks, points, etc."
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
                  Assignee
                </label>
                <input
                  type="text"
                  value={newGoal.assignee}
                  onChange={(e) => setNewGoal({ ...newGoal, assignee: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Responsible person"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                className="filter-btn"
                style={{ background: '#404040' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  toast.success('Goal created successfully!')
                }}
                className="nav-btn"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
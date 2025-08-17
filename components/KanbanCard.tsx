'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, Tag, User, MoreVertical, ArrowRight, X, Clock, Flag } from 'lucide-react'
import { format } from 'date-fns'

interface Task {
  id: string
  title: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'
  assignees: any[]
  tags: string[]
  dueDate?: string
}

interface KanbanCardProps {
  task: Task
  isDragging?: boolean
  availableColumns?: { id: string; name: string }[]
  onMoveTask?: (taskId: string, columnId: string) => void
}

const priorityColors = {
  LOW: 'bg-gray-200 text-gray-700',
  MEDIUM: 'bg-blue-200 text-blue-700',
  HIGH: 'bg-orange-200 text-orange-700',
  URGENT: 'bg-red-200 text-red-700'
}

export default function KanbanCard({ task, isDragging, availableColumns, onMoveTask }: KanbanCardProps) {
  const [showMoveMenu, setShowMoveMenu] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  }

  const handleMoveTask = (columnId: string) => {
    if (onMoveTask) {
      onMoveTask(task.id, columnId)
    }
    setShowMoveMenu(false)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open modal if clicking on move menu button
    if ((e.target as HTMLElement).closest('.move-menu-button')) {
      return
    }
    setShowTaskModal(true)
  }

  return (
    <>
      <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: '#fefefe',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f0f0f0',
        marginBottom: '0px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isDragging ? 'rotate(2deg) scale(1.02)' : style.transform
      }}
      onClick={handleCardClick}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.backgroundColor = '#ffffff';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.backgroundColor = '#fefefe';
        }
      }}
    >
      <div 
        {...attributes}
        {...listeners}
        className="cursor-move"
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '8px'
        }}>
          <h4 style={{
            fontWeight: '500',
            color: '#1f2937',
            flex: 1,
            fontSize: '14px',
            lineHeight: '1.4'
          }}>{task.title}</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            {availableColumns && onMoveTask && (
              <div className="relative move-menu-button">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMoveMenu(!showMoveMenu)
                  }}
                  className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                >
                  <MoreVertical size={16} />
                </button>
                
                {showMoveMenu && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                    <div className="py-1">
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                        Move to:
                      </div>
                      {availableColumns.map((column) => (
                        <button
                          key={column.id}
                          onClick={() => handleMoveTask(column.id)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <ArrowRight size={12} />
                          <span>{column.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {task.description && (
        <p style={{
          fontSize: '13px',
          color: '#4b5563',
          marginBottom: '12px',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        {task.tags.map((tag) => (
          <span
            key={tag}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '11px',
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              padding: '2px 8px',
              borderRadius: '4px'
            }}
          >
            <Tag size={10} style={{ marginRight: '4px' }} />
            {tag}
          </span>
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: '#6b7280'
      }}>
        {task.dueDate && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Calendar size={12} style={{ marginRight: '4px' }} />
            {format(new Date(task.dueDate), 'MMM d')}
          </div>
        )}
        
        {task.assignees.length > 0 && (
          <div style={{ display: 'flex', marginLeft: '-8px' }}>
            {task.assignees.slice(0, 3).map((assignee, index) => (
              <div
                key={index}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  border: '2px solid white',
                  marginLeft: '8px'
                }}
              >
                {assignee.name?.[0] || <User size={10} />}
              </div>
            ))}
            {task.assignees.length > 3 && (
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#d1d5db',
                color: '#4b5563',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                border: '2px solid white',
                marginLeft: '8px'
              }}>
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
      </div>

      {/* Full-Screen Immersive Task Modal */}
      {showTaskModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* Full-Screen Background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #0c0d14 0%, #1a1b2e 25%, #16213e 50%, #0f172a 75%, #0c0d14 100%)',
            overflow: 'hidden'
          }}>
          {/* Animated Background Elements */}
          <div style={{
            position: 'absolute',
            width: '200%',
            height: '200%',
            background: `
              radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 80% 60%, rgba(168, 85, 247, 0.12) 0%, transparent 40%),
              radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 40%),
              radial-gradient(circle at 90% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 40%)
            `,
            animation: 'float 20s ease-in-out infinite'
          }} />
          
          {/* Floating Particles */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.3), transparent),
              radial-gradient(2px 2px at 40% 70%, rgba(59, 130, 246, 0.4), transparent),
              radial-gradient(1px 1px at 90% 40%, rgba(168, 85, 247, 0.3), transparent),
              radial-gradient(1px 1px at 50% 50%, rgba(255, 255, 255, 0.2), transparent)
            `,
            backgroundSize: '100px 100px, 150px 150px, 80px 80px, 120px 120px',
            animation: 'stars 30s linear infinite'
          }} />
        </div>

        {/* Main Content Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10
        }}>
          {/* Top Navigation Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 40px',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: task.priority === 'URGENT' ? '#ef4444' : 
                               task.priority === 'HIGH' ? '#f59e0b' :
                               task.priority === 'MEDIUM' ? '#3b82f6' : '#64748b',
                boxShadow: `0 0 24px ${task.priority === 'URGENT' ? '#ef4444' : 
                                     task.priority === 'HIGH' ? '#f59e0b' :
                                     task.priority === 'MEDIUM' ? '#3b82f6' : '#64748b'}80`,
                animation: 'pulse 2s infinite'
              }} />
              <span style={{
                fontSize: '14px',
                color: '#94a3b8',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.15em'
              }}>
                {task.priority} Priority Task
              </span>
            </div>
            <button
              onClick={() => setShowTaskModal(false)}
              style={{
                color: '#94a3b8',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                cursor: 'pointer',
                padding: '16px',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <X size={28} />
            </button>
          </div>

          {/* Hero Section */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '80px 40px',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%'
          }}>
            {/* Task Title */}
            <h1 style={{
              fontSize: '64px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '32px',
              lineHeight: '1.1',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {task.title}
            </h1>

            {/* Status Badges */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '24px', 
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: '48px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                padding: '12px 24px',
                borderRadius: '30px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                backdropFilter: 'blur(20px)'
              }}>
                <Clock size={20} style={{ color: '#60a5fa' }} />
                <span style={{ fontSize: '16px', color: '#bfdbfe', fontWeight: '600' }}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
              {task.dueDate && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  backdropFilter: 'blur(20px)'
                }}>
                  <Calendar size={20} style={{ color: '#f87171' }} />
                  <span style={{ fontSize: '16px', color: '#fca5a5', fontWeight: '600' }}>
                    Due {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {task.description && (
              <div style={{
                maxWidth: '800px',
                width: '100%'
              }}>
                <div style={{
                  background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)',
                  padding: '40px',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(30px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                }}>
                  <h3 style={{ 
                    fontSize: '24px', 
                    fontWeight: '600', 
                    color: '#ffffff', 
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '24px',
                      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                      borderRadius: '3px'
                    }} />
                    Task Description
                    <div style={{
                      width: '6px',
                      height: '24px',
                      background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
                      borderRadius: '3px'
                    }} />
                  </h3>
                  <p style={{ 
                    color: '#e2e8f0', 
                    lineHeight: '1.8',
                    fontSize: '18px',
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                    textAlign: 'left'
                  }}>
                    {task.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  )
}
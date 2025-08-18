'use client'

import { useState } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import KanbanCard from './KanbanCard'
import { Plus, Sparkles, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

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

interface Column {
  id: string
  name: string
  color: string
  tasks: Task[]
}

interface KanbanColumnProps {
  column: Column
  onAddTask: (task: Partial<Task>) => void
  availableColumns?: { id: string; name: string }[]
  onMoveTask?: (taskId: string, columnId: string) => void
}

export default function KanbanColumn({ column, onAddTask, availableColumns, onMoveTask }: KanbanColumnProps) {
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '' })
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  
  const { setNodeRef } = useDroppable({
    id: column.id,
  })

  const handleAddTask = () => {
    if (!newTask.title.trim()) return
    
    onAddTask({
      title: newTask.title,
      description: newTask.description,
      priority: 'MEDIUM',
      status: 'TODO'
    })
    
    setNewTask({ title: '', description: '' })
    setShowAddTask(false)
  }

  const generateAIDescription = async () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title first')
      return
    }

    setIsGeneratingDescription(true)
    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask.title })
      })

      if (response.ok) {
        const data = await response.json()
        setNewTask({ ...newTask, description: data.description })
        toast.success('Description generated!')
      } else {
        // Fallback description
        const simpleDescription = `Complete the task: ${newTask.title}. Please provide detailed implementation and ensure all requirements are met.`
        setNewTask({ ...newTask, description: simpleDescription })
        toast.success('Description generated!')
      }
    } catch (error) {
      // Fallback description
      const simpleDescription = `Complete the task: ${newTask.title}. Please provide detailed implementation and ensure all requirements are met.`
      setNewTask({ ...newTask, description: simpleDescription })
      toast.success('Description generated!')
    } finally {
      setIsGeneratingDescription(false)
    }
  }

  // Define task area background based on column theme
  const getTaskAreaBackground = () => {
    if (column.name.toLowerCase().includes('to do') || column.name.toLowerCase() === 'todo') {
      return 'rgba(254, 242, 242, 0.8)'; // Very light red
    } else if (column.name.toLowerCase().includes('in progress')) {
      return 'rgba(255, 251, 235, 0.8)'; // Very light orange
    } else if (column.name.toLowerCase().includes('review')) {
      return 'rgba(239, 246, 255, 0.8)'; // Very light blue
    } else if (column.name.toLowerCase().includes('done')) {
      return 'rgba(240, 253, 244, 0.8)'; // Very light green
    }
    return 'rgba(249, 250, 251, 0.8)'; // Default light gray
  };

  // Define column-specific styles based on column name
  const getColumnStyles = () => {
    const baseStyles = {
      borderRadius: '16px',
      padding: '24px',
      minWidth: '340px',
      maxWidth: '340px',
      height: 'fit-content',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden'
    };
    
    // Modern gradient styles based on column name
    if (column.name.toLowerCase().includes('to do') || column.name.toLowerCase() === 'todo') {
      return {
        ...baseStyles,
        background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
        border: '1px solid #475569',
        boxShadow: '0 10px 25px -5px rgba(30, 41, 59, 0.25), 0 4px 15px -5px rgba(30, 41, 59, 0.15)',
        '::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #f97316 0%, #fb923c 100%)'
        }
      };
    } else if (column.name.toLowerCase().includes('in progress')) {
      return {
        ...baseStyles,
        background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
        border: '1px solid #334155',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25), 0 4px 15px -5px rgba(15, 23, 42, 0.15)'
      };
    } else if (column.name.toLowerCase().includes('review')) {
      return {
        ...baseStyles,
        background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 100%)',
        border: '1px solid #4338ca',
        boxShadow: '0 10px 25px -5px rgba(30, 27, 75, 0.25), 0 4px 15px -5px rgba(30, 27, 75, 0.15)'
      };
    } else if (column.name.toLowerCase().includes('done')) {
      return {
        ...baseStyles,
        background: 'linear-gradient(145deg, #064e3b 0%, #065f46 100%)',
        border: '1px solid #059669',
        boxShadow: '0 10px 25px -5px rgba(6, 78, 59, 0.25), 0 4px 15px -5px rgba(6, 78, 59, 0.15)'
      };
    }
    
    return {
      ...baseStyles,
      background: 'linear-gradient(145deg, #374151 0%, #4b5563 100%)',
      border: '1px solid #6b7280',
      boxShadow: '0 10px 25px -5px rgba(55, 65, 81, 0.25)'
    };
  };

  return (
    <div
      ref={setNodeRef}
      style={getColumnStyles()}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: column.color || '#6b7280',
              boxShadow: `0 0 12px ${column.color || '#6b7280'}60`,
              animation: 'pulse 2s infinite'
            }}
          />
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#ffffff',
            margin: 0,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
          }}>{column.name}</h3>
          <span style={{
            fontSize: '12px',
            color: '#e2e8f0',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontWeight: '600',
            backdropFilter: 'blur(10px)'
          }}>{column.tasks.length}</span>
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          style={{
            backgroundColor: column.color || '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        >
          <Plus size={18} />
        </button>
      </div>

      <SortableContext
        items={column.tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          minHeight: '250px',
          padding: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)'
        }}>
          {column.tasks.length === 0 ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100px',
              color: '#6b7280',
              fontSize: '14px',
              fontStyle: 'italic',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '6px',
              border: `1px dashed ${column.color || '#d1d5db'}60`,
              textAlign: 'center'
            }}>
              Drop tasks here or click + to add
            </div>
          ) : (
            column.tasks.map((task) => (
              <KanbanCard 
                key={task.id} 
                task={task} 
                availableColumns={availableColumns}
                onMoveTask={onMoveTask}
              />
            ))
          )}
        </div>
      </SortableContext>

      {showAddTask && (
        <div style={{
          marginTop: '12px',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <input
            type="text"
            placeholder="Task title..."
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#1f2937',
              backgroundColor: 'white',
              outline: 'none'
            }}
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            onFocus={(e) => e.target.style.borderColor = column.color || '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            autoFocus
          />
          
          <div style={{ position: 'relative', marginBottom: '8px' }}>
            <textarea
              placeholder="Description (optional)..."
              style={{
                width: '100%',
                padding: '8px 12px',
                paddingRight: '50px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                resize: 'none',
                fontSize: '14px',
                color: '#1f2937',
                backgroundColor: 'white',
                outline: 'none',
                minHeight: '80px'
              }}
              rows={3}
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              onFocus={(e) => e.target.style.borderColor = column.color || '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <button
              onClick={generateAIDescription}
              disabled={isGeneratingDescription || !newTask.title.trim()}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#f3e8ff',
                color: '#7c3aed',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                border: 'none',
                cursor: isGeneratingDescription || !newTask.title.trim() ? 'not-allowed' : 'pointer',
                opacity: isGeneratingDescription || !newTask.title.trim() ? 0.5 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isGeneratingDescription && newTask.title.trim()) {
                  e.currentTarget.style.backgroundColor = '#e9d5ff';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f3e8ff';
              }}
              title="Generate AI description"
            >
              {isGeneratingDescription ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              <span>AI</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAddTask}
              style={{
                flex: 1,
                backgroundColor: column.color || '#3b82f6',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Add Task
            </button>
            <button
              onClick={() => {
                setShowAddTask(false)
                setNewTask({ title: '', description: '' })
              }}
              style={{
                flex: 1,
                backgroundColor: '#e5e7eb',
                color: '#4b5563',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
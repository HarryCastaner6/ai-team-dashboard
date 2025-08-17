'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import KanbanColumn from './KanbanColumn'
import KanbanCard from './KanbanCard'
import { Plus, Archive, ChevronDown, ChevronUp, Calendar, Sparkles, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Board {
  id: string
  name: string
}

interface Column {
  id: string
  name: string
  position: number
  color: string
  tasks: Task[]
}

interface Task {
  id: string
  title: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'
  assignees: any[]
  tags: string[]
  dueDate?: string
  completedAt?: string
  archivedAt?: string
  isArchived?: boolean
  todoAddedAt?: string
}

export default function KanbanBoard({ board }: { board: Board }) {
  const [columns, setColumns] = useState<Column[]>([])
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [archivedTasks, setArchivedTasks] = useState<Record<string, Task[]>>({})
  const [showArchived, setShowArchived] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '' })
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)

  useEffect(() => {
    fetchColumns()
    fetchArchivedTasks()
  }, [board.id])

  const fetchColumns = async () => {
    try {
      const response = await fetch(`/api/boards/${board.id}/columns`)
      if (response.ok) {
        const data = await response.json()
        setColumns(data)
      }
    } catch (error) {
      toast.error('Failed to fetch columns')
    }
  }

  const fetchArchivedTasks = async () => {
    try {
      const response = await fetch('/api/tasks/archive')
      if (response.ok) {
        const data = await response.json()
        setArchivedTasks(data)
      }
    } catch (error) {
      console.error('Failed to fetch archived tasks:', error)
    }
  }


  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = columns
      .flatMap(col => col.tasks)
      .find(task => task.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) {
      setActiveTask(null)
      return
    }

    const activeColumnIndex = columns.findIndex(col =>
      col.tasks.some(task => task.id === active.id)
    )
    const overColumnIndex = columns.findIndex(col =>
      col.id === over.id || col.tasks.some(task => task.id === over.id)
    )

    if (activeColumnIndex === -1 || overColumnIndex === -1) {
      setActiveTask(null)
      return
    }

    const newColumns = [...columns]
    const [movedTask] = newColumns[activeColumnIndex].tasks.splice(
      newColumns[activeColumnIndex].tasks.findIndex(task => task.id === active.id),
      1
    )

    newColumns[overColumnIndex].tasks.push(movedTask)
    setColumns(newColumns)
    setActiveTask(null)

    try {
      await fetch(`/api/tasks/${active.id}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          columnId: newColumns[overColumnIndex].id
        })
      })
    } catch (error) {
      toast.error('Failed to move task')
    }
  }

  const addTask = async (columnId: string, taskData: Partial<Task>) => {
    try {
      const response = await fetch(`/api/columns/${columnId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })

      if (response.ok) {
        const task = await response.json()
        const newColumns = columns.map(col => {
          if (col.id === columnId) {
            return { ...col, tasks: [...col.tasks, task] }
          }
          return col
        })
        setColumns(newColumns)
        toast.success('Task added successfully')
      }
    } catch (error) {
      toast.error('Failed to add task')
    }
  }

  const moveTaskToColumn = async (taskId: string, targetColumnId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columnId: targetColumnId })
      })

      if (response.ok) {
        // Update local state
        const updatedTask = await response.json()
        const newColumns = columns.map(col => ({
          ...col,
          tasks: col.tasks.filter(task => task.id !== taskId)
        }))
        
        const targetColumn = newColumns.find(col => col.id === targetColumnId)
        if (targetColumn) {
          targetColumn.tasks.push(updatedTask)
        }
        
        setColumns(newColumns)
        toast.success('Task moved successfully')
      }
    } catch (error) {
      toast.error('Failed to move task')
    }
  }

  const handleAddTaskToToDo = async () => {
    if (!newTask.title.trim()) return
    
    // Find the To Do column
    const todoColumn = columns.find(col => col.name.toLowerCase().includes('to do'))
    if (!todoColumn) {
      toast.error('To Do column not found')
      return
    }

    try {
      const response = await fetch(`/api/columns/${todoColumn.id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          priority: 'MEDIUM',
          status: 'TODO'
        })
      })

      if (response.ok) {
        const task = await response.json()
        const newColumns = columns.map(col => {
          if (col.id === todoColumn.id) {
            return { ...col, tasks: [...col.tasks, task] }
          }
          return col
        })
        setColumns(newColumns)
        setNewTask({ title: '', description: '' })
        setShowAddTask(false)
        toast.success('Task added to To Do successfully')
      }
    } catch (error) {
      toast.error('Failed to add task')
    }
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
        body: JSON.stringify({ 
          title: newTask.title,
          context: 'This is a task for the To Do column in task management.'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setNewTask({ ...newTask, description: data.description })
        toast.success('AI description generated!')
      } else {
        toast.error('Failed to generate description')
      }
    } catch (error) {
      toast.error('Failed to generate description')
    } finally {
      setIsGeneratingDescription(false)
    }
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        border: '1px solid #e5e7eb'
      }}>
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0,
            marginBottom: '4px'
          }}>{board.name}</h2>
          <div style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Task Management Board: To Do → In Progress → Done
          </div>
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.3)';
          }}
        >
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div style={{ 
          display: 'flex', 
          gap: '24px', 
          overflowX: 'auto', 
          padding: '32px', 
          minHeight: '600px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          borderRadius: '20px',
          border: '1px solid #334155',
          boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3), 0 10px 40px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddTask={(taskData) => addTask(column.id, taskData)}
              availableColumns={columns.filter(col => col.id !== column.id).map(col => ({ id: col.id, name: col.name }))}
              onMoveTask={moveTaskToColumn}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && <KanbanCard task={activeTask} isDragging />}
        </DragOverlay>
      </DndContext>

      {/* Add Task Modal */}
      {showAddTask && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '450px',
            margin: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>Add New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter task title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    placeholder="Enter task description..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                  <button
                    onClick={generateAIDescription}
                    disabled={isGeneratingDescription || !newTask.title.trim()}
                    className="absolute top-2 right-2 flex items-center space-x-1 bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs hover:bg-purple-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Generate AI description"
                  >
                    {isGeneratingDescription ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    <span>Generate with AI</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter a title first, then use AI to generate a description
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={handleAddTaskToToDo}
                disabled={!newTask.title.trim()}
                style={{
                  flex: 1,
                  backgroundColor: !newTask.title.trim() ? '#9ca3af' : '#ef4444',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: !newTask.title.trim() ? 'not-allowed' : 'pointer',
                  opacity: !newTask.title.trim() ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                  boxShadow: !newTask.title.trim() ? 'none' : '0 2px 4px rgba(239, 68, 68, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (newTask.title.trim()) {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (newTask.title.trim()) {
                    e.currentTarget.style.backgroundColor = '#ef4444';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.3)';
                  }
                }}
              >
                Add to To Do
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
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
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
        </div>
      )}

      {/* Archived Tasks Section */}
      {Object.keys(archivedTasks).length > 0 && (
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Archive className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">Task Archive</h3>
              <span className="text-sm text-gray-500">
                (Tasks that were in To Do for 24+ hours - {Object.values(archivedTasks).flat().length} total)
              </span>
            </div>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition"
            >
              <span className="text-sm">{showArchived ? 'Hide' : 'Show'}</span>
              {showArchived ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showArchived && (
            <div className="space-y-6">
              {Object.entries(archivedTasks)
                .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                .map(([date, tasks]) => (
                  <div key={date} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <h4 className="font-medium text-gray-900">
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h4>
                      <span className="text-sm text-gray-500">({tasks.length} tasks)</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {tasks.map((task) => (
                        <div key={task.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                          <h5 className="font-medium text-gray-900 text-sm mb-1">{task.title}</h5>
                          {task.description && (
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Priority: {task.priority}</span>
                            <span>
                              Added to To Do: {task.todoAddedAt ? new Date(task.todoAddedAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
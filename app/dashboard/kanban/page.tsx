'use client'

import { useState, useEffect } from 'react'
import { Plus, MoreVertical, Edit2, Trash2, Users } from 'lucide-react'
import KanbanBoard from '@/components/KanbanBoard'
import toast from 'react-hot-toast'

interface Board {
  id: string
  name: string
  description?: string
  isPublic: boolean
  canEdit?: boolean
}

export default function KanbanPage() {
  const [boards, setBoards] = useState<Board[]>([])
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAccessModal, setShowAccessModal] = useState(false)
  const [newBoard, setNewBoard] = useState({ name: '', description: '', isPublic: false })

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      const response = await fetch('/api/boards')
      if (response.ok) {
        const data = await response.json()
        setBoards(data)
      }
    } catch (error) {
      toast.error('Failed to fetch boards')
    }
  }

  const createBoard = async () => {
    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBoard)
      })
      
      if (response.ok) {
        const board = await response.json()
        setBoards([...boards, board])
        setShowCreateModal(false)
        setNewBoard({ name: '', description: '', isPublic: false })
        toast.success('Board created successfully')
      }
    } catch (error) {
      toast.error('Failed to create board')
    }
  }

  const deleteBoard = async (boardId: string) => {
    if (!confirm('Are you sure you want to delete this board?')) return
    
    try {
      const response = await fetch(`/api/boards/${boardId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setBoards(boards.filter(b => b.id !== boardId))
        if (selectedBoard?.id === boardId) {
          setSelectedBoard(null)
        }
        toast.success('Board deleted successfully')
      }
    } catch (error) {
      toast.error('Failed to delete board')
    }
  }

  return (
    <div style={{ height: '100%' }}>
      <div className="section-header">
        <h2>
          <Edit2 size={40} />
          Taskboards
        </h2>
        <p>Manage your tasks and projects with drag-and-drop boards</p>
      </div>

      {!selectedBoard ? (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '30px' 
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#fbbf24' }}>
              Your Boards
            </h3>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
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
              <Plus size={20} />
              <span>Create Board</span>
            </button>
          </div>

          <div className="team-grid">
            {boards.map((board) => (
              <div
                key={board.id}
                className="team-card"
                onClick={() => setSelectedBoard(board)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-header">
                  <div className="avatar">
                    <Edit2 size={24} />
                  </div>
                  <div className="member-info">
                    <div className="member-name">{board.name}</div>
                    <div className="member-niche">
                      {board.isPublic ? 'Public Board' : 'Private Board'}
                    </div>
                    {board.description && (
                      <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '5px' }}>
                        {board.description}
                      </p>
                    )}
                  </div>
                  <div className="card-actions">
                    {board.canEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowAccessModal(true)
                        }}
                        className="action-btn"
                      >
                        <Users size={16} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteBoard(board.id)
                      }}
                      className="action-btn"
                      style={{ background: '#ef4444' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  {board.description || 'No description'}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    board.isPublic 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {board.isPublic ? 'Public' : 'Private'}
                  </span>
                  
                  <button
                    onClick={() => setSelectedBoard(board)}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#3b82f6';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Open Board →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedBoard(null)}
            style={{
              marginBottom: '16px',
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              border: '1px solid #d1d5db',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
              e.currentTarget.style.color = '#1f2937';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#4b5563';
            }}
          >
            ← Back to boards
          </button>
          <KanbanBoard board={selectedBoard} />
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Board</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Board Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  value={newBoard.name}
                  onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  rows={3}
                  value={newBoard.description}
                  onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  className="mr-2"
                  checked={newBoard.isPublic}
                  onChange={(e) => setNewBoard({ ...newBoard, isPublic: e.target.checked })}
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">
                  Make this board public
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={createBoard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
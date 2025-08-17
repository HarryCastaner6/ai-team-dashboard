'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Hash, User, Users, Search, Plus, Paperclip, Smile, Phone, Video, Settings, Bell, Pin, AtSign, MessageCircle, Bot, Sparkles, Brain } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Message {
  id: string
  content: string
  type: 'text' | 'file' | 'image' | 'system'
  sender: {
    id: string
    name: string
    avatar?: string
    status: 'online' | 'away' | 'offline'
  }
  timestamp: Date
  edited?: boolean
  reactions?: { emoji: string; count: number; users: string[] }[]
  replyTo?: string
  mentions?: string[]
  channelId: string
}

interface Channel {
  id: string
  name: string
  type: 'public' | 'private' | 'direct' | 'ai'
  description?: string
  members: string[]
  unreadCount: number
  lastMessage?: Message
  createdAt: Date
}

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  status: 'online' | 'away' | 'offline'
  role: string
}

export default function TeamChatPage() {
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: 'general',
      name: 'general',
      type: 'public',
      description: 'General team discussions',
      members: ['user1', 'user2', 'user3'],
      unreadCount: 0,
      createdAt: new Date()
    },
    {
      id: 'development',
      name: 'development',
      type: 'public',
      description: 'Development discussions and updates',
      members: ['user1', 'user2'],
      unreadCount: 2,
      createdAt: new Date()
    },
    {
      id: 'ai-assistant',
      name: 'AI Assistant',
      type: 'ai',
      description: 'Chat with AI assistants',
      members: ['user1'],
      unreadCount: 0,
      createdAt: new Date()
    }
  ])

  const [users] = useState<User[]>([
    {
      id: 'user1',
      name: 'You',
      email: 'you@company.com',
      status: 'online',
      role: 'Admin'
    },
    {
      id: 'user2',
      name: 'Team Member',
      email: 'member@company.com',
      status: 'online',
      role: 'Developer'
    },
    {
      id: 'user3',
      name: 'Project Manager',
      email: 'pm@company.com',
      status: 'away',
      role: 'Manager'
    }
  ])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to the team chat! Feel free to discuss anything here.',
      type: 'text',
      sender: users[1],
      timestamp: new Date(Date.now() - 3600000),
      channelId: 'general'
    },
    {
      id: '2',
      content: 'Hi everyone! Ready for the sprint planning today?',
      type: 'text',
      sender: users[2],
      timestamp: new Date(Date.now() - 1800000),
      channelId: 'general'
    }
  ])
  
  const [activeChannel, setActiveChannel] = useState<Channel>(channels[0])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAIModel, setSelectedAIModel] = useState<'chatgpt' | 'gemini'>('chatgpt')
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      type: 'text',
      sender: users[0],
      timestamp: new Date(),
      channelId: activeChannel.id
    }

    setMessages(prev => [...prev, newMessage])
    setInput('')

    // Handle AI responses for AI channels
    if (activeChannel.type === 'ai') {
      setIsLoading(true)
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `This is a simulated AI response using ${selectedAIModel}. In a real implementation, this would connect to the actual AI API.`,
          type: 'text',
          sender: {
            id: 'ai',
            name: selectedAIModel === 'chatgpt' ? 'ChatGPT' : 'Gemini',
            status: 'online'
          },
          timestamp: new Date(),
          channelId: activeChannel.id
        }
        setMessages(prev => [...prev, aiResponse])
        setIsLoading(false)
      }, 1000)
    }

    toast.success('Message sent!')
  }

  const createChannel = () => {
    const channelName = prompt('Channel name:')
    if (!channelName) return

    const newChannel: Channel = {
      id: channelName.toLowerCase().replace(/\s+/g, '-'),
      name: channelName.toLowerCase(),
      type: 'public',
      description: '',
      members: ['user1'],
      unreadCount: 0,
      createdAt: new Date()
    }

    setChannels(prev => [...prev, newChannel])
    setActiveChannel(newChannel)
    toast.success('Channel created!')
  }

  const getChannelIcon = (channel: Channel) => {
    switch (channel.type) {
      case 'public': return <Hash size={16} />
      case 'private': return <Users size={16} />
      case 'direct': return <User size={16} />
      case 'ai': return selectedAIModel === 'chatgpt' ? <Brain size={16} /> : <Sparkles size={16} />
      default: return <Hash size={16} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10b981'
      case 'away': return '#f59e0b'
      case 'offline': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const channelMessages = messages.filter(msg => msg.channelId === activeChannel.id)

  return (
    <div>
      <div className="section-header">
        <h2>
          <MessageCircle size={40} />
          Team Chat & AI Assistant
        </h2>
        <p>Collaborate with your team and chat with AI assistants</p>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={createChannel}
            className="nav-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} />
            <span>Create Channel</span>
          </button>
        </div>
      </div>

      {/* Chat Overview Cards */}
      <div className="analytics-grid">
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <Hash size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Active Channels</div>
              <div className="member-rating">
                <div className="rating-value">{channels.filter(c => c.type === 'public').length}</div>
                <div className="rating-rank">Public channels</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <Users size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Team Members</div>
              <div className="member-rating">
                <div className="rating-value">{users.filter(u => u.status === 'online').length}</div>
                <div className="rating-rank">Online now</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <MessageCircle size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Messages</div>
              <div className="member-rating">
                <div className="rating-value">{messages.length}</div>
                <div className="rating-rank">Total sent</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              <Brain size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">AI Assistant</div>
              <div className="member-rating">
                <div className="rating-value">{selectedAIModel}</div>
                <div className="rating-rank">Active model</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="analytics-row">
        {/* Channels Sidebar */}
        <div className="chart-container">
          <h3>
            <Hash size={20} />
            Channels
          </h3>
          
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Search size={16} style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#999' 
            }} />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 15px 10px 40px',
                background: '#333333',
                border: '1px solid #404040',
                borderRadius: '10px',
                color: 'white',
                fontSize: '0.9rem'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#404040'}
            />
          </div>

          {/* Channel List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredChannels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => setActiveChannel(channel)}
                className="team-card"
                style={{ 
                  padding: '12px',
                  cursor: 'pointer',
                  background: activeChannel.id === channel.id ? '#333333' : '#2a2a2a',
                  border: activeChannel.id === channel.id ? '1px solid #667eea' : '1px solid #404040'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ color: '#667eea' }}>
                    {getChannelIcon(channel)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, color: '#fbbf24', fontSize: '0.9rem' }}>
                        {channel.name}
                      </span>
                      {channel.unreadCount > 0 && (
                        <span style={{
                          background: '#ef4444',
                          color: 'white',
                          fontSize: '0.7rem',
                          padding: '2px 6px',
                          borderRadius: '10px'
                        }}>
                          {channel.unreadCount}
                        </span>
                      )}
                    </div>
                    {channel.description && (
                      <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '2px' }}>
                        {channel.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Team Members */}
          <div style={{ marginTop: '30px' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#fbbf24', marginBottom: '15px', fontWeight: 600 }}>
              Team ({users.filter(u => u.status === 'online').length} online)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {users.map((user) => (
                <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px' }}>
                  <div style={{ position: 'relative' }}>
                    <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                      {user.name[0]}
                    </div>
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '-2px', 
                      right: '-2px', 
                      width: '12px', 
                      height: '12px', 
                      background: getStatusColor(user.status),
                      borderRadius: '50%',
                      border: '2px solid #2a2a2a'
                    }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ccc' }}>{user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#999' }}>{user.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="chart-container large" style={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
          {/* Chat Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '20px',
            borderBottom: '1px solid #404040',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: '#667eea' }}>
                {getChannelIcon(activeChannel)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24' }}>
                  {activeChannel.name}
                </h3>
                {activeChannel.description && (
                  <p style={{ fontSize: '0.85rem', color: '#ccc' }}>{activeChannel.description}</p>
                )}
                {activeChannel.type === 'ai' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#999' }}>Model:</span>
                    <button
                      onClick={() => setSelectedAIModel('chatgpt')}
                      className={selectedAIModel === 'chatgpt' ? 'filter-btn active' : 'filter-btn'}
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    >
                      ChatGPT
                    </button>
                    <button
                      onClick={() => setSelectedAIModel('gemini')}
                      className={selectedAIModel === 'gemini' ? 'filter-btn active' : 'filter-btn'}
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    >
                      Gemini
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {activeChannel.type !== 'ai' && (
                <>
                  <button className="action-btn">
                    <Phone size={16} />
                  </button>
                  <button className="action-btn">
                    <Video size={16} />
                  </button>
                </>
              )}
              <button className="action-btn">
                <Settings size={16} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '0 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            {channelMessages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', marginTop: '60px' }}>
                <MessageCircle size={48} style={{ opacity: 0.5, margin: '0 auto 15px' }} />
                <p>No messages yet</p>
                <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Start the conversation!</p>
              </div>
            ) : (
              channelMessages.map((message, index) => {
                const showAvatar = index === 0 || channelMessages[index - 1].sender.id !== message.sender.id
                const isAI = message.sender.id === 'ai'

                return (
                  <div key={message.id} style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flexShrink: 0 }}>
                      {showAvatar ? (
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: isAI ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'linear-gradient(135deg, #10b981, #059669)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 600
                        }}>
                          {isAI ? (
                            selectedAIModel === 'chatgpt' ? <Brain size={20} /> : <Sparkles size={20} />
                          ) : (
                            message.sender.name[0]
                          )}
                        </div>
                      ) : (
                        <div style={{ width: '40px' }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      {showAvatar && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, color: '#fbbf24' }}>{message.sender.name}</span>
                          <span style={{ fontSize: '0.75rem', color: '#999' }}>
                            {format(message.timestamp, 'h:mm a')}
                          </span>
                        </div>
                      )}
                      <div style={{
                        background: '#333333',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        border: '1px solid #404040'
                      }}>
                        <p style={{ color: '#ccc', lineHeight: 1.5 }}>{message.content}</p>
                        {message.edited && (
                          <span style={{ fontSize: '0.7rem', color: '#999', marginLeft: '8px' }}>(edited)</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            
            {isLoading && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {selectedAIModel === 'chatgpt' ? <Brain size={20} /> : <Sparkles size={20} />}
                </div>
                <div style={{
                  background: '#333333',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  border: '1px solid #404040'
                }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      background: '#999', 
                      borderRadius: '50%',
                      animation: 'pulse 1.5s infinite'
                    }} />
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      background: '#999', 
                      borderRadius: '50%',
                      animation: 'pulse 1.5s infinite 0.5s'
                    }} />
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      background: '#999', 
                      borderRadius: '50%',
                      animation: 'pulse 1.5s infinite 1s'
                    }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div style={{ 
            padding: '20px',
            borderTop: '1px solid #404040',
            marginTop: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'end', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <button className="action-btn">
                    <Paperclip size={16} />
                  </button>
                  <button className="action-btn">
                    <Smile size={16} />
                  </button>
                  <button className="action-btn">
                    <AtSign size={16} />
                  </button>
                </div>
                <textarea
                  placeholder={`Message ${activeChannel.name}...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '0.9rem',
                    resize: 'none',
                    minHeight: '44px',
                    fontFamily: 'inherit'
                  }}
                  rows={1}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="nav-btn"
                style={{ 
                  padding: '12px',
                  opacity: (isLoading || !input.trim()) ? 0.5 : 1,
                  cursor: (isLoading || !input.trim()) ? 'not-allowed' : 'pointer'
                }}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* AI Quick Actions Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="chart-container">
            <h3>
              <Brain size={20} />
              AI Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => {
                  setActiveChannel(channels.find(c => c.type === 'ai') || channels[0])
                  toast.success('Switched to AI chat')
                }}
              >
                <Brain size={16} />
                <span>Chat with AI</span>
              </button>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => toast.success('AI code review started')}
              >
                <Sparkles size={16} />
                <span>Code Review</span>
              </button>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => toast.success('AI analysis started')}
              >
                <MessageCircle size={16} />
                <span>Analyze Chat</span>
              </button>
            </div>
          </div>

          <div className="chart-container">
            <h3>
              <Settings size={20} />
              Chat Settings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>Notifications</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>Enabled</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>Auto-scroll</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>On</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>Message history</span>
                <span style={{ fontWeight: 'bold', color: '#667eea' }}>30 days</span>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <h3>
              <Hash size={20} />
              Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
              {channels.slice(0, 3).map((channel) => (
                <div key={channel.id} className="team-card" style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ color: '#667eea' }}>
                      {getChannelIcon(channel)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.85rem', color: '#ccc', display: 'block' }}>
                        #{channel.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#999' }}>
                        {channel.members.length} members
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
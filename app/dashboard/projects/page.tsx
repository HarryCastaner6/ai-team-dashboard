'use client'

import { useState } from 'react'
import { 
  Sparkles, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  Zap,
  Plus,
  TrendingUp
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ProjectTask {
  id: string
  name: string
  assignee: string
  timeEstimate: number
  description: string
  dependencies?: string[]
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

interface ProjectBreakdown {
  projectName: string
  description: string
  timeline: {
    start: string
    end: string
    duration: number
  }
  phases: {
    name: string
    duration: number
    tasks: ProjectTask[]
  }[]
  teamAllocation: {
    member: string
    role: string
    allocation: number
    tasks: string[]
  }[]
  risks?: string[]
  milestones?: {
    name: string
    date: string
  }[]
}

export default function ProjectsPage() {
  const [projectInput, setProjectInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [breakdown, setBreakdown] = useState<ProjectBreakdown | null>(null)

  const analyzeProject = async () => {
    if (!projectInput.trim()) {
      toast.error('Please enter a project description')
      return
    }

    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/projects/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: projectInput })
      })

      if (response.ok) {
        const data = await response.json()
        setBreakdown(data)
        toast.success('Project analyzed successfully!')
      } else {
        toast.error('Failed to analyze project')
      }
    } catch (error) {
      toast.error('An error occurred during analysis')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const mockBreakdown: ProjectBreakdown = {
    projectName: "E-commerce Platform Development",
    description: "Build a modern e-commerce platform with user authentication, product catalog, shopping cart, and payment integration",
    timeline: {
      start: "2024-01-15",
      end: "2024-04-15",
      duration: 90
    },
    phases: [
      {
        name: "Planning & Design",
        duration: 14,
        tasks: [
          {
            id: "1",
            name: "Requirements gathering",
            assignee: "Product Manager",
            timeEstimate: 3,
            description: "Gather and document all project requirements",
            priority: "HIGH"
          },
          {
            id: "2",
            name: "UI/UX Design",
            assignee: "Design Team",
            timeEstimate: 7,
            description: "Create wireframes and high-fidelity designs",
            priority: "HIGH"
          },
          {
            id: "3",
            name: "Technical architecture",
            assignee: "Tech Lead",
            timeEstimate: 4,
            description: "Define system architecture and tech stack",
            priority: "HIGH"
          }
        ]
      },
      {
        name: "Backend Development",
        duration: 30,
        tasks: [
          {
            id: "4",
            name: "Database setup",
            assignee: "Backend Developer",
            timeEstimate: 3,
            description: "Design and implement database schema",
            priority: "HIGH"
          },
          {
            id: "5",
            name: "API development",
            assignee: "Backend Team",
            timeEstimate: 15,
            description: "Develop RESTful APIs for all features",
            priority: "HIGH"
          },
          {
            id: "6",
            name: "Payment integration",
            assignee: "Senior Developer",
            timeEstimate: 7,
            description: "Integrate payment gateway (Stripe/PayPal)",
            priority: "MEDIUM"
          },
          {
            id: "7",
            name: "Authentication system",
            assignee: "Backend Developer",
            timeEstimate: 5,
            description: "Implement secure authentication with JWT",
            priority: "HIGH"
          }
        ]
      },
      {
        name: "Frontend Development",
        duration: 35,
        tasks: [
          {
            id: "8",
            name: "Component development",
            assignee: "Frontend Team",
            timeEstimate: 20,
            description: "Build all UI components and pages",
            priority: "HIGH"
          },
          {
            id: "9",
            name: "State management",
            assignee: "Frontend Developer",
            timeEstimate: 5,
            description: "Implement state management with Redux/Zustand",
            priority: "MEDIUM"
          },
          {
            id: "10",
            name: "API integration",
            assignee: "Frontend Team",
            timeEstimate: 10,
            description: "Connect frontend with backend APIs",
            priority: "HIGH"
          }
        ]
      },
      {
        name: "Testing & Deployment",
        duration: 11,
        tasks: [
          {
            id: "11",
            name: "Unit testing",
            assignee: "QA Team",
            timeEstimate: 4,
            description: "Write and run unit tests",
            priority: "MEDIUM"
          },
          {
            id: "12",
            name: "Integration testing",
            assignee: "QA Team",
            timeEstimate: 3,
            description: "Test all system integrations",
            priority: "HIGH"
          },
          {
            id: "13",
            name: "Deployment setup",
            assignee: "DevOps",
            timeEstimate: 2,
            description: "Setup CI/CD pipeline and deploy",
            priority: "HIGH"
          },
          {
            id: "14",
            name: "Performance optimization",
            assignee: "Full Team",
            timeEstimate: 2,
            description: "Optimize performance and fix bugs",
            priority: "MEDIUM"
          }
        ]
      }
    ],
    teamAllocation: [
      {
        member: "John Smith",
        role: "Tech Lead",
        allocation: 80,
        tasks: ["Technical architecture", "Code reviews", "Mentoring"]
      },
      {
        member: "Sarah Johnson",
        role: "Frontend Developer",
        allocation: 100,
        tasks: ["Component development", "API integration", "UI polish"]
      },
      {
        member: "Mike Chen",
        role: "Backend Developer",
        allocation: 100,
        tasks: ["API development", "Database setup", "Authentication"]
      },
      {
        member: "Emily Davis",
        role: "UI/UX Designer",
        allocation: 60,
        tasks: ["UI design", "User research", "Design system"]
      },
      {
        member: "David Wilson",
        role: "QA Engineer",
        allocation: 70,
        tasks: ["Test planning", "Test execution", "Bug reporting"]
      }
    ],
    risks: [
      "Payment gateway integration delays",
      "Scope creep from additional feature requests",
      "Performance issues with large product catalogs",
      "Security vulnerabilities in authentication"
    ],
    milestones: [
      { name: "Design Approval", date: "2024-01-29" },
      { name: "Backend API Complete", date: "2024-02-28" },
      { name: "Frontend Beta", date: "2024-03-20" },
      { name: "Go Live", date: "2024-04-15" }
    ]
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return '#ef4444'
      case 'MEDIUM': return '#f59e0b'
      case 'LOW': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <div>
      <div className="section-header">
        <h2>
          <Sparkles size={40} />
          AI Project Breakdown
        </h2>
        <p>Let AI analyze and break down your project into actionable tasks</p>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setBreakdown(mockBreakdown)}
            className="nav-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} />
            <span>Load Example</span>
          </button>
        </div>
      </div>

      {/* Project Input Section */}
      <div className="chart-container large">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <Sparkles size={24} style={{ color: '#667eea' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24' }}>Describe Your Project</h3>
        </div>
        
        <textarea
          style={{
            width: '100%',
            padding: '15px',
            background: '#333333',
            border: '1px solid #404040',
            borderRadius: '12px',
            color: 'white',
            fontSize: '0.9rem',
            minHeight: '120px',
            fontFamily: 'inherit',
            marginBottom: '20px'
          }}
          rows={4}
          placeholder="Describe your project in detail... (e.g., 'Build an e-commerce platform with user authentication, product catalog, shopping cart, and payment integration')"
          value={projectInput}
          onChange={(e) => setProjectInput(e.target.value)}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#404040'}
        />
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            onClick={analyzeProject}
            disabled={isAnalyzing}
            className="nav-btn"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              opacity: isAnalyzing ? 0.5 : 1,
              cursor: isAnalyzing ? 'not-allowed' : 'pointer'
            }}
          >
            <Zap size={20} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}</span>
          </button>
          
          <button
            onClick={() => setBreakdown(mockBreakdown)}
            className="filter-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FileText size={20} />
            <span>Load Example</span>
          </button>
        </div>
      </div>

      {breakdown && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Project Overview */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '15px',
            padding: '30px',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '10px' }}>{breakdown.projectName}</h2>
            <p style={{ opacity: 0.9, marginBottom: '25px', fontSize: '1rem' }}>{breakdown.description}</p>
            
            <div className="analytics-grid">
              <div style={{ background: 'rgba(255, 255, 255, 0.2)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Calendar size={20} />
                  <span style={{ fontSize: '0.9rem' }}>Timeline</span>
                </div>
                <p style={{ fontWeight: 700, fontSize: '1.4rem' }}>{breakdown.timeline.duration} days</p>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.2)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Users size={20} />
                  <span style={{ fontSize: '0.9rem' }}>Team Size</span>
                </div>
                <p style={{ fontWeight: 700, fontSize: '1.4rem' }}>{breakdown.teamAllocation.length} members</p>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.2)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <CheckCircle size={20} />
                  <span style={{ fontSize: '0.9rem' }}>Total Tasks</span>
                </div>
                <p style={{ fontWeight: 700, fontSize: '1.4rem' }}>
                  {breakdown.phases.reduce((acc, phase) => acc + phase.tasks.length, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="analytics-row">
            {/* Project Phases */}
            <div className="chart-container large">
              <h3>
                <TrendingUp size={24} />
                Project Phases
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginTop: '20px' }}>
                {breakdown.phases.map((phase, index) => (
                  <div key={index} style={{
                    borderLeft: '4px solid #667eea',
                    paddingLeft: '20px',
                    background: '#2a2a2a',
                    borderRadius: '10px',
                    padding: '20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h4 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fbbf24' }}>{phase.name}</h4>
                      <span style={{ fontSize: '0.9rem', color: '#999' }}>{phase.duration} days</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {phase.tasks.map((task) => (
                        <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: getPriorityColor(task.priority)
                            }} />
                            <span style={{ color: '#ccc', fontSize: '0.9rem' }}>{task.name}</span>
                          </div>
                          <span style={{ color: '#999', fontSize: '0.85rem' }}>{task.timeEstimate}d</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* Team Allocation */}
              <div className="chart-container">
                <h3>
                  <Users size={20} />
                  Team Allocation
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                  {breakdown.teamAllocation.map((member, index) => (
                    <div key={index} className="team-card" style={{ padding: '15px' }}>
                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fbbf24' }}>{member.member}</h4>
                          <span style={{
                            background: '#667eea',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            {member.allocation}%
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#999' }}>{member.role}</p>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {member.tasks.slice(0, 2).map((task, i) => (
                          <span key={i} style={{
                            fontSize: '0.7rem',
                            background: '#333333',
                            color: '#ccc',
                            padding: '3px 8px',
                            borderRadius: '8px'
                          }}>
                            {task}
                          </span>
                        ))}
                        {member.tasks.length > 2 && (
                          <span style={{ fontSize: '0.7rem', color: '#999' }}>
                            +{member.tasks.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="chart-container">
                <h3>
                  <Clock size={20} />
                  Project Stats
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ opacity: 0.8 }}>Total Duration</span>
                    <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>{breakdown.timeline.duration} days</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ opacity: 0.8 }}>Team Members</span>
                    <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>{breakdown.teamAllocation.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ opacity: 0.8 }}>Total Tasks</span>
                    <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>
                      {breakdown.phases.reduce((acc, phase) => acc + phase.tasks.length, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Milestones */}
          {breakdown.milestones && (
            <div className="chart-container large">
              <h3>
                <CheckCircle size={24} />
                Key Milestones
              </h3>
              <div className="analytics-grid" style={{ marginTop: '20px' }}>
                {breakdown.milestones.map((milestone, index) => (
                  <div key={index} className="team-card" style={{ padding: '20px' }}>
                    <div className="card-header">
                      <div className="avatar" style={{ background: '#10b981' }}>
                        <CheckCircle size={20} />
                      </div>
                      <div className="member-info">
                        <div className="member-name">{milestone.name}</div>
                        <div className="member-rating">
                          <div className="rating-rank">
                            {new Date(milestone.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risks */}
          {breakdown.risks && (
            <div style={{
              background: '#2a2a2a',
              border: '1px solid #f59e0b',
              borderRadius: '15px',
              padding: '25px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <AlertCircle size={24} style={{ color: '#f59e0b' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f59e0b' }}>Potential Risks</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {breakdown.risks.map((risk, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ color: '#f59e0b', marginTop: '6px', fontSize: '0.8rem' }}>•</span>
                    <span style={{ color: '#ccc', fontSize: '0.9rem' }}>{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="nav-btn" style={{ flex: 1 }}>
              Create Project
            </button>
            <button className="filter-btn" style={{ flex: 1 }}>
              Export as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
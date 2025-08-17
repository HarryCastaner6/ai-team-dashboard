import Link from 'next/link'
import { ArrowRight, Sparkles, Users, Kanban, MessageSquare, ChartBar, Brain } from 'lucide-react'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <header className="main-header">
        <div className="header-background"></div>
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <h1>
                <Sparkles size={32} />
                AI Team Dashboard
              </h1>
              <p className="subtitle">Your Complete AI-Powered Team Management Platform</p>
            </div>
            
            <div className="header-stats">
              <Link href="/login" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>
                Login
              </Link>
              <Link 
                href="/register" 
                className="nav-btn"
                style={{ textDecoration: 'none' }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="section-header">
          <h2>
            <Brain size={40} />
            Streamline Your Workflow
          </h2>
          <p>
            Intelligent task tracking, AI assistants, and powerful analytics - 
            all in one comprehensive dashboard.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
            <Link 
              href="/register"
              className="nav-btn"
              style={{ textDecoration: 'none', padding: '15px 30px' }}
            >
              <span>Start Free Trial</span>
              <ArrowRight size={20} />
            </Link>
            <Link 
              href="/login"
              className="filter-btn"
              style={{ textDecoration: 'none', padding: '15px 30px' }}
            >
              View Demo
            </Link>
          </div>
        </div>

        <div className="team-grid">
          <div className="team-card">
            <div className="card-header">
              <div className="avatar">
                <Kanban size={28} />
              </div>
              <div className="member-info">
                <div className="member-name">Taskboards</div>
                <p className="section">
                  Create and manage multiple boards with drag-and-drop functionality. 
                  Control access and collaborate with your team in real-time.
                </p>
              </div>
            </div>
          </div>

          <div className="team-card">
            <div className="card-header">
              <div className="avatar">
                <MessageSquare size={28} />
              </div>
              <div className="member-info">
                <div className="member-name">AI Chat Assistant</div>
                <p className="section">
                  Get instant answers using ChatGPT and Gemini AI. 
                  Switch between models and maintain conversation history.
                </p>
              </div>
            </div>
          </div>

          <div className="team-card">
            <div className="card-header">
              <div className="avatar">
                <Users size={28} />
              </div>
              <div className="member-info">
                <div className="member-name">Team Management</div>
                <p className="section">
                  View team members with NBA 2K-style ratings, track performance, 
                  and manage roles with admin/user access controls.
                </p>
              </div>
            </div>
          </div>

          <div className="team-card">
            <div className="card-header">
              <div className="avatar">
                <ChartBar size={28} />
              </div>
              <div className="member-info">
                <div className="member-name">Analytics Dashboard</div>
                <p className="section">
                  Visualize team productivity with interactive charts, track project progress, 
                  and monitor key performance indicators.
                </p>
              </div>
            </div>
          </div>

          <div className="team-card">
            <div className="card-header">
              <div className="avatar">
                <Brain size={28} />
              </div>
              <div className="member-info">
                <div className="member-name">AI Project Breakdown</div>
                <p className="section">
                  Let AI analyze your projects and automatically break them down into tasks, 
                  assign team members, and estimate timelines.
                </p>
              </div>
            </div>
          </div>

          <div className="team-card">
            <div className="card-header">
              <div className="avatar">
                <Sparkles size={28} />
              </div>
              <div className="member-info">
                <div className="member-name">Smart Features</div>
                <p className="section">
                  Enjoy intelligent task suggestions, automated reporting, 
                  and AI-powered insights to optimize team performance.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-container" style={{ marginTop: '60px', textAlign: 'center' }}>
          <h3>
            <Sparkles size={24} />
            Ready to Transform Your Team Management?
          </h3>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '30px' }}>
            Join hundreds of teams already using AI Dashboard to boost productivity
          </p>
          <Link 
            href="/register"
            className="nav-btn"
            style={{ 
              textDecoration: 'none', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px',
              padding: '15px 30px',
              backgroundColor: 'white',
              color: '#667eea'
            }}
          >
            <span>Get Started Now</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </main>

      <footer style={{ 
        marginTop: '60px', 
        borderTop: '1px solid #404040', 
        padding: '30px 0',
        textAlign: 'center',
        opacity: 0.7 
      }}>
        <div className="container">
          <p>© 2024 AI Team Dashboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
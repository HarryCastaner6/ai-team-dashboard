'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Kanban, 
  Users, 
  FolderOpen,
  Settings,
  LogOut,
  ChartBar,
  Clock,
  FileText,
  Calendar,
  TrendingUp,
  Zap,
  Target,
  UserCheck,
  CreditCard,
  Package,
  Building2,
  DollarSign,
  Megaphone,
  BookOpen,
  Video,
  Phone,
  Mail,
  Shield,
  Briefcase
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const menuSections = [
  {
    title: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, gradient: 'from-blue-500 to-cyan-500' },
      { href: '/dashboard/analytics', label: 'Analytics', icon: ChartBar, gradient: 'from-green-500 to-emerald-500' },
    ]
  },
  {
    title: 'Productivity',
    items: [
      { href: '/dashboard/kanban', label: 'Taskboards', icon: Kanban, gradient: 'from-purple-500 to-pink-500' },
      { href: '/dashboard/time-tracking', label: 'Time Tracking', icon: Clock, gradient: 'from-orange-500 to-red-500' },
      { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar, gradient: 'from-indigo-500 to-purple-500' },
      { href: '/dashboard/goals', label: 'Goals & OKRs', icon: Target, gradient: 'from-teal-500 to-green-500' },
    ]
  },
  {
    title: 'Business Operations',
    items: [
      { href: '/dashboard/crm', label: 'CRM', icon: UserCheck, gradient: 'from-cyan-500 to-blue-500' },
      { href: '/dashboard/invoices', label: 'Invoices & Billing', icon: CreditCard, gradient: 'from-green-500 to-teal-500' },
      { href: '/dashboard/inventory', label: 'Inventory', icon: Package, gradient: 'from-amber-500 to-orange-500' },
      { href: '/dashboard/finances', label: 'Finances', icon: DollarSign, gradient: 'from-emerald-500 to-green-500' },
    ]
  },
  {
    title: 'Human Resources',
    items: [
      { href: '/dashboard/team', label: 'Team Management', icon: Users, gradient: 'from-blue-500 to-indigo-500' },
      { href: '/dashboard/hr', label: 'HR & Payroll', icon: Briefcase, gradient: 'from-violet-500 to-purple-500' },
    ]
  },
  {
    title: 'Marketing & Sales',
    items: [
      { href: '/dashboard/marketing', label: 'Marketing', icon: Megaphone, gradient: 'from-pink-500 to-rose-500' },
      { href: '/dashboard/projects', label: 'Projects', icon: FolderOpen, gradient: 'from-yellow-500 to-orange-500' },
    ]
  },
  {
    title: 'Communication',
    items: [
      { href: '/dashboard/video', label: 'Video Calls', icon: Video, gradient: 'from-indigo-500 to-blue-500' },
      { href: '/dashboard/chat', label: 'AI Chat', icon: MessageSquare, gradient: 'from-emerald-500 to-teal-500' },
      { href: '/dashboard/documents', label: 'Documents', icon: FileText, gradient: 'from-gray-500 to-slate-500' },
      { href: '/dashboard/knowledge', label: 'Knowledge Base', icon: BookOpen, gradient: 'from-blue-500 to-purple-500' },
    ]
  },
  {
    title: 'Automation & Insights',
    items: [
      { href: '/dashboard/reports', label: 'Reports', icon: TrendingUp, gradient: 'from-rose-500 to-pink-500' },
      { href: '/dashboard/automation', label: 'Automation', icon: Zap, gradient: 'from-violet-500 to-purple-500' },
    ]
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div style={{
      width: '288px',
      background: 'linear-gradient(135deg, #2a2a2a, #1e1e1e)',
      color: 'white',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
      borderRight: '1px solid #404040'
    }}>
      <div className="main-header" style={{ padding: '25px', margin: 0 }}>
        <div className="header-background"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 800, 
            marginBottom: '5px',
            color: '#fbbf24'
          }}>
            ⚡ Productivity Suite
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.85rem' }}>AI-Powered Workspace</p>
        </div>
      </div>

      <nav style={{ 
        flex: 1, 
        padding: '20px', 
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {menuSections.map((section) => (
            <div key={section.title}>
              <h3 style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: '#94a3b8', 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px', 
                marginBottom: '15px', 
                paddingLeft: '8px' 
              }}>
                {section.title}
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={isActive ? 'nav-btn active' : 'nav-btn'}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 15px',
                          borderRadius: '12px',
                          textDecoration: 'none',
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          transition: 'all 0.3s ease',
                          background: isActive ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent'
                        }}
                      >
                        <div style={{
                          padding: '6px',
                          borderRadius: '8px',
                          background: isActive ? 'rgba(255, 255, 255, 0.2)' : '#404040',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon size={16} />
                        </div>
                        <span>{item.label}</span>
                        {isActive && (
                          <div style={{ 
                            marginLeft: 'auto', 
                            width: '8px', 
                            height: '8px', 
                            background: 'white', 
                            borderRadius: '50%',
                            animation: 'pulse 2s infinite'
                          }} />
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div style={{ 
        padding: '20px', 
        borderTop: '1px solid #404040' 
      }}>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="action-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 15px',
            borderRadius: '12px',
            width: '100%',
            border: 'none',
            background: '#404040',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#ef4444'
            e.target.style.transform = 'scale(1.02)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#404040'
            e.target.style.transform = 'scale(1)'
          }}
        >
          <div style={{
            padding: '6px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <LogOut size={16} />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
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
      width: '320px',
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
      backdropFilter: 'blur(20px)',
      color: 'white',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderLeft: 'none',
      zIndex: 1000
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 30%, rgba(120, 119, 198, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 118, 117, 0.15) 0%, transparent 50%)',
        animation: 'float 25s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <div style={{ 
        padding: '32px', 
        position: 'relative', 
        zIndex: 1,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        animation: 'slideInLeft 0.8s ease-out'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
            borderRadius: '16px',
            padding: '12px',
            animation: 'pulse 3s infinite',
            boxShadow: '0 8px 16px rgba(255, 107, 107, 0.3)'
          }}>
            <span style={{ fontSize: '24px' }}>⚡</span>
          </div>
          <div>
            <h1 style={{ 
              fontSize: '1.6rem', 
              fontWeight: '700', 
              marginBottom: '4px',
              background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
              AI Suite
            </h1>
            <p style={{ 
              opacity: 0.8, 
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: '300'
            }}>
              Productivity Workspace
            </p>
          </div>
        </div>
      </div>

      <nav style={{ 
        flex: 1, 
        padding: '24px 20px', 
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {menuSections.map((section, sectionIndex) => (
            <div 
              key={section.title}
              style={{
                animation: `slideInLeft 0.8s ease-out ${sectionIndex * 0.1 + 0.2}s both`
              }}
            >
              <h3 style={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: 'rgba(255, 255, 255, 0.6)', 
                textTransform: 'uppercase', 
                letterSpacing: '1px', 
                marginBottom: '16px', 
                paddingLeft: '12px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}>
                {section.title}
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <li key={item.href} style={{
                      animation: `slideInLeft 0.6s ease-out ${(sectionIndex * 0.1 + itemIndex * 0.05 + 0.4)}s both`
                    }}>
                      <Link
                        href={item.href}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '14px 16px',
                          borderRadius: '16px',
                          textDecoration: 'none',
                          color: 'white',
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          transition: 'all 0.3s ease',
                          background: isActive 
                            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))' 
                            : 'transparent',
                          border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                          boxShadow: isActive ? '0 8px 16px rgba(0, 0, 0, 0.1)' : 'none',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                            e.currentTarget.style.transform = 'translateX(8px)'
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.transform = 'translateX(0)'
                            e.currentTarget.style.boxShadow = 'none'
                          }
                        }}
                      >
                        {/* Gradient overlay for active item */}
                        {isActive && (
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1))',
                            borderRadius: '16px'
                          }} />
                        )}
                        
                        <div style={{
                          padding: '8px',
                          borderRadius: '12px',
                          background: isActive 
                            ? 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' 
                            : 'rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: isActive ? '0 4px 8px rgba(255, 107, 107, 0.3)' : 'none',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          zIndex: 1
                        }}>
                          <Icon size={18} />
                        </div>
                        <span style={{ 
                          position: 'relative',
                          zIndex: 1,
                          textShadow: isActive ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none'
                        }}>
                          {item.label}
                        </span>
                        {isActive && (
                          <div style={{ 
                            marginLeft: 'auto', 
                            width: '10px', 
                            height: '10px', 
                            background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)', 
                            borderRadius: '50%',
                            animation: 'pulse 2s infinite',
                            boxShadow: '0 0 10px rgba(255, 107, 107, 0.5)',
                            position: 'relative',
                            zIndex: 1
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
        padding: '24px', 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 1
      }}>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '16px 18px',
            borderRadius: '16px',
            width: '100%',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            fontSize: '0.95rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            animation: 'slideInUp 0.8s ease-out 1s both'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)'
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{
            padding: '8px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}>
            <LogOut size={18} />
          </div>
          <span style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Logout</span>
        </button>
      </div>

      {/* Add CSS Animations */}
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(20px, -20px) rotate(120deg);
          }
          66% {
            transform: translate(-15px, 15px) rotate(240deg);
          }
        }
      `}</style>
    </div>
  )
}
import Sidebar from '@/components/Sidebar'
import DebugPanel from '@/components/DebugPanelNew'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        marginLeft: '320px', // Updated to match new sidebar width
        overflowY: 'auto',
        background: 'transparent'
      }}>
        <div style={{ padding: '0' }}>
          {children}
        </div>
      </main>
      <DebugPanel />
    </div>
  )
}
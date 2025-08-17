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
      background: '#1a1a1a'
    }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        marginLeft: '288px', // 72 * 4 = 288px (w-72)
        overflowY: 'auto',
        background: '#1a1a1a'
      }}>
        <div className="container" style={{ padding: '30px' }}>
          {children}
        </div>
      </main>
      <DebugPanel />
    </div>
  )
}
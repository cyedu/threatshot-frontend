import { useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function PageWrapper({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-brand-bg text-brand-text overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar title={title} onMenuClick={() => setSidebarOpen(v => !v)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

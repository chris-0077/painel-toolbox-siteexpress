import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminDashboard from '@/components/admin/AdminDashboard'
import AdminItems from '@/components/admin/AdminItems'
import AdminNewItem from '@/components/admin/AdminNewItem'
import AdminCategories from '@/components/admin/AdminCategories'
import AdminUsers from '@/components/admin/AdminUsers'

export type AdminPage = 'dashboard' | 'items' | 'new-item' | 'categories' | 'users'

export default function Admin() {
  const [page, setPage] = useState<AdminPage>('dashboard')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-dark)' }}>
      <AdminSidebar active={page} onNavigate={setPage} />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {page === 'dashboard' && <AdminDashboard onNavigate={setPage} />}
        {page === 'items' && <AdminItems onEdit={() => setPage('new-item')} />}
        {page === 'new-item' && <AdminNewItem />}
        {page === 'categories' && <AdminCategories />}
        {page === 'users' && <AdminUsers />}
      </main>
    </div>
  )
}

import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminDashboard from '@/components/admin/AdminDashboard'
import AdminItems from '@/components/admin/AdminItems'
import AdminNewItem from '@/components/admin/AdminNewItem'
import AdminEditItem from '@/components/admin/AdminEditItem'
import AdminCategories from '@/components/admin/AdminCategories'
import AdminUsers from '@/components/admin/AdminUsers'
import type { Item } from '@/types'

export type AdminPage = 'dashboard' | 'items' | 'new-item' | 'edit-item' | 'categories' | 'users'

export default function Admin() {
  const [page, setPage] = useState<AdminPage>('dashboard')
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  function handleEditItem(item: Item) {
    setEditingItem(item)
    setPage('edit-item')
  }

  function handleBackToItems() {
    setEditingItem(null)
    setPage('items')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-dark)' }}>
      <AdminSidebar active={page} onNavigate={(p) => { setPage(p); setEditingItem(null); }} />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {page === 'dashboard' && <AdminDashboard onNavigate={setPage} />}
        {page === 'items' && <AdminItems onEdit={handleEditItem} />}
        {page === 'new-item' && <AdminNewItem />}
        {page === 'edit-item' && editingItem && (
          <AdminEditItem item={editingItem} onBack={handleBackToItems} onSave={handleBackToItems} />
        )}
        {page === 'categories' && <AdminCategories />}
        {page === 'users' && <AdminUsers />}
      </main>
    </div>
  )
}
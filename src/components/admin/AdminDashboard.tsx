import type { AdminPage } from '@/pages/Admin'
import { mockItems, mockCategories } from '@/data/mock'
import { mockUsers } from '@/data/mockUsers'

interface Props {
  onNavigate: (page: AdminPage) => void
}

export default function AdminDashboard({ onNavigate }: Props) {
  const stats = [
    { label: 'Itens', value: mockItems.length, page: 'items' as AdminPage },
    { label: 'Categorias', value: mockCategories.length, page: 'categories' as AdminPage },
    { label: 'Usuários', value: mockUsers.length, page: 'users' as AdminPage },
    { label: 'Ativos', value: mockUsers.filter((u) => u.active).length, page: 'users' as AdminPage },
  ]

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '24px' }}>
        Dashboard
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {stats.map((stat) => (
          <button
            key={stat.label}
            onClick={() => onNavigate(stat.page)}
            style={{ background: 'var(--color-dark-card)', border: '1px solid var(--color-border)', borderRadius: '12px', textAlign: 'left', padding: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)' }}>{stat.value}</p>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{stat.label}</p>
          </button>
        ))}
      </div>
      <div style={{ background: 'var(--color-dark-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '10px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '8px' }}>Ações rápidas</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onNavigate('new-item')}
            style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--color-purple)', color: '#fff', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer' }}
          >
            + Novo Item
          </button>
          <button
            onClick={() => onNavigate('categories')}
            style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--color-dark-lighter)', color: 'var(--color-text-muted)', fontSize: '14px', fontWeight: 500, border: '1px solid var(--color-border)', cursor: 'pointer' }}
          >
            Gerenciar Categorias
          </button>
        </div>
      </div>
    </div>
  )
}

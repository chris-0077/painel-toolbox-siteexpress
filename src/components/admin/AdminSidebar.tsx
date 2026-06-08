import type { AdminPage } from '@/pages/Admin'
import logo from '@/assets/logo.png'

interface Props {
  active: AdminPage
  onNavigate: (page: AdminPage) => void
}

const menuItems: { id: AdminPage; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '◻' },
  { id: 'items', label: 'Catálogo', icon: '▦' },
  { id: 'new-item', label: 'Novo Item', icon: '+' },
  { id: 'categories', label: 'Categorias', icon: '≡' },
  { id: 'users', label: 'Usuários', icon: '◉' },
]

export default function AdminSidebar({ active, onNavigate }: Props) {
  return (
    <aside style={{ width: '260px', minHeight: '100vh', background: 'var(--color-dark-lighter)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)' }}>
        <img src={logo} alt="Site Express" style={{ width: '140px', marginBottom: '8px' }} />
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Painel Administrativo</p>
      </div>
      <nav style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', textAlign: 'left', border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: active === item.id ? 'var(--color-purple)' : 'transparent', color: active === item.id ? '#fff' : 'var(--color-text-muted)', fontWeight: active === item.id ? 500 : 400 }}
          >
            <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)' }}>
        <a
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--color-text-muted)', textDecoration: 'none' }}
        >
          ← Voltar ao catálogo
        </a>
      </div>
    </aside>
  )
}

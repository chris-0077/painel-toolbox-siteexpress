import { useState } from 'react'
import { mockUsers, type MockUser } from '@/data/mockUsers'

function isOverOneYear(dateStr: string): boolean {
  const created = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - created.getTime()
  const oneYear = 365 * 24 * 60 * 60 * 1000
  return diffMs >= oneYear
}

export default function AdminUsers() {
  const [users, setUsers] = useState<MockUser[]>(mockUsers)

  function toggleActive(id: string) {
    setUsers(users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)))
  }

  const activeCount = users.filter((u) => u.active).length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text)' }}>
            Usuários
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {users.length} total · {activeCount} ativos
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--color-dark-card)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)', padding: '12px 16px' }}>Nome</th>
              <th style={{ textAlign: 'left', fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)', padding: '12px 16px' }}>Email</th>
              <th style={{ textAlign: 'left', fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)', padding: '12px 16px' }}>Cadastro</th>
              <th style={{ textAlign: 'left', fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)', padding: '12px 16px' }}>+1 Ano</th>
              <th style={{ textAlign: 'left', fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)', padding: '12px 16px' }}>Status</th>
              <th style={{ textAlign: 'right', fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)', padding: '12px 16px' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user.id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <td style={{ padding: '12px 16px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text)' }}>{user.name}</p>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{user.email}</p>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{user.created_at}</p>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '99px', background: isOverOneYear(user.created_at) ? 'rgba(245,158,11,0.15)' : 'var(--color-dark-lighter)', color: isOverOneYear(user.created_at) ? '#fbbf24' : 'var(--color-text-muted)' }}>
                    {isOverOneYear(user.created_at) ? 'Sim' : 'Não'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '99px', background: user.active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: user.active ? '#4ade80' : '#f87171' }}>
                    {user.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => toggleActive(user.id)}
                    style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '6px', fontWeight: 500, border: 'none', cursor: 'pointer', background: user.active ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', color: user.active ? '#f87171' : '#4ade80' }}
                  >
                    {user.active ? 'Desativar' : 'Ativar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

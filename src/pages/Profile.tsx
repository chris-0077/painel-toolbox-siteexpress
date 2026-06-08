import { useNavigate } from 'react-router-dom'

const mockProfile = {
  name: 'Maria Silva',
  email: 'maria@email.com',
  avatar: null,
  plan: 'Premium',
  created_at: '2024-08-15',
  active: true,
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function getTimeSince(dateStr: string) {
  const created = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - created.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)
  if (years > 0) return `${years} ano${years > 1 ? 's' : ''} e ${months % 12} mes${(months % 12) !== 1 ? 'es' : ''}`
  if (months > 0) return `${months} mes${months > 1 ? 'es' : ''}`
  return `${days} dia${days > 1 ? 's' : ''}`
}

export default function Profile() {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'var(--color-dark-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-purple)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text)' }}>{mockProfile.name}</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{mockProfile.email}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--color-dark-lighter)', borderRadius: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Plano</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text)' }}>{mockProfile.plan}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--color-dark-lighter)', borderRadius: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Status</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: mockProfile.active ? '#4ade80' : '#f87171' }}>{mockProfile.active ? 'Ativo' : 'Inativo'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--color-dark-lighter)', borderRadius: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Membro desde</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text)' }}>{formatDate(mockProfile.created_at)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--color-dark-lighter)', borderRadius: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Tempo de assinatura</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text)' }}>{getTimeSince(mockProfile.created_at)}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          style={{ width: '100%', marginTop: '24px', padding: '10px', borderRadius: '8px', background: 'var(--color-dark-lighter)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '14px', cursor: 'pointer' }}
        >
          ← Voltar ao catálogo
        </button>
      </div>
    </div>
  )
}

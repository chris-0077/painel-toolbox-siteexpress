import type { Item } from '@/types'

interface Props {
  item: Item
  onClick: () => void
}

export default function ItemCard({ item, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="card-hover"
      style={{ padding: '15px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-dark-card)', textAlign: 'left', cursor: 'pointer' }}
    >
      <div style={{ aspectRatio: '16/9', overflow: 'hidden', borderRadius: '8px' }}>
        <img
          src={item.preview_url}
          alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
        />
      </div>
      <div style={{ marginTop: '12px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text)' }}>
          {item.title}
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          {item.description}
        </p>
      </div>
    </button>
  )
}

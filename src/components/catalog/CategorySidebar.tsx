import { useState } from 'react'
import type { Category } from '@/types'
import logo from '@/assets/logo.png'

interface Props {
  categories: Category[]
  selected: string | null
  onSelect: (slug: string | null) => void
}

export default function CategorySidebar({ categories, selected, onSelect }: Props) {
  const parents = categories.filter((c) => c.parent_id === null)
  const [openParent, setOpenParent] = useState<string | null>(parents[0]?.id || null)

  function getChildren(parentId: string) {
    return categories.filter((c) => c.parent_id === parentId)
  }

  function toggleParent(id: string) {
    setOpenParent(openParent === id ? null : id)
  }

  return (
    <aside style={{ width: '240px', minHeight: '100vh', borderRight: '1px solid var(--color-border)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '4px', background: 'var(--color-dark)', overflowY: 'auto' }}>
      <img src={logo} alt="Site Express" style={{ width: '140px', marginBottom: '24px' }} />

      <button
        onClick={() => onSelect(null)}
        style={{ textAlign: 'left', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: selected === null ? 'var(--color-purple)' : 'transparent', color: selected === null ? '#fff' : 'var(--color-text-muted)', fontWeight: selected === null ? 500 : 400 }}
      >
        Todos
      </button>

      {parents.map((parent) => (
        <div key={parent.id} style={{ marginTop: '8px' }}>
          <button
            onClick={() => toggleParent(parent.id)}
            style={{ width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', background: openParent === parent.id ? 'var(--color-dark-lighter)' : 'transparent', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}
          >
            {parent.label}
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', transition: 'transform 0.2s', transform: openParent === parent.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
          </button>
          <div className={`accordion-content ${openParent === parent.id ? 'open' : ''}`}>
            <div className="accordion-inner" style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px', paddingLeft: '12px' }}>
              <button
                onClick={() => onSelect(`all-${parent.slug}`)}
                style={{ textAlign: 'left', padding: '5px 10px', borderRadius: '6px', fontSize: '13px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: selected === `all-${parent.slug}` ? 'var(--color-purple)' : 'transparent', color: selected === `all-${parent.slug}` ? '#fff' : 'var(--color-text-muted)', fontWeight: selected === `all-${parent.slug}` ? 500 : 400, display: 'block', width: '100%' }}
              >
                Todos
              </button>
              {getChildren(parent.id).map((child) => (
                <button
                  key={child.id}
                  onClick={() => onSelect(child.slug)}
                  style={{ textAlign: 'left', padding: '5px 10px', borderRadius: '6px', fontSize: '13px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: selected === child.slug ? 'var(--color-purple)' : 'transparent', color: selected === child.slug ? '#fff' : 'var(--color-text-muted)', fontWeight: selected === child.slug ? 500 : 400, display: 'block', width: '100%' }}
                >
                  {child.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </aside>
  )
}

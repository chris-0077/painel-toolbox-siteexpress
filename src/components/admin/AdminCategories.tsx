import { useState } from 'react'
import { mockCategories } from '@/data/mock'
import type { Category } from '@/types'

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [newLabel, setNewLabel] = useState('')
  const [newParent, setNewParent] = useState<string | null>(null)

  const parents = categories.filter((c) => c.parent_id === null)

  function getChildren(parentId: string) {
    return categories.filter((c) => c.parent_id === parentId)
  }

  function handleAdd() {
    if (!newLabel.trim()) return
    const slug = newLabel.toLowerCase().replace(/\s+/g, '-')
    setCategories([
      ...categories,
      { id: Date.now().toString(), label: newLabel, slug, order: categories.length + 1, parent_id: newParent, created_at: '' },
    ])
    setNewLabel('')
  }

  function handleDelete(id: string) {
    setCategories(categories.filter((c) => c.id !== id && c.parent_id !== id))
  }

  return (
    <div style={{ maxWidth: '560px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '24px' }}>
        Categorias
      </h2>

      <div style={{ background: 'var(--color-dark-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '10px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <select
            value={newParent || ''}
            onChange={(e) => setNewParent(e.target.value || null)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-dark-lighter)', fontSize: '14px', color: 'var(--color-text)', width: '140px' }}
          >
            <option value="">Categoria pai</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-dark-lighter)', fontSize: '14px', color: 'var(--color-text)' }}
            placeholder={newParent ? 'Nome da subcategoria' : 'Nome da categoria pai'}
          />
          <button
            onClick={handleAdd}
            style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--color-purple)', color: '#fff', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer' }}
          >
            Adicionar
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {parents.map((parent) => (
            <div key={parent.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '8px', border: '1px solid var(--color-border)', padding: '8px 10px', background: 'var(--color-dark-lighter)' }}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text)' }}>{parent.label}</span>
                <button
                  onClick={() => handleDelete(parent.id)}
                  style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '6px', background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', cursor: 'pointer' }}
                >
                  Excluir
                </button>
              </div>
              <div style={{ marginLeft: '16px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {getChildren(parent.id).map((child) => (
                  <div
                    key={child.id}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '8px', border: '1px solid var(--color-border)', padding: '6px 10px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--color-text)' }}>{child.label}</span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>/{child.slug}</span>
                    </div>
                    <button
                      onClick={() => handleDelete(child.id)}
                      style={{ fontSize: '11px', padding: '3px 6px', borderRadius: '4px', background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', cursor: 'pointer' }}
                    >
                      Excluir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

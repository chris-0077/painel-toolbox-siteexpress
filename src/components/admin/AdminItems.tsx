import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Item, Category } from '@/types'

interface Props {
  onEdit: (item: Item) => void
}

export default function AdminItems({ onEdit }: Props) {
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const [itemsRes, categoriesRes] = await Promise.all([
      supabase.from('items').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
    ])

    if (itemsRes.data) setItems(itemsRes.data)
    if (categoriesRes.data) setCategories(categoriesRes.data)
    setLoading(false)
  }

  const filteredItems = filter
    ? items.filter((item) => item.category_id === filter)
    : items

  if (loading) {
    return <p style={{ color: 'var(--color-text-muted)' }}>Carregando...</p>
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text)' }}>
          Catálogo ({filteredItems.length} itens)
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-dark-lighter)', fontSize: '14px', color: 'var(--color-text)' }}
        >
          <option value="">Todas as categorias</option>
          {categories.filter((c) => c.parent_id !== null).map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>
      {filteredItems.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '48px' }}>
          Nenhum item encontrado.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {filteredItems.map((item) => {
            const cat = categories.find((c) => c.id === item.category_id)
            return (
              <div key={item.id} style={{ borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden', background: 'var(--color-dark-card)', position: 'relative' }}>
                <button
                  onClick={() => onEdit(item)}
                  style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', zIndex: 1 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: 'var(--color-dark-lighter)' }}>
                  {item.preview_url ? (
                    <img
                      src={item.preview_url}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                      Sem imagem
                    </div>
                  )}
                </div>
                <div style={{ padding: '10px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text)' }}>{item.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '99px', background: 'var(--color-dark-lighter)', color: 'var(--color-text-muted)' }}>
                      {cat?.label || '—'}
                    </span>
                    <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '99px', background: item.is_published ? 'rgba(34,197,94,0.15)' : 'var(--color-dark-lighter)', color: item.is_published ? '#4ade80' : 'var(--color-text-muted)' }}>
                      {item.is_published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
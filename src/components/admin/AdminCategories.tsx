import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types'

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newLabel, setNewLabel] = useState('')
  const [newParent, setNewParent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    if (data) setCategories(data)
    setLoading(false)
  }

  const parents = categories.filter((c) => c.parent_id === null)

  function getChildren(parentId: string) {
    return categories.filter((c) => c.parent_id === parentId)
  }

  async function handleAdd() {
    if (!newLabel.trim()) return
    const slug = newLabel.toLowerCase().replace(/\s+/g, '-')
    const sort_order = categories.length + 1

    try {
      const insertData: any = { label: newLabel, slug, sort_order }
      if (newParent) {
        insertData.parent_id = newParent
      }

      const { data, error } = await supabase
        .from('categories')
        .insert([insertData])
        .select()
        .single()

      if (error) throw error
      if (data) setCategories([...categories, data])
      setNewLabel('')
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error)
      alert('Erro ao adicionar categoria. Verifique o console.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir categoria e suas subcategorias?')) return

    try {
      // Excluir subcategorias primeiro
      const children = categories.filter((c) => c.parent_id === id)
      for (const child of children) {
        await supabase.from('categories').delete().eq('id', child.id)
      }
      // Excluir categoria pai
      await supabase.from('categories').delete().eq('id', id)

      setCategories(categories.filter((c) => c.id !== id && c.parent_id !== id))
    } catch (error) {
      console.error('Erro ao excluir:', error)
      alert('Erro ao excluir categoria')
    }
  }

  if (loading) {
    return <p style={{ color: 'var(--color-text-muted)' }}>Carregando...</p>
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
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import CategorySidebar from '@/components/catalog/CategorySidebar'
import ItemCard from '@/components/catalog/ItemCard'
import ItemModal from '@/components/catalog/ItemModal'
import type { Item, Category } from '@/types'

export default function Catalog() {
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('items').select('*').eq('is_published', true),
      ])

      if (categoriesRes.data) setCategories(categoriesRes.data)
      if (itemsRes.data) setItems(itemsRes.data)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = selectedCategory
    ? selectedCategory.startsWith('all-')
      ? (() => {
          const parentSlug = selectedCategory.replace('all-', '')
          const parent = categories.find((c) => c.slug === parentSlug && c.parent_id === null)
          if (!parent) return items
          const childIds = categories.filter((c) => c.parent_id === parent.id).map((c) => c.id)
          return items.filter((item) => childIds.includes(item.category_id))
        })()
      : items.filter((item) => {
          const cat = categories.find((c) => c.slug === selectedCategory)
          return cat && item.category_id === cat.id
        })
    : items

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--color-dark)' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Carregando...</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-dark)' }}>
      <CategorySidebar
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <main style={{ flex: 1, padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-text)' }}>
              Elementor Toolbox
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'}
            </p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-purple)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s' }}
            title="Meu perfil"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
        {filteredItems.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '48px' }}>
            Nenhum item encontrado. Adicione itens no painel admin!
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        )}
      </main>
      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  )
}
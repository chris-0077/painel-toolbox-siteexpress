import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockCategories, mockItems } from '@/data/mock'
import CategorySidebar from '@/components/catalog/CategorySidebar'
import ItemCard from '@/components/catalog/ItemCard'
import ItemModal from '@/components/catalog/ItemModal'
import type { Item } from '@/types'

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const navigate = useNavigate()

  const filteredItems = selectedCategory
    ? selectedCategory.startsWith('all-')
      ? (() => {
          const parentSlug = selectedCategory.replace('all-', '')
          const parent = mockCategories.find((c) => c.slug === parentSlug && c.parent_id === null)
          if (!parent) return mockItems
          const childIds = mockCategories.filter((c) => c.parent_id === parent.id).map((c) => c.id)
          return mockItems.filter((item) => childIds.includes(item.category_id))
        })()
      : mockItems.filter((item) => {
          const cat = mockCategories.find((c) => c.slug === selectedCategory)
          return cat && item.category_id === cat.id
        })
    : mockItems

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-dark)' }}>
      <CategorySidebar
        categories={mockCategories}
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      </main>
      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  )
}

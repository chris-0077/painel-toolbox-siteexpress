export interface Category {
  id: string
  label: string
  slug: string
  sort_order: number
  parent_id: string | null
  created_at: string
}

export interface Item {
  id: string
  category_id: string
  title: string
  description: string
  preview_url: string
  is_published: boolean
  created_at: string
}

export interface ItemCode {
  id: string
  parent_item_id: string
  label: string
  instruction: string
  code: string
  created_at: string
}

export interface Profile {
  id: string
  role: 'user' | 'admin'
  active: boolean
  created_at: string
}
export interface MockUser {
  id: string
  name: string
  email: string
  active: boolean
  created_at: string
}

export const mockUsers: MockUser[] = [
  { id: '1', name: 'Maria Silva', email: 'maria@email.com', active: true, created_at: '2025-01-10' },
  { id: '2', name: 'João Santos', email: 'joao@email.com', active: true, created_at: '2025-02-05' },
  { id: '3', name: 'Ana Costa', email: 'ana@email.com', active: false, created_at: '2025-03-12' },
  { id: '4', name: 'Pedro Oliveira', email: 'pedro@email.com', active: true, created_at: '2025-04-01' },
  { id: '5', name: 'Carla Mendes', email: 'carla@email.com', active: false, created_at: '2025-04-20' },
]

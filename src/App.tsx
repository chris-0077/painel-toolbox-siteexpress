import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Auth from '@/pages/Auth'
import Catalog from '@/pages/Catalog'
import Admin from '@/pages/Admin'
import Profile from '@/pages/Profile'
import Blocked from '@/pages/Blocked'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Catalog />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/blocked" element={<Blocked />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

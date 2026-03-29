import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './router'
import { useTheme } from './hooks/useTheme'
import CookieBanner from './components/CookieBanner'
import useAuthStore from './store/authStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function ThemeInitializer() {
  useTheme() // syncs localStorage → data-theme on <html> on every mount
  return null
}

function SessionInitializer() {
  const fetchMe = useAuthStore(state => state.fetchMe)
  useEffect(() => { fetchMe() }, [fetchMe])
  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeInitializer />
      <SessionInitializer />
      <RouterProvider router={router} />
      <CookieBanner />
    </QueryClientProvider>
  )
}

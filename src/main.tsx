import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NotFound from './pages/NotFound.tsx'
import { Toaster } from "./components/ui/sonner"
import Github from './components/Github.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="relative">
        <div className="absolute bottom-4 right-4 z-10">
          <Github />
        </div>
        <App />
      </div>
    )
  },
  {path: '*', element: <NotFound/>}
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
    <Toaster />
  </StrictMode>
)

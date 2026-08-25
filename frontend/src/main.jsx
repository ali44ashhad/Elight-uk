import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { UserAuthProvider } from './contexts/UserAuthContext.jsx'
import { ScrollToTop } from './components/Layout/ScrollToTop.jsx'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found')

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserAuthProvider>
          <ScrollToTop />
          <App />
        </UserAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

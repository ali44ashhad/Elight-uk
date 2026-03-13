import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAdmin } from './components/auth/RequireAdmin'
import { HomePage } from './pages/HomePage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminDashboardHome } from './pages/admin/AdminDashboardHome'
import { AdminPropertiesPage } from './pages/admin/AdminPropertiesPage'
import { AdminSellersPage } from './pages/admin/AdminSellersPage'
import { AdminDealsPage } from './pages/admin/AdminDealsPage'
import { AdminInquiriesPage } from './pages/admin/AdminInquiriesPage'
import { AdminRefundsPage } from './pages/admin/AdminRefundsPage'
import { AdminGeneralQueriesPage } from './pages/admin/AdminGeneralQueriesPage'
import { AboutPage } from './pages/AboutPage'
import { GettingStartedPage } from './pages/GettingStartedPage'
import { PropertyDetailsPage } from './pages/PropertyDetailsPage'
import { SellerProfilePage } from './pages/SellerProfilePage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { DealSourceTermsPage } from './pages/DealSourceTermsPage'
import { RefundPage } from './pages/RefundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about-us" element={<AboutPage />} />
      <Route path="/getting-started" element={<GettingStartedPage />} />
      <Route path="/properties/:id" element={<PropertyDetailsPage />} />
      <Route path="/sellers/:id" element={<SellerProfilePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/deal-source-terms" element={<DealSourceTermsPage />} />
      <Route path="/refund" element={<RefundPage />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout>
              <AdminDashboardHome />
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/properties"
        element={
          <RequireAdmin>
            <AdminLayout>
              <AdminPropertiesPage />
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/sellers"
        element={
          <RequireAdmin>
            <AdminLayout>
              <AdminSellersPage />
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/deals"
        element={
          <RequireAdmin>
            <AdminLayout>
              <AdminDealsPage />
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/inquiries"
        element={
          <RequireAdmin>
            <AdminLayout>
              <AdminInquiriesPage />
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/refunds"
        element={
          <RequireAdmin>
            <AdminLayout>
              <AdminRefundsPage />
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/general-queries"
        element={
          <RequireAdmin>
            <AdminLayout>
              <AdminGeneralQueriesPage />
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

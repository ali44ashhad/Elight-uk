import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAdmin } from './components/auth/RequireAdmin'
import { HomePage } from './pages/HomePage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminDashboardHome } from './pages/admin/AdminDashboardHome'
import { AdminPropertiesPage } from './pages/admin/AdminPropertiesPage'
import { AdminDealsPage } from './pages/admin/AdminDealsPage'
import { AdminInquiriesPage } from './pages/admin/AdminInquiriesPage'
import { AdminRefundsPage } from './pages/admin/AdminRefundsPage'
import { AdminGeneralQueriesPage } from './pages/admin/AdminGeneralQueriesPage'
import { AdminInvestorsLoungePage } from './pages/admin/AdminInvestorsLoungePage'
import { AdminProviderApplicationsPage } from './pages/admin/AdminProviderApplicationsPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminPendingPropertiesPage } from './pages/admin/AdminPendingPropertiesPage'
import { AdminPropertyReviewPage } from './pages/admin/AdminPropertyReviewPage'
import { AboutPage } from './pages/AboutPage'
import { GettingStartedPage } from './pages/GettingStartedPage'
import { PropertyDetailsPage } from './pages/PropertyDetailsPage'
import { SellerProfilePage } from './pages/SellerProfilePage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { DealSourceTermsPage } from './pages/DealSourceTermsPage'
import { RefundPage } from './pages/RefundPage'
import { BuyerTermsPage } from './pages/BuyerTermsPage'
import { PropertyConnectPage } from './pages/PropertyConnectPage'
import { BespokePropertyConnectPage } from './pages/BespokePropertyConnectPage'
import { SellerTermsPage } from './pages/SellerTermsPage'
import { UserLoginPage } from './pages/UserLoginPage'
import { UserRegisterPage } from './pages/UserRegisterPage'
import { UserAccountPage } from './pages/UserAccountPage'
import { ProviderPropertiesPage } from './pages/provider/ProviderPropertiesPage'
import { ProviderSubmitPropertyPage } from './pages/provider/ProviderSubmitPropertyPage'
import { ProviderPropertyDetailsPage } from './pages/provider/ProviderPropertyDetailsPage'
import { ProviderEditPropertyPage } from './pages/provider/ProviderEditPropertyPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about-us" element={<AboutPage />} />
      <Route path="/getting-started" element={<GettingStartedPage />} />
      <Route path="/properties/:id" element={<PropertyDetailsPage />} />
      <Route path="/sellers/:id" element={<SellerProfilePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/buyer-terms" element={<BuyerTermsPage />} />
      <Route path="/seller-terms" element={<SellerTermsPage />} />
      <Route path="/bespoke-property-connect" element={<BespokePropertyConnectPage />} />
      <Route path="/property-connect" element={<PropertyConnectPage />} />
      <Route path="/deal-source-terms" element={<DealSourceTermsPage />} />
      <Route path="/refunds" element={<RefundPage />} />
      <Route path="/login" element={<UserLoginPage />} />
      <Route path="/register" element={<UserRegisterPage />} />
      <Route path="/account" element={<UserAccountPage />} />
      <Route path="/provider/properties" element={<ProviderPropertiesPage />} />
      <Route path="/provider/properties/new" element={<ProviderSubmitPropertyPage />} />
      <Route path="/provider/properties/:id" element={<ProviderPropertyDetailsPage />} />
      <Route path="/provider/properties/:id/edit" element={<ProviderEditPropertyPage />} />
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
        path="/admin/pending-properties"
        element={
          <RequireAdmin>
            <AdminLayout>
              <AdminPendingPropertiesPage />
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/pending-properties/:id"
        element={
          <RequireAdmin>
            <AdminLayout>
              <AdminPropertyReviewPage />
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/provider-applications"
        element={
          <RequireAdmin>
            <AdminLayout>
              <AdminProviderApplicationsPage />
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RequireAdmin>
            <AdminLayout>
              <AdminUsersPage />
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
      <Route
        path="/admin/investors-lounge"
        element={
          <RequireAdmin>
            <AdminLayout>
              <AdminInvestorsLoungePage />
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

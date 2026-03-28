import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import useAuthStore from './store/authStore'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import VerifyEmail from './pages/auth/VerifyEmail'
import ResetPassword from './pages/auth/ResetPassword'

// App pages
import Dashboard from './pages/dashboard/Dashboard'
import ThreatFeed from './pages/threat-feed/ThreatFeed'
import IOCScanner from './pages/ioc-scanner/IOCScanner'
import BlogList from './pages/blog/BlogList'
import BlogPost from './pages/blog/BlogPost'
import Landing from './pages/Landing'
import CVESearch from './pages/cve/CVESearch'

// Admin
import BlogAdmin from './pages/admin/blog/BlogAdmin'
import BlogEditor from './pages/admin/blog/BlogEditor'

import NotFound from './pages/NotFound'

// SBOM Scanner
import SBOMScanner from './pages/sbom/SBOMScanner'
import SBOMResults from './pages/sbom/SBOMResults'

// Coming soon
import DNSEmailSecurity from './pages/coming-soon/DNSEmailSecurity'
import NetworkScan from './pages/coming-soon/NetworkScan'
import AIPentest from './pages/coming-soon/AIPentest'
import VendorScorecard from './pages/coming-soon/VendorScorecard'

// Legal pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import TermsOfService from './pages/legal/TermsOfService'
import TermsAndConditions from './pages/legal/TermsAndConditions'
import RefundPolicy from './pages/legal/RefundPolicy'
import CookiePolicy from './pages/legal/CookiePolicy'
import AcceptableUse from './pages/legal/AcceptableUse'
import SecurityPolicy from './pages/legal/SecurityPolicy'

// Company pages
import About from './pages/company/About'
import Contact from './pages/company/Contact'

function RequireAuth() {
  const token = localStorage.getItem('access_token')
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}

function RedirectIfAuth() {
  const token = localStorage.getItem('access_token')
  if (token) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

export const router = createBrowserRouter([
  // Public landing
  { path: '/', element: <Landing /> },

  // Public browsable routes (no auth required — drives SEO)
  { path: '/cve', element: <CVESearch /> },
  { path: '/threat-feed', element: <ThreatFeed /> },
  { path: '/blog', element: <BlogList /> },
  { path: '/blog/:slug', element: <BlogPost /> },
  { path: '/sbom', element: <SBOMScanner /> },
  { path: '/sbom/scan/:scanId', element: <SBOMResults /> },
  { path: '/ioc-scanner', element: <IOCScanner /> },

  // Legal pages
  { path: '/privacy', element: <PrivacyPolicy /> },
  { path: '/terms', element: <TermsOfService /> },
  { path: '/terms-and-conditions', element: <TermsAndConditions /> },
  { path: '/refunds', element: <RefundPolicy /> },
  { path: '/cookies', element: <CookiePolicy /> },
  { path: '/aup', element: <AcceptableUse /> },
  { path: '/security', element: <SecurityPolicy /> },

  // Company pages
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },

  // Email verification and password reset — always public (token is the auth)
  { path: '/verify-email', element: <VerifyEmail /> },
  { path: '/reset-password/:token', element: <ResetPassword /> },

  // Public auth pages (redirect if already logged in)
  {
    element: <RedirectIfAuth />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
    ],
  },

  // Protected app routes
  {
    element: <RequireAuth />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/admin/blog', element: <BlogAdmin /> },
      { path: '/admin/blog/new', element: <BlogEditor /> },
      { path: '/admin/blog/:id/edit', element: <BlogEditor /> },
      { path: '/dns-email', element: <DNSEmailSecurity /> },
      { path: '/network-scan', element: <NetworkScan /> },
      { path: '/ai-pentest', element: <AIPentest /> },
      { path: '/vendor-scorecard', element: <VendorScorecard /> },
    ],
  },

  // Catch-all — 404
  { path: '*', element: <NotFound /> },
])

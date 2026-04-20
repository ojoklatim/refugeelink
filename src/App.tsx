import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Public
import Landing from './pages/Landing';
import Login from './pages/Login';
import RefugeeRegister from './pages/refugee/Register';
import OrgRegister from './pages/organisation/Register';
import BrowseOpportunities from './pages/opportunities/Browse';
import OpportunityDetail from './pages/opportunities/Detail';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Terms from './pages/Terms';

// Protected: Refugee
import RefugeeDashboard from './pages/refugee/Dashboard';
import EditProfile from './pages/refugee/EditProfile';

// Protected: Organisation
import OrgDashboard from './pages/organisation/Dashboard';
import EditOrgProfile from './pages/organisation/EditProfile';
import CreateOpportunity from './pages/organisation/CreateOpportunity';
import ManageOpportunity from './pages/organisation/ManageOpportunity';

// Protected: Admin
import AdminDashboard from './pages/admin/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public Routes */}
              <Route index element={<Landing />} />
              <Route path="login" element={<Login />} />
              <Route path="register/refugee" element={<RefugeeRegister />} />
              <Route path="register/organisation" element={<OrgRegister />} />
              <Route path="opportunities" element={<BrowseOpportunities />} />
              <Route path="opportunities/:id" element={<OpportunityDetail />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="terms" element={<Terms />} />

              {/* Refugee Routes */}
              <Route path="dashboard" element={
                <ProtectedRoute allowedRoles={['refugee']}>
                  <RefugeeDashboard />
                </ProtectedRoute>
              } />
              <Route path="profile/edit" element={
                <ProtectedRoute allowedRoles={['refugee']}>
                  <EditProfile />
                </ProtectedRoute>
              } />

              {/* Organisation Routes */}
              <Route path="org/dashboard" element={
                <ProtectedRoute allowedRoles={['organisation']}>
                  <OrgDashboard />
                </ProtectedRoute>
              } />
              <Route path="org/profile" element={
                <ProtectedRoute allowedRoles={['organisation']}>
                  <EditOrgProfile />
                </ProtectedRoute>
              } />
              <Route path="org/opportunities/new" element={
                <ProtectedRoute allowedRoles={['organisation']}>
                  <CreateOpportunity />
                </ProtectedRoute>
              } />
              <Route path="org/opportunities/:id" element={
                <ProtectedRoute allowedRoles={['organisation']}>
                  <ManageOpportunity />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Admin/Dashboard';
import AdminDestinations from './pages/Admin/Destinations';
import About from './pages/About';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';
import Hajj from './pages/Hajj';
import Omra from './pages/Omra';
import Tourisme from './pages/Tourisme';
import Contact from './pages/Contact';

function App() {
  const { t } = useTranslation();

  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="min-h-screen App bg-gray-50">
          <Routes future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            {/* Page d'accueil avec navigation */}
            <Route path="/" element={<Home />} />
            
            {/* Routes avec design autonome (image de fond) */}
            <Route path="/hajj" element={<Hajj />} />
            <Route path="/omra" element={<Omra />} />
            
            {/* Routes avec layout */}
            <Route path="/app" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="destinations" element={<Destinations />} />
              <Route path="destinations/:id" element={<DestinationDetail />} />
              <Route path="about" element={<About />} />
              <Route path="tourisme" element={<Tourisme />} />
              <Route path="contact" element={<Contact />} />
              
              {/* Routes protégées (nécessitent une inscription) */}
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Routes admin */}
              <Route path="admin" element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              } />
              
              <Route path="admin/destinations" element={
                <AdminRoute>
                  <AdminDestinations />
                </AdminRoute>
              } />
            </Route>
            
            {/* Routes d'authentification (sans layout) */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            {/* Route 404 */}
            <Route path="*" element={
              <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="p-8 text-center border shadow-xl bg-white/80 backdrop-blur-md rounded-3xl border-white/20">
                  <h1 className="mb-4 text-6xl font-bold text-slate-900">404</h1>
                  <p className="mb-6 text-lg text-slate-600">{t('common.pageNotFound')}</p>
                  <a 
                    href="/" 
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span>{t('common.backToHome')}</span>
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
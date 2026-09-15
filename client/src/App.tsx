import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoadingScreen } from './components/LoadingScreen';
import { SmoothScroll } from './components/SmoothScroll';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Events } from './pages/Events';
import { EventDetail } from './pages/EventDetail';
import { EventRegister } from './pages/EventRegister';
import { Resources } from './pages/Resources';
import { ResourceDetail } from './pages/ResourceDetail';
import { ResourceSubmit } from './pages/ResourceSubmit';
import { Members } from './pages/Members';
import { Alumni } from './pages/Alumni';
import { Highlights } from './pages/Highlights';
import { Join } from './pages/Join';
import { Contact } from './pages/Contact';
import { Journey } from './pages/Journey';
import { NotFound } from './pages/NotFound';

// Admin Pages
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { AdminEvents } from './pages/admin/Events';
import { EventCreate } from './pages/admin/EventCreate';
import { EventEdit } from './pages/admin/EventEdit';
import { FormBuilder } from './pages/admin/FormBuilder';
import { AdminRegistrations } from './pages/admin/Registrations';
import { AdminResources } from './pages/admin/Resources';
import { AdminMembers } from './pages/admin/Members';
import { AdminHighlights } from './pages/admin/Highlights';
import { AdminApplications } from './pages/admin/Applications';
import { AdminAnalytics } from './pages/admin/Analytics';
import { AdminAuditLogs } from './pages/admin/AuditLogs';
import { AdminSettings } from './pages/admin/Settings';

import { CyberHuntPopup } from './components/CyberHuntPopup';

export function App() {
  const [loadingDone, setLoadingDone] = useState(() => {
    // Only show loading screen once per session
    return sessionStorage.getItem('scs_loaded') === 'true';
  });

  const handleLoadingComplete = () => {
    sessionStorage.setItem('scs_loaded', 'true');
    setLoadingDone(true);
  };

  return (
    <AuthProvider>
      <SmoothScroll>
        {!loadingDone && <LoadingScreen onComplete={handleLoadingComplete} />}
        <BrowserRouter>
          <CyberHuntPopup />
          <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:slug" element={<EventDetail />} />
            <Route path="/events/:slug/register" element={<EventRegister />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/submit" element={<ResourceSubmit />} />
            <Route path="/resources/:slug" element={<ResourceDetail />} />
            <Route path="/members" element={<Members />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/highlights" element={<Highlights />} />
            <Route path="/join" element={<Join />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Dedicated Cinematic Scroll Journey */}
          <Route path="/journey" element={<Journey />} />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="events/new" element={<EventCreate />} />
            <Route path="events/:id/edit" element={<EventEdit />} />
            <Route path="events/:id/form" element={<FormBuilder />} />
            <Route path="registrations" element={<AdminRegistrations />} />
            <Route path="resources" element={<AdminResources />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="highlights" element={<AdminHighlights />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route
              path="audit-logs"
              element={
                <ProtectedRoute requiredRole="MENTOR">
                  <AdminAuditLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
      </SmoothScroll>
    </AuthProvider>
  );
}

export default App;

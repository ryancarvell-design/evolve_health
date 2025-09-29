import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import NotFound from "pages/NotFound";
import LandingPage from './pages/landing';
import TemplateBuilder from './pages/template-builder';
import LoginPage from './pages/login';
import DocumentLibrary from './pages/document-library';
import Dashboard from './pages/dashboard';
import Register from './pages/register';
import DocumentEditor from './pages/document-editor';
import DocumentCreationHub from './pages/document-creation-hub';
import Pricing from './pages/pricing';
import Contact from './pages/contact';
import AnalyticsDashboard from './pages/analytics-dashboard';
import CollaborationHub from './pages/collaboration-hub';
import UserProfileAndSettings from './pages/user-profile-and-settings';
import HelpCentre from './pages/help-centre';
import TeamManagement from './pages/team-management';
import PatientRegistry from './pages/patient-registry';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help-centre" element={<HelpCentre />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/template-builder" element={
          <ProtectedRoute>
            <TemplateBuilder />
          </ProtectedRoute>
        } />
        <Route path="/document-library" element={
          <ProtectedRoute>
            <DocumentLibrary />
          </ProtectedRoute>
        } />
        <Route path="/document-creation-hub" element={
          <ProtectedRoute>
            <DocumentCreationHub />
          </ProtectedRoute>
        } />
        <Route path="/document-editor" element={
          <ProtectedRoute>
            <DocumentEditor />
          </ProtectedRoute>
        } />
        <Route path="/analytics-dashboard" element={
          <ProtectedRoute>
            <AnalyticsDashboard />
          </ProtectedRoute>
        } />
        <Route path="/collaboration-hub" element={
          <ProtectedRoute>
            <CollaborationHub />
          </ProtectedRoute>
        } />
        <Route path="/user-profile-and-settings" element={
          <ProtectedRoute>
            <UserProfileAndSettings />
          </ProtectedRoute>
        } />
        <Route path="/team-management" element={
          <ProtectedRoute>
            <TeamManagement />
          </ProtectedRoute>
        } />
        <Route path="/patient-registry" element={
          <ProtectedRoute>
            <PatientRegistry />
          </ProtectedRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import Authentication from '../pages/Authentication';
import SignupPage from '../pages/SignupPage';
// import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
// import Dashboard from '../pages/Dashboard';
import PlantAnalyze from '../pages/PlantAnalyzer';
import DetectionPage from '@/pages/DetectionPage';
import SubscribePro from '@/pages/SubscribePro';
import {DocumentPage} from '@/pages/DocumentPage';
import { SubscriptionManager } from '@/components/SubscriptionManager';
import HistoryPage from '@/pages/HistoryPage';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
export const AppRoute = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      {/* Auth routes */}
      <Route path="/auth" element={
        <PublicRoute>
          <Authentication />
        </PublicRoute>
      } />
      {/* <Route path="/profile" element={
      } /> */}

      <Route path="/signup" element={
        <PublicRoute>
          <SignupPage />
        </PublicRoute>
      } />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        // <ProtectedRoute>
        <HomePage />
        // </ProtectedRoute>
      } />

      {/* Protected routes */}
      <Route path="/detect" element={
        // <ProtectedRoute>
        <DetectionPage />
        // </ProtectedRoute>
      } />

      <Route path='/PlantAnalyze' element={
        // <ProtectedRoute>
        <PlantAnalyze />
        // </ProtectedRoute>
      } />

      <Route path='/SubToPro' element={
        // <ProtectedRoute>
        <SubscribePro />
        // </ProtectedRoute>
      } />

      <Route path='/docs' element={
        // <ProtectedRoute>
        <DocumentPage/>
        // </ProtectedRoute>
      } />
      <Route path="/subscribe" element={<SubscriptionManager />} />
      {/* Not found */}
      <Route path="*" element={<h1>Not Found</h1>} />

      <Route path="/history" element={
        // <ProtectedRoute>
        <HistoryPage />
        // </ProtectedRoute>
      } />
    </Routes>
  )
}
export default AppRoute;
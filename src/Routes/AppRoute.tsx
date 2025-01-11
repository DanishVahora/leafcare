import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import Authentication from '../pages/Authentication';
import SignupPage from '../pages/SingupPage';
// import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

export const AppRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        
        {/* Auth routes */}
        <Route path="/auth" element={
          <PublicRoute>
            <Authentication />
          </PublicRoute>
        } />
        
        <Route path="/signup" element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        } />
        </Routes>
        </BrowserRouter>
)
}
export default AppRoute;

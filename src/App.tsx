import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import LandingPage from './components/landing/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import TopicSelector from './components/gd/TopicSelector';
import GDSimulation from './components/gd/GDSimulation';
import FeedbackSummary from './components/gd/FeedbackSummary';
import Navbar from './components/shared/Navbar';
import ErrorBoundary from './components/shared/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<PrivateRoute><><Navbar /><Dashboard /></></PrivateRoute>} />
              <Route path="/topics" element={<PrivateRoute><><Navbar /><TopicSelector /></></PrivateRoute>} />
              <Route path="/simulation/:topicId" element={<PrivateRoute><><Navbar /><GDSimulation /></></PrivateRoute>} />
              <Route path="/feedback/:sessionId" element={<PrivateRoute><><Navbar /><FeedbackSummary /></></PrivateRoute>} />
            </Routes>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
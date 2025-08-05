import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IDE from './pages/IDE';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import React from 'react';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, logout, loadingUser } = useAuth();

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size={12} />
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="flex flex-1">
          <main className="flex-1">
            <Routes>
              {!user ? (
                <>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<IDE user={user} logout={logout} isAuthenticated={!!user} />} />
                  <Route path="/ide" element={<IDE user={user} logout={logout} isAuthenticated={!!user} />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              )}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
export default App;
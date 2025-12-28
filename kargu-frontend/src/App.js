import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CasesPage from './pages/CasesPage';
import UsersPage from './pages/UsersPage';
import './styles/index.css';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
      />
      
      {/* Main Content Area - Centered */}
      <div 
        style={{ 
          marginLeft: '80px',
          paddingTop: '64px',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div style={{ width: '100%', maxWidth: '1400px', padding: '0 24px' }}>
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'cases' && <CasesPage />}
          {currentPage === 'users' && <UsersPage />}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
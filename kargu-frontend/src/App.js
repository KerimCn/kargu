import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CasesPage from './pages/CasesPage';
import UsersPage from './pages/UsersPage';
import FalconEye from './pages/FalconEyePage';
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
      
      {/* Main Content Area */}
      <div 
        className="transition-all duration-300"
        style={{ 
          marginLeft: isSidebarCollapsed ? '80px' : '280px',
          paddingTop: '64px',
          minHeight: '100vh',
        }}
      >
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'cases' && <CasesPage />}
        {currentPage === 'falcon-eye' && <FalconEye />}
        {currentPage === 'users' && <UsersPage />}
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
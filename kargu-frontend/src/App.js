import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/common/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CasesPage from './pages/CasesPage';
import UsersPage from './pages/UsersPage';
import PlaybooksPage from './pages/PlaybooksPage';
import './styles/index.css';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedCaseTab, setSelectedCaseTab] = useState(null);

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
        onNotificationClick={(caseId, tab) => {
          setSelectedCaseId(caseId);
          setSelectedCaseTab(tab);
          setCurrentPage('cases');
        }}
      />
      
      {/* Main Content Area - Centered */}
      <div 
        style={{ 
          marginLeft: '80px',
          paddingTop: '72px',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div style={{ width: '100%', maxWidth: '1400px', padding: '0 24px' }}>
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'cases' && (
            <CasesPage 
              initialCaseId={selectedCaseId}
              initialTab={selectedCaseTab}
              onCaseViewChange={(caseId) => {
                setSelectedCaseId(caseId);
                setSelectedCaseTab(null); // Reset tab when manually selecting a case
              }}
            />
          )}
          {currentPage === 'users' && <UsersPage />}
          {currentPage === 'playbooks' && <PlaybooksPage />}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
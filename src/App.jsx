import { useState } from 'react';
import HomePage from './HomePage';
import LicensePage from './LicensePage';
import LoginPage from './LoginPage';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const handleLoginSuccess = () => {
    setCurrentPage('home');
  };

  const handleGoToLicense = () => {
    setCurrentPage('license');
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
  };

  const handleActivate = () => {
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setCurrentPage('login');
  };

  if (currentPage === 'license') {
    return (
      <LicensePage
        onActivate={handleActivate}
        onBackToLogin={handleBackToLogin}
      />
    );
  }

  if (currentPage === 'home') {
    return <HomePage onLogout={handleLogout} />;
  }

  return (
    <LoginPage
      onLoginSuccess={handleLoginSuccess}
      onGoToLicense={handleGoToLicense}
    />
  );
}

export default App;

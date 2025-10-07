import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import useModalStore from './store'; // Import our new store
import LogoutModal from './components/LogoutModal';
import ReportItemModal from './components/ReportItemModal';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

const App = () => {
  const navigate = useNavigate();

  // Get all modal states and actions from the global store
  const {
    isLogoutModalOpen,
    closeLogoutModal,
    isReportModalOpen,
    reportType,
    closeReportModal
  } = useModalStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeLogoutModal(); // Close modal on success
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>

      {/* Render modals globally here */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
      />
      <ReportItemModal
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
        reportType={reportType}
      />
    </div>
  );
};

export default App;

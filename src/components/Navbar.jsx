import React from 'react';
import { Link } from 'react-router-dom';
import useModalStore from '../store'; // Import our global store

const ProfileIcon = () => (
  <svg className="w-8 h-8 text-gray-600 hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"></path>
  </svg>
);

const Navbar = () => {
  // Get only the 'open' actions from the store
  const { openLogoutModal, openReportModal } = useModalStore();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">FindIt</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => openReportModal('lost')} className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition">Report Lost</button>
            <button onClick={() => openReportModal('found')} className="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition">Report Found</button>
            <Link to="/profile" className="p-1 rounded-full">
              <ProfileIcon />
            </Link>
            <button onClick={openLogoutModal} className="text-gray-500 hover:text-gray-700 text-sm font-medium">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const ProtectedRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged is a listener that checks for login state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    // You can show a loading spinner here
    return <div>Loading...</div>;
  }

  // If there is a user, render the main app content (the <Outlet />)
  // If not, redirect them to the login page
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

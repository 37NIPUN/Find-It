import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Import your page components
import Home from './components/Home.jsx';
import ReportLost from './components/ReportLost.jsx';
import ReportFound from './components/ReportFound.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Profile from './components/Profile.jsx';

// Define the application routes with the corrected structure
const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />, // This component now wraps the entire authenticated app layout
    children: [
      {
        path: '/',
        element: <App />, // The App component is the layout for all nested routes
        children: [
          {
            index: true, // Render Home at the root '/' path
            element: <Home />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          // The ReportLost and ReportFound components are not actual pages,
          // they are modals, so we don't need routes for them.
          // The Navbar buttons will open the modals.
        ]
      }
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

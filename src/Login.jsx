import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase'; 
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (err) {
      setError("Failed to send password reset email. Please check the email address.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">FindIt</h1>
          <p className="text-gray-500">Welcome to FindIt!</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required 
          />
          {/* Password input with visibility toggle */}
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              name="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          
          <div className="text-right">
            <button 
              type="button" 
              onClick={handleForgotPassword}
              className="text-sm text-blue-500 hover:underline font-semibold"
            >
              Forgot Password?
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center -my-2">{error}</p>}
          {message && <p className="text-green-500 text-sm text-center -my-2">{message}</p>}

          <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300 disabled:opacity-50">
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Are you a new user?{" "}
            <Link to="/register" className="text-blue-500 hover:underline font-semibold">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

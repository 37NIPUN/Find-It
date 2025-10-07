import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase'; // Import db from firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore'; // Import firestore functions

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const name = e.target.name.value;
    const studentId = e.target.studentId.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // --- THIS IS THE UPDATED PART ---
      // Add the new user document with item counts initialized to 0
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        studentId: studentId,
        email: email,
        uid: user.uid,
        lostItemCount: 0,
        foundItemCount: 0
      });

      navigate("/");
    } catch (err) {
      setError("Failed to create an account. Email may already be in use.");
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
          <p className="text-gray-500">Create your account</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" name="name" placeholder="Name" className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
          <input type="text" name="studentId" placeholder="Student ID" className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
          <input type="email" name="email" placeholder="Email" className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />

          {/* Password input with visibility toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
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

          <div className="pt-2">
            <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300 disabled:opacity-50">
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

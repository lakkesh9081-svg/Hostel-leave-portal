import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const login = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: form.email,
        password: form.password
      });


      const { token } = response.data;
      localStorage.setItem('token', token);

      // Fetch user profile to determine role
      const profileRes = await axios.get(`${BACKEND_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });


      const role = profileRes.data.role || 'student';

      // Navigate based on role
      switch(role) {
        case 'student':
          navigate('/student');
          break;
        case 'parent':
          navigate('/parent');
          break;
        case 'tutor':
          navigate('/tutor');
          break;
        case 'hod':
          navigate('/hod');
          break;
        case 'warden':
          navigate('/warden');
          break;
        default:
          navigate('/student');
      }
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden relative">

      {/* Enhanced Animated Background */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-3xl opacity-20 top-[-150px] left-[-150px] animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-3xl opacity-20 bottom-[-150px] right-[-150px] animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full blur-3xl opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-2 h-2 bg-pink-400 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full opacity-80 animate-ping animation-delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-3 h-3 bg-purple-400 rounded-full opacity-50 animate-ping animation-delay-2000"></div>
        <div className="absolute top-60 left-60 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-70 animate-ping animation-delay-3000"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-[450px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[35px] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-8 hover:shadow-pink-500/30 transition duration-500">

        {/* Logo */}
        <div className="flex justify-center mb-6">

          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl animate-pulse">
            H
          </div>

        </div>

        {/* Title */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-wide">
            Hostel Portal
          </h1>

          <p className="text-gray-300 mt-2 text-sm">
            Smart Leave Management System
          </p>

        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-300 text-sm text-center">
            {errors.general}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-5">

          <div>

            <label className="text-white text-sm mb-2 block flex items-center">
              <svg className="w-5 h-5 mr-2 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full p-4 rounded-2xl bg-white/10 border text-white placeholder-gray-300 outline-none transition duration-300 ${
                errors.email ? 'border-red-400 focus:ring-red-400' : 'border-white/20 focus:border-pink-400 focus:ring-2 focus:ring-pink-400'
              }`}
              onChange={(e) => {
                setForm({
                  ...form,
                  email: e.target.value
                });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              value={form.email}
            />

            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}

          </div>

          <div>

            <label className="text-white text-sm mb-2 block flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`w-full p-4 rounded-2xl bg-white/10 border text-white placeholder-gray-300 outline-none transition duration-300 ${
                  errors.password ? 'border-red-400 focus:ring-red-400' : 'border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400'
                }`}
                onChange={(e) => {
                  setForm({
                    ...form,
                    password: e.target.value
                  });
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                value={form.password}
              />

              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>

            </div>

            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}

          </div>

          {/* Button */}
          <button
            onClick={login}
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-lg shadow-lg hover:scale-105 hover:shadow-pink-500/50 transition duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-300 text-sm">

          <p className="mb-2">
            Hostel Leave Approval Workflow
          </p>

          <div className="text-xs text-gray-400 bg-black/20 p-3 rounded-2xl">
            Parent → Tutor → HOD → Warden
          </div>

        </div>

      </div>

    </div>
  );
}
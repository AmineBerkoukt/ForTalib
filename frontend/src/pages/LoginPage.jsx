// Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, Moon, Sun } from 'lucide-react';
import { useAuthStore } from "../store/useAuthStore";
import { useTheme } from "../contexts/ThemeContext";
import LoginHero from "../components/skeletons/LoginHero";
import Footer from "../components/Footer.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(formData);
      if (response?.token) {
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
      <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark" : ""}`}>
        <div className="flex-grow flex flex-col lg:flex-row">
          {/* Left Side - Form */}
          <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
            <div className="w-full max-w-md space-y-8 relative z-10">
              {/* Logo and Welcome Text */}
              <div className="text-center mb-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 animate-float">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white animate-fade-in-up">Welcome Back</h1>
                  <p className="text-base text-gray-600 dark:text-gray-400 animate-fade-in-up animation-delay-200">Sign in to your account</p>
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <div className="flex justify-center animate-fade-in-up animation-delay-400">
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md"
                    onClick={toggleDarkMode}
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDarkMode ? (
                      <>
                        <Sun className="w-5 h-5" /> Light Mode
                      </>
                  ) : (
                      <>
                        <Moon className="w-5 h-5" /> Dark Mode
                      </>
                  )}
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up animation-delay-600">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="email"
                        type="email"
                        className="block w-full pl-10 pr-3 py-3 text-base border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="block w-full pl-10 pr-10 py-3 text-base border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={6}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-dark transition-colors duration-300">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                      disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Signing in...
                        </>
                    ) : (
                        "Sign in"
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center animate-fade-in-up animation-delay-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link to="/signup" className="font-medium text-primary hover:text-primary-dark transition-colors duration-300">
                    Create account
                  </Link>
                </p>
              </div>
            </div>
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl animate-pulse animation-delay-1000"></div>
          </div>

          {/* Right Side - LoginHero component */}
          <LoginHero />
        </div>

        {/* Footer */}
        <Footer />
      </div>
  );
};

export default LoginPage;
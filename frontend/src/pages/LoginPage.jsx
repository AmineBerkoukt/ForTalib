import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Info, Loader2, Lock, Mail, MessageSquare, Moon, Sun } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useTheme } from "../contexts/ThemeContext";
import LoginHero from "../components/skeletons/LoginHero";
import Footer from "../components/Footer.jsx";
import GoogleLoginButton from "../components/GoogleLoginButton.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailValid = validateEmail(formData.email);
    const passwordValid = validatePassword(formData.password);

    if (!emailValid || !passwordValid) {
      setErrors({
        email: emailValid ? "" : "Invalid email format",
        password: passwordValid ? "" : "Password must be at least 8 characters",
      });
      return;
    }

    try {
      const response = await login(formData);
      if (response?.token) {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
      <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark" : ""}`}>
        <div className="flex-grow flex flex-col lg:flex-row">
          {/* Left Side - Form */}
          <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
            {/* Dark Mode Toggle */}
            <div className="absolute top-4 right-4 z-20">
              <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <div className="w-full max-w-md space-y-8 relative z-10">
              {/* Logo and Welcome Text */}
              <div className="text-center mb-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
                  <p className="text-base text-gray-600 dark:text-gray-400">Sign in to your account</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Google Login */}
                <div className="w-full">
                  <GoogleLoginButton />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="email"
                        type="email"
                        className="block w-full pl-10 pr-3 py-3 text-base border border-gray-300 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="block w-full pl-10 pr-10 py-3 text-base border border-gray-300 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-dark">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform hover:scale-105"
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

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - LoginHero */}
          <LoginHero />
        </div>

        {/* Footer */}
        <Footer />
      </div>
  );
};

export default LoginPage;

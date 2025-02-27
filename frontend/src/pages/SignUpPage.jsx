import React, { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { HomeIcon, BadgeIcon, Loader2, Lock, Mail, MessageSquare, Moon, Sun, User, Phone } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTheme } from "../contexts/ThemeContext.jsx";
import GoogleLoginButton from "../components/GoogleLoginButton.jsx";
import LoginHero from "../components/skeletons/LoginHero.jsx";
import FormInput from "../components/FormInput.jsx";
import initUpperCase from "../utils/initUpperCase.js";
import TermsAndConditionsModal from "../components/TermsAndConditionsModal.jsx";
import Footer from "../components/Footer.jsx";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const phoneNumberRef = useRef();

    const { signup, isSigningUp } = useAuthStore();
    const navigate = useNavigate();
    const { isDarkMode, toggleDarkMode } = useTheme();

    const validateForm = () => {
        if (!acceptTerms) {
            toast.error("You must accept the Terms and Conditions.");
            return false;
        }

        const fields = [
            { ref: firstNameRef, message: "Please enter your first name" },
            { ref: lastNameRef, message: "Please enter your last name" },
            { ref: emailRef, message: "Please enter your email" },
            { ref: passwordRef, message: "Please enter your password" },
            { ref: phoneNumberRef, message: "Please enter your phone number" },
        ];

        for (const field of fields) {
            if (!field.ref.current.value.trim()) {
                toast.error(field.message);
                return false;
            }
        }

        if (!/\S+@\S+\.\S+/.test(emailRef.current.value)) {
            toast.error("Invalid email format");
            return false;
        }

        if (passwordRef.current.value.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return false;
        }

        //if (!/^(0[67]|\+212)[0-9]{8}$/.test(phoneNumberRef.current.value)) {
          //  toast.error("Invalid phone number");
            //return false;
        //}

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const formData = {
                firstName: initUpperCase(firstNameRef.current.value),
                lastName: lastNameRef.current.value.toUpperCase(),
                email: emailRef.current.value.toLowerCase(),
                password: passwordRef.current.value,
                phoneNumber: phoneNumberRef.current.value,
                hasAcceptedTermsAndConditions: acceptTerms // Add this line
            };

            console.log("sending data : " , formData)

            try {
                await signup(formData);
                navigate("/complete-signup");
            } catch (error) {
                toast.error("Error while creating the account, please try again!");
            }
        }
    };


    return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark" : ""}`}>
            <div className="flex-1 flex flex-col lg:flex-row">
                <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-white dark:bg-gray-900 transition-colors duration-200 relative">
                    {/* Dark Mode Toggle */}
                    <div className="absolute top-4 right-4 z-20">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {isDarkMode ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center mb-8">
                            <div className="flex flex-col items-center gap-2 group">
                                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <MessageSquare className="w-8 h-8 text-primary" />
                                </div>
                                <h1 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">Create your account</h1>
                                <p className="text-base text-gray-600 dark:text-gray-400">Get started with your free account</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="w-full">
                                <GoogleLoginButton />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or</span>
                                </div>
                            </div>

                            <FormInput label="First Name" icon={User} inputRef={firstNameRef} placeholder="Enter your first name" />
                            <FormInput label="Last Name" icon={User} inputRef={lastNameRef} placeholder="Enter your last name" />
                            <FormInput label="Email" icon={Mail} inputRef={emailRef} placeholder="Enter your email" type="email" />
                            <FormInput label="Password" icon={Lock} inputRef={passwordRef} placeholder="••••••" type="password" showPassword={showPassword} setShowPassword={setShowPassword} />
                            <FormInput label="Phone" icon={Phone} inputRef={phoneNumberRef} placeholder="Enter your phone number" />

                            <div className="flex items-center">
                                <input type="checkbox" id="terms" checked={acceptTerms} onChange={() => setAcceptTerms(!acceptTerms)} className="mr-2" />
                                <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                                    I accept the <span className="text-primary cursor-pointer" onClick={() => setIsModalOpen(true)}>Terms and Conditions</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 bg-primary text-white rounded-md transition flex items-center justify-center"
                                disabled={isSigningUp}
                            >
                                {isSigningUp ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create your account"
                                )}
                            </button>

                            <div className="text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Already have an account?{" "}
                                    <Link to="/login" className="font-medium text-primary hover:text-primary-dark transition-colors duration-300">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                <LoginHero />
            </div>

            <Footer />
            <TermsAndConditionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default SignUpPage;
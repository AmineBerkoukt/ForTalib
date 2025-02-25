import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useTheme } from "./contexts/ThemeContext.jsx";
import { Toaster } from "react-hot-toast";
import PostDetailsModal from "./components/PostDetailsModal";
import { useModalStore } from "./store/useModalStore.js";

// Components and Pages
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage.jsx";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";
import PageNotFoundPage from "./pages/PageNotFoundPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import SavedPage from "./pages/SavedPage.jsx";
import UserManagementPage from "./pages/UserManagementPage.jsx";
import RequestsPage from "./pages/RequestsPage.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

// Route Protection HOC
const ProtectedRoute = ({ element, isAuthenticated, redirectTo }) => {
    return isAuthenticated ? element : <Navigate to={redirectTo} />;
};

const RoleProtectedRoute = ({
                                element,
                                isAuthenticated,
                                userRole,
                                allowedRoles,
                                redirectTo,
                            }) => {
    if (!isAuthenticated) return <Navigate to={redirectTo} />;
    return allowedRoles.includes(userRole) ? element : <Navigate to={redirectTo} />;
};

// Loading Spinner
const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen bg-gray-300 dark:bg-gray-900">
        <div className="text-5xl font-bold text-blue-500 dark:text-blue-300">
            <span className="inline-block animate-pulse delay-100">e</span>
            <span className="inline-block animate-bounce delay-200">L</span>
            <span className="inline-block animate-pulse delay-300">o</span>
            <span className="inline-block animate-bounce delay-400">c</span>
        </div>
    </div>
);

const App = () => {
    const { authUser, checkAuth, isCheckingAuth, role } = useAuthStore();
    const { isDarkMode } = useTheme();
    const location = useLocation();
    const { isModalOpen, modalData, disactivateModal } = useModalStore();

    const publicRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];

    React.useEffect(() => {
        if (!publicRoutes.includes(location.pathname)) {
            checkAuth().catch(() => {
                useAuthStore.getState().clearAuth();
                window.location.href = "/login";
            });
        }
    }, [checkAuth, location.pathname]);

    React.useEffect(() => {
        if (!authUser && !publicRoutes.includes(location.pathname)) {
            window.location.href = "/login";
        }
    }, [authUser, location.pathname]);

    if (isCheckingAuth && !authUser && !publicRoutes.includes(location.pathname)) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    className: isDarkMode ? "!bg-gray-800 !text-white" : "",
                    duration: 3000,
                }}
            />

            <PostDetailsModal
                isOpen={isModalOpen}
                onClose={disactivateModal}
                post={modalData}
            />

            <ScrollToTop />

            <Routes>
                {/* Public Routes */}
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Home />} />

                {/* Protected Routes */}
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute
                            element={<ChatPage />}
                            isAuthenticated={!!authUser}
                            redirectTo="/login"
                        />
                    }
                />
                <Route
                    path="/saved"
                    element={
                        <ProtectedRoute
                            element={<SavedPage />}
                            isAuthenticated={!!authUser}
                            redirectTo="/login"
                        />
                    }
                />
                <Route
                    path="/profile/:id?"
                    element={
                        <ProtectedRoute
                            element={<ProfilePage />}
                            isAuthenticated={!!authUser}
                            redirectTo="/login"
                        />
                    }
                />

                {/* Admin-Only Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <RoleProtectedRoute
                            element={<DashboardPage />}
                            isAuthenticated={!!authUser}
                            userRole={role}
                            allowedRoles={["admin"]}
                            redirectTo="/login"
                        />
                    }
                />
                <Route
                    path="/requests"
                    element={
                        <RoleProtectedRoute
                            element={<RequestsPage />}
                            isAuthenticated={!!authUser}
                            userRole={role}
                            allowedRoles={["admin"]}
                            redirectTo="/login"
                        />
                    }
                />
                <Route
                    path="/management"
                    element={
                        <RoleProtectedRoute
                            element={<UserManagementPage />}
                            isAuthenticated={!!authUser}
                            userRole={role}
                            allowedRoles={["admin"]}
                            redirectTo="/login"
                        />
                    }
                />

                {/* Error Pages */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="*" element={<PageNotFoundPage />} />
            </Routes>
        </>
    );
};

export default App;
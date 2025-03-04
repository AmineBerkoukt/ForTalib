import React, {useState, useEffect} from "react";
import {Routes, Route, Navigate, useLocation, useNavigate} from "react-router-dom";
import {useAuthStore} from "./store/useAuthStore";
import {useTheme} from "./contexts/ThemeContext.jsx";
import {Toaster, toast} from "react-hot-toast";
import PostDetailsModal from "./components/modals/PostDetailsModal.jsx";
import {useModalStore} from "./store/useModalStore.js";

// Components and Pages
import HomePage from "./pages/HomePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";
import PageNotFoundPage from "./pages/PageNotFoundPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import SavedPage from "./pages/SavedPage.jsx";
import UserManagementPage from "./pages/UserManagementPage.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";
import CompleteSignUpPage from "./pages/CompleteSignUpPage.jsx";
import BanManagementPage from "./pages/BanManagementPage.jsx";
import HomeLoading from "./components/skeletons/HomeLoading.jsx";

const ProtectedRoute = ({element, isAuthenticated, redirectTo}) => {
    return isAuthenticated ? element : <Navigate to={redirectTo}/>;
};

const RoleProtectedRoute = ({
                                element,
                                isAuthenticated,
                                userRole,
                                allowedRoles,
                                redirectTo,
                            }) => {
    if (!isAuthenticated) return <Navigate to={redirectTo}/>;
    return allowedRoles.includes(userRole) ? element : <Navigate to={redirectTo}/>;
};


const App = () => {
    const {authUser, checkAuth, isCheckingAuth, role, logout} = useAuthStore();
    const {isDarkMode} = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const {isModalOpen, modalData, disactivateModal} = useModalStore();
    const [isLoading, setIsLoading] = useState(true);

    const publicRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token && !publicRoutes.includes(location.pathname)) {
                await logout();
                navigate("/login");
                return;
            }

            if (!publicRoutes.includes(location.pathname)) {
                try {
                    await checkAuth();
                } catch (e) {
                    logout();
                    navigate("/login");
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, [checkAuth, logout, location.pathname, navigate]);

    //Console access
    useEffect(() => {
        // Handle Right Click
        const handleRightClick = (event) => {
            event.preventDefault(); // Prevent default right-click menu
            toast("🤓 You can't inspect me", {
                duration: 1000,
                className: isDarkMode ? "!bg-gray-800 !text-white" : "",
            });
        };

        // Detect keyboard shortcuts for dev tools
        const handleKeyboardShortcut = (e) => {
            if (
                e.key === "F12" || // F12 for dev tools
                (e.ctrlKey && (e.key === "I" || e.key === "J")) // Ctrl+I or Ctrl+Shift+I for dev tools
            ) {
                e.preventDefault();
                toast("🤓 You can't inspect me", {
                    duration: 1000,
                    className: isDarkMode ? "!bg-gray-800 !text-white" : "",
                });
            }
        };


        // Add event listeners
        document.addEventListener("contextmenu", handleRightClick);
        document.addEventListener("keydown", handleKeyboardShortcut);

        return () => {
            // Cleanup
            document.removeEventListener("contextmenu", handleRightClick);
            document.removeEventListener("keydown", handleKeyboardShortcut);
        };
    }, [isDarkMode]);

    if (isLoading || (isCheckingAuth && !authUser && !publicRoutes.includes(location.pathname))) {
        return <HomeLoading/>;
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

            <ScrollToTop/>

            <Routes>
                {/* Public Routes */}
                <Route path="/signup" element={<SignUpPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/" element={<HomePage/>}/>

                {/* Protected Routes */}
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute
                            element={<ChatPage/>}
                            isAuthenticated={!!authUser}
                            redirectTo="/login"
                        />
                    }
                />
                <Route
                    path="/saved"
                    element={
                        <ProtectedRoute
                            element={<SavedPage/>}
                            isAuthenticated={!!authUser}
                            redirectTo="/login"
                        />
                    }
                />
                <Route
                    path="/profile/:id?"
                    element={
                        <ProtectedRoute
                            element={<ProfilePage/>}
                            isAuthenticated={!!authUser}
                            redirectTo="/login"
                        />
                    }
                />
                <Route
                    path="/complete-signup"
                    element={
                        <CompleteSignUpPage
                            element={<ChatPage/>}
                            isAuthenticated={!!authUser}
                            redirectTo="/login"
                        />
                    }
                />
                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute
                            element={<ChangePasswordPage/>}
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
                            element={<DashboardPage/>}
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
                            element={<UserManagementPage/>}
                            isAuthenticated={!!authUser}
                            userRole={role}
                            allowedRoles={["admin"]}
                            redirectTo="/login"
                        />
                    }
                />
                <Route
                    path="/bans"
                    element={
                        <RoleProtectedRoute
                            element={<BanManagementPage/>}
                            isAuthenticated={!!authUser}
                            userRole={role}
                            allowedRoles={["admin"]}
                            redirectTo="/login"
                        />
                    }
                />

                {/* Error Pages */}
                <Route path="/unauthorized" element={<UnauthorizedPage/>}/>
                <Route path="*" element={<PageNotFoundPage/>}/>
            </Routes>
        </>
    );
};

export default App;

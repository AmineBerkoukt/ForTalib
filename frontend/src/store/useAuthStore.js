import {create} from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";
import api from "../utils/api.js";

// Set the BASE_URL based on the environment
const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL_NOAPI = import.meta.env.VITE_PFP_URL;


// Define the Zustand store
export const useAuthStore = create((set, get) => ({
    authUser: null,
    role: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,


    oAuthLogin: async (authData) => {
        try {
            const response = await api.post(`/auth/google/register`, authData);

            if (!response.data.token || !response.data.user) {
                throw new Error("Invalid response from server");
            }

            try {
                localStorage.setItem("token", response.data.token);
            } catch (storageError) {
                console.warn("Could not save token to localStorage", storageError);
            }

            set({ authUser: response.data.user, role: response.data.user.role });

            get().connectSocket();
        } catch (error) {
            console.error("Error in OAuth login:", error.response?.data?.message || error.message);
            toast.error("OAuth login failed");
        }
    },

    // Check authentication and fetch the logged-in user's data
    checkAuth: async () => {
        try {
            const storedToken = localStorage.getItem("token");

            if (!storedToken) {
                set({authUser: undefined});
                return;
            }

            const res = await api.get("/users/me", {
                headers: {Authorization: `Bearer ${storedToken}`},
            });

            set({authUser: res.data, role: res.data.role});
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth:", error.message);
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },


    // Sign up a new user
    signup: async (data) => {
        set({isSigningUp: true});
        try {
            const res = await api.post("/auth/register", data);
            if (res.status === 201) {
                set({authUser: res.data});
                toast.success("Account created successfully");
                localStorage.setItem('token', res.data.token);
                get().connectSocket();
                return res.data;
            } else {
                res.errors.map(err => toast.error(err))
            }

        } catch (error) {
            if (error.status === 429) {
                toast.error(error.response.data.error);
            }
            toast.error(error.response.data.message || "Failed to create account");
        } finally {
            set({isSigningUp: false});
        }
    },

    oauthLogin: async (authData) => {
        try {
            // Save token in localStorage
            localStorage.setItem("token", authData.accessToken);

            // Update store with authenticated user and role
            set({authUser: authData.profile, role: authData.role});

            // Show success message
            toast.success("Logged in with Google successfully");

            // Connect the user to the socket
            get().connectSocket();
        } catch (error) {
            console.error("Error in OAuth login:", error);
            toast.error("OAuth login failed");
        }
    },


    // Log in an existing user
    login: async (data) => {
        set({isLoggingIn: true});
        try {
            const res = await api.post("/auth/login", data);

            await localStorage.setItem('token', res.data.token);

            set({authUser: res.data});
            console.log(get().authUser);
            toast.success("Logged in successfully");
            get().connectSocket();
            return res.data;
        } catch (error) {
            if (error.status === 429) {
                toast.error(error.response.data.error);
            }
            toast.error(error.response.data.message || "Login failed");
            get().logout();
        } finally {
            set({isLoggingIn: false});
        }
    },

    // Log out the current user
    logout: async () => {
        try {
            localStorage.removeItem("token");
            set({authUser: null});
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message || "Logout failed");
        }
    },


    // Connect the user to the Socket.IO server
    connectSocket: () => {
        const {authUser} = get();

        if (!authUser) {
            console.warn("Cannot connect socket: authUser is not defined.");
            return;
        }

        if (get().socket?.connected) {
            console.log("Socket already connected");
            return;
        }

        const socket = io(BASE_URL_NOAPI, {
            query: {userId: authUser._id},
        });

        set({socket});

        socket.on("connect", () => {
            console.log(`Socket connected with ID: ${socket.id}`);
        });

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds});
        });

        socket.on("forceLogout", (message) => {
            console.warn("User banned, logging out...");
            toast.error(message);
            localStorage.removeItem("token");
            set({ authUser: null });
            window.location.href = "/login";
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });
    },

    // Disconnect the user's socket
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
            console.log("Disconnecting socket");
            socket.disconnect();
        }
    },

    // Update the user's profile
    updateProfile: async (data) => {
        set({isUpdatingProfile: true});
        const apiConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        try {
            const res = await api.patch(BASE_URL + "/users/update-profile", data, apiConfig);
            set({authUser: res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in updateProfile:", error);
        } finally {
            set({isUpdatingProfile: false});
        }
    },

    //http://localhost:5000/api/auth/forgot-password
    forgotPassword: async (email) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password', email);
            toast.success("Reset instructions sent successfully!");
            return response;
        } catch (error) {
            toast.error("Error during the process. Please retry !");
            console.log("Error in forgotPassword:", error.message);
        }

    },

    resetPassword: async (token, newPassword) => {
        try {
            const response = await api.post(`/auth/reset-password/${token}`, newPassword);
            toast.success("Password changed successfully !");
            return response;

        } catch (error) {
            toast.error("Error during the process. Please retry !");
            console.log("Error in resetPassword:", error);
        }
    },

}));

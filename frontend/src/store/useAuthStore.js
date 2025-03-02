import {create} from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";
import api from "../utils/api.js";

// Set the BASE_URL based on the environment
const BASE_URL = import.meta.env.VITE_BASE_URL;

const token = localStorage.getItem('token');

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
            // Save token in localStorage
            const response = await axios.post(BASE_URL + "/auth/google/register", authData);

            await localStorage.setItem("token", response.data.token);


            set({authUser: response.data.user, role: response.data.user.role});

            // Connect the user to the socket
            get().connectSocket();
        } catch (error) {
            console.error("Error in OAuth login:", error.message);
            toast.error("OAuth login failed");
        }
    },

    // Check authentication and fetch the logged-in user's data
    checkAuth: async () => {
        try {
            const storedToken = localStorage.getItem("token");

            if (!storedToken) {
                set({authUser: null});
                return;
            }

            const res = await axios.get(BASE_URL + "/users/me", {
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
            const res = await axios.post(BASE_URL + "/auth/register", data);
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
            const res = await axios.post("http://localhost:5000/api/auth/login", data);

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

        const socket = io("http://localhost:5000", {
            query: {userId: authUser._id},
        });

        set({socket});

        socket.on("connect", () => {
            console.log(`Socket connected with ID: ${socket.id}`);
        });

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds});
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
}));

import { create } from "zustand";
import api from "../utils/api.js";
import toast from "react-hot-toast";


export const useProfileStore = create((set, get) => ({
    profilePosts: [],
    user: [],

    // Fetch all posts
    getUserPosts: async (userId) => {
        try {
            const res = await api.get(`/posts/postsFor?userId=${userId}`);
            set({ profilePosts: res.data }); // Set posts state
            console.log("usePostStore.userPosts res", res.data);
        } catch (error) {
            console.log("usePostStore.getPosts err", error.message);
        }
    },

    getUser: async (userId) => {
        try {
            const res = await api.get(`/users/${userId}`);
            set({ user: res.data });
            console.log("userData : ", res.data);
        } catch (error) {
            console.log("usePostStore.getPostsFilter err", error.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });

        try {
            const isFormData = data instanceof FormData;
            const apiConfig = isFormData ? {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            } : {};

            const res = await api.patch( '/users/update-profile',data, apiConfig);

            // Update the auth user state with the new data
            const updatedUser = res.data;

            // Update both the user state and return the updated user data
            set((state) => ({
                user: Array.isArray(state.user)
                    ? state.user.map(u => u._id === updatedUser._id ? updatedUser : u)
                    : updatedUser
            }));

            return { user: updatedUser }; // Return the updated user data
        } catch (error) {
            console.error("Error in updateProfile:", error);
            throw error; // Re-throw the error to handle it in the component
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    changePassword: async (userId) => {
        try {
            const res = await api.get(`/users/${userId}`);
            set({ user: res.data });
            console.log("userData : ", res.data);
        } catch (error) {
            console.log("usePostStore.getPostsFilter err", error.message);
        }
    },


}));

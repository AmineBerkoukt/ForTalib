import { create } from "zustand";
import api from "../utils/api.js";
import toast from "react-hot-toast";

export const useSavedPostStore = create((set) => ({
    savedPosts: [],
    savedPostsIds:[],
    loading: true,

    // Fetch all saved posts
    getSavedPosts: async () => {
        try {
            set({ loading: true, error: null });
            const response = await api.get("/saved");
            console.info(response.data);
            set({ savedPosts: response.data, loading: false });
            if(response.status === 404) {
                toast.error("No saved posts");
            }
        } catch (err) {
            console.error("Failed to fetch saved posts:", err);
            set({ savedPosts: [], loading: false, error: err.message });
        }
    },

    getSavedPostsIds: async () => {
        try {
            set({ loading: true, error: null });
            const response = await api.get("/saved/ids");
            set({ savedPostsIds: response.data, loading: false });
        } catch (err) {
            console.error("Failed to fetch saved posts:", err);
        }
    }
}));

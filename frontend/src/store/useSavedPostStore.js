import { create } from "zustand";
import api from "../utils/api.js";

export const useSavedPostStore = create((set) => ({
    savedPosts: [],
    loading: true,
    error: null,

    // Fetch all saved posts
    fetchSavedPosts: async () => {
        set({ loading: true, error: null }); // Set loading state
        try {
            const response = await api.get("/saved");
            set({ savedPosts: response.data, loading: false });
        } catch (err) {
            set({
                error: err.message || "Failed to fetch saved posts",
                loading: false,
            });
        }
    },
}));

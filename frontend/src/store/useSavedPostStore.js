import { create } from "zustand";
import api from "../utils/api.js";

export const useSavedPostStore = create((set) => ({
    savedPosts: [],
    loading: true,

    // Fetch all saved posts
    getSavedPosts: async () => {
        try {
            set({ loading: true, error: null });
            const response = await api.get("/saved");
            set({ savedPosts: response.data, loading: false });
        } catch (err) {
            console.error("Failed to fetch saved posts:", err);
            set({ savedPosts: [], loading: false, error: err.message });
        }
    }
}));

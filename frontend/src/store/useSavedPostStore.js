import { create } from "zustand";
import api from "../utils/api.js";
import toast from "react-hot-toast";

export const useSavedPostStore = create((set) => ({
    savedPosts: [],
    savedPostsIds: [],
    loading: false,

    getSavedPosts: async () => {
        set({ loading: true, error: null }); // Start loading

        try {
            const response = await api.get("/saved");
            console.info(response.data);

            if (response.status === 404) {
                set({ savedPosts: [], loading: false });
                toast.error("No saved posts");
            } else {
                set({ savedPosts: response.data, loading: false });
            }
        } catch (err) {
            console.error("Failed to fetch saved posts:", err);
            set({ savedPosts: [], loading: false, error: err.message });
        }
    },

    getSavedPostsIds: async () => {
        set({ loading: true, error: null }); // Start loading

        try {
            const response = await api.get("/saved/ids");
            set({ savedPostsIds: response.data, loading: false });
        } catch (err) {
            console.error("Failed to fetch saved posts:", err);
            set({ loading: false, error: err.message });
        }
    }
}));

import { create } from "zustand";
import api from "../utils/api.js";
import toast from "react-hot-toast";

export const useSavedPostStore = create((set) => ({
    savedPosts: [],
    savedPostsIds: [],
    loading: false,

    /*
     const fetchSavedPosts = async () => {
            try {
                const response = await api.get("/saved");
                setSavedPosts(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch saved posts:", err);
                setSavedPosts([]);
                setLoading(false);
            }
        };
    */

    getSavedPosts: async () => {

        try {
            set({ loading: true, error: null }); // Start loading
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
            set({loading: false });
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

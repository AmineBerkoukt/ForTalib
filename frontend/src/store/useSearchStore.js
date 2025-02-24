import { create } from "zustand";
import api from "../utils/api.js"; // Your API helper
import toast from "react-hot-toast";

export const useSearchStore = create((set, get) => ({
    isSearching: false,
    searchResult: [],

    searchUser: async (keyword) => {
        set({ isSearching: true });
        try {
            const res = await api.get(`/users/search?keyword=${keyword}`);
            set({ searchResult: res.data || [] });
        } catch (error) {
            console.error("Search error:", error.message);
            set({ searchResult: [] });
        } finally {
            set({ isSearching: false });
        }
    }
}));

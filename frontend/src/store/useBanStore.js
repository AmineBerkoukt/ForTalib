import { create } from "zustand";
import toast from "react-hot-toast";
import api from "../utils/api.js";

export const useBanStore = create((set, get) => ({
    bannedUsers: [],
    loading: false,
    error: null,

    getBannedUsers: async () => {
        try {
            set({ loading: true, error: null });
            const { data } = await api.get(`/banned-users`);
            set({ bannedUsers: data, loading: false });
        } catch (err) {
            console.error("useBanStore.getBannedUsers failed:", err);
            set({
                error: err.message || "Failed to fetch banned users",
                loading: false
            });
            toast.error("Failed to fetch banned users!");
        }
    },

    banUser: async (userId) => {
        try {
            set({ loading: true, error: null });
            await api.post(`/banned-users/${userId}`);
            toast.success("User banned successfully!");

            // Update the banned users list
            await get().getBannedUsers();
        } catch (err) {
            console.error("useBanStore.banUser failed:", err);
            set({
                error: err.message || "Failed to ban user",
                loading: false
            });
            toast.error("Failed to ban user!");
        }
    },

    unbanUser: async (userId) => {
        try {
            set({ loading: true, error: null });
            await api.delete(`/banned-users/${userId}`);
            toast.success("User unbanned successfully!");

            // Update the banned users list
            await get().getBannedUsers();
        } catch (err) {
            console.error("useBanStore.unbanUser failed:", err);
            set({
                error: err.message || "Failed to unban user",
                loading: false
            });
            toast.error("Failed to unban user!");
        }
    }
}));
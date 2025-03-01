import { create } from "zustand";
import toast from "react-hot-toast";
import api from "../utils/api.js";

export const useBanStore = create((set, get) => ({
    bannedUsers: [],

    getBannedUsers: async () => {
        try {
            const { data } = await api.get(`/banned-users`);
            set({ bannedUsers: data });
        } catch (err) {
            console.error("useBanStore.getBannedUsers failed!");
            toast.error("Failed to fetch banned users!");
        }
    },

    banUser: async (userId) => {
        try {
            await api.post(`/ban`, { userId });
            toast.success("User banned successfully!");
            get().getBannedUsers();
        } catch (err) {
            console.error("useBanStore.banUser failed!");
            toast.error("Failed to ban user!");
        }
    },

    unbanUser: async (userId) => {
        try {
            await api.post(`/unban`, { userId });
            toast.success("User unbanned successfully!");
            get().getBannedUsers();
        } catch (err) {
            console.error("useBanStore.unbanUser failed!");
            toast.error("Failed to unban user!");
        }
    }
}));

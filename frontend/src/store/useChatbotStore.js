import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatbotStore = create((set) => ({
    messages: [],
    isLoading: false,

    sendMessage: (text) => {
        const socket = useAuthStore.getState().socket;
        const userId = useAuthStore.getState().authUser._id;

        if (!socket) {
            toast.error("Erreur de connexion");
            return;
        }

        socket.emit("chatbotMessage", { text, userId });
    },

    addMessage: (message) => {
        set((state) => ({
            messages: [...state.messages, message],
        }));
    },

    resetMessages: () => set({ messages: [] })
}));
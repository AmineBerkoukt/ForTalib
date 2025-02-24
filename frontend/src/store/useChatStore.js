import { create } from "zustand";
import toast from "react-hot-toast";
import api from "../utils/api.js";
import { useAuthStore } from "./useAuthStore";

const BASE_URL = "http://localhost:5000/api/messages";

export const useChatStore = create((set, get) => ({
  messages: [],
  usersForSidebar: [],
  allUsers: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getAllUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await api.get(BASE_URL + "/users");
      set({ allUsers: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getUsersForSidebar: async (showOnlineOnly = false, onlineUsers = []) => {
    try {
      const res = await api.get(BASE_URL + "/recent");
      let users = res.data;

      if (showOnlineOnly) {
        users = users.filter((user) => onlineUsers.includes(user._id));
      }

      set({ usersForSidebar: users });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await api.get(BASE_URL + `/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData, config) => {
    const configToSend = config ? config : {};

    const { selectedUser, messages } = get();
    console.log("sendMessage selectedUser : ", selectedUser);
    const id = selectedUser._id ? selectedUser._id : selectedUser.id;
    try {
      const res = await api.post(BASE_URL + `/send/${id}`, messageData, configToSend);
      set({ messages: [...messages, res.data] });

      // Refresh sidebar
      get().getUsersForSidebar();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message.");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (isMessageFromSelectedUser) {
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      }
      console.log(selectedUser);
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser })
    console.log(selectedUser);
    toast(`You are talking to ${selectedUser.lastName} ${selectedUser.firstName}`,
        {
          icon: 'ℹ️',

        }
    );
    },
}));

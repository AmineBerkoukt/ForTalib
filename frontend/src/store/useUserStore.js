import {create} from 'zustand';
import toast from 'react-hot-toast';
import api from "../utils/api.js";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useUserStore = create((set, get) => ({
    isLoading: false,
    error: null,
    users: [],
    loading: true,
    user: {},

    fetchUsers: async () => {
        set({loading: true, error: null});
        try {
            const response = await api.get("/users"); // Your backend endpoint to fetch users
            set({
                users: response.data,
                loading: false,
            });
        } catch (err) {
            set({
                error: err.message || "Failed to fetch users",
                loading: false,
            });
        }
    },

    makeAdmin: async (userId) => {
        try {
            const response = await api.patch(`/users/promote/${userId}`);
            if (response.status === 200) {
                // First update the local state
                set((state) => ({
                    users: state.users.map((user) =>
                        user._id === userId ? {...user, role: 'admin'} : user
                    ),
                }));

                // Then fetch fresh data from server
                const updatedResponse = await api.get("/users");
                set({
                    users: updatedResponse.data,
                });

                toast.success("User has been promoted to admin!");
            }
        } catch (err) {
            toast.error("Failed to promote user to admin");
        }
    },

    deleteUser: async (userId) => {
        try {
            const response = await api.delete(`/users/delete/${userId}`);
            toast.success("User has been deleted successfully!");
            await get().fetchUsers();
        } catch (err) {
            toast.error(err.message || "Failed to delete user");
        }finally {

        }
    }
}));
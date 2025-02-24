import { create } from 'zustand';
import toast from 'react-hot-toast';
import api from "../utils/api.js";

const BASE_URL = 'http://localhost:5000/api';

export const useRequestStore = create((set) => ({
    isLoading: false,
    error: null,
    requests: [],

    createRequest: async () => {
        set({ isLoading: true });
        try {
            const response = await api.post(BASE_URL + "/requests/create" );
            toast.success('Application submitted successfully');
            return response.data;
        } catch (error) {
            console.log(error.message);
            toast.error('Failed to submit application');
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    fetchRequests: async () => {
        try {
            const response = await api.get(BASE_URL + "/requests");
            console.log("Fetched requests:", response.data);
            set({ requests: response.data });
        } catch (error) {
            console.error("Failed to fetch requests:", error);
        }
    },


    updateRequestStatus: async (id, status) => {
        set({ isLoading: true }); // Start loading state
        try {
            const normalizedStatus = status.toLowerCase();

            // Send API request to update status
            const response = await api.patch(`${BASE_URL}/requests/${id}`, { status: normalizedStatus });

            // Update request in the store locally (optimistic UI update)
            set((state) => ({
                requests: state.requests.map((request) =>
                    request._id === id ? { ...request, status: normalizedStatus, treatedAt: new Date().toISOString() } : request
                ),
            }));

            // Success notification
            toast.success(`Request ${normalizedStatus} successfully!`);
        } catch (error) {
            // Log and display error from backend
            console.error("Failed to update request status:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || "Failed to update request status";
            toast.error(errorMsg);
        } finally {
            set({ isLoading: false }); // End loading state
        }
    },
}));
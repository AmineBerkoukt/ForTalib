import { create } from "zustand";

export const useModalStore = create((set) => ({
  isModalActive: false,
  modalData: {},

  activateModal: (data) => {
    set({ isModalActive: true });
    set({modalData: data});
  },

  disactivateModal: () => {
    set({ isModalActive: false, modalData: {} }); // Clear modal data when deactivating
  },
}));

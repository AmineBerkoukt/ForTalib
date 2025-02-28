import { create } from "zustand";

export const useModalStore = create((set, get) => ({
  isModalActive: false,
  isEditModalActive:false,
  modalData: {},

  toggleEditModal: () => set({ isEditModalActive: !get().isEditModalActive }),

  activateModal: (data) => {
    set({ isModalActive: true, modalData: data });
  },

  disactivateModal: () => {
    set({ isModalActive: false, modalData: {} });
  },
}));
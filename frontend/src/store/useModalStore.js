import { create } from "zustand";

export const useModalStore = create((set, get) => ({
  isModalActive: false,
  modalData: {},

  toggleModal: () => set({ isModalActive: !get().isModalActive }),

  activateModal: (data) => {
    set({ isModalActive: true, modalData: data });
  },

  disactivateModal: () => {
    set({ isModalActive: false, modalData: {} });
  },
}));
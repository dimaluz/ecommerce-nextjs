import { create } from "zustand";

interface useLogoutProps {
    isLogoutOpen: boolean;
    onLogoutOpen: () => void;
    onLogoutClose: () => void;
}

export const useLogoutModal = create<useLogoutProps>((set) => ({
    isLogoutOpen: false,
    onLogoutOpen: () => set({ isLogoutOpen: true }),
    onLogoutClose: () => set({ isLogoutOpen: false }),
}))
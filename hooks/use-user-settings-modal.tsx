import { create } from "zustand";

interface useUserSettingsProps {
    isSettingsOpen: boolean;
    onSettingsOpen: () => void;
    onSettingsClose: () => void;
}

export const useUserSettingsModal = create<useUserSettingsProps>((set) => ({
    isSettingsOpen: false,
    onSettingsOpen: () => set({ isSettingsOpen: true }),
    onSettingsClose: () => set({ isSettingsOpen: false }),
}))
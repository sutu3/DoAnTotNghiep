// store/useFileStore.ts
import { create } from "zustand";
// 🔒 Checkpoint file
interface FileStore {
    file: File | null;
    setFile: (file: File | undefined) => void;
    resetFile: () => void;
}

export const useFileStore = create<FileStore>((set) => ({
    file: null,
    setFile: (file) => set({ file }),
    resetFile: () => set({ file: null }),
}));

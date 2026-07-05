import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface UIState {
  sidebarOpen: boolean;
  theme: Theme;
  currentTool: string | null;
  activeModal: string | null;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setTheme: (theme: Theme) => void;
  setCurrentTool: (tool: string | null) => void;
  setActiveModal: (modal: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'system',
      currentTool: null,
      activeModal: null,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
      setTheme: (theme) => set({ theme }),
      setCurrentTool: (tool) => set({ currentTool: tool }),
      setActiveModal: (modal) => set({ activeModal: modal }),
    }),
    {
      name: 'ai-office-ui',
    }
  )
);

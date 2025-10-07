import { create } from "zustand";
import { getAllPosts } from "./services/firestoreService";

const useModalStore = create((set, get) => ({
  // Modal State
  isLogoutModalOpen: false,
  openLogoutModal: () => set({ isLogoutModalOpen: true }),
  closeLogoutModal: () => set({ isLogoutModalOpen: false }),

  isReportModalOpen: false,
  reportType: "lost",
  openReportModal: (type) => set({ isReportModalOpen: true, reportType: type }),
  closeReportModal: () => set({ isReportModalOpen: false }),

  // Posts State - now from Firestore
  posts: [],
  loading: false,

  // Fetch posts from Firestore
  fetchPosts: async () => {
    set({ loading: true });
    try {
      const posts = await getAllPosts();
      set({ posts, loading: false });
    } catch (error) {
      console.error("Error fetching posts:", error);
      set({ loading: false });
    }
  },

  // Refresh posts (called after creating new post)
  refreshPosts: () => {
    get().fetchPosts();
  },
}));

export default useModalStore;

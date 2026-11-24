import { create } from 'zustand';
import { SERVICES_CONFIG, getServiceByIndex } from '../config/services.config';

function loadLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.warn(`Failed to read ${key} from localStorage:`, err);
    return fallback;
  }
}

function saveLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to save ${key} to localStorage:`, err);
  }
}

export interface AppState {
  introSeen: boolean;
  isIntroActive: boolean;
  activeFaceIndex: number | null;
  frontFaceIndex: number;
  isDraggingCube: boolean;
  viewMode: 'cube' | 'list';
  liveAnnouncement: string;
  searchQuery: string;
  isCommandPaletteOpen: boolean;
  isWizardOpen: boolean;
  isCompareOpen: boolean;
  highlightedComponentId: string | null;
  activeItemId: string | null;
  favorites: string[];
  recentlyViewed: string[];
  compareList: string[];
  isMuted: boolean;
  hasInteracted: boolean;

  // Section, Scroll & Docking extensions
  activeSection: string;
  scrollProgress: number;
  isCubeDocked: boolean;
  requestedFaceRotation: number | null;
  selectedProjectId: string | null;
  isUserInteractingWithCube: boolean;
  isResumeOpen: boolean;
  preselectedInquiry: { serviceType?: string; brief?: string } | null;

  // Actions
  skipIntro: () => void;
  replayIntro: () => void;
  setActiveFace: (index: number | null) => void;
  setFrontFaceIndex: (index: number) => void;
  setIsDraggingCube: (isDragging: boolean) => void;
  setViewMode: (mode: 'cube' | 'list') => void;
  setLiveAnnouncement: (announcement: string) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  openWizard: () => void;
  closeWizard: () => void;
  openCompare: () => void;
  closeCompare: () => void;
  toggleFavorite: (itemId: string) => void;
  addToRecentlyViewed: (itemId: string) => void;
  toggleCompareItem: (itemId: string) => void;
  clearCompare: () => void;
  nextFace: () => void;
  prevFace: () => void;
  selectFaceItem: (faceIndex: number, itemId?: string | null) => void;
  setSearchQuery: (query: string) => void;
  setHighlightedComponent: (id: string | null) => void;
  toggleMute: () => void;
  setHasInteracted: () => void;

  // Section, Scroll & Docking Actions
  setActiveSection: (section: string) => void;
  setScrollProgress: (progress: number) => void;
  setIsCubeDocked: (docked: boolean) => void;
  rotateToFace: (faceIndex: number) => void;
  clearRequestedRotation: () => void;
  setSelectedProjectId: (id: string | null) => void;
  setUserInteractingWithCube: (interacting: boolean) => void;
  openResume: () => void;
  closeResume: () => void;
  startInquiry: (opts: { serviceType?: string; brief?: string }) => void;
  clearPreselectedInquiry: () => void;
}

export const useAppStore = create<AppState>((set, get) => {
  const introPreviouslySeen =
    typeof window !== 'undefined' && sessionStorage.getItem('nikneuron_intro_seen') === 'true';

  const initialFavorites = loadLocalStorage<string[]>('nikneuron_favorites', []);
  const initialRecents = loadLocalStorage<string[]>('nikneuron_recently_viewed', []);

  return {
    introSeen: true,
    isIntroActive: false,
    activeFaceIndex: null,
    frontFaceIndex: 4, // Default front face (+Z: Future Interfaces)
    isDraggingCube: false,
    viewMode: 'cube',
    liveAnnouncement: '',
    searchQuery: '',
    isCommandPaletteOpen: false,
    isWizardOpen: false,
    isCompareOpen: false,
    highlightedComponentId: null,
    activeItemId: null,
    favorites: initialFavorites,
    recentlyViewed: initialRecents,
    compareList: [],
    isMuted: false,
    hasInteracted: false,
    activeSection: 'hero',
    scrollProgress: 0,
    isCubeDocked: false,
    requestedFaceRotation: null,
    selectedProjectId: null,
    isUserInteractingWithCube: false,
    isResumeOpen: false,
    preselectedInquiry: null,

    skipIntro: () => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('nikneuron_intro_seen', 'true');
      }
      set({ isIntroActive: false, introSeen: true });
    },

    replayIntro: () => {
      set({ isIntroActive: true, activeFaceIndex: null, activeItemId: null });
    },

    setActiveFace: (index: number | null) => {
      const service = index !== null ? getServiceByIndex(index) : null;
      set({
        activeFaceIndex: index,
        frontFaceIndex: index !== null ? index : get().frontFaceIndex,
        activeItemId: null,
        hasInteracted: true,
        liveAnnouncement: service ? `${service.title} service selected` : 'Returned to free cube view',
      });
    },

    setFrontFaceIndex: (index: number) => {
      if (get().frontFaceIndex !== index) {
        set({ frontFaceIndex: index });
      }
    },

    setIsDraggingCube: (isDragging: boolean) => {
      set({ isDraggingCube: isDragging });
    },

    setViewMode: (mode: 'cube' | 'list') => {
      set({
        viewMode: mode,
        hasInteracted: true,
        liveAnnouncement: `Switched to ${mode === 'list' ? '2D list view' : '3D cube view'}`,
      });
    },

    setLiveAnnouncement: (announcement: string) => {
      set({ liveAnnouncement: announcement });
    },

    openCommandPalette: () => {
      set({ isCommandPaletteOpen: true, hasInteracted: true });
    },

    closeCommandPalette: () => {
      set({ isCommandPaletteOpen: false });
    },

    toggleCommandPalette: () => {
      set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen, hasInteracted: true }));
    },

    openWizard: () => {
      set({ isWizardOpen: true, hasInteracted: true });
    },

    closeWizard: () => {
      set({ isWizardOpen: false });
    },

    openCompare: () => {
      set({ isCompareOpen: true, hasInteracted: true });
    },

    closeCompare: () => {
      set({ isCompareOpen: false });
    },

    toggleFavorite: (itemId: string) => {
      const current = get().favorites;
      const updated = current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId];
      saveLocalStorage('nikneuron_favorites', updated);
      set({
        favorites: updated,
        liveAnnouncement: current.includes(itemId)
          ? 'Removed service from favorites'
          : 'Added service to favorites',
      });
    },

    addToRecentlyViewed: (itemId: string) => {
      const current = get().recentlyViewed.filter((id) => id !== itemId);
      const updated = [itemId, ...current].slice(0, 8); // Keep last 8
      saveLocalStorage('nikneuron_recently_viewed', updated);
      set({ recentlyViewed: updated });
    },

    toggleCompareItem: (itemId: string) => {
      const current = get().compareList;
      if (current.includes(itemId)) {
        set({ compareList: current.filter((id) => id !== itemId) });
      } else {
        if (current.length >= 3) {
          // Replace the oldest item
          set({ compareList: [...current.slice(1), itemId], isCompareOpen: true });
        } else {
          set({ compareList: [...current, itemId], isCompareOpen: true });
        }
      }
    },

    clearCompare: () => {
      set({ compareList: [], isCompareOpen: false });
    },

    nextFace: () => {
      const { activeFaceIndex, frontFaceIndex } = get();
      const current = activeFaceIndex !== null ? activeFaceIndex : frontFaceIndex;
      const next = (current + 1) % SERVICES_CONFIG.length;
      get().setActiveFace(next);
    },

    prevFace: () => {
      const { activeFaceIndex, frontFaceIndex } = get();
      const current = activeFaceIndex !== null ? activeFaceIndex : frontFaceIndex;
      const prev = (current + SERVICES_CONFIG.length - 1) % SERVICES_CONFIG.length;
      get().setActiveFace(prev);
    },

    selectFaceItem: (faceIndex: number, itemId?: string | null) => {
      const service = getServiceByIndex(faceIndex);
      const svcId = itemId || service.id;
      get().addToRecentlyViewed(svcId);
      set({
        activeFaceIndex: faceIndex,
        frontFaceIndex: faceIndex,
        activeItemId: svcId,
        highlightedComponentId: svcId,
        hasInteracted: true,
        liveAnnouncement: `${service.title} service opened`,
      });
    },

    setSearchQuery: (query: string) => {
      set({ searchQuery: query, hasInteracted: true });
    },

    setHighlightedComponent: (id: string | null) => {
      set({ highlightedComponentId: id });
    },

    toggleMute: () => {
      set((state) => ({ isMuted: !state.isMuted }));
    },

    setHasInteracted: () => {
      if (!get().hasInteracted) {
        set({ hasInteracted: true });
      }
    },

    setActiveSection: (section: string) => {
      if (get().activeSection !== section) {
        set({
          activeSection: section,
          liveAnnouncement: `Navigated to ${section} section`,
        });
      }
    },

    setScrollProgress: (progress: number) => {
      set({ scrollProgress: progress });
    },

    setIsCubeDocked: (docked: boolean) => {
      if (get().isCubeDocked !== docked) {
        set({ isCubeDocked: docked });
      }
    },

    rotateToFace: (faceIndex: number) => {
      set({
        requestedFaceRotation: faceIndex,
        hasInteracted: true,
      });
    },

    clearRequestedRotation: () => {
      set({ requestedFaceRotation: null });
    },

    setSelectedProjectId: (id: string | null) => {
      set({ selectedProjectId: id });
    },

    setUserInteractingWithCube: (interacting: boolean) => {
      set({ isUserInteractingWithCube: interacting });
    },

    openResume: () => {
      set({ isResumeOpen: true, hasInteracted: true });
    },

    closeResume: () => {
      set({ isResumeOpen: false });
    },

    startInquiry: (opts: { serviceType?: string; brief?: string }) => {
      set({
        preselectedInquiry: opts,
        activeFaceIndex: null,
        selectedProjectId: null,
        isCompareOpen: false,
        isWizardOpen: false,
        hasInteracted: true,
      });
      if (typeof document !== 'undefined') {
        setTimeout(() => {
          const contactEl = document.getElementById('contact');
          if (contactEl) {
            contactEl.scrollIntoView({ behavior: 'smooth' });
          }
        }, 60);
      }
    },

    clearPreselectedInquiry: () => {
      set({ preselectedInquiry: null });
    },
  };
});

import { create } from 'zustand';
import type { QuoteRequest } from '../data/mock';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export interface ProRequest {
  id: string;
  clientName: string;
  clientCity: string;
  serviceTitle: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  budget?: string;
}

// ─── Seeded mock pro requests ─────────────────────────────────────────────────
const INITIAL_PRO_REQUESTS: ProRequest[] = [
  {
    id: 'req1',
    clientName: 'Mohammed Alami',
    clientCity: 'Casablanca',
    serviceTitle: 'Kitchen Pipe Leak Repair',
    description: 'My kitchen sink has been leaking for 2 days. Need urgent fix.',
    status: 'pending',
    createdAt: '2026-05-15T10:30:00Z',
    budget: '150 – 300 MAD',
  },
  {
    id: 'req2',
    clientName: 'Aicha Benkirane',
    clientCity: 'Casablanca',
    serviceTitle: 'Full Bathroom Renovation',
    description: 'Looking for a complete bathroom remodel — new tiles, fixtures, and plumbing.',
    status: 'pending',
    createdAt: '2026-05-14T16:00:00Z',
    budget: '3000 – 8000 MAD',
  },
  {
    id: 'req3',
    clientName: 'Hassan Tazi',
    clientCity: 'Rabat',
    serviceTitle: 'Water Heater Installation',
    description: 'Need a new 100L water heater installed, replacing an old boiler.',
    status: 'accepted',
    createdAt: '2026-05-13T09:15:00Z',
    budget: '400 – 600 MAD',
  },
  {
    id: 'req4',
    clientName: 'Leila Chraibi',
    clientCity: 'Casablanca',
    serviceTitle: 'Outdoor Pipe Inspection',
    description: 'Garden pipes need inspection and possible replacement.',
    status: 'completed',
    createdAt: '2026-05-10T14:45:00Z',
    budget: '200 – 500 MAD',
  },
  {
    id: 'req5',
    clientName: 'Youssef Naciri',
    clientCity: 'Mohammedia',
    serviceTitle: 'Emergency Leak — Ceiling',
    description: 'Urgent: water is leaking through my ceiling from upstairs bathroom.',
    status: 'pending',
    createdAt: '2026-05-16T08:00:00Z',
    budget: '500 – 1000 MAD',
  },
];

// ─── Weekly activity data (last 7 days) ──────────────────────────────────────
export const WEEKLY_STATS = [
  { day: 'Mon', requests: 2, views: 18 },
  { day: 'Tue', requests: 4, views: 32 },
  { day: 'Wed', requests: 1, views: 12 },
  { day: 'Thu', requests: 6, views: 47 },
  { day: 'Fri', requests: 3, views: 25 },
  { day: 'Sat', requests: 5, views: 39 },
  { day: 'Sun', requests: 2, views: 21 },
];

// ─── App State ────────────────────────────────────────────────────────────────

interface AppState {
  favorites: string[];
  quoteRequests: QuoteRequest[];
  proRequests: ProRequest[];
  toast: Toast | null;

  toggleFavorite: (proId: string) => void;
  isFavorite: (proId: string) => boolean;
  addQuoteRequest: (req: QuoteRequest) => void;
  showToast: (message: string, type?: Toast['type']) => void;
  clearToast: () => void;

  // Pro Dashboard actions
  acceptRequest: (id: string) => void;
  declineRequest: (id: string) => void;
  completeRequest: (id: string) => void;
  getPendingRequests: () => ProRequest[];
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set, get) => ({
  favorites: [],
  quoteRequests: [],
  proRequests: INITIAL_PRO_REQUESTS,
  toast: null,

  toggleFavorite: (proId) => {
    const favs = get().favorites;
    const exists = favs.includes(proId);
    set({ favorites: exists ? favs.filter((id) => id !== proId) : [...favs, proId] });
  },

  isFavorite: (proId) => get().favorites.includes(proId),

  addQuoteRequest: (req) =>
    set((state) => ({ quoteRequests: [...state.quoteRequests, req] })),

  showToast: (message, type = 'success') => {
    const id = Date.now().toString();
    set({ toast: { id, message, type } });
    setTimeout(() => {
      if (get().toast?.id === id) set({ toast: null });
    }, 3000);
  },

  clearToast: () => set({ toast: null }),

  // ── Pro-specific ──────────────────────────────────────────────────────────
  acceptRequest: (id) =>
    set((state) => ({
      proRequests: state.proRequests.map((r) =>
        r.id === id ? { ...r, status: 'accepted' } : r,
      ),
    })),

  declineRequest: (id) =>
    set((state) => ({
      proRequests: state.proRequests.map((r) =>
        r.id === id ? { ...r, status: 'declined' } : r,
      ),
    })),

  completeRequest: (id) =>
    set((state) => ({
      proRequests: state.proRequests.map((r) =>
        r.id === id ? { ...r, status: 'completed' } : r,
      ),
    })),

  getPendingRequests: () =>
    get().proRequests.filter((r) => r.status === 'pending'),
}));

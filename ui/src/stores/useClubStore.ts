import { create } from 'zustand';

interface ClubState {
  selectedClub: string;
  showClubSelect: boolean;
  lastServerClub: string | null;
  selectClub: (club: string) => void;
  dismissClubSelect: () => void;
  syncServerClub: (club: string | null) => void;
}

export const useClubStore = create<ClubState>((set) => ({
  selectedClub: 'driver',
  showClubSelect: true,
  lastServerClub: null,
  selectClub: (selectedClub) => set({ selectedClub }),
  dismissClubSelect: () => set({ showClubSelect: false }),
  syncServerClub: (club) =>
    set((state) => {
      if (!club || club === state.lastServerClub) {
        return state;
      }

      return {
        selectedClub: club,
        lastServerClub: club,
      };
    }),
}));

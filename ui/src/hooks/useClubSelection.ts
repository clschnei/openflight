import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { socketService } from '../services/socketService';
import { useClubStore } from '../stores/useClubStore';
import { useSystemStore } from '../stores/useSystemStore';

export function useClubSelection() {
  const serverClub = useSystemStore((state) => state.serverClub);
  const { selectedClub, showClubSelect, selectClub, dismissClubSelect, syncServerClub } = useClubStore(
    useShallow((state) => ({
      selectedClub: state.selectedClub,
      showClubSelect: state.showClubSelect,
      selectClub: state.selectClub,
      dismissClubSelect: state.dismissClubSelect,
      syncServerClub: state.syncServerClub,
    })),
  );

  useEffect(() => {
    syncServerClub(serverClub);
  }, [serverClub, syncServerClub]);

  const updateClub = (club: string) => {
    selectClub(club);
    socketService.setClub(club);
  };

  return {
    selectedClub,
    showClubSelect,
    updateClub,
    dismissClubSelect,
  };
}

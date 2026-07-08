import { CLUBS_BY_TYPE } from '../data/clubs';
import { useClubSelection } from '../hooks/useClubSelection';
import './ClubSelectScreen.css';

interface ClubSelectScreenProps {
  selectedClub?: string;
}

/**
 * Full-screen interstitial shown on app load so the user confirms which club
 * they're hitting before the first shot. Dismissible via the X in the corner,
 * which keeps the current (default) club.
 */
export function ClubSelectScreen({ selectedClub: selectedClubOverride }: ClubSelectScreenProps) {
  const { selectedClub, updateClub, dismissClubSelect } = useClubSelection();
  const activeClub = selectedClubOverride ?? selectedClub;

  return (
    <div className="club-select" role="dialog" aria-modal="true" aria-label="Select your club">
      <div className="club-select__panel">
        <button className="club-select__close" onClick={dismissClubSelect} aria-label="Close club selection">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h1 className="club-select__title">Select your club</h1>
        <p className="club-select__subtitle">Choose the club you're hitting to start your session.</p>

        {Object.entries(CLUBS_BY_TYPE).map(([type, clubs]) => (
          <div className="club-select__section" key={type}>
            <span className="club-select__section-title">{type}</span>
            <div className="club-select__grid">
              {clubs.map((club) => (
                <button
                  key={club.id}
                  className={`club-select__option ${activeClub === club.id ? 'club-select__option--selected' : ''}`}
                  onClick={() => {
                    updateClub(club.id);
                    dismissClubSelect();
                  }}
                >
                  {club.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

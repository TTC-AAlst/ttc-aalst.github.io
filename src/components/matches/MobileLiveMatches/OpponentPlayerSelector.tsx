import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { IMatch } from '../../../models/model-interfaces';
import { useTtcDispatch, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { ClubPlayer, fetchClubPlayers, selectClubPlayers, selectClubPlayersLoading, editOpponentPlayers } from '../../../reducers/clubPlayersReducer';
import { t } from '../../../locales';
import { Icon } from '../../controls/Icons/Icon';

type OpponentPlayerSelectorProps = {
  match: IMatch;
};

type PlayerRowProps = {
  player: ClubPlayer;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (player: ClubPlayer) => void;
};

const getBackgroundColor = (isSelected: boolean, isDisabled: boolean): string => {
  if (isSelected) return '#e3f2fd';
  if (isDisabled) return '#f5f5f5';
  return '#fff';
};

const PlayerRow = ({ player, isSelected, isDisabled, onToggle }: PlayerRowProps) => (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  <label
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 8px',
      borderRadius: 4,
      backgroundColor: getBackgroundColor(isSelected, isDisabled),
      border: `1px solid ${isSelected ? '#2196f3' : '#ddd'}`,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
      margin: 0,
    }}
  >
    <Form.Check
      type="checkbox"
      checked={isSelected}
      onChange={() => onToggle(player)}
      disabled={isDisabled}
    />
    <span style={{ flex: 1 }}>{player.name}</span>
    <span style={{ fontWeight: 600, fontSize: '0.85em', color: '#666' }}>
      {player.ranking}
    </span>
  </label>
);

export const OpponentPlayerSelector = ({ match }: OpponentPlayerSelectorProps) => {
  const dispatch = useTtcDispatch();
  const club = match.getOpponentClub();
  const clubCode = match.competition === 'Vttl' ? club?.codeVttl : club?.codeSporta;

  const clubPlayers = useTtcSelector(state => selectClubPlayers(state, match.competition, clubCode || ''));
  const isLoading = useTtcSelector(state => selectClubPlayersLoading(state, match.competition, clubCode || ''));

  const requiredPlayerCount = match.getTeamPlayerCount();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<ClubPlayer[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isFormOpen && clubCode && !clubPlayers) {
      dispatch(fetchClubPlayers({ competition: match.competition, clubCode }));
    }
  }, [dispatch, match.competition, clubCode, clubPlayers, isFormOpen]);

  const handlePlayerToggle = (player: ClubPlayer) => {
    setSelectedPlayers(prev => {
      const isAlreadySelected = prev.some(p => p.uniqueIndex === player.uniqueIndex);
      if (isAlreadySelected) {
        return prev.filter(p => p.uniqueIndex !== player.uniqueIndex);
      }
      if (prev.length >= requiredPlayerCount) {
        return prev;
      }
      return [...prev, player];
    });
  };

  const handleSave = async () => {
    if (selectedPlayers.length !== requiredPlayerCount) {
      return;
    }
    setIsSaving(true);
    try {
      await dispatch(editOpponentPlayers({ matchId: match.id, players: selectedPlayers }));
      setIsFormOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (!clubCode) {
    return (
      <div style={{ color: '#666', fontStyle: 'italic' }}>
        {t('match.club.locationUnknown')}
      </div>
    );
  }

  if (!isFormOpen) {
    return (
      <Button size="sm" variant="outline-primary" onClick={() => setIsFormOpen(true)}>
        {t('match.selectOpponents')}
      </Button>
    );
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Spinner animation="border" size="sm" />
        <span>{t('common.loading')}</span>
      </div>
    );
  }

  if (!clubPlayers || clubPlayers.length === 0) {
    return (
      <div style={{ color: '#666', fontStyle: 'italic' }}>
        {t('match.formationUnknown')}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 300, overflowY: 'auto' }}>
        {clubPlayers.map(player => {
          const isSelected = selectedPlayers.some(p => p.uniqueIndex === player.uniqueIndex);
          return (
            <PlayerRow
              key={player.uniqueIndex}
              player={player}
              isSelected={isSelected}
              isDisabled={!isSelected && selectedPlayers.length >= requiredPlayerCount}
              onToggle={handlePlayerToggle}
            />
          );
        })}
      </div>

      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          disabled={selectedPlayers.length !== requiredPlayerCount || isSaving}
        >
          {isSaving ? (
            <>
              <Spinner animation="border" size="sm" style={{ marginRight: 6 }} />
              {t('common.saving')}
            </>
          ) : (
            <>
              <Icon fa="fa fa-check" />
              <span style={{ marginLeft: 6 }}>{t('common.save')}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

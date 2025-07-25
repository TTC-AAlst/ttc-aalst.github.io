import React from 'react';
import { t } from '../../locales';
import { useTtcSelector } from '../../utils/hooks/storeHooks';

export const IntroClub = () => {
  const players = useTtcSelector(state => state.players);
  const teams = useTtcSelector(state => state.teams);
  const jeugdploegen = teams.filter(team => team.competition === 'Jeugd').length;
  const inClub = {
    players: players.length,
    teamsSporta: teams.filter(team => team.competition === 'Sporta').length,
    teamsVttl: teams.filter(team => team.competition === 'Vttl').length,
    teamsJeugd: jeugdploegen,
    teamsJeugdAmount: jeugdploegen === 1 ? '' : 'en',
  };

  return (
    <div>
      <h3>{t('intro.title')}</h3>
      {t(`intro.text${inClub.teamsJeugd > 0 ? '' : 'NoJeugd'}`, inClub)}
    </div>
  );
};

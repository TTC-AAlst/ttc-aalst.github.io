import React from 'react';
import MatchForm from '../Match/MatchForm';
import { IMatch } from '../../../models/model-interfaces';
import { selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';
import t from '../../../locales';

type MobileLiveMatchHeaderProps = {
  match: IMatch;
};

export const MobileLiveMatchHeader = ({ match }: MobileLiveMatchHeaderProps) => {
  const user = useTtcSelector(selectUser);
  const team = match.getTeam();

  const homeTeam = match.isHomeMatch ? team.renderOwnTeamTitle() : match.renderOpponentTitle();
  const awayTeam = match.isHomeMatch ? match.renderOpponentTitle() : team.renderOwnTeamTitle();

  return (
    <div
      style={{
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #ddd',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div style={{ fontWeight: match.isHomeMatch ? 'bold' : 'normal', fontSize: '1.1em' }}>
            {homeTeam}
          </div>
          <div style={{ color: '#888', fontSize: '0.85em', margin: '4px 0' }}>
            {t('match.vs')}
          </div>
          <div style={{ fontWeight: !match.isHomeMatch ? 'bold' : 'normal', fontSize: '1.1em' }}>
            {awayTeam}
          </div>
        </div>

        <div style={{ marginLeft: 12 }}>
          <MatchForm match={match} user={user} />
        </div>
      </div>
    </div>
  );
};

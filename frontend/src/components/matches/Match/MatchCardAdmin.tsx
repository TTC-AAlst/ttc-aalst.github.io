import React from 'react';
import { IMatch } from '../../../models/model-interfaces';
import { useTtcDispatch } from '../../../utils/hooks/storeHooks';
import { frenoyMatchSync } from '../../../reducers/matchesReducer';

type MatchCardAdminProps = {
  match: IMatch;
}

export const MatchCardAdmin = ({match}: MatchCardAdminProps) => {
  const dispatch = useTtcDispatch();

  const playerDetails = match.players
    .slice()
    .sort((a, b) => `${a.status}-${a.alias}`.localeCompare(`${b.status}-${b.alias}`))
    .map(ply => `${ply.status}: ${ply.alias}`);
  console.log('playerDetails', playerDetails);

  return (
    <div style={{padding: 7}}>
      <button type="button" onClick={() => dispatch(frenoyMatchSync({match, forceSync: true}))} className="btn btn-outline-secondary pull-right">
        Nu synchroniseren
      </button>

      ID={match.id}<br />FrenoyId={match.frenoyMatchId}
      <br />Block={match.block}

      <div style={{clear: 'both'}} />

      <pre>
        {JSON.stringify(match, null, 4)}
      </pre>
    </div>
  );
};

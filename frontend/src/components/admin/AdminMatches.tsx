import React, {useState} from 'react';
import { useTtcDispatch } from '../../utils/hooks/storeHooks';
import { frenoyMatchSync } from '../../reducers/matchesReducer';
import { IStoreMatchCommon } from '../../models/model-interfaces';


export const AdminMatches = () => {
  const [matchId, setMatchId] = useState<null | number>(null);
  const dispatch = useTtcDispatch();

  const match: Partial<IStoreMatchCommon> = {
    id: matchId || 0,
  };
  const data = {
    match: match as IStoreMatchCommon,
    forceSync: true,
  };

  return (
    <div style={{paddingLeft: 15}}>
      <h1>Force Frenoy Sync</h1>
      MatchId:
      <input type="text" onChange={e => setMatchId(parseInt(e.target.value, 10))} style={{marginRight: 7, height: 32}} />
      <button type="button" onClick={() => dispatch(frenoyMatchSync(data))} className="btn btn-outline-secondary">
        Force Sync
      </button>
    </div>
  );
};

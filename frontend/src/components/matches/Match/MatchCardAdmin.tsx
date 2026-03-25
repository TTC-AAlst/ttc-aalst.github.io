import { IMatch } from '../../../models/model-interfaces';
import { useTtcDispatch } from '../../../utils/hooks/storeHooks';
import { frenoyMatchSync } from '../../../reducers/matchesReducer';

type MatchCardAdminProps = {
  match: IMatch;
};

export const MatchCardAdmin = ({ match }: MatchCardAdminProps) => {
  const dispatch = useTtcDispatch();

  return (
    <div style={{ padding: 7 }}>
      <button type="button" onClick={() => dispatch(frenoyMatchSync({ match, forceSync: true }))} className="btn btn-outline-secondary pull-right">
        Nu synchroniseren
      </button>
      ID={match.id}
      <br />
      FrenoyId={match.frenoyMatchId}
      <br />
      Block={match.block}
      <div style={{ clear: 'both' }} />
      <pre>{JSON.stringify(match, null, 4)}</pre>
    </div>
  );
};

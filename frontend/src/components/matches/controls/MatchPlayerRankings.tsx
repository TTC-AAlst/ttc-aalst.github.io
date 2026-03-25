import { getMatchPlayerRankings } from '../../../storeUtil';
import { IMatch } from '../../../models/model-interfaces';

type PlayerRankingsProps = {
  formation: { ranking: string; amount: number }[];
};

export const PlayerRankings = ({ formation, ...props }: PlayerRankingsProps) => (
  <span {...props}>
    {formation.map(({ ranking, amount }, index) => (
      <span key={ranking}>
        {amount > 1 ? <small>{amount}x</small> : null}
        {ranking}
        {index < formation.length - 1 ? ', ' : null}
      </span>
    ))}
  </span>
);

type MatchPlayerRankingsProps = {
  homeTeam: boolean;
  match: IMatch;
};

export const MatchPlayerRankings = ({ match, homeTeam }: MatchPlayerRankingsProps) => {
  const formation = getMatchPlayerRankings(match, homeTeam);
  return <PlayerRankings formation={formation} />;
};

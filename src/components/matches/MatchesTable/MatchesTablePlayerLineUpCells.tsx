import React from 'react';
import { IMatch, IPlayer, ITeam } from '../../../models/model-interfaces';
import { tableMatchViewportWidths } from './matchesTableUtil';
import { MatchDate } from '../controls/MatchDate';
import { ThrillerIcon } from '../../controls/Icons/ThrillerIcon';
import { useViewport } from '../../../utils/hooks/useViewport';
import MatchVs from '../Match/MatchVs';
import { FrenoyWeekLink } from '../../controls/Buttons/FrenoyButton';
import { MatchBlock } from '../Match/MatchBlock';
import { Icon } from '../../controls/Icons/Icon';


type MatchesTablePlayerLineUpProps = {
  team: ITeam;
  match: IMatch;
}

export const MatchesTablePlayerLineUpDateCell = ({team, match}: MatchesTablePlayerLineUpProps) => (
  <td>
    {match.shouldBePlayed && !!team.getThriller(match) && (
      <ThrillerIcon color="red" />
    )}
    {match.shouldBePlayed ? <MatchDate match={match} bigDisplayMinWith={tableMatchViewportWidths.other} /> : null}
  </td>
);

export const MatchesTablePlayerLineUpFrenoyMatchIdCell = ({match}: {match: IMatch}) => {
  const viewport = useViewport();

  if (viewport.width > tableMatchViewportWidths.frenoyMatchId) {
    return <td><FrenoyWeekLink match={match} /></td>;
  }

  return null;
};

export const MatchesTablePlayerLineUpMatchVsCell = ({match, playerCount}: {match: IMatch, playerCount: number}) => {
  const viewport = useViewport();

  return (
    <td>
      <MatchVs
        match={match}
        opponentOnly={viewport.width < tableMatchViewportWidths.other}
        ownTeamLink={undefined}
        withLinks
        withPosition={viewport.width > tableMatchViewportWidths.other}
      />
      {!!playerCount && playerCount < match.getTeamPlayerCount() && (
        <Icon
          fa="fa fa-exclamation-circle"
          style={{color: 'red', float: 'right', fontSize: '1.5em', marginTop: 3}}
          translate
          tooltip="match.block.incompleteTooltip"
        />
      )}
    </td>
  );
};


export const MatchesTablePlayerLineUpMatchBlockCell = ({match, displayNonBlocked}: {match: IMatch, displayNonBlocked: boolean}) => (
  <td><MatchBlock block={match.block} displayNonBlocked={displayNonBlocked} /></td>
);


type MatchesTablePlayerLineUpPlayerPlayingCellProps = {
  display: boolean;
  match: IMatch;
  player: IPlayer;
  team: ITeam;
}

export const MatchesTablePlayerLineUpPlayerPlayingCell = ({display, player, team, match}: MatchesTablePlayerLineUpPlayerPlayingCellProps) => (
  <td>
    {display && (
      <span className={`badge label-as-badge ${match.block ? 'bg-success' : 'bg-warning'}`} style={{fontWeight: 'normal'}}>
        {player.alias}
        <span style={{marginLeft: 5, marginRight: 5, fontSize: 10}}>
          {player.getCompetition(team.competition)?.ranking}
        </span>
        <i className="fa fa-thumbs-o-up" />
      </span>
    )}
  </td>
);

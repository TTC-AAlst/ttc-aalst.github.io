import React from 'react';
import moment from 'moment';
import MatchesTable from '../matches/MatchesTable';
import {TeamPlayerAvatars} from './controls/TeamPlayerAvatars';
import {TeamOverviewPlayers} from './controls/TeamOverviewPlayers';
import {TeamOverviewRanking} from './controls/TeamOverviewRanking';
import {OpponentsTeamFormation} from '../matches/Match/OpponentsTeamFormation';
import { IMatch, ITeam } from '../../models/model-interfaces';
import { t } from '../../locales';
import { useViewport } from '../../utils/hooks/useViewport';

type TeamOverviewProps = {
  team: ITeam,
  small: boolean,
};

export const TeamOverview = ({team, small}: TeamOverviewProps) => {
  const today = moment().startOf('day');
  const sortedMatches = team.getMatches()
    .sort((a, b) => a.date.valueOf() - b.date.valueOf());

  const nextMatches = sortedMatches
    .filter(m => m.date.isSame(today, 'day') || m.date.isAfter(today, 'day'))
    .slice(0, 2);

  const prevMatches = sortedMatches
    .filter(m => m.date.isBefore(today, 'day'))
    .slice(0, 2);

  return (
    <div style={{paddingLeft: 5, paddingRight: 5}}>
      <TeamPlayerAvatars team={team} />
      <div className="col-md-8">
        <TeamOverviewRanking team={team} small={small} />
      </div>
      <div className="col-md-4" style={{paddingTop: 16}}>
        <h3>{t('common.teamFormations')}</h3>
        <OpponentsTeamFormation matches={team.getMatches()} hideHeader />
      </div>

      <TeamOverviewMatches matches={prevMatches} title={t('match.playedMatches')} />
      <TeamOverviewMatches matches={nextMatches} title={t('match.nextMatches')} />

      <TeamOverviewPlayers team={team} />

    </div>
  );
};




const ucFirst = (input: string) => input[0].toUpperCase() + input.substr(1);

type TeamOverviewMatchesProps = {
  matches: IMatch[],
  title: string,
};


const TeamOverviewMatches = ({matches, title}: TeamOverviewMatchesProps) => {
  const viewport = useViewport();
  if (matches.length === 0) {
    return <div />;
  }
  return (
    <div>
      <h3>{ucFirst(title)}</h3>
      <MatchesTable matches={matches} allowOpponentOnly viewport={viewport} />
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { WeekCalcer } from '../matches/MatchesWeeks/WeekCalcer';
import { WeekTitle } from '../matches/MatchesWeeks/WeekTitle';
import { OpponentMatches } from '../matches/Match/OpponentMatches';
import { FrenoyWeekButton } from '../controls/Buttons/FrenoyButton';
import { IMatch, ITeam } from '../../models/model-interfaces';
import { selectReadOnlyMatches, useTtcDispatch, useTtcSelector } from '../../utils/hooks/storeHooks';
import { getOpponentMatches } from '../../reducers/readonlyMatchesReducer';

export const TeamMatchesWeek = ({team}: {team: ITeam}) => {
  const dispatch = useTtcDispatch();
  const readonlyMatches = useTtcSelector(selectReadOnlyMatches);
  const [currentWeek, setCurrentWeek] = useState<number | undefined>(undefined);

  useEffect(() => {
    dispatch(getOpponentMatches({teamId: team.id}));
  }, [team.id, dispatch]);

  const teamCompetition = team.competition === 'Sporta' ? 'Sporta' : 'Vttl';
  const otherMatches = readonlyMatches
    .filter(m => m.competition === teamCompetition)
    .filter(m => m.frenoyDivisionId === team.frenoy.divisionId)
    .filter(m => m.shouldBePlayed);

  const weekCalcer = new WeekCalcer(otherMatches, currentWeek);

  let prevWeekMatches: IMatch[] = [];
  if (weekCalcer.currentWeek > weekCalcer.firstWeek) {
    const prevWeekCalcer = new WeekCalcer(otherMatches, weekCalcer.currentWeek - 1);
    prevWeekMatches = prevWeekCalcer.getMatches();
  }

  return (
    <div style={{paddingTop: 10, paddingRight: 2}}>
      <FrenoyWeekButton team={team} week={weekCalcer.currentWeek} className="pull-right" style={{marginRight: 10}} />
      <WeekTitle weekCalcer={weekCalcer} weekChange={weekDiff => setCurrentWeek(weekCalcer.currentWeek + weekDiff)} />
      <OpponentMatches team={team} readonlyMatches={weekCalcer.getMatches()} />

      {prevWeekMatches.length ? (
        <div style={{marginTop: 50}}>
          <WeekTitle weekCalcer={new WeekCalcer(otherMatches, weekCalcer.currentWeek - 1)} />
          <OpponentMatches team={team} readonlyMatches={prevWeekMatches} />
        </div>
      ) : null}
    </div>
  );
};

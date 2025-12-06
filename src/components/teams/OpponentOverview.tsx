import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackIcon } from '../controls/Icons/BackIcon';
import { OpponentMatches } from '../matches/Match/OpponentMatches';
import { OpponentsFormation } from '../matches/Match/OpponentsFormation';
import { OpponentsTeamFormation } from '../matches/Match/OpponentsTeamFormation';
import { DivisionHeader } from './controls/DivisionHeader';
import { selectTeams, useTtcDispatch, useTtcSelector } from '../../utils/hooks/storeHooks';
import { t } from '../../locales';
import { Competition } from '../../models/model-interfaces';
import { getOpponentMatches } from '../../reducers/readonlyMatchesReducer';
import { selectOpponentMatchesForTeam } from '../../reducers/selectors/selectOpponentMatchesForTeam';


export const OpponentOverview = () => {
  const {competition, clubId, teamCode} = useParams(); // /tegenstander/:competition/:clubId/:teamCode
  const dispatch = useTtcDispatch();
  const navigate = useNavigate();
  const teams = useTtcSelector(selectTeams);

  const opponent = {clubId: parseInt(clubId!, 10), teamCode: teamCode!};
  const team = teams.find(tm => tm.competition === competition
    && tm.ranking.find(x => x.clubId === parseInt(clubId!, 10) && (!teamCode || x.teamCode === teamCode)));

  const opponentClub = useTtcSelector(state => state.clubs.find(club => club.id === opponent.clubId));
  const otherMatches = useTtcSelector(state => selectOpponentMatchesForTeam(state, competition as Competition, opponent.clubId, teamCode));

  useEffect(() => {
    window.scrollTo(0, 0);

    const escIsBack = evn => {
      if (evn.keyCode === 27) {
        navigate(-1);
      }
    };

    document.addEventListener('keydown', escIsBack, false);
    return () => {
      document.removeEventListener('keydown', escIsBack, false);
    };
  }, []);

  useEffect(() => {
    if (team) {
      dispatch(getOpponentMatches({teamId: team.id, opponent}));
    }
  }, [team?.id]);

  if (!team || !opponentClub || otherMatches.length === 0) {
    return null;
  }

  return (
    <div style={{marginBottom: 30}}>
      <BackIcon className="pull-right" />
      <h1>
        <span>
          {opponentClub.name}: {team.competition} {opponent.teamCode}
        </span>
        <br />
        <small><DivisionHeader team={team} opponent={opponent} /></small>
      </h1>

      <div className="col-md-4">
        <h3>{t('match.tabs.opponentsFormationTitle')}</h3>
        <OpponentsTeamFormation matches={otherMatches} opponent={opponent} limitRows />
      </div>

      <div className="col-md-8">
        <h3>{t('teamCalendar.individual')}</h3>
        <OpponentsFormation match={otherMatches[0]} opponent={opponent} />
      </div>

      <div className="col-md-12" style={{marginTop: 20}}>
        <h3>{t('teamCalendar.matches')}</h3>
        <OpponentMatches team={team} readonlyMatches={otherMatches} roundSwitchButton opponent={opponent} />
      </div>
    </div>
  );
};

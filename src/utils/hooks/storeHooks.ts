import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import moment from 'moment';
import type { RootState, AppDispatch } from '../../store';
import UserModel from '../../models/UserModel';
import MatchModel from '../../models/MatchModel';
import TeamModel from '../../models/TeamModel';
import PlayerModel from '../../models/PlayerModel';
import { IMatch, IPlayer } from '../../models/model-interfaces';

export const useTtcDispatch = useDispatch.withTypes<AppDispatch>();
export const useTtcSelector = useSelector.withTypes<RootState>();


export const selectUser = createSelector(
  [(state: RootState) => state.user],
  user => new UserModel(user),
);

export const selectTeams = createSelector(
  [
    (state: RootState) => state.teams,
    (state: RootState) => state.teamRankings,
  ],
  (teams, rankings) => teams.map(t => new TeamModel(t, rankings[t.id])),
);

export const selectTeamRanking = createSelector(
  [
    (state: RootState) => state.teamRankings,
    (_, teamId: number) => teamId,
  ],
  (teamRankings, teamId) => teamRankings[teamId] ?? [],
);

export const selectMatches = createSelector(
  [(state: RootState) => state.matches],
  matches => matches.map(m => new MatchModel(m) as IMatch),
);

export const selectFreeMatches = createSelector(
  [(state: RootState) => state.freeMatches],
  matches => matches.map(m => new MatchModel(m) as IMatch),
);

export const selectReadOnlyMatches = createSelector(
  [(state: RootState) => state.readonlyMatches],
  matches => matches.map(m => new MatchModel(m) as IMatch),
);

export const selectPlayers = createSelector(
  [(state: RootState) => state.players],
  players => players.map(p => new PlayerModel(p) as IPlayer),
);

export const selectQuitters = createSelector(
  [(state: RootState) => state.playersQuitters],
  players => players.map(p => new PlayerModel(p) as IPlayer),
);

export const selectMatchesBeingPlayed = createSelector(
  selectMatches,
  matches => matches.filter(m => m.isBeingPlayed()),
);

const today = moment();
export const selectMatchesToday = createSelector(
  selectMatches,
  matches => matches.filter(m => m.date.isSame(today, 'day')),
);

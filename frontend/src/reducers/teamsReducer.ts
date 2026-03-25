import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mergeInStore2 } from './immutableHelpers';
import { ICacheResponse, IStoreTeam, ITeamRanking, TeamPlayerType } from '../models/model-interfaces';
import http from '../utils/httpClient';
import { showSnackbar } from './configReducer';
import { t } from '../locales';
import { RootState } from '../store';

export const fetchTeams = createAsyncThunk(
  'teams/Get',
  async (_, { getState }) => {
    const lastChecked = (getState() as RootState).config.caches.teams;
    const response = await http.get<ICacheResponse<IStoreTeam>>('/teams', {lastChecked});
    return response;
  },
);

export const fetchTeam = createAsyncThunk(
  'teams/GetOne',
  async ({id}: {id: number}) => {
    const response = await http.get<IStoreTeam>(`/teams/${id}`);
    return response;
  },
);

export const toggleTeamPlayer = createAsyncThunk(
  'teams/ToggleTeamPlayer',
  async (data: {playerId: number, teamId: number, role: TeamPlayerType}, { dispatch }) => {
    try {
      const response = await http.post<IStoreTeam>('/teams/ToggleTeamPlayer', data);
      dispatch(simpleLoaded(response));
      dispatch(showSnackbar(t('common.apiSuccess')));
      return response;
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
      return null;
    }
  },
);

export const loadTeamRanking = createAsyncThunk(
  'teams/Ranking',
  async ({team}: {team: IStoreTeam}, { dispatch }) => {
    const url = `/teams/Ranking/${team.competition}/${team.frenoy.divisionId}`;
    try {
      const response = await http.get<ITeamRanking[]>(url);
      dispatch(teamRankingsSlice.actions.rankingLoaded({teamId: team.id, rankings: response}));
    } catch (err) {
      console.error(url, err);
    }
  },
);

function getInitialState(): IStoreTeam[] {
  return [];
  // const serializedState = localStorage.getItem("redux_teams");
  // if (!serializedState) {
  //   return [];
  // }

  // try {
  //   const players = JSON.parse(serializedState);
  //   return players;
  // } catch {
  //   return [];
  // }
}


export const teamsSlice = createSlice({
  name: 'teams',
  initialState: getInitialState(),
  reducers: {
    simpleLoaded: (state, action: PayloadAction<IStoreTeam | IStoreTeam[]>) => mergeInStore2(state, action.payload),
  },
  extraReducers: builder => {
    builder.addCase(fetchTeams.fulfilled, (state, action) => {
      if (!action.payload?.data) {
        return state;
      }
      return mergeInStore2(state, action.payload.data);
    });
    builder.addCase(fetchTeam.fulfilled, (state, action) => mergeInStore2(state, action.payload));
  },
});


type TeamRankingStore = {[teamId: number]: ITeamRanking[]};


export const teamRankingsSlice = createSlice({
  name: 'teamRankings',
  initialState: {} as TeamRankingStore,
  reducers: {
    rankingLoaded: (state, action: PayloadAction<{teamId: number, rankings: ITeamRanking[]}>) => {
      state[action.payload.teamId] = action.payload.rankings;
    },
  },
});

export const { simpleLoaded } = teamsSlice.actions;

export default teamsSlice.reducer;

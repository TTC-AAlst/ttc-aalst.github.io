import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mergeInStore2 } from './immutableHelpers';
import { IStoreTeam, TeamPlayerType } from '../models/model-interfaces';
import http from '../utils/httpClient';
import { showSnackbar } from './configReducer';
import { t } from '../locales';

export const fetchTeams = createAsyncThunk(
  'teams/Get',
  async () => {
    const response = await http.get<IStoreTeam[]>('/teams');
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
  async (data: {teamId: number}, { dispatch }) => {
    try {
      const response = await http.get<IStoreTeam>('/teams/Ranking', data);
      dispatch(simpleLoaded(response));
    } catch (err) {
      console.error('teams/Ranking', data, err);
    }
  },
);


export const teamsSlice = createSlice({
  name: 'teams',
  initialState: [] as IStoreTeam[],
  reducers: {
    simpleLoaded: (state, action: PayloadAction<IStoreTeam | IStoreTeam[]>) => mergeInStore2(state, action.payload),
  },
  extraReducers: builder => {
    builder.addCase(fetchTeams.fulfilled, (state, action) => mergeInStore2(state, action.payload));
    builder.addCase(fetchTeam.fulfilled, (state, action) => mergeInStore2(state, action.payload));
  },
});

export const { simpleLoaded } = teamsSlice.actions;

export default teamsSlice.reducer;

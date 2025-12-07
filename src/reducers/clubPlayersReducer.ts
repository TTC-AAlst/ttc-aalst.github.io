import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import http from '../utils/httpClient';
import { Competition, IFullStoreMatchOwn, IMatch } from '../models/model-interfaces';
import { RootState } from '../store';
import { simpleLoaded } from './matchesReducer';
import { showSnackbar } from './configReducer';
import { t } from '../locales';

export type ClubPlayer = {
  name: string;
  ranking: string;
  uniqueIndex: number;
};

type ClubPlayersState = {
  /** Key: `{competition}-{clubCode}` */
  players: { [key: string]: ClubPlayer[] };
  loading: { [key: string]: boolean };
};

function getClubKey(competition: Competition, clubCode: string): string {
  return `${competition.toLowerCase()}-${clubCode.toLowerCase()}`;
}

export const fetchClubPlayers = createAsyncThunk(
  'clubPlayers/fetch',
  async (params: { competition: Competition; clubCode: string }, { getState }) => {
    const { competition, clubCode } = params;
    const key = getClubKey(competition, clubCode);

    const state = getState() as RootState;
    if (state.clubPlayers.players[key]) {
      // Already fetched, return cached data
      return { key, players: state.clubPlayers.players[key], cached: true };
    }

    const players = await http.get<ClubPlayer[]>(`/clubs/Players/${competition}/${clubCode}`);
    return { key, players, cached: false };
  },
);

export type EditOpponentPlayersParams = {
  matchId: number;
  players: ClubPlayer[];
};

export const editOpponentPlayers = createAsyncThunk(
  'clubPlayers/editOpponentPlayers',
  async (params: EditOpponentPlayersParams, { dispatch }) => {
    try {
      const result = await http.post<IFullStoreMatchOwn>('/matches/EditOpponentPlayers', params);
      dispatch(simpleLoaded(result));
      dispatch(showSnackbar(t('common.apiSuccess')));
      return result;
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
      throw err;
    }
  },
);

function getInitialState(): ClubPlayersState {
  return {
    players: {},
    loading: {},
  };
}

export const clubPlayersSlice = createSlice({
  name: 'clubPlayers',
  initialState: getInitialState(),
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchClubPlayers.pending, (state, action) => {
      const key = getClubKey(action.meta.arg.competition, action.meta.arg.clubCode);
      state.loading[key] = true;
    });
    builder.addCase(fetchClubPlayers.fulfilled, (state, action) => {
      const { key, players, cached } = action.payload;
      state.loading[key] = false;
      if (!cached) {
        state.players[key] = players;
      }
    });
    builder.addCase(fetchClubPlayers.rejected, (state, action) => {
      const key = getClubKey(action.meta.arg.competition, action.meta.arg.clubCode);
      state.loading[key] = false;
    });
  },
});

// Selector
export const selectClubPlayers = (state: RootState, competition: Competition, clubCode: string): ClubPlayer[] | undefined => {
  const key = getClubKey(competition, clubCode);
  return state.clubPlayers.players[key];
};

export const selectClubPlayersLoading = (state: RootState, competition: Competition, clubCode: string): boolean => {
  const key = getClubKey(competition, clubCode);
  return state.clubPlayers.loading[key] || false;
};

export default clubPlayersSlice.reducer;

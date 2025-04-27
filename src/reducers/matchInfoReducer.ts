import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import http from '../utils/httpClient';
import { IMatch, PlayerEncounter } from '../models/model-interfaces';
import { RootState } from '../store';

export const getPreviousEncounters = createAsyncThunk(
  'matches/getPreviousEncounters',
  async (match: IMatch, { getState }) => {
    const data = {
      matchId: match.id,
      opponentPlayerNames: Object.fromEntries(match.getTheirPlayers().map(player => [player.name, player.uniqueIndex])),
      ownPlayerIds: Object.fromEntries(match.getOwnPlayers().map(x => [x.playerId, x.uniqueIndex])),
      competition: match.competition,
    };

    const store = getState() as RootState;
    const hasBeenFetched = store.matchInfo.previousEncounters.some(encounter => encounter.requestMatchId === data.matchId);
    if (hasBeenFetched) {
      return [] as PlayerEncounter[];
    }

    try {
      const encounters = await http.get<PlayerEncounter[]>('/matches/GetPreviousEncounters', data);
      return encounters;
    } catch (err) {
      console.error('GetPreviousEncounters', err);
      return [] as PlayerEncounter[];
    }
  },
);


type MatchInfoState = {
  previousEncounters: PlayerEncounter[];
}

function getInitialState(): MatchInfoState {
  return {
    previousEncounters: [],
  };
}


export const matchInfoSlice = createSlice({
  name: 'matchInfo',
  initialState: getInitialState(),
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getPreviousEncounters.fulfilled, (state, action) => {
      if (action.payload) {
        state.previousEncounters.push(...action.payload);
      }
    });
  },
});

export default matchInfoSlice.reducer;

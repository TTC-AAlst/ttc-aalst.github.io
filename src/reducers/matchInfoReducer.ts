import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import http from '../utils/httpClient';
import { IMatch, PlayerEncounter } from '../models/model-interfaces';
import { RootState } from '../store';
import storeUtil from '../storeUtil';

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
      const encounters = await http.post<PlayerEncounter[]>('/matches/GetPreviousEncounters', data);
      return encounters;
    } catch (err) {
      console.error('GetPreviousEncounters', err);
      return [] as PlayerEncounter[];
    }
  },
);

export const getOpponentTeamEncounters = createAsyncThunk(
  'matches/getOpponentTeamEncounters',
  async (params: {match: IMatch, ourPlayerId: number, opponentPlayers: {name: string, uniqueIndex: number}[]}, { getState }) => {
    const { match, ourPlayerId, opponentPlayers } = params;
    const opponentKey = getOpponentKey(match);

    const store = getState() as RootState;
    if (store.matchInfo.opponentTeamEncounters[opponentKey]) {
      // Already fetched, return empty to avoid re-fetching
      return { opponentKey, encounters: [], skipUpdate: true };
    }

    // Get player from store, not from match (they may not have played in THIS match)
    const ourPlayer = storeUtil.getPlayer(ourPlayerId);
    if (!ourPlayer) {
      return { opponentKey, encounters: [], skipUpdate: false };
    }

    // Get player's uniqueIndex for this competition
    const playerCompetition = ourPlayer.getCompetition(match.competition);
    if (!playerCompetition) {
      // Player doesn't play this competition at all
      return { opponentKey, encounters: [], skipUpdate: false };
    }

    const data = {
      matchId: null,
      opponentPlayerNames: Object.fromEntries(opponentPlayers.map(player => [player.name, player.uniqueIndex])),
      ownPlayerIds: { [ourPlayerId]: playerCompetition.uniqueIndex },
      competition: match.competition,
    };

    try {
      const encounters = await http.post<PlayerEncounter[]>('/matches/GetPreviousEncounters', data);
      return { opponentKey, encounters, skipUpdate: false };
    } catch (err) {
      console.error('getOpponentTeamEncounters', err);
      return { opponentKey, encounters: [], skipUpdate: false };
    }
  },
);


type MatchInfoState = {
  previousEncounters: PlayerEncounter[];
  opponentTeamEncounters: {[opponentKey: string]: PlayerEncounter[]};
}

function getInitialState(): MatchInfoState {
  return {
    previousEncounters: [],
    opponentTeamEncounters: {},
  };
}

function getOpponentKey(match: IMatch): string {
  return `${match.competition.toLowerCase()}-${match.opponent.clubId}-${match.opponent.teamCode}`;
}


export const matchInfoSlice = createSlice({
  name: 'matchInfo',
  initialState: getInitialState(),
  reducers: {
    clearPreviousEncountersForMatch: (state, action: { payload: number }) => {
      state.previousEncounters = state.previousEncounters.filter(
        encounter => encounter.requestMatchId !== action.payload,
      );
    },
  },
  extraReducers: builder => {
    builder.addCase(getPreviousEncounters.fulfilled, (state, action) => {
      if (action.payload?.length) {
        const newEncounters = action.payload.filter(
          encounter => !state.previousEncounters.some(existing => existing.matchGameId === encounter.matchGameId),
        );
        state.previousEncounters.push(...newEncounters);
      }
    });
    builder.addCase(getOpponentTeamEncounters.fulfilled, (state, action) => {
      // Skip update if data already exists (deduplication)
      if (action.payload?.skipUpdate) {
        return;
      }

      if (action.payload?.encounters?.length) {
        state.opponentTeamEncounters[action.payload.opponentKey] = action.payload.encounters;
      } else if (action.payload?.opponentKey && !action.payload.skipUpdate) {
        // Store empty array to mark as fetched (player doesn't play this competition or no encounters)
        state.opponentTeamEncounters[action.payload.opponentKey] = [];
      }
    });
  },
});

export const { clearPreviousEncountersForMatch } = matchInfoSlice.actions;

export default matchInfoSlice.reducer;

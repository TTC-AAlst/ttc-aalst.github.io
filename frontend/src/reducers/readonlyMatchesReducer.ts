import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mergeInStore2 } from './immutableHelpers';
import http from '../utils/httpClient';
import { IMatch, ITeamOpponent } from '../models/model-interfaces';
import { setOpponentMatchesLoaded } from './configReducer';
import { RootState } from '../store';
import { shouldSync } from './matchesReducer';

export const getOpponentMatches = createAsyncThunk(
  'matches/GetOpponentMatches',
  async (data: {teamId: number, opponent?: ITeamOpponent}, { dispatch, getState }) => {
    const key = `${data.teamId}-${data.opponent?.teamCode}-${data.opponent?.clubId}`;
    const store = getState() as RootState;
    const hasBeenFetched = store.config.opponentMatchesLoaded[key];
    if (hasBeenFetched) {
      return;
    }

    try {
      const otherMatches = await http.get<IMatch[]>('/matches/GetOpponentMatches', {teamId: data.teamId, ...data.opponent});
      if (!otherMatches || !otherMatches.length) {
        return;
      }
      dispatch(simpleLoaded(otherMatches));
      dispatch(setOpponentMatchesLoaded(data));
      otherMatches.forEach(m => {
        dispatch(frenoyReadOnlyMatchSync(m));
      });
    } catch (err) {
      console.error('getOpponentMatches', err);
    }
  },
);

export const frenoyReadOnlyMatchSync = createAsyncThunk(
  'matches/FrenoyOtherMatchSync',
  async (match: IMatch, { dispatch }) => {
    if (!shouldSync(match)) {
      return;
    }

    try {
      const newMatch = await http.post<IMatch>('/matches/FrenoyOtherMatchSync', {id: match.id});
      dispatch(simpleLoaded(newMatch));
    } catch (err) {
      console.error('frenoyReadOnlyMatchSync', match, err);
    }
  },
);

export const fetchReadOnlyMatch = createAsyncThunk(
  'matches/GetOpponentOne',
  async ({id}: {id: number}) => {
    const response = await http.get<IMatch>(`/matches/GetOpponentOne/${id}`);
    return response;
  },
);


export const readonlyMatchesSlice = createSlice({
  name: 'readonlyMatches',
  initialState: [] as IMatch[],
  reducers: {
    simpleLoaded: (state, action: PayloadAction<IMatch | IMatch[]>) => {
      const newState = mergeInStore2(state, action.payload);
      return newState;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchReadOnlyMatch.fulfilled, (state, action) => {
      const newState = mergeInStore2(state, action.payload, m => m.shouldBePlayed);
      return newState;
    });
  },
});

export const { simpleLoaded } = readonlyMatchesSlice.actions;

export default readonlyMatchesSlice.reducer;

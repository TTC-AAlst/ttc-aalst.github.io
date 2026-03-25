import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mergeInStore2 } from './immutableHelpers';
import { IClub, ICacheResponse } from '../models/model-interfaces';
import http from '../utils/httpClient';
import { showSnackbar } from './configReducer';
import { t } from '../locales';
import { RootState } from '../store';

export const fetchClubs = createAsyncThunk(
  'clubs/Get',
  async (_, { getState }) => {
    const lastChecked = (getState() as RootState).config.caches.clubs;
    const response = await http.get<ICacheResponse<IClub>>('/clubs', {lastChecked});
    return response;
  },
);

export const updateClub = createAsyncThunk(
  'clubs/UpdateClub',
  async (club: IClub, { dispatch }) => {
    try {
      await http.post('/clubs/UpdateClub', club);
      dispatch(showSnackbar('Club saved'));
      return club;
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
      throw err;
    }
  },
);

export const frenoyClubSync = createAsyncThunk(
  'clubs/Sync',
  async (_, { dispatch }) => {
    try {
      const response = await http.post<IClub[]>('/clubs/Sync');
      dispatch(showSnackbar('Clubs synced with Frenoy'));
      return response;
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
      throw err;
    }
  },
);

function getInitialState(): IClub[] {
  return [];
  // const serializedState = localStorage.getItem("redux_clubs");
  // if (!serializedState) {
  //   return [];
  // }

  // try {
  //   const clubs = JSON.parse(serializedState);
  //   return clubs;
  // } catch {
  //   return [];
  // }
}

export const clubsSlice = createSlice({
  name: 'clubs',
  initialState: getInitialState(),
  reducers: {
    simpleLoaded: (state, action: PayloadAction<IClub | IClub[]>) => mergeInStore2(state, action.payload),
  },
  extraReducers: builder => {
    builder.addCase(fetchClubs.fulfilled, (state, action) => {
      if (!action.payload?.data) {
        return state;
      }
      return mergeInStore2(state, action.payload.data);
    });
    builder.addCase(updateClub.fulfilled, (state, action) => mergeInStore2(state, action.payload));
  },
});

export const { simpleLoaded } = clubsSlice.actions;

export default clubsSlice.reducer;

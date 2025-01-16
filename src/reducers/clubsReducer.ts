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
  async (data: {club: IClub}, { dispatch }) => {
    try {
      await http.post('/clubs/UpdateClub', data.club);
      dispatch(showSnackbar('Club saved'));
      return data.club;
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
      throw err;
    }
  },
);

function getInitialState(): IClub[] {
  const serializedState = localStorage.getItem("redux_clubs");
  if (!serializedState) {
    return [];
  }

  try {
    const clubs = JSON.parse(serializedState);
    return clubs;
  } catch {
    return [];
  }
}

export const clubsSlice = createSlice({
  name: 'clubs',
  initialState: getInitialState(),
  reducers: {
    simpleLoaded: (state, action: PayloadAction<IClub | IClub[]>) => mergeInStore2(state, action.payload),
  },
  extraReducers: builder => {
    builder.addCase(fetchClubs.fulfilled, (state, action) => mergeInStore2(state, action.payload.data));
    builder.addCase(updateClub.fulfilled, (state, action) => mergeInStore2(state, action.payload));
  },
});

export const { simpleLoaded } = clubsSlice.actions;

export default clubsSlice.reducer;

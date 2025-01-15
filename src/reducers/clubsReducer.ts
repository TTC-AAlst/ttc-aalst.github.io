import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mergeInStore2 } from './immutableHelpers';
import { IClub } from '../models/model-interfaces';
import http from '../utils/httpClient';
import { showSnackbar } from './configReducer';
import { t } from '../locales';

export const fetchClubs = createAsyncThunk(
  'clubs/Get',
  async () => {
    const response = await http.get<IClub[]>('/clubs');
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

export const clubsSlice = createSlice({
  name: 'clubs',
  initialState: [] as IClub[],
  reducers: {
    simpleLoaded: (state, action: PayloadAction<IClub | IClub[]>) => mergeInStore2(state, action.payload),
  },
  extraReducers: builder => {
    builder.addCase(fetchClubs.fulfilled, (state, action) => mergeInStore2(state, action.payload));
    builder.addCase(updateClub.fulfilled, (state, action) => mergeInStore2(state, action.payload));
  },
});

export const { simpleLoaded } = clubsSlice.actions;

export default clubsSlice.reducer;

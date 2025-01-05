import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mergeInStore2 } from './immutableHelpers';
import { IPlayerStyle, IStorePlayer } from '../models/model-interfaces';
import http from '../utils/httpClient';
import { t } from '../locales';
import { showSnackbar } from './configReducer';

export const fetchPlayers = createAsyncThunk(
  'players/Get',
  async () => {
    const response = await http.get<IStorePlayer[]>('/players');
    return response;
  },
);


export const deletePlayer = createAsyncThunk(
  'players/DeletePlayer',
  async (data: {playerId: number}, { dispatch }) => {
    try {
      await http.post<IStorePlayer>(`/players/DeletePlayer/${data.playerId}`);
      dispatch(showSnackbar(t('player.deletePlaterSuccess')));
      return data.playerId;
    } catch (err) {
      dispatch(showSnackbar(t('player.deletePlayerFail')));
      return null;
    }
  },
);

export const frenoySync = createAsyncThunk(
  'players/FrenoySync',
  async (_, { dispatch }) => {
    try {
      await http.post('/players/FrenoySync');
      dispatch(showSnackbar(t('common.apiSuccess')));
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
    }
  },
);

// TODO: player sync?
// export function frenoySync() {
//   return dispatch => {
//     return http.post('/players/FrenoySync')
//       .then(function() {
//         dispatch(showSnackbar(trans('common.apiSuccess')));
//       }, function(err) {
//         dispatch(showSnackbar(trans('common.apiFail')));
//         console.log('FrenoySync!', err); // eslint-disable-line
//       });
//   };

export const updatePlayer = createAsyncThunk(
  'players/UpdatePlayer',
  async (data: {player: IStorePlayer, switchActive?: boolean}, { dispatch }) => {
    try {
      const response = await http.post<IStorePlayer>('/players/UpdatePlayer', data.player);
      dispatch(showSnackbar(t('player.updatePlayerSuccess')));
      // TODO: need to be broadcasting here...
      // broadcastReload('player', data.player.id);
      return {player: response, switchActive: data.switchActive};
    } catch (err) {
      dispatch(showSnackbar(t('player.updatePlayerFail')));
      return null;
    }
  },
);

export const saveBoardMember = createAsyncThunk(
  'clubs/Board/save',
  async (data: {playerId: number, boardFunction: string, sort: number}, { dispatch }) => {
    try {
      await http.post('/clubs/Board', data);
      dispatch(showSnackbar(t('common.apiSuccess')));
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
    }
  },
);

export const deleteBoardMember = createAsyncThunk(
  'clubs/Board/delete',
  async (data: {playerId: number}, { dispatch }) => {
    try {
      await http.post(`/clubs/Board/${data.playerId}`);
      dispatch(showSnackbar(t('common.apiSuccess')));
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
    }
  },
);

export const updateStyle = createAsyncThunk(
  'players/UpdateStyle',
  async (data: {player: IStorePlayer, newStyle: Omit<IPlayerStyle, 'playerId'>, updatedBy: number | 'system'}, { dispatch }) => {
    try {
      const response = await http.post<IStorePlayer>('/players/UpdateStyle', {playerId: data.player.id, ...data.newStyle});
      dispatch(showSnackbar(t('common.apiSuccess')));
      // broadcastReload('player', data.player.id);
      // const user = storeUtil.getPlayer(data.updatedBy) || {alias: ''};
      // broadcastSnackbar(t('player.editStyle.saved', {
      //   ply: data.player.alias,
      //   by: user.alias,
      //   newStyle: data.newStyle.name + ': ' + data.newStyle.bestStroke
      // }));
      return response;
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
      return null;
    }
  },
);


export const playersSlice = createSlice({
  name: 'players',
  initialState: [] as IStorePlayer[],
  reducers: {
    simpleLoaded: (state, action: PayloadAction<IStorePlayer | IStorePlayer[]>) => {
      mergeInStore2(state, action.payload, p => p.active);
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchPlayers.fulfilled, (state, action) => mergeInStore2(state, action.payload, p => p.active));
    builder.addCase(updateStyle.fulfilled, (state, action) => {
      if (action.payload) {
        return mergeInStore2(state, action.payload, p => p.active);
      }
      return state;
    });
    builder.addCase(updatePlayer.fulfilled, (state, action) => {
      if (action.payload?.switchActive === true) {
        if (action.payload?.player.active) {
          return mergeInStore2(state, action.payload.player, p => p.active);
        }
        return state.filter(p => p.id !== action.payload?.player.id);
      }
      if (action.payload?.player) {
        return mergeInStore2(state, action.payload.player, p => p.active);
      }
      return state;
    });
  },
});

export const playersQuittersSlice = createSlice({
  name: 'playersQuitters',
  initialState: [] as IStorePlayer[],
  reducers: {
    simpleLoaded: (state, action: PayloadAction<IStorePlayer | IStorePlayer[]>) => {
      mergeInStore2(state, action.payload, p => !p.active && p.alias !== 'SYSTEM');
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchPlayers.fulfilled, (state, action) => mergeInStore2(state, action.payload, p => !p.active && p.alias !== 'SYSTEM'));
    builder.addCase(updatePlayer.fulfilled, (state, action) => {
      if (action.payload?.switchActive === true) {
        if (!action.payload?.player.active) {
          return mergeInStore2(state, action.payload.player, p => !p.active && p.alias !== 'SYSTEM');
        }
        return state.filter(p => p.id !== action.payload?.player.id);
      }
      if (action.payload?.player) {
        return mergeInStore2(state, action.payload.player, p => !p.active && p.alias !== 'SYSTEM');
      }
      return state;
    });
    builder.addCase(deletePlayer.fulfilled, (state, action) => state.filter(p => p.id !== action.payload));
  },
});

export const { simpleLoaded } = playersSlice.actions;

export default playersSlice.reducer;

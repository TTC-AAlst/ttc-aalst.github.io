import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NavigateFunction } from 'react-router-dom';
import http from '../utils/httpClient';
import { IStoreUser } from '../models/UserModel';
import { showSnackbar } from './configReducer';
import { t } from '../locales';
import { RootState } from '../store';


const startState = {
  playerId: 0,
  teams: [] as number[],
  security: [] as string[],
};


type ValidateUser = IStoreUser & {
  alias: string;
  token: string;
}


export const login = createAsyncThunk(
  'users/Login',
  async (data: {playerId: number | string, password: string, navigate: NavigateFunction}, {dispatch, getState}) => {
    let playerName: string;
    if (typeof data.playerId === 'number') {
      const store = getState() as RootState;
      const player = store.players.find(x => x.id === data.playerId);
      playerName = player ? player.alias : 'John Doe';
    } else {
      data.playerId = -1;
      playerName = t('systemUserAlias');
    }

    try {
      const response = await http.post<ValidateUser>('/users/Login', {playerId: data.playerId, password: data.password});
      if (response) {
        dispatch(userSlice.actions.login(response));
        // broadcastSnackbar(t('login.loggedIn', response.alias));
        data.navigate('/');
      } else {
        dispatch(showSnackbar(t('login.fail', playerName)));
      }
    } catch (err) {
      dispatch(showSnackbar(t('login.fail', playerName)));
    }
  },
);


export const validateToken = createAsyncThunk(
  'users/ValidateToken',
  async (token: string) => {
    const response = await http.post<ValidateUser>('/users/ValidateToken', {token});
    return response;
  },
);

export const adminSetNewPassword = createAsyncThunk(
  'users/admin/NewPassword',
  async (data: {playerId: string | number, newPassword: string}, { dispatch }) => {
    if (typeof data.playerId === 'string') {
      data.playerId = -1;
    }
    try {
      await http.post('/users/AdminSetNewPassword', data);
      dispatch(showSnackbar(t('common.apiSuccess')));
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
    }
  },
);

export const changePassword = createAsyncThunk(
  'users/ChangePassword',
  async (data: {playerId: number, newPassword: string, oldPassword: string}, { dispatch }) => {
    try {
      const response = await http.post('/users/ChangePassword', data);
      if (response) {
        dispatch(showSnackbar(t('password.passwordChangedSuccess')));
      } else {
        dispatch(showSnackbar(t('password.passwordChangedFail')));
      }
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
    }
  },
);

export const requestResetPasswordLink = createAsyncThunk(
  'users/requestResetPasswordLink',
  async ({playerId, email, navigate}: {playerId: string | number, email: string, navigate: NavigateFunction}, { dispatch }) => {
    try {
      await http.post('/users/requestResetPasswordLink', {playerId, email});
      dispatch(showSnackbar(t('password.fogotMailSent')));
      navigate(-1);
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
    }
  },
);

export const setNewPasswordFromGuid = createAsyncThunk(
  'users/SetNewPasswordFromGuid',
  async ({guid, playerId, password, navigate}: {guid: string, playerId: number, password: string, navigate: NavigateFunction}, { dispatch }) => {
    try {
      await http.post('/users/SetNewPasswordFromGuid', {guid, playerId, password});
      dispatch(showSnackbar(t('common.apiSuccess')));
      dispatch(login({playerId, password, navigate}));
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
    }
  },
);

export const uploadPlayer = createAsyncThunk(
  'users/uploadPlayer',
  async ({imageBase64, playerId, type}: {imageBase64: string, playerId: number, type: 'player-photo' | 'player-avatar'}, { dispatch }) => {
    try {
      await http.uploadImage(imageBase64, playerId, type);
      dispatch(showSnackbar(t('common.apiSuccess')));
      return {playerId};
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
      return {playerId};
    }
  },
);


export const userSlice = createSlice({
  name: 'user',
  initialState: startState,
  reducers: {
    logout: () => {
      localStorage.removeItem('token');
      return startState;
    },
    login: (_, action: PayloadAction<ValidateUser>) => {
      localStorage.setItem('token', action.payload.token);
      return {
        playerId: action.payload.playerId,
        teams: action.payload.teams,
        security: action.payload.security,
      };
    },
  },
  extraReducers: builder => {
    builder.addCase(validateToken.fulfilled, (state, action) => {
      if (action.payload) {
        // if (payload.redirect) {
        //   window.history.back();
        // }
        // broadcastSnackbar(t('login.loggedIn', action.payload.alias));
        localStorage.setItem('token', action.payload.token);
        return {
          playerId: action.payload.playerId,
          teams: action.payload.teams,
          security: action.payload.security,
        };
      }
      return state;
    });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;

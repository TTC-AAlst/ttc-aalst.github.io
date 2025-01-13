import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStoreUser } from '../models/UserModel';
import { validateToken } from './userActions';


const startState = {
  playerId: 0,
  teams: [] as number[],
  security: [] as string[],
};


export type ValidateUser = IStoreUser & {
  alias: string;
  token: string;
}


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

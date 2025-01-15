/* eslint-disable object-property-newline */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import http from '../utils/httpClient';
import { t } from "../locales";
import { ITeamOpponent } from '../models/model-interfaces';
import { login, validateToken } from "./userActions";
import { RootState } from "../store";

type IConfig = typeof defaultConfigState;
type IConfigParams = typeof defaultConfigState.params;
type IBackendConfigParams = Omit<IConfigParams, 'endOfSeason'> & {endOfSeason: 'true' | 'false'};

export const fetchConfig = createAsyncThunk(
  'config/Get',
  async (_, { getState }) => {
    const lastChecked = (getState() as RootState).config.params.ModifiedOn;
    const response = await http.get<IBackendConfigParams>('/config', {lastChecked});
    return response;
  },
);

export const saveConfig = createAsyncThunk(
  'config/Save',
  async (pair: {key: string, value: string}, { dispatch }) => {
    try {
      await http.post('/config', pair);
      dispatch(showSnackbar('Parameter saved'));
      return pair;
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
      console.log('saveConfigParam!', err);
      throw err;
    }
  },
);

type InitialLoad = 'evaluating-start' | 'should-start' | 'done';

const defaultConfigState = {
  initialLoad: 'evaluating-start' as InitialLoad,
  params: {
    email: '', googleMapsUrl: '', location: '', trainingDays: '', competitionDays: '',
    adultMembership: '', youthMembership: '', additionalMembership: '', recreationalMembers: '',
    frenoyClubIdVttl: '', frenoyClubIdSporta: '', compBalls: '', clubBankNr: '', clubOrgNr: '',
    year: '', endOfSeason: false,
    ModifiedOn: '',
  },
  snackbar: '',
  settings: {
    /** 100% width container and hides the footer for today matches on big screen */
    container100PerWidth: false,
  },
  newMatchComments: {} as {[matchId: number]: boolean},
  opponentMatchesLoaded: {} as {[opponentKey: string]: boolean},
};

function getDefaultConfig(initialState: IConfig): IConfig {
  const serializedState = localStorage.getItem("redux_configParams");
  if (!serializedState) {
    return initialState;
  }

  try {
    const configParams = JSON.parse(serializedState);
    return {
      ...defaultConfigState,
      params: configParams,
    };
  } catch {
    return initialState;
  }
}



type Settings = typeof defaultConfigState.settings;
type SettingPair<K extends keyof Settings> = {
  key: K;
  value: Settings[K];
};

export const configSlice = createSlice({
  name: 'config',
  initialState: getDefaultConfig(defaultConfigState),
  reducers: {
    setInitialLoad: (state, action: PayloadAction<InitialLoad>) => {
      state.initialLoad = action.payload;
    },
    clearSnackbar: state => {
      state.snackbar = '';
    },
    showSnackbar: (state, action: PayloadAction<string>) => {
      state.snackbar = action.payload;
    },
    setSetting: <K extends keyof Settings>(state: typeof defaultConfigState, action: PayloadAction<SettingPair<K>>) => {
      const {key, value} = action.payload;
      state.settings[key] = value;
    },
    setNewMatchComment: (state, action: PayloadAction<{matchId: number, isNew: boolean}>) => {
      const {matchId, isNew} = action.payload;
      state.newMatchComments[matchId] = isNew;
    },
    setOpponentMatchesLoaded: (state, action: PayloadAction<{teamId: number, opponent?: ITeamOpponent}>) => {
      const {teamId, opponent} = action.payload;
      const key = `${teamId}-${opponent?.teamCode}-${opponent?.clubId}`;
      state.opponentMatchesLoaded[key] = true;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchConfig.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      state.params = {
        ...action.payload,
        endOfSeason: action.payload.endOfSeason === 'true',
      };
    });

    builder.addCase(saveConfig.fulfilled, (state, action) => {
      state.params[action.payload.key] = action.payload.value;
    });

    builder.addCase(validateToken.fulfilled, (state, action) => {
      state.initialLoad = 'should-start';
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.initialLoad = 'should-start';
    });
  },
});

export const { setInitialLoad, clearSnackbar, showSnackbar, setSetting, setNewMatchComment, setOpponentMatchesLoaded } = configSlice.actions;

const configReducer = configSlice.reducer;
export default configReducer;

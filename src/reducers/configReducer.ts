 
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import http from '../utils/httpClient';
import { t } from "../locales";
import { ITeamOpponent } from '../models/model-interfaces';
import { login, validateToken } from "./userActions";
import { fetchClubs } from "./clubsReducer";
import { fetchPlayers } from "./playersReducer";
import { fetchTeams } from "./teamsReducer";

type IConfig = typeof defaultConfigState;
type IConfigParams = typeof defaultConfigState.params;
type IBackendConfigParams = Omit<IConfigParams, 'endOfSeason'> & {endOfSeason: 'true' | 'false'};

export const fetchConfig = createAsyncThunk(
  'config/Get',
  async () => {
    const response = await http.get<IBackendConfigParams>('/config');
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

const defaultCaches = {
  clubs: '',
  players: '',
  teams: '',
};

const defaultConfigState = {
  initialLoad: 'evaluating-start' as InitialLoad,
  params: {
    email: '', googleMapsUrl: '', location: '', trainingDays: '', competitionDays: '',
    adultMembership: '', youthMembership: '', additionalMembership: '', recreationalMembers: '',
    frenoyClubIdVttl: '', frenoyClubIdSporta: '', compBalls: '', clubBankNr: '', clubOrgNr: '',
    year: '', endOfSeason: false, trainingDays2: '', trainingDays3: '', trainingDays4: '',
    eetfestijn: '', events: '',
    // ModifiedOn: '',
  },
  snackbar: '',
  settings: {
    /** 100% width container and hides the footer for today matches on big screen */
    container100PerWidth: false,
  },
  newMatchComments: {} as {[matchId: number]: boolean},
  opponentMatchesLoaded: {} as {[opponentKey: string]: boolean},
  expandedMatchCards: {} as {[matchId: number]: boolean},
  caches: defaultCaches,
};

function getDefaultConfig(initialState: IConfig): IConfig {
  return initialState;
  // const serializedState = localStorage.getItem("redux_configParams");
  // if (!serializedState) {
  //   return initialState;
  // }

  // const caches = localStorage.getItem("redux_configCaches");
  // try {
  //   const configParams = JSON.parse(serializedState);
  //   return {
  //     ...defaultConfigState,
  //     params: configParams,
  //     caches: caches ? JSON.parse(caches) : defaultCaches,
  //   };
  // } catch {
  //   return initialState;
  // }
}


export type ConfigParams = typeof defaultConfigState.params;
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
    toggleMatchCardExpanded: (state, action: PayloadAction<number>) => {
      const matchId = action.payload;
      state.expandedMatchCards[matchId] = !state.expandedMatchCards[matchId];
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

    builder.addCase(fetchClubs.fulfilled, (state, action) => {
      if (action.payload) {
        state.caches.clubs = action.payload.lastChange;
      }
    });
    builder.addCase(fetchPlayers.fulfilled, (state, action) => {
      if (action.payload) {
        state.caches.players = action.payload.lastChange;
      }
    });
    builder.addCase(fetchTeams.fulfilled, (state, action) => {
      if (action.payload) {
        state.caches.teams = action.payload.lastChange;
      }
    });
  },
});

export const {
  setInitialLoad, clearSnackbar, showSnackbar, setSetting,
  setNewMatchComment, setOpponentMatchesLoaded, toggleMatchCardExpanded,
} = configSlice.actions;

const configReducer = configSlice.reducer;
export default configReducer;

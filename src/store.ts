import { configureStore } from '@reduxjs/toolkit';
import matchesReducer, { freeMatchesSlice } from './reducers/matchesReducer';
import configReducer from './reducers/configReducer';
import userReducer from './reducers/userReducer';
import playersReducer, { playersQuittersSlice } from './reducers/playersReducer';
import teamsReducer from './reducers/teamsReducer';
import clubsReducer from './reducers/clubsReducer';
import readonlyMatchesReducer from './reducers/readonlyMatchesReducer';

export const store = configureStore({
  reducer: {
    config: configReducer,
    user: userReducer,
    matches: matchesReducer,
    freeMatches: freeMatchesSlice.reducer,
    readonlyMatches: readonlyMatchesReducer,
    teams: teamsReducer,
    players: playersReducer,
    playersQuitters: playersQuittersSlice.reducer,
    clubs: clubsReducer,
  },
});


const saveStateToLocalStorage = (state: RootState) => {
  try {
    // Object.entries(state).forEach(([key, value]) => {
    //   const serializedState = JSON.stringify(value);
    //   localStorage.setItem(`redux_${key}`, serializedState);
    // });
    const serializedConfig = JSON.stringify(state.config.params);
    localStorage.setItem("redux_configParams", serializedConfig);

    const serializedCaches = JSON.stringify(state.config.caches);
    localStorage.setItem("redux_configCaches", serializedCaches);

    const serializedClubs = JSON.stringify(state.clubs);
    localStorage.setItem("redux_clubs", serializedClubs);
  } catch (error) {
    console.error("Could not save state", error);
  }
};


store.subscribe(() => {
  console.log('saving state to localStorage');
  saveStateToLocalStorage(store.getState());
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

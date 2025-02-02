import { configureStore } from '@reduxjs/toolkit';
import matchesReducer, { freeMatchesSlice } from './reducers/matchesReducer';
import configReducer from './reducers/configReducer';
import userReducer from './reducers/userReducer';
import playersReducer, { playersQuittersSlice } from './reducers/playersReducer';
import teamsReducer, { teamRankingsSlice } from './reducers/teamsReducer';
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
    teamRankings: teamRankingsSlice.reducer,
    players: playersReducer,
    playersQuitters: playersQuittersSlice.reducer,
    clubs: clubsReducer,
  },
});


// TODO: Disabled this on frontend & backend
// Idea was to store store in localStorage
// Problem: loggedIn vs cleaned data
// const saveStateToLocalStorage = (state: RootState) => {
//   try {
//     const serializedConfig = JSON.stringify(state.config.params);
//     localStorage.setItem("redux_configParams", serializedConfig);

//     const serializedCaches = JSON.stringify(state.config.caches);
//     localStorage.setItem("redux_configCaches", serializedCaches);

//     const serializedClubs = JSON.stringify(state.clubs);
//     localStorage.setItem("redux_clubs", serializedClubs);

//     const serializedPlayers = JSON.stringify(state.players);
//     localStorage.setItem("redux_players", serializedPlayers);

//     const serializedTeams = JSON.stringify(state.teams);
//     localStorage.setItem("redux_teams", serializedTeams);
//   } catch (error) {
//     console.error("Could not save state", error);
//   }
// };


// store.subscribe(() => {
//   console.log('saving state to localStorage');
//   saveStateToLocalStorage(store.getState());
// });


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

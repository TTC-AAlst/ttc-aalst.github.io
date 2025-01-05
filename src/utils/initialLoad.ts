import { useEffect } from 'react';
import { fetchClubs } from '../reducers/clubsReducer';
import { useTtcDispatch, useTtcSelector } from './hooks/storeHooks';
import { fetchConfig, initialLoadCompleted } from '../reducers/configReducer';
import { fetchPlayers } from '../reducers/playersReducer';
import { fetchTeams, loadTeamRanking } from '../reducers/teamsReducer';
import { fetchMatches, frenoyMatchSync } from '../reducers/matchesReducer';
import { validateToken } from '../reducers/userReducer';

export const useInitialLoad = () => {
  const dispatch = useTtcDispatch();
  const playerId = useTtcSelector(state => state.user.playerId);
  const config = useTtcSelector(state => state.config);
  const matches = useTtcSelector(state => state.matches);
  const teams = useTtcSelector(state => state.teams);

  useEffect(() => {
    const initialLoad = async () => {
      const token = localStorage.getItem('token');
      if (token && !playerId) {
        console.log('Validating Token');
        try {
          await dispatch(validateToken(token)).unwrap();
        } catch (e) {
          console.error('Token validation failed', e);
        }
      }

      if (token && !config.initialLoadStart) {
        console.log('Skipping Initial Load');
        return;
      }

      console.log('Start Initial Load', playerId);
      await Promise.all([
        dispatch(fetchClubs()).unwrap(),
        dispatch(fetchConfig()).unwrap(),
        dispatch(fetchPlayers()).unwrap(),
        dispatch(fetchTeams()).unwrap(),
        dispatch(fetchMatches()).unwrap(),
      ]);

      console.log('Initial Load Completing');
      dispatch(initialLoadCompleted());
    };

    try {
      initialLoad().then(() => {
        console.log('Initial Load Completed');
      }, err => {
        console.error('Initial Load failed (promise)', err);
      });
    } catch (err) {
      console.error('Initial Load failed (catch block)', err);
    }
  }, [playerId, config.initialLoadStart]);

  useEffect(() => {
    if (config.initialLoadCompleted) {
      console.log('Secondary load started');
      console.log('Teams', teams.length);
      teams.forEach(team => {
        if (!team.ranking || team.ranking.length === 0) {
          dispatch(loadTeamRanking({teamId: team.id}));
        }
      });

      console.log('Matches', matches.length);
      matches.forEach(match => {
        dispatch(frenoyMatchSync({match}));
      });
    }
  }, [config.initialLoadCompleted]);
};

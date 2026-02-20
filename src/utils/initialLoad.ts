import { useEffect } from 'react';
import { fetchClubs } from '../reducers/clubsReducer';
import { useTtcDispatch, useTtcSelector } from './hooks/storeHooks';
import { fetchConfig, setInitialLoad } from '../reducers/configReducer';
import { fetchPlayers, fetchRankingPredictions } from '../reducers/playersReducer';
import { fetchTeams, loadTeamRanking } from '../reducers/teamsReducer';
import { fetchMatches, frenoyMatchSync } from '../reducers/matchesReducer';
import { validateToken } from '../reducers/userActions';
import http from './httpClient';

export const useInitialLoad = () => {
  const dispatch = useTtcDispatch();
  const playerId = useTtcSelector(state => state.user.playerId);
  const config = useTtcSelector(state => state.config);
  const matches = useTtcSelector(state => state.matches);
  const teams = useTtcSelector(state => state.teams);

  useEffect(() => {
    const initialLoad = async () => {
      if (config.initialLoad === 'done') {
        return;
      }

      const token = localStorage.getItem('token');
      console.log(`InitialLoadEffect: ${config.initialLoad} for PlayerId=${playerId} with Token=${!!token}`);

      if (token && !playerId) {
        console.log('Validating Token');
        try {
          localStorage.removeItem('token');
          await dispatch(validateToken(token)).unwrap();
        } catch (e) {
          console.error('Token validation failed', e);
        }
      }

      if (token && config.initialLoad === 'evaluating-start') {
        console.log('Skipping Initial Load');
        return;
      }

      console.log('Start Initial Load', playerId);
      try {
        await Promise.all([
          dispatch(fetchClubs()).unwrap(),
          dispatch(fetchConfig()).unwrap(),
          dispatch(fetchPlayers()).unwrap(),
          dispatch(fetchTeams()).unwrap(),
          dispatch(fetchMatches()).unwrap(),
        ]);
        console.log('Initial Load Done');
      } catch (err) {
        console.error('Initial Load failed', err);
      }

      dispatch(setInitialLoad('done'));
    };

    try {
      initialLoad().then(() => {}, err => {
        console.error('Initial Load failed (promise)', err);
      });
    } catch (err) {
      console.error('Initial Load failed (catch block)', err);
    }
  }, [playerId, config.initialLoad, dispatch]);

  useEffect(() => {
    if (config.initialLoad === 'done') {
      console.log('Secondary load started');
      console.log('Teams', teams.length);
      teams.forEach(team => {
        dispatch(loadTeamRanking({team}));
      });

      dispatch(fetchRankingPredictions())
        .unwrap()
        .catch(err => {
          http.post('/config/log', {
            Message: `Failed to load ranking predictions: ${err?.message || String(err)}`,
            Stack: err?.stack || '',
            ComponentStack: `userAgent: ${navigator.userAgent}, screen: ${window.innerWidth}x${window.innerHeight}`,
            Url: window.location.href,
            ParsedStack: '',
          });
        });

      console.log('Matches', matches.length);
      matches.forEach(match => {
        dispatch(frenoyMatchSync({match}));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.initialLoad]);
};

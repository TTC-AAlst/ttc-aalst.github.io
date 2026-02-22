import React from 'react';
import { EndOfSeason } from '../other/EndOfSeason/EndOfSeason';
import { selectUser, useTtcSelector } from '../../utils/hooks/storeHooks';
import { Dashboard } from '../dashboard/Dashboard';
import { PublicDashboard } from '../dashboard/PublicDashboard';


const Intro = () => {
  const config = useTtcSelector(state => state.config);
  const user = useTtcSelector(selectUser);

  if (config.params.endOfSeason) {
    return <EndOfSeason />;
  }

  if (user.playerId) {
    return <Dashboard />;
  }

  return <PublicDashboard />;
};

export default Intro;

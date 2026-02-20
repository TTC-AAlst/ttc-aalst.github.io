import React from 'react';
import { BrowserRouter, Route, Routes as Switch } from 'react-router-dom';
import { Competition, ITeam, ITeamOpponent } from './models/model-interfaces';
import { useInitialLoad } from './utils/initialLoad';
import { App } from './components/App/App';
import { Players } from './components/players/Players';
import { Player } from './components/players/Player';
import { Login } from './components/users/Login';
import { ForgotPassword, ForgotPasswordReset } from './components/users/ForgotPassword';
import { Profile } from './components/users/Profile';
import Links from './components/other/Links';
import { Administration } from './components/other/Administration';
import { GeneralInfo } from './components/other/GeneralInfo';
import { Matches } from './components/matches/Matches';
import { MatchesToday } from './components/matches/MatchesToday';
import { MatchesWeek } from './components/matches/MatchesWeek';
import { RoutedMatchCard } from './components/matches/Match/RoutedMatchCard';
import Facts from './components/other/Facts';
import { Teams } from './components/teams/Teams';
const Admin = React.lazy(() => import('./components/admin/Admin'));
import { OpponentOverview } from './components/teams/OpponentOverview';
import Intro from './components/App/Intro';
import { NotFound } from './components/other/NotFound';
import { useErrorHandling } from './utils/hooks/useErrorHandling';
import t from './locales';
import { useSignalR } from './utils/hooks/useSignalR';

const Routes = () => {
  useInitialLoad();
  useErrorHandling();
  useSignalR();

  return (
    <BrowserRouter>
      <Switch>
        <Route path={`${t.route('matchesWeek')}/:week?/:comp?`} element={<App Component={MatchesWeek} />} />
        <Route path={`${t.route('teams')}/:tabKey?/:view?`} element={<App Component={Teams} />} />
        <Route path={t.route('opponent')} element={<App Component={OpponentOverview} />} />

        <Route path={t.route('matchesToday')} element={<App Component={MatchesToday} />} />
        <Route path={t.route('matches')} element={<App Component={Matches} />} />
        <Route path={`${t.route('match')}/:tabKey?`} element={<App Component={RoutedMatchCard} />} />

        <Route path={`${t.route('profile')}/:tabKey?`} element={<App Component={Profile} />} />
        <Route path={t.route('forgotPassword')} element={<App Component={ForgotPassword} />} />
        <Route path={`${t.route('forgotPassword')}/:guid`} element={<App Component={ForgotPasswordReset} />} />
        <Route path={t.route('login')} element={<App Component={Login} />} />

        <Route path={`${t.route('players')}/:tabKey?`} element={<App Component={Players} />} />
        <Route path={t.route('player')} element={<App Component={Player} />} />

        <Route path={t.route('generalInfo')} element={<App Component={GeneralInfo} />} />
        <Route path={t.route('facts')} element={<App Component={Facts} />} />
        <Route path={t.route('administration')} element={<App Component={Administration} />} />
        <Route path={t.route('links')} element={<App Component={Links} />} />

        <Route path={`${t.route('admin')}/:tabKey?`} element={<App Component={Admin} />} />

        <Route path="/" element={<App Component={Intro} />} />
        <Route path="*" element={<App Component={NotFound} />} />
      </Switch>
    </BrowserRouter>
  );
};


export const browseTo = {
  getTeam({competition, teamCode = 'A'}: ITeam, view = 'main') {
    return `${t.route('teams').replace(':competition', competition)}/${teamCode}/${view}`;
  },
  getOpponent(competition: Competition, {clubId, teamCode}: ITeamOpponent) {
    return t.route('opponent')
      .replace(':competition', competition)
      .replace(':clubId', clubId?.toString())
      .replace(':teamCode', teamCode || '');
  },
};

export default Routes;

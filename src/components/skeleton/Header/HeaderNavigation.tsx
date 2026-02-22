import React from 'react';
import {useNavigate} from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import { t } from '../../../locales';
import { selectMatchesBeingPlayed, selectPlayers, selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';
import PlayerModel from '../../../models/PlayerModel';

type NavigationProps = {
  closeNav: () => void,
  navOpen: boolean,
}

export const Navigation = ({navOpen, closeNav}: NavigationProps) => {
  const matchesToday = useTtcSelector(selectMatchesBeingPlayed);
  const navigate = useNavigate();
  const user = useTtcSelector(selectUser);
  const players = useTtcSelector(selectPlayers);
  const hasYouthTeam = useTtcSelector(state => state.teams.some(team => team.competition === 'Jeugd'));
  const currentPlayer = user.playerId ? players.find(p => p.id === user.playerId) : null;
  const playerUrl = currentPlayer ? t.route('player').replace(':playerId', encodeURI(new PlayerModel(currentPlayer).slug)) : '';

  const handleClickHelpButton = () => {
    window.open('https://ttc-aalst.github.io/onboarding/', '_blank');
  };

  const goto = (url: string) => {
    closeNav();
    navigate(url);
  };

  return (
    <Drawer open={navOpen} onClose={closeNav}>
      <AppBar>
        <Toolbar variant="dense">
          <Typography className="clickable" variant="subtitle1" color="inherit" style={{flexGrow: 1, fontSize: '1.7rem'}} onClick={closeNav}>
            {t('clubName')}
          </Typography>
        </Toolbar>
      </AppBar>

      <div style={{marginTop: 60, width: 250}}>
        <MenuItem onClick={() => goto('/')}>{t('nav.home')}</MenuItem>
        <MenuItem onClick={() => goto(t.route('matches'))}>{t('nav.matches')}</MenuItem>
        {matchesToday.length ? (
          <MenuItem onClick={() => goto(t.route('matchesToday'))}>
            <Badge badgeContent={matchesToday.length} color="secondary">
              {t('nav.matchesToday')}
            </Badge>
          </MenuItem>
        ) : null}
        <MenuItem onClick={() => goto(t.route('matchesWeek'))}>{t('nav.matchesWeek')}</MenuItem>
        <MenuItem onClick={() => goto(t.route('teams', {competition: 'Vttl'}))}>{t('nav.teamsVttl')}</MenuItem>
        <MenuItem onClick={() => goto(t.route('teams', {competition: 'Sporta'}))}>{t('nav.teamsSporta')}</MenuItem>
        {hasYouthTeam && <MenuItem onClick={() => goto(t.route('teams', {competition: 'Jeugd'}))}>{t('nav.teamsJeugd')}</MenuItem>}
        {currentPlayer && <MenuItem onClick={() => goto(playerUrl)}>{t('nav.myPlayerPage')}</MenuItem>}
        <MenuItem onClick={() => goto(t.route('players'))}>{t('nav.players')}</MenuItem>
        {user.isAdmin() ? <MenuItem onClick={() => goto(t.route('admin'))}>{t('nav.admin')}</MenuItem> : null}
        <Divider />
        <MenuItem onClick={() => goto(t.route('generalInfo'))}>{t('nav.generalInfo')}</MenuItem>
        <MenuItem onClick={() => goto(t.route('administration'))}>{t('nav.administration')}</MenuItem>
        <MenuItem onClick={() => goto(t.route('links'))}>{t('nav.links')}</MenuItem>
        <MenuItem onClick={() => goto(t.route('facts'))}>{t('nav.facts')}</MenuItem>
        <MenuItem onClick={handleClickHelpButton}>{t('nav.help')}</MenuItem>
        <MenuItem onClick={closeNav}>{t('nav.closeMenu')}</MenuItem>
        <Divider />
      </div>
    </Drawer>
  );
};

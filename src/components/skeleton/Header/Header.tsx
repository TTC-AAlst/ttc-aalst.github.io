import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Navigation } from './HeaderNavigation';
import { Icon } from '../../controls/Icons/Icon';
import { t } from '../../../locales';
import { useViewport } from '../../../utils/hooks/useViewport';
import { useTtcSelector } from '../../../utils/hooks/storeHooks';

import './Header.css';

const HeaderButton = ({label, href}: {label: string, href: string}) => (
  <Link to={href}>
    <Button style={{color: 'white'}}>
      {label}
    </Button>
  </Link>
);


type HeaderProps = {
  navOpen: boolean,
  setNavOpen: (open: boolean) => void,
}

export const Header = ({navOpen, setNavOpen}: HeaderProps) => {
  const user = useTtcSelector(state => state.user);
  const viewport = useViewport();
  const showExtraNavigationButtons = viewport.width > 700;

  return (
    <div style={{flexGrow: 1}}>
      <AppBar position="sticky">
        <Toolbar variant="dense">
          <IconButton
            style={{marginLeft: -12, marginRight: 20}}
            color="inherit"
            aria-label="Menu"
            onClick={() => setNavOpen(!navOpen)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="subtitle1" color="inherit" style={{flexGrow: 1, fontSize: '1.7rem'}}>
            <Link className="Header-link" to="/">{navOpen ? null : t('clubName')}</Link>
          </Typography>

          <div>
            {showExtraNavigationButtons ? (
              <div style={{display: 'inline-block', textAlign: 'center', width: 300}}>
                <HeaderButton label={t('common.vttl')} href={t.route('teams', {competition: 'Vttl'})} />
                <HeaderButton label={t('common.sporta')} href={t.route('teams', {competition: 'Sporta'})} />
                <HeaderButton label={t('nav.players')} href={t.route('players')} />
              </div>
            ) : null}

            {!user.playerId ? (
              <HeaderButton label={t('nav.login')} href={t.route('login')} />
            ) : (
              <Link className="Header-icon-right" to={t.route('profile')}>
                <Icon fa="fa fa-2x fa-user" translate tooltip="profile.tooltip" tooltipPlacement="left" />
              </Link>
            )}
          </div>
        </Toolbar>
      </AppBar>

      <Navigation
        navOpen={navOpen}
        closeNav={() => setNavOpen(false)}
      />
    </div>
  );
};

import { Link } from 'react-router-dom';
import { Badge, Button, Container, Navbar } from 'react-bootstrap';
import { isProd } from '../../../config';
import { Navigation } from './HeaderNavigation';
import { HeaderScoreCarousel } from './HeaderScoreCarousel';
import { Icon } from '../../controls/Icons/Icon';
import { t } from '../../../locales';
import { useViewport } from '../../../utils/hooks/useViewport';
import { selectMatchesBeingPlayed, useTtcSelector } from '../../../utils/hooks/storeHooks';

import './Header.css';

const HeaderButton = ({ label, href }: { label: string; href: string }) => (
  <Link to={href}>
    <Button variant="link" className="text-decoration-none" style={{ color: 'white' }}>
      {label}
    </Button>
  </Link>
);

type HeaderProps = {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
};

export const Header = ({ navOpen, setNavOpen }: HeaderProps) => {
  const user = useTtcSelector(state => state.user);
  const matchesToday = useTtcSelector(selectMatchesBeingPlayed);
  const viewport = useViewport();
  const showExtraNavigationButtons = viewport.width > 700;
  const showCarousel = matchesToday.length > 0;

  // Non-prod (dev/PR previews) gets a colourblind-safe amber bar + label so it's never
  // mistaken for the live site. Label, not colour alone.
  const nonProd = !isProd();

  return (
    <div style={{ flexGrow: 1 }}>
      <Navbar bg="primary" sticky="top" data-bs-theme="dark" style={nonProd ? { backgroundColor: '#b45309' } : undefined}>
        <Container fluid>
          <button className="btn btn-link text-white" style={{ marginLeft: -12, marginRight: 20 }} aria-label="Menu" onClick={() => setNavOpen(!navOpen)}>
            <i className="fa fa-bars" />
          </button>

          {nonProd ? (
            <Badge bg="dark" className="me-2" style={{ letterSpacing: 1 }}>
              DEV
            </Badge>
          ) : null}

          <span style={{ flexGrow: 1, fontSize: '1.7rem' }}>
            {showCarousel && !navOpen ? (
              <HeaderScoreCarousel matches={matchesToday} />
            ) : (
              <Link className="Header-link" to="/">
                {navOpen ? null : t('clubName')}
              </Link>
            )}
          </span>

          <div>
            {showExtraNavigationButtons ? (
              <div style={{ display: 'inline-block', textAlign: 'center', width: 300 }}>
                <HeaderButton label={t('common.vttl')} href={t.route('teams', { competition: 'Vttl' })} />
                <HeaderButton label={t('common.sporta')} href={t.route('teams', { competition: 'Sporta' })} />
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
        </Container>
      </Navbar>

      <Navigation navOpen={navOpen} closeNav={() => setNavOpen(false)} />
    </div>
  );
};

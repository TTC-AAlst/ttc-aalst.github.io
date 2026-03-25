import React from 'react';
import dayjs from 'dayjs';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import t from '../../locales';
import { Strike } from '../controls/controls/Strike';
import { SmallMatchCardHeader } from '../matches/Match/MatchCardHeader';
import { EndOfSeason } from '../other/EndOfSeason/EndOfSeason';
import { Eetfestijn } from './Eetfestijn';
import { IntroClub } from './IntroClub';
import { WeirdLocaleYearInfo } from './WeirdLocaleYearInfo';
import { IntroSponsors } from './IntroSponsors';
import { IMatch } from '../../models/model-interfaces';
import { useViewport } from '../../utils/hooks/useViewport';
import { selectMatches, selectMatchesToday, selectUser, useTtcSelector } from '../../utils/hooks/storeHooks';
import { ClubEvents } from '../other/ClubEvents';
import { Dashboard } from '../dashboard/Dashboard';


const Intro = () => {
  const viewport = useViewport();
  const config = useTtcSelector(state => state.config);
  const user = useTtcSelector(selectUser);

  if (config.params.endOfSeason) {
    return <EndOfSeason />;
  }

  if (user.playerId) {
    return <Dashboard />;
  }

  return (
    <div>
      <Row style={{marginTop: 25}}>
        <ClubEvents />
        <Col md={6} style={{verticalAlign: 'top'}}>
          <IntroClub />
          <WeirdLocaleYearInfo params={config.params} />
        </Col>
        <Col md={6}>
          {config.initialLoad !== 'done' ? (
            <Loading bigScreen={viewport.width > 768} />
          ) : (
            <div>
              <div style={{clear: 'both'}} />
              <Eetfestijn />
              <TodaysEvents />
            </div>
          )}
        </Col>
      </Row>
      <IntroSponsors />
    </div>
  );
};

export default Intro;


const Loading = ({bigScreen}: {bigScreen: boolean}) => (
  <div style={bigScreen ? undefined : {width: 310, margin: 'auto', marginBottom: 15, marginTop: 15}}>
    <img
      src="/img/schlager.gif"
      style={{borderRadius: 25}}
      title={t('intro.loading')}
      alt="Busy TT player spinner"
    />

    <div style={{position: 'absolute', top: 5, width: 310, margin: 'auto'}}>
      <div style={{width: 310, textAlign: 'center', color: 'white'}}>
        {t('intro.loading')}
      </div>
    </div>
  </div>
);


const TodayEventMatches = ({matches}: {matches: IMatch[]}) => (
  <>
    {matches.map(match => (
      <div style={{padding: 5}} key={match.id}>
        <SmallMatchCardHeader match2={match} isOpen={false} noScoreEdit />
      </div>
    ))}
  </>
);


const TodaysEvents = () => {
  const matches = useTtcSelector(selectMatches);
  const matchesToday = useTtcSelector(selectMatchesToday);
  if (matchesToday.length) {
    return (
      <div>
        <Strike text={t('intro.matchesToday')} />
        <TodayEventMatches matches={matchesToday} />
      </div>
    );
  }

  const today = dayjs();
  const lastPlayedMatches = matches
    .filter(cal => cal.date.isBefore(today, 'day'))
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .slice(0, 4);

  return (
    <div>
      {!!lastPlayedMatches.length && (
        <div>
          <Strike text={t('intro.playedMatches')} />
          <TodayEventMatches matches={lastPlayedMatches} />
        </div>
      )}
    </div>
  );
};

import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ClubEvents } from '../other/ClubEvents';
import { Eetfestijn } from '../App/Eetfestijn';
import { IntroClub } from '../App/IntroClub';
import { IntroSponsors } from '../App/IntroSponsors';
import { PublicTeamStats } from './PublicTeamStats';
import { DashboardRankingPredictions } from './DashboardRankingPredictions';
import { useTtcSelector } from '../../utils/hooks/storeHooks';

export const PublicDashboard = () => {
  const config = useTtcSelector(state => state.config);
  const isLoading = config.initialLoad !== 'done';

  if (isLoading) {
    return (
      <div style={{marginTop: 25}}>
        <Row>
          <Col md={6}>
            <IntroClub />
          </Col>
          <Col md={6}>
            <div style={{textAlign: 'center', padding: 40}}>
              <img
                src="/img/schlager.gif"
                style={{borderRadius: 25, maxWidth: '100%'}}
                alt="Loading..."
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div style={{marginTop: 25}}>
      <Row>
        <ClubEvents />
      </Row>

      <Row>
        <Col md={6}>
          <IntroClub />
        </Col>
        <Col md={6}>
          <Eetfestijn />
        </Col>
      </Row>

      <PublicTeamStats />

      <DashboardRankingPredictions />

      <IntroSponsors />
    </div>
  );
};

import React, { useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ClubEvents } from '../other/ClubEvents';
import { Eetfestijn } from '../App/Eetfestijn';
import { DashboardUpcomingMatches } from './DashboardUpcomingMatches';
import { DashboardGlobalTeamStats } from './DashboardGlobalTeamStats';
import { DashboardRecentMatches } from './DashboardRecentMatches';
import { DashboardRankingPredictions } from './DashboardRankingPredictions';
import { TeamPlayerPerformance } from './TeamPlayerPerformance/TeamPlayerPerformance';
import { PlayerEvents } from './PlayerEvents/PlayerEvents';
import { useTtcDispatch } from '../../utils/hooks/storeHooks';
import { fetchPlayerEvents } from '../../reducers/playersReducer';

export const Dashboard = () => {
  const dispatch = useTtcDispatch();

  useEffect(() => {
    dispatch(fetchPlayerEvents());
  }, [dispatch]);

  return (
    <div style={{marginTop: 25}}>
      <Row>
        <ClubEvents />
      </Row>

      <Row>
        <Col lg={9} md={8}>
          <Eetfestijn />
          <DashboardUpcomingMatches />
          <DashboardGlobalTeamStats />
          <DashboardRecentMatches />
          <TeamPlayerPerformance />
        </Col>

        <Col lg={3} md={4}>
          <DashboardRankingPredictions />
          <PlayerEvents />
        </Col>
      </Row>
    </div>
  );
};

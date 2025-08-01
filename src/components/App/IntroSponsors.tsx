import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Strike } from '../controls/controls/Strike';
import * as Sponsor from './Sponsors';
import { useViewport } from '../../utils/hooks/useViewport';
import { t } from '../../locales';

export const IntroSponsors = () => {
  const viewport = useViewport();
  const big = viewport.width > 830;
  if (big) {
    return (
      <Row style={{marginTop: 25, marginBottom: 15}}>
        <div style={{width: 800, margin: 'auto'}}>
          <Strike text={t('intro.ourSponsors')} style={{marginBottom: 5}} />
          <Sponsor.NextGenLED big={big} />
          <Sponsor.Capatt big={big} style={{marginLeft: 20}} />
        </div>
        <div style={{width: 770, margin: 'auto', paddingTop: 25, display: 'flex'}}>
          <div>
            <Sponsor.Itenium big={big} style={{marginBottom: 20}} />
            <Sponsor.HappyPlays big={big} />
          </div>
          <div style={{marginLeft: 20}}>
            <Sponsor.NextGenLasers big={big} style={{marginBottom: 15}} />
          </div>
        </div>
        <div style={{width: 770, margin: 'auto', paddingTop: 25, paddingLeft: 200}}>
          <Sponsor.Mijlbeek big={big} />
        </div>
      </Row>
    );
  }

  return (
    <Row style={{margin: 10}}>
      <Strike text={t('intro.ourSponsors')} style={{marginBottom: 5}} />
      <Col style={{marginTop: 20}}>
        <Sponsor.Itenium big={big} />
      </Col>
      <Col style={{marginTop: 20}}>
        <Sponsor.NextGenLED big={big} />
      </Col>
      <Col style={{marginTop: 20}}>
        <Sponsor.Capatt big={big} />
      </Col>
      <Col style={{marginTop: 20}}>
        <Sponsor.Mijlbeek big={big} />
      </Col>
      <Col style={{marginTop: 20}}>
        <Sponsor.HappyPlays big={big} />
      </Col>
      <Col style={{marginTop: 20}}>
        <Sponsor.NextGenLasers big={big} />
      </Col>
    </Row>
  );
};

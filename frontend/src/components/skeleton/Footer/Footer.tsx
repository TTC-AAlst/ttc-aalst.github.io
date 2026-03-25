import React from 'react';
import { CookieNotice } from './CookieNotice';
import { Icon } from '../../controls/Icons/Icon';
import { OwnEmail } from '../../controls/controls/Email';
import { useTtcSelector } from '../../../utils/hooks/storeHooks';

import './Footer.scss';

export const Footer = () => {
  const params = useTtcSelector(state => state.config.params);

  return (
    <>
      <MadeBy />
      <div className="Footer">
        <div className="container">
          <div className="row">
            <div className="col-12 logo">
              <img src="/img/footer.svg" style={{maxWidth: 500}} />
            </div>
            <div className="col-2 col-md-1"><Icon fa="fa fa-map-marker" /></div>
            <div className="col-10 col-md-5 Footer-text">{params.location}</div>
            <div className="col-2 col-md-1"><Icon fa="fa fa-calendar" /></div>
            <div className="col-10 col-md-5 Footer-text">
              {params.trainingDays}
              <br />
              {params.competitionDays}
            </div>
            <div className="col-2 col-md-1"><Icon fa="fa fa-envelope-o" /></div>
            <div className="col-10 col-md-5 Footer-text">
              <OwnEmail className="Footer-link" />
            </div>
          </div>
        </div>
        <CookieNotice />
      </div>
    </>
  );
};


const MadeBy = () => {
  const style: React.CSSProperties = {
    float: 'right',
    marginRight: 20,
    marginTop: 8,
  };
  return (
    <div>
      <div style={style}>
        by <a href="https://itenium.be" target="_blank" rel="noopener noreferrer">itenium</a>
      </div>
      <div style={{clear: 'both'}} />
    </div>
  );
};

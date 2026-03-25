import React, {Component} from 'react';
import {Icon} from '../Icons/Icon';
import {Telephone} from './Telephone';
import { t } from '../../../locales';

type LocationProps = {
  loc: any;
  noTelephoneLink?: boolean;
};

export const Location = ({loc, noTelephoneLink = false}: LocationProps) => (
  <div>
    <div className="iconize">
      <Icon fa="fa fa-map-marker" style={{verticalAlign: 'top'}} />
      {loc.address ? (
        <div>
          <strong>{loc.description}</strong><br />
          {loc.address}<br />
          {`${loc.postalCode} ${loc.city}`}
        </div>
      ) : (
        <div>{t('match.club.locationUnknown')}</div>
      )}
    </div>
    <Telephone number={loc.mobile} noLink={noTelephoneLink} />
    {loc.website ? (<Website site={loc.website} description={t('match.club.websiteKnown')} />) : null}
  </div>
);



type WebsiteProps = {
  site: string;
  description: string;
}

class Website extends Component<WebsiteProps> {
  render() {
    if (!this.props.site) {
      return null;
    }

    return (
      <div className="iconize">
        <Icon fa="fa fa-external-link" />
        <span style={{marginLeft: 7}}>
          <a href={this.props.site} target="_blank" rel="noopener noreferrer">{this.props.description}</a>
        </span>
      </div>
    );
  }
}

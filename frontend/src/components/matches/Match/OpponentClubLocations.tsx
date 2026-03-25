import React from 'react';
import { Location } from '../../controls/controls/Location';
import { IClub } from '../../../models/model-interfaces';
import { t } from '../../../locales';

export const OpponentClubLocations = ({club}: {club: IClub}) => (
  <div className="match-card-tab-content">
    <h3>{t('match.club.locationTitle')}</h3>
    <Location loc={club.mainLocation} />
  </div>
);

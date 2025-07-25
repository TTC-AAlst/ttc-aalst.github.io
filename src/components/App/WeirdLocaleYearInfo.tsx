import React from 'react';
import { t } from '../../locales';

export const WeirdLocaleYearInfo = ({params}: any) => ( // eslint-disable-line
  <div style={{paddingTop: 18}}>
    <h3>KTA Technigo Sporthal - De Voorstad</h3>
    <b>{params.location}</b>
    <br />
    <br />{t('clubs.training.trainingDays2')}
    <br />{t('clubs.training.trainingDays3')}
    <br />
    Jeugdwerking vanaf 8 jaar
    <br />
    {params.competitionDays}
    <br />
  </div>
);

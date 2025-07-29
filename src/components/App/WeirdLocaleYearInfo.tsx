import React from 'react';
import { t } from '../../locales';
import { ConfigParams } from '../../reducers/configReducer';

export const WeirdLocaleYearInfo = ({params}: {params: ConfigParams}) => (
  <div style={{paddingTop: 18}}>
    <h3>KTA Technigo Sporthal - De Voorstad</h3>
    <b>{params.location}</b>
    <br />
    <br />{params.trainingDays2}
    <br />{params.trainingDays3}
    <br />
    {params.trainingDays4}
    <br />
    {params.competitionDays}
    <br />
  </div>
);

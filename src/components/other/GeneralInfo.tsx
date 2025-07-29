import React from 'react';
import {OwnEmail} from '../controls/controls/Email';
import {GoogleMap} from '../controls/controls/GoogleMap';
import { t } from '../../locales';
import { useTtcSelector } from '../../utils/hooks/storeHooks';

export const GeneralInfo = () => {
  const params = useTtcSelector(state => state.config.params);

  return (
    <div style={{marginTop: 10, marginBottom: 10}}>
      <h2>{t('clubs.generalInfo.title')}</h2>
      <div className="row">
        <div className="col-md-6">
          <h1>{t('clubs.generalInfo.contact')}</h1>
          <strong>{t('clubs.generalInfo.ourAddress')}</strong> {params.location}
          <div><strong>{t('clubs.generalInfo.ourEmail')}</strong> <OwnEmail /></div>
          <strong>{t('clubs.generalInfo.orgNr')}</strong> {params.clubOrgNr}<br />

          <h1>{t('clubs.generalInfo.openDays')}</h1>
          {params.competitionDays}
          <br />
          {params.trainingDays}
          Hello?
          <br />{params.trainingDays2}
          <br />{params.trainingDays3}
          <br />{params.trainingDays4}
          <br />{t('clubs.training.extra')}
          <br /><br />
          <strong>VTTL</strong> {params.frenoyClubIdVttl}<br />
          <strong>Sporta</strong> {params.frenoyClubIdSporta}<br />
          <br />
          <strong>{t('clubs.generalInfo.balls')}</strong><br />
          {params.compBalls}<br />

          <h1>{t('clubs.generalInfo.moneyMoney')}</h1>
          {params.adultMembership}
          <br />
          {params.youthMembership}
          <br />
          {params.recreationalMembers}

          <div style={{marginTop: 16, fontSize: 12}}>{params.additionalMembership}</div>

          <br />
          <strong>{t('clubs.generalInfo.bankNr')}</strong> {params.clubBankNr}<br />

        </div>
        <div className="col-md-6">
          <h1 className="d-block d-md-none">{t('clubs.generalInfo.googleMap')}</h1>
          <GoogleMap />
        </div>
      </div>
    </div>
  );
};

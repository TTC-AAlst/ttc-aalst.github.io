import React from 'react';
import {IntroClub} from '../../App/IntroClub';
import {IntroSponsors} from '../../App/IntroSponsors';
import {Kampioenen} from './Kampioenen';
import Achievements from './Achievements';
import {NextSeasonChanges} from './NextSeasonChanges';
import {IPlayer, ITeam, IMatch, IClub} from '../../../models/model-interfaces';
import {AchievementsCalculator} from './AchievementsCalculator';
import {Strike} from '../../controls/controls/Strike';
import { selectMatches, selectPlayers, selectTeams, useTtcSelector } from '../../../utils/hooks/storeHooks';

// TODO: This thing crashes on PlayerLink --> Probably when there is someone in the achievements that has left the club

require('./achievements.css');

export const EndOfSeason = () => {
  const players = useTtcSelector(selectPlayers);
  const teams = useTtcSelector(selectTeams);
  const matches = useTtcSelector(selectMatches);
  const calcer = new AchievementsCalculator(players, matches, teams);
  return (
    <div className="endofseason-container">
      <div className="row">
        <div className="col-md-6">
          <IntroClub />
        </div>
        {/* <div className="col-md-6">
          <h3>Komende Events</h3>
          <Strike text="Kampioenenhuldiging met drankje en hapje vrijdag 7 juni" />
          <Strike text="Save the date! Eetfestijn 2019 op zaterdag 28 september" />
        </div> */}
      </div>
      <h2>Einde Seizoen {new Date().getFullYear() - 1}-{new Date().getFullYear()}</h2>
      <Kampioenen topTeams={calcer.getTopRankedTeams()} />
      <NextSeasonChanges calcer={calcer} />
      <Achievements calcer={calcer} />
      <div className="row">
        <IntroSponsors />
      </div>
    </div>
  );
};

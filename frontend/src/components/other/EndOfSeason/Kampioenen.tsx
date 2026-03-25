import React from 'react';
import {Link} from 'react-router-dom';
import {TrophyIcon} from '../../controls/Icons/TrophyIcon';
import {TeamRankingBadges} from '../../teams/controls/TeamRankingBadges';
import {TeamPlayerAvatars} from '../../teams/controls/TeamPlayerAvatars';
import {ITeam} from '../../../models/model-interfaces';
import { t } from '../../../locales';

type KampioenenProps = {
  topTeams: ITeam[];
}

export const Kampioenen = ({topTeams}: KampioenenProps) => {
  if (!topTeams.length) {
    return null;
  }

  return (
    <div className="row kampioen">
      <h2>
        <TrophyIcon style={{marginRight: 15}} />
        Onze Kampioenen
        <TrophyIcon style={{marginLeft: 15}} />
      </h2>
      {topTeams.map(team => (
        <div key={team.id} className="col-md-4 col-sm-6">
          <div className="content">
            <h3>
              <Link to={`${t.route('teams').replace(':competition', team.competition)}/${team.teamCode}`} className="link-hover-underline">
                {team.renderOwnTeamTitle()}
              </Link>
            </h3>
            <b>{team.getDivisionDescription()}</b>
            <TeamRankingBadges team={team} style={{float: 'right'}} />
            <TeamPlayerAvatars team={team} style={{marginTop: 20}} />
          </div>
        </div>
      ))}
    </div>
  );
};

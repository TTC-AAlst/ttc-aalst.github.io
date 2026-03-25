import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import {PlayerLink} from '../../players/controls/PlayerLink';
import {AchievementsCalculator} from './AchievementsCalculator';
import { AchievementInfo } from './achievements/otherAchievements';
import { TeamAchievementInfo } from './achievements/achievement-models';
import { browseTo } from '../../../routes';

type AchievementsProps = {
  calcer: AchievementsCalculator;
}

export default class Achievements extends Component<AchievementsProps> {
  render() {
    const {calcer} = this.props;
    return (
      <div>
        <h2>
          <i className="fa fa-diamond" style={{marginRight: 15, color: 'indigo'}} />
          Prijsuitreikingen
          <i className="fa fa-gift" style={{marginLeft: 15, color: '#BE2625'}} />
        </h2>
        <div className="row endofseason-listing">
          <div className="col-md-4">
            <h3>Vttl</h3>
            <dl>
              {calcer.getAchievements('Vttl').map((achievement, index) => <Achievement key={index} achievement={achievement} />)}
            </dl>
          </div>
          <div className="col-md-4">
            <h3>Sporta</h3>
            <dl>
              {calcer.getAchievements('Sporta').map((achievement, index) => <Achievement key={index} achievement={achievement} />)}
            </dl>
          </div>
          <div className="col-md-4">
            <h3>De Belles</h3>
            <dl>
              {calcer.getAchievements('belles').map((achievement, index) => <Achievement key={index} achievement={achievement} />)}
            </dl>

            <h3>Teams</h3>
            <dl>
              {calcer.getTeamAchievements().map((achievement, index) => (
                <TeamAchievement key={index} achievement={achievement} />
              ))}
            </dl>
          </div>
        </div>
      </div>
    );
  }
}

const TeamAchievement = ({achievement}: {achievement: TeamAchievementInfo}) => (
  <>
    <dt>
      <b>{achievement.title}&nbsp;</b>
      <small> {achievement.desc}</small>
    </dt>
    {achievement.teams.map((team, index) => (
      <dd key={index}>
        <Link to={browseTo.getTeam(team.team)} className="link-hover-underline">
          {team.team.renderOwnTeamTitle()}
        </Link>{team.throphy}
      </dd>
    ))}
  </>
);


const Achievement = ({achievement}: {achievement: AchievementInfo}) => {
  const nodes: any[] = achievement.players.map((player, index) => (
    <dd key={index}>
      <PlayerLink player={player.player} />
      {player.throphy}
    </dd>
  ));

  return (
    <>
      <dt key="-1">
        {achievement.title ? <b>{achievement.title}&nbsp;</b> : null}
        <small> {achievement.desc}</small>
      </dt>
      {nodes}
    </>
  );
};

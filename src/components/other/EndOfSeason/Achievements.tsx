import React, {Component} from 'react';
import {PlayerLink} from '../../players/controls/PlayerLink';
import {AchievementsCalculator} from './AchievementsCalculator';
import { AchievementInfo } from './PlayerAchievements';

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
          </div>
        </div>
      </div>
    );
  }
}


const Achievement = ({achievement}: {achievement: AchievementInfo}) => {
  let nodes: any[] = [];
  if (achievement.players) {
    nodes = achievement.players.map((player, index) => (
      <dd key={index}>
        <PlayerLink player={player.player} />
        {player.throphy}
      </dd>
    ));
  } else {
    // ATTN: This isn't actually happening anymore:
    //       All Achievements are PlayerAchievements
    // nodes = achievement.teams.map((team, index) => (
    //   <dd key={index}>
    //     <span>{team.renderOwnTeamTitle()}</span>
    //   </dd>
    // ));
  }


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

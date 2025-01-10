import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { PlayerImage } from './PlayerImage';
import { PlayerPlayingStyleForm } from './PlayerPlayingStyle';
import { PlayerContact } from './controls/PlayerContact';
import { createFrenoyLink } from '../../models/PlayerModel';
import { PlayerLink } from './controls/PlayerLink';
import { Icon } from '../controls/Icons/Icon';
import { FrenoyPlayerDetailsIcon } from '../controls/Buttons/FrenoyButton';
import { IPlayer, IPlayerCompetition, Competition } from '../../models/model-interfaces';
import { browseTo } from '../../routes';
import { t } from '../../locales';
import { selectUser, useTtcSelector } from '../../utils/hooks/storeHooks';

type PlayerCardProps = {
  player: IPlayer;
  showSideBySide?: boolean;
}

export const PlayerCard = ({player, showSideBySide = false}: PlayerCardProps) => {
  const user = useTtcSelector(selectUser);
  const showAddressBelow = !showSideBySide;
  return (
    <Card style={{height: user.playerId && showAddressBelow ? 410 : 300, marginBottom: 20}}>
      <Card.Header>
        <div style={{height: 40}}>
          <div style={{float: 'left'}}>
            <strong><PlayerLink player={player} /></strong>
            <br />
            {player.style ? player.style.name : null}
          </div>

          <div style={{textAlign: 'right', float: 'right'}}>
            <PlayerAllCompetitions player={player} />
          </div>
          <div style={{clear: 'both'}} />
        </div>
      </Card.Header>

      <PlayerPlayingStyleForm player={player} iconStyle="edit-icon" style={{color: '#d3d3d3', position: 'absolute', top: 75, right: 27}} />

      <Card.Body>
        {!user.playerId || showAddressBelow ? (
          <div>
            <PlayerImage playerId={player.id} center shape="thumbnail" />
            <br />
            <PlayerContact player={player} />
          </div>
        ) : (
          <div className="media" style={{marginTop: 0}}>
            <div className="media-left">
              <PlayerImage playerId={player.id} shape="thumbnail" className="pull-left" style={{width: 200, marginRight: 12}} />
            </div>
            <div className="media-body">
              <PlayerContact player={player} />
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};


type PlayerCardCompetitionProps = {
  player: IPlayer;
}

export const PlayerCardCompetition = ({player}: PlayerCardCompetitionProps) => (
  <div style={{marginTop: 5}}>
    <strong>{t('common.competition')}</strong>
    <br />
    <PlayerAllCompetitions player={player} />
  </div>
);


type PlayerAllCompetitionsProps = {
  player: IPlayer;
};

export const PlayerAllCompetitions = ({player}: PlayerAllCompetitionsProps) => (
  <div>
    <PlayerCompetitionLabel comp="Vttl" player={player} />
    {player.vttl && player.sporta ? <br /> : null}
    <PlayerCompetitionLabel comp="Sporta" player={player} />
  </div>
);



export const TeamCaptainIcon = () => (
  <Icon fa="fa fa-star" color="#FFB00F" style={{marginRight: 5}} tooltip={t('player.teamCaptain')} />
);



type PlayerCompetitionLabelProps = {
  comp: Competition;
  player: IPlayer;
  withName?: boolean | 'alias';
};


export const PlayerCompetitionLabel = ({comp, player, withName = false}: PlayerCompetitionLabelProps) => {
  // withName = Jorn C2 (frenoylink)
  // !withName = Sporta (ploeg) C2 (frenoylink)
  const compDetails = player.getCompetition(comp);
  if (!compDetails.ranking) {
    return <div />;
  }

  const team = player.getTeam(comp);
  const isCaptain = team ? team.isCaptain(player) : false;
  return (
    <span>
      {isCaptain ? <TeamCaptainIcon /> : null}
      {withName ? (
        <strong><PlayerLink player={player} alias={withName === 'alias'} /></strong>
      ) : (
        <Link to={browseTo.getTeam(team || {competition: comp})} className="link-hover-underline">
          {comp}{team ? ` ${team.teamCode}` : null}
        </Link>
      )}
      <PlayerFrenoyLink comp={compDetails} style={{marginLeft: 10}}>
        {compDetails.ranking}
      </PlayerFrenoyLink>
    </span>
  );
};


type PlayerFrenoyLinkProps = {
  comp: IPlayerCompetition;
  style?: React.CSSProperties;
  children?: any;
};

export const PlayerFrenoyLink = ({comp, style, children}: PlayerFrenoyLinkProps) => (
  <a href={createFrenoyLink(comp)} target="_blank" className="link-hover-underline" style={style} rel="noopener noreferrer">
    {children} <FrenoyPlayerDetailsIcon />
  </a>
);

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
import { selectMatches, selectTeams, selectUser, useTtcSelector } from '../../utils/hooks/storeHooks';
import { PlayerRanking } from './controls/PlayerRanking';
import { PlayerPerformanceBadge } from './controls/PlayerPerformanceBadge';
import { calculatePerformanceBadge, collectPlayerPerformanceData } from './controls/PlayerPerformanceUtils';
import { PlayerRanking as PlayerRankingType } from '../../models/utils/rankingSorter';

type PlayerCardProps = {
  player: IPlayer;
  showSideBySide?: boolean;
}

export const PlayerCard = ({player, showSideBySide = false}: PlayerCardProps) => {
  const user = useTtcSelector(selectUser);
  const allMatches = useTtcSelector(selectMatches);
  const teams = useTtcSelector(selectTeams);
  const showAddressBelow = !showSideBySide;

  const { allResults, recentResults } = collectPlayerPerformanceData(
    player.id,
    player.vttl?.ranking as PlayerRankingType,
    player.sporta?.ranking as PlayerRankingType,
    allMatches,
    teams,
  );

  const badge = allResults.length >= 3 ? calculatePerformanceBadge(allResults, recentResults) : null;
  const showRibbon = badge && ['on-fire', 'solid', 'rising'].includes(badge.type);

  const bestStroke = player.style.bestStroke ? (
    <>
      <span>
        <span style={{marginRight: 7}}>🔥</span>
        {player.style.bestStroke}
      </span>
      <br />
    </>
  ) : null;

  return (
    <Card style={{height: user.playerId && showAddressBelow ? 425 : 330, marginBottom: 20}}>
      <Card.Header>
        <div style={{height: 40}}>
          <div style={{float: 'left'}}>
            <strong><PlayerLink player={player} /></strong>
            <br />
            <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
              {badge && badge.type !== 'neutral' && (
                <PlayerPerformanceBadge allResults={allResults} recentResults={recentResults} size="lg" showLabel={false} />
              )}
              {player.style ? player.style.name : null}
            </span>
          </div>

          <div style={{textAlign: 'right', float: 'right'}}>
            <PlayerAllCompetitions player={player} />
          </div>
          <div style={{clear: 'both'}} />
        </div>
      </Card.Header>

      <PlayerPlayingStyleForm
        player={player}
        iconStyle="edit-icon"
        style={{color: '#d3d3d3', position: 'absolute', top: 75, right: 27}}
      />

      <Card.Body style={{position: 'relative', overflow: 'hidden'}}>
        {showRibbon && badge && <PerformanceRibbon badge={badge} />}
        {!user.playerId || showAddressBelow ? (
          <div>
            <PlayerImage playerId={player.id} center shape="thumbnail" />
            <br />
            {bestStroke}
            <PlayerContact player={player} />
          </div>
        ) : (
          <div className="media" style={{marginTop: 0}}>
            <div className="media-left">
              <PlayerImage playerId={player.id} shape="thumbnail" className="pull-left" style={{width: 200, marginRight: 12}} />
            </div>
            <div className="media-body">
              {bestStroke}
              <PlayerContact player={player} />
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

type PerformanceRibbonProps = {
  badge: { type: string; label: string; color: string; icon: string };
};

const PerformanceRibbon = ({ badge }: PerformanceRibbonProps) => {
  const getGradient = () => {
    if (badge.type === 'on-fire') {
      return 'linear-gradient(90deg, #ff4500 0%, #ff6347 50%, #ff8c00 100%)';
    }
    if (badge.type === 'solid') {
      return 'linear-gradient(90deg, #ffd700 0%, #ffec8b 50%, #daa520 100%)';
    }
    // rising
    return 'linear-gradient(90deg, #2196F3 0%, #64B5F6 50%, #1976D2 100%)';
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: -35,
        width: 120,
        padding: '4px 0',
        background: getGradient(),
        color: 'white',
        fontSize: '0.75em',
        fontWeight: 600,
        textAlign: 'center',
        transform: 'rotate(-45deg)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 1,
      }}
    >
      {badge.label}
    </div>
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
        <PlayerRanking player={compDetails} />
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

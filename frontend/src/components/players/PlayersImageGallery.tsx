import React from 'react';
import { playerUtils } from '../../models/PlayerModel';
import { PlayerPlayingStyle, PlayerPlayingStyleForm } from './PlayerPlayingStyle';
import { PlayerImage } from './PlayerImage';
import { PlayerLink } from './controls/PlayerLink';
import { FrenoyLink } from '../controls/Buttons/FrenoyButton';
import { Telephone } from '../controls/controls/Telephone';
import { Competition, IPlayer } from '../../models/model-interfaces';
import { useViewport } from '../../utils/hooks/useViewport';

const PlayersImageWidth = playerUtils.getPlayerImageSize().width + 30;
const PlayersImageHeight = playerUtils.getPlayerImageSize().height;
const gridStylesRoot: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  margin: 6,
};

const editStyleIcon: React.CSSProperties = {
  position: 'absolute',
  top: 5,
  right: 15,
  color: '#d3d3d3',
};

type PlayersImageGalleryProps = {
  players: IPlayer[];
  competition: Competition;
  viewportWidthContainerCount?: number;
  subtitle?: Function;
  forceSmall?: boolean;
};

export const PlayersImageGallery = ({ competition, players, ...props }: PlayersImageGalleryProps) => {
  const viewport = useViewport();

  // This one is used in the MatchCard

  if (viewport.width > 600 && !props.forceSmall) {
    const cols = Math.min(5, Math.floor(viewport.width / (props.viewportWidthContainerCount || 1) / PlayersImageWidth));
    // big image gallery
    return (
      <div style={gridStylesRoot}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4 }}>
          {players.map(ply => {
            const comp = ply.getCompetition(competition);
            return (
              <div key={ply.id} style={{ position: 'relative', height: PlayersImageHeight }}>
                <PlayerPlayingStyleForm player={ply} iconStyle="edit-icon" style={editStyleIcon} />
                <PlayerImage playerId={ply.id} />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    padding: '6px 8px',
                  }}
                >
                  <div>
                    <PlayerLink player={ply} style={{ color: 'white' }} />
                    <small style={{ marginLeft: 5 }}>{comp ? comp.ranking : '??'}</small>
                  </div>
                  <div style={{ fontSize: '0.85em', opacity: 0.8 }}>
                    {props.subtitle ? props.subtitle(ply) : <PlayerPlayingStyle ply={ply} allowEdit={false} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  // small card gallery
  return (
    <div style={gridStylesRoot}>
      {players.map(ply => (
        <div key={ply.id} className="col-6" style={{ padding: 8, textAlign: 'center' }}>
          <div className="media">
            <div className="media-left">
              <PlayerPlayingStyleForm player={ply} iconStyle="avatar" />
            </div>
            <div className="media-body">
              <strong>{ply.name}</strong>
              <br />

              {props.subtitle ? props.subtitle(ply) : <SmallPlayerAvatarCard competition={competition} ply={ply} />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SmallPlayerAvatarCard = ({ competition, ply }: { competition: Competition; ply: IPlayer }) => {
  const comp = ply.getCompetition(competition);
  return (
    <span>
      <span className="ellipsis" style={{ marginTop: 7, marginRight: 6 }}>
        {ply.style.name}
      </span>
      {comp ? (
        <FrenoyLink competition={competition} uniqueIndex={comp.uniqueIndex}>
          {`${comp.ranking} `}
        </FrenoyLink>
      ) : null}
      <br />
      <Telephone player={ply} hideIcon />
    </span>
  );
};

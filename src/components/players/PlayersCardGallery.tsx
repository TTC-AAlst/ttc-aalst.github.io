import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { PlayerImage } from './PlayerImage';
import { PlayerCard } from './PlayerCard';
import { PlayerLink } from './controls/PlayerLink';
import { Competition, IPlayer } from '../../models/model-interfaces';
import { useViewport } from '../../utils/hooks/useViewport';

type PlayersCardGalleryProps = {
  players: IPlayer[];
  competition?: Competition;
};

export const PlayersCardGallery = ({players, competition}: PlayersCardGalleryProps) => {
  const viewWidth = useViewport().width;
  if (viewWidth > 360) {
    return (
      <div style={{marginTop: 15, marginLeft: 0, marginRight: 0, padding: 0}} className="row players-gallery">
        {players.map(player => (
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12" key={player.id}>
            <PlayerCard player={player} showSideBySide={viewWidth < 768 && viewWidth > 550} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{marginLeft: 10, marginRight: 10, marginTop: 10}}>
      {players.map(player => {
        const comp = player.vttl ?? player.sporta ?? {ranking: ''};
        return (
          <div key={player.id} style={{paddingBottom: 10, textAlign: 'center'}}>
            <Card>
              <CardContent>
                <h4>
                  <PlayerLink player={player} />
                  <small style={{marginLeft: 6}}>{comp.ranking}</small>
                  <br />
                  <small>
                    {player.style && player.style.name ? player.style.name : null}
                  </small>
                </h4>
                <PlayerImage playerId={player.id} center shape="thumbnail" />
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

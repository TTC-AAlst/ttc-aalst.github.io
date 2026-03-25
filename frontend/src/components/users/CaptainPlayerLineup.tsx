import React, { useState } from "react";
import { MenuItem, TextField } from "@mui/material";
import TeamModel from "../../models/TeamModel";
import { t } from "../../locales";
import PlayerLineup from "./PlayerLineup";

type CaptainPlayerLineupProps = {
  teams: TeamModel[];
}

export const CaptainPlayerLineup = ({ teams }: CaptainPlayerLineupProps) => {
  const [playerId, setPlayerId] = useState<number>(0);
  const players = teams.map(ply => ply.getPlayers()).flat();

  return (
    <div style={{padding: 10}}>
      <TextField select value={playerId} onChange={e => setPlayerId(+e.target.value)} style={{width: 250, marginRight: 10}}>
        <MenuItem key="0" value={0} style={{color: 'gray'}}>{t('profile.editCaptainSelectPlayer')}</MenuItem>
        {players.map(ply => <MenuItem key={ply.player.id} value={ply.player.id}>{ply.player.alias}</MenuItem>)}
      </TextField>

      {playerId > 0 && (
        <div style={{marginTop: 25}}>
          <h3>{t('profile.editCaptainTitle')}</h3>
          <PlayerLineup teams={teams} playerId={playerId} />
        </div>
      )}
    </div>
  );
};

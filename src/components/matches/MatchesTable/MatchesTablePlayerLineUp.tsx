import React from 'react';
import { Table } from 'react-bootstrap';
import { t } from '../../../locales';
import { IMatch, IMatchPlayerInfo, ITeam, PickedPlayer } from '../../../models/model-interfaces';
import { getTablePlayers } from './matchesTableUtil';
import { TeamCaptainIcon } from '../../players/PlayerCard';
import { selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { MatchDate } from '../controls/MatchDate';
import { ThrillerIcon } from '../../controls/Icons/ThrillerIcon';
import { useViewport } from '../../../utils/hooks/useViewport';
import MatchVs from '../Match/MatchVs';
import { FrenoyWeekLink } from '../../controls/Buttons/FrenoyButton';
import { MatchBlock } from '../Match/MatchBlock';
import { Icon } from '../../controls/Icons/Icon';

type MatchesTablePlayerLineUpProps = {
  team: ITeam;
  matches: IMatch[];
  editMode: boolean;
  // tablePlayers?: PickedPlayer[];
}


// onTablePlayerSelect?: (players: PickedPlayer[], match: IMatch) => void,


// _renderTableEditMatchPlayers(match: IMatch) {
//   // console.log('--------------------------------');
//   const majorFormation = match.getPlayerFormation(undefined);
//   if (!this.props.editMode) {
//     return this._getTablePlayers()
//       .map(ply => {
//         const playerDecision = majorFormation.find(frm => frm.id === ply.player.id);
//         // if (playerDecision)
//         //  console.log(match.frenoyMatchId, playerDecision.player.alias, playerDecision.matchPlayer.status);
//         return (
//           <td key={ply.player.id} className={`td-${getPlayingStatusClass(playerDecision?.matchPlayer.status)}`}>
//             &nbsp;
//           </td>
//         );
//       });
//   }

//   const formation = match.getPlayerFormation('Play');
//   return this._getTablePlayers()
//     .map(plyInfo => {
//       const playerDecision = formation.find(frm => frm.id === plyInfo.player.id);
//       const majorDecision = majorFormation.find(frm => frm.id === plyInfo.player.id);
//       if (!this.props.user.canEditMatchPlayers(match)) {
//         return (
//           <td
//             style={{textAlign: 'center'}}
//             key={plyInfo.player.id}
//             className={`td-${getPlayingStatusClass(playerDecision?.matchPlayer.status)}`}
//           >
//             {majorDecision ? <PlayerCompetitionBadge plyInfo={majorDecision} competition={match.competition} /> : null}
//           </td>
//         );
//       }

//       let captainDecision = this.props.tablePlayers?.find(frm => frm.matchId === match.id && frm.id === plyInfo.player.id);
//       if (!captainDecision) {
//         captainDecision = {
//           id: plyInfo.player.id,
//           matchId: match.id,
//           matchPlayer: {status: '', statusNote: ''},
//           player: plyInfo.player,
//         };
//         if (playerDecision?.matchPlayer.statusNote) {
//           captainDecision.matchPlayer.statusNote = `${playerDecision.player.alias}: ${playerDecision?.matchPlayer.statusNote}`;
//         }
//       }

//       const onButtonClick = this._toggleTablePlayer.bind(this, plyInfo.player.id, match);
//       return (
//         <td
//           style={{textAlign: 'center'}}
//           key={plyInfo.player.id}
//           className={`td-${getPlayingStatusClass(playerDecision?.matchPlayer.status)}`}
//         >
//           <PlayerCompetitionButton
//             plyInfo={captainDecision}
//             isPicked={!!captainDecision.matchPlayer.status}
//             actionIconClass="fa fa-thumbs-o-up"
//             onButtonClick={onButtonClick}
//             competition={match.competition}
//           />
//         </td>
//       );
//     });
// }

// _toggleTablePlayer(playerId: number, match: IMatch) {
//   if (!this.props.onTablePlayerSelect || !this.props.tablePlayers) {
//     return;
//   }

//   const ply = this.props.tablePlayers?.find(x => x.id === playerId && x.matchId === match.id);
//   if (ply) {
//     this.props.onTablePlayerSelect(this.props.tablePlayers.filter(x => x !== ply), match);

//   } else {
//     const plyInfo = {
//       id: playerId,
//       matchId: match.id,
//       player: storeUtil.getPlayer(playerId),
//       matchPlayer: {status: this._getUserStatus(), statusNote: ''},
//     };
//     this.props.onTablePlayerSelect(this.props.tablePlayers.concat([plyInfo]), match);
//   }
// }


export const MatchesTablePlayerLineUp = ({team, matches, editMode}: MatchesTablePlayerLineUpProps) => {
  const user = useTtcSelector(selectUser);
  const viewport = useViewport();
  const teamPlayers = getTablePlayers(team);

  return (
    <Table className="matches-table max-width-table">
      <thead>
        <tr>
          <th>{t('common.date')}</th>
          {viewport.width > 1400 && <th>{t('common.frenoy')}</th>}
          <th>{t('teamCalendar.match')}</th>
          <th>{t('match.block.block')}</th>
          {teamPlayers.map(ply => (
            <th key={ply.player.id}>
              {ply.type === 'Captain' ? <TeamCaptainIcon /> : null}
              <span style={{fontStyle: ply.type === 'Reserve' ? 'italic' : undefined}}>{ply.player.alias}</span>
            </th>
          ))}
        </tr>
      </thead>
      {matches.map((match, i) => {
        const stripeColor = {backgroundColor: i % 2 === 0 ? '#f9f9f9' : undefined};

        let playerFormation: IMatchPlayerInfo[] = [];
        if (match.block === 'Major' || match.block === 'Captain') {
          playerFormation = match.getPlayerFormation(match.block);
        } else {
          playerFormation = match.getPlayerFormation('Captain');
        }

        return (
          <tbody key={match.id}>
            <tr key={match.id} style={stripeColor}>
              <td>
                {match.shouldBePlayed && !!team.getThriller(match) && (
                  <ThrillerIcon color="red" />
                )}
                {match.shouldBePlayed ? <MatchDate match={match} bigDisplayMinWith={1600} /> : null}
              </td>
              {viewport.width > 1400 && <td><FrenoyWeekLink match={match} /></td>}
              <td>
                <MatchVs
                  match={match}
                  opponentOnly={viewport.width < 1600}
                  ownTeamLink={undefined}
                  withLinks
                  withPosition={viewport.width > 1600}
                />
                {!!playerFormation.length && playerFormation.length < match.getTeamPlayerCount() && (
                  <Icon
                    fa="fa fa-exclamation-circle"
                    style={{color: 'red', float: 'right', fontSize: '1.5em', marginTop: 3}}
                    translate
                    tooltip="match.block.incompleteTooltip"
                  />
                )}
              </td>
              <td><MatchBlock block={match.block} /></td>
              {teamPlayers.map(ply => (
                <td key={ply.player.id}>
                  {playerFormation.some(formation => formation.id === ply.player.id) && (
                    <span className={`badge label-as-badge ${match.block ? 'bg-success' : 'bg-warning'}`} style={{fontWeight: 'normal'}}>
                      {ply.player.alias}
                      <span style={{marginLeft: 5, marginRight: 5, fontSize: 10}}>
                        {ply.player.getCompetition(team.competition)?.ranking}
                      </span>
                      <i className="fa fa-thumbs-o-up" />
                    </span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        );
      })}
      {/* {false ? (
        <tr>
          <td colSpan={3}>&nbsp;</td>
          {getTablePlayers(team).map(ply => {
            const played = matches.filter(match => tablePlayers?.find(frm => frm.matchId === match.id && frm.id === ply.player.id));
            return (
              <td key={ply.player.id} style={{textAlign: 'center', fontWeight: 'bold'}}>{played.length}</td>
            );
          })}
        </tr>
      ) : null} */}
    </Table>
  );
};

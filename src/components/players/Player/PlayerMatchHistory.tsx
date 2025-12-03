import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { Icon } from '../../controls/Icons/Icon';
import { TrophyIcon } from '../../controls/Icons/TrophyIcon';
import MatchVs from '../../matches/Match/MatchVs';
import { MatchDate } from '../../matches/controls/MatchDate';
import { OpponentPlayerLabel } from '../../matches/Match/OpponentPlayer';
import { ViewMatchDetailsButton } from '../../matches/controls/ViewMatchDetailsButton';
import { IPlayer } from '../../../models/model-interfaces';
import { selectMatches, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { t } from '../../../locales';

type PlayerMatchHistoryProps = {
  player: IPlayer;
}

export const PlayerMatchHistory = ({player}: PlayerMatchHistoryProps) => {
  const matches = useTtcSelector(selectMatches);

  const matchesWithPlayer = matches
    .filter(match => match.isSyncedWithFrenoy && match.games.length)
    .filter(match => match.players.some(ply => ply?.playerId === player.id))
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());

  return (
    <Card>
      <Card.Header>
        <h4 style={{marginBottom: 0}}>{t('match.individual.matchHistory')}</h4>
      </Card.Header>
      <Card.Body style={{padding: 15}}>
        <Table size="sm" style={{marginBottom: 0}}>
          <thead>
            <tr>
              <th>{t('teamCalendar.match')}</th>
              <th>{t('match.individual.opponentPlayer')}</th>
              <th>{t('match.individual.setsTitle')}</th>
            </tr>
          </thead>
          <tbody>
            {matchesWithPlayer.map((match, matchIndex) => {
              const games = match.getGameMatches()
                .filter(game => !game.isDoubles)
                .filter(game => game.home.playerId === player.id || game.out.playerId === player.id);

              const isEvenMatch = matchIndex % 2 === 0;

              return games.map((game, index) => {
                const opponentPlayer = match.isHomeMatch ? game.out : game.home;
                const playerWon = (match.isHomeMatch && game.homeSets > game.outSets)
                  || (!match.isHomeMatch && game.outSets > game.homeSets);

                return (
                  <tr
                    key={`${match.id}-${game.matchNumber}`}
                    className={isEvenMatch ? '' : 'table-info'}
                  >
                    {index === 0 ? (
                      <td rowSpan={games.length}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <div>
                            <div style={{fontSize: '0.85em', color: '#666', marginBottom: 4}}>
                              <MatchDate match={match} />
                            </div>
                            <MatchVs match={match} withLinks withPosition ownTeamLink="matches" />
                          </div>
                          <div style={{marginLeft: 10, marginRight: 5}}>
                            <ViewMatchDetailsButton match={match} size={null} />
                          </div>
                        </div>
                      </td>
                    ) : null}
                    <td>
                      {playerWon ? <TrophyIcon style={{marginRight: 6}} /> : null}
                      <OpponentPlayerLabel player={opponentPlayer} competition={match.competition} />
                    </td>
                    <td>
                      {match.isHomeMatch ? game.homeSets : game.outSets}-{match.isHomeMatch ? game.outSets : game.homeSets}
                      {playerWon ? <Icon fa="fa fa-thumbs-o-up" color="black" style={{marginLeft: 8}} /> : null}
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

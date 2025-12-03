import React from 'react';
import Table from 'react-bootstrap/Table';
import { TrophyIcon } from '../../controls/Icons/TrophyIcon';
import { Icon } from '../../controls/Icons/Icon';
import { OpponentLink } from '../../teams/controls/OpponentLink';
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
    <div style={{marginTop: 40, marginBottom: 20}}>
      <h3>{t('match.individual.matchHistory')}</h3>
      <Table size="sm" striped hover>
        <thead>
          <tr>
            <th>{t('match.opponents.outcome')}</th>
            <th>{t('common.date')}</th>
            <th>{t('match.opponents.vsTeam')}</th>
            <th>{t('match.individual.opponentPlayer')}</th>
            <th>{t('match.individual.setsTitle')}</th>
          </tr>
        </thead>
        <tbody>
          {matchesWithPlayer.map(match => {
            console.log('getGameMatches', match.getGameMatches().filter(x => !x.home || !x.out));
            const games = match.getGameMatches()
              .filter(game => !game.isDoubles)
              .filter(game => game.home.playerId === player.id || game.out.playerId === player.id);

            const teamWon = match.scoreType === 'Won';
            const team = match.getTeam();

            return games.map((game, index) => {
              const opponentPlayer = match.isHomeMatch ? game.out : game.home;
              const playerWon = (match.isHomeMatch && game.homeSets > game.outSets)
                || (!match.isHomeMatch && game.outSets > game.homeSets);

              return (
                <tr key={`${match.id}-${game.matchNumber}`}>
                  {index === 0 ? (
                    <>
                      <td rowSpan={games.length}>
                        {teamWon ? <TrophyIcon /> : null}
                        {' '}
                        {match.score.home}-{match.score.out}
                      </td>
                      <td rowSpan={games.length}>
                        {match.isHomeMatch ? <Icon fa="fa fa-home" style={{marginRight: 5}} /> : null}
                        {match.date.format('DD/MM/YYYY')}
                      </td>
                      <td rowSpan={games.length}>
                        <OpponentLink opponent={match.opponent} team={team} />
                      </td>
                    </>
                  ) : null}
                  <td>{opponentPlayer.name} ({opponentPlayer.ranking})</td>
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
    </div>
  );
};

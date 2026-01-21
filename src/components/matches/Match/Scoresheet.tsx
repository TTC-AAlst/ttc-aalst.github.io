import React from 'react';
import Table from 'react-bootstrap/Table';
import { downloadScoresheetExcel } from '../../../utils/httpClient';
import { ExcelButton } from '../../controls/Buttons/ExcelButton';
import { FrenoyWeekLink } from '../../controls/Buttons/FrenoyButton';
import { PlayerLink } from '../../players/controls/PlayerLink';
import { t } from '../../../locales';
import { IMatch } from '../../../models/model-interfaces';
import { useViewport } from '../../../utils/hooks/useViewport';

type ScoresheetProps = {
  match: IMatch;
  hideDownload?: boolean;
};

export const Scoresheet = ({match, hideDownload}: ScoresheetProps) => {
  const viewport = useViewport();
  const isSmall = viewport.width < 550;

  if (match.competition === 'Sporta') {
    return (
      <>
        {!hideDownload && (
          <ExcelButton
            onClick={() => downloadScoresheetExcel(match)}
            tooltip={match.isHomeMatch ? 'Download Scoresheet' : 'Download Scoresheet (UIT match???)'}
            className={`pull-right ${match.isHomeMatch ? 'btn-success' : 'btn-danger'}`}
            style={{margin: 6}}
          />
        )}
        <Table size="sm" className="match-card-tab-table">
          <thead>
            <tr>
              <th colSpan={2}><FrenoyWeekLink match={match} /></th>
              <th>{t('comp.sporta.uniqueIndex')}</th>
              <th>{t('comp.ranking')}</th>
              <th>
                {t('comp.sporta.rankingValue')}
              </th>
            </tr>
          </thead>
          <tbody>
            {match.getOwnPlayerModels().map((player, i) => {
              const comp = player.getCompetition(match.competition);
              return (
                <tr key={player.name}>
                  <td>{i + 1}</td>
                  <td><PlayerLink player={player} /></td>
                  <td>{comp.uniqueIndex}</td>
                  <td>{comp.ranking}</td>
                  <td>{comp.rankingValue}</td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={2}>{t('space')}</td>
              <td colSpan={2}>{t('comp.sporta.teamValue')}</td>
              <td>
                {match.getOwnPlayerModels()
                  .map(player => player.getCompetition(match.competition).rankingValue)
                  .reduce((prev, cur) => prev + cur, 0)}
              </td>
            </tr>
          </tbody>
        </Table>
      </>
    );
  }
  // VTTL Scoresheet
  return (
    <Table size="sm" className="match-card-tab-table">
      <thead>
        <tr>
          <th colSpan={2}>{match.frenoyMatchId}</th>
          <th>{t('comp.vttl.uniqueIndex')}</th>
          <th>{isSmall ? '' : t('comp.rankingIndex')}</th>
          <th>{isSmall ? '' : t('comp.index')}</th>
          <th>{isSmall ? '' : t('comp.ranking')}</th>
        </tr>
      </thead>
      <tbody>
        {match.getOwnPlayerModels().map((player, i) => {
          const comp = player.getCompetition(match.competition);
          return (
            <tr key={player.name}>
              <td>{i + 1}</td>
              <td>{player.name}</td>
              <td>{comp.uniqueIndex}</td>
              <td>{comp.position}</td>
              <td>{comp.rankingIndex}</td>
              <td>{comp.ranking}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

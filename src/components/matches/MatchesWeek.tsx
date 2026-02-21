import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MatchesTable } from './MatchesTable';
import { WeekTitle } from './MatchesWeeks/WeekTitle';
import { WeekCalcer } from './MatchesWeeks/WeekCalcer';
import { ButtonStack } from '../controls/Buttons/ButtonStack';
import { EditButton } from '../controls/Buttons/EditButton';
import { Competition, IMatch } from '../../models/model-interfaces';
import { t } from '../../locales';
import { selectFreeMatches, selectMatches, selectUser, useTtcSelector } from '../../utils/hooks/storeHooks';


export const MatchesWeek = () => {
  const user = useTtcSelector(selectUser);
  const {comp} = useParams();
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const realMatches = useTtcSelector(selectMatches);
  const freeMatches = useTtcSelector(selectFreeMatches);
  const weekRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const hasScrolled = useRef(false);

  const onChangeCompetition = (competition: string) => {
    navigate(`${t.route('matchesWeek')}${competition && competition !== 'all' ? `/${competition}` : ''}`);
  };

  let allMatches = realMatches;
  if (editMode) {
    allMatches = allMatches.concat(freeMatches);
  }

  const weekCalcer = new WeekCalcer(allMatches, undefined, editMode);

  // Scroll to current week on mount
  useEffect(() => {
    if (!hasScrolled.current && weekCalcer.weeks.length > 0) {
      const currentWeekEl = weekRefs.current.get(weekCalcer.currentWeek - 1);
      if (currentWeekEl) {
        // Delay slightly to allow layout to settle
        setTimeout(() => {
          currentWeekEl.scrollIntoView({ behavior: 'auto', block: 'start' });
        }, 100);
        hasScrolled.current = true;
      }
    }
  }, [weekCalcer.currentWeek, weekCalcer.weeks.length]);

  if (weekCalcer.weeks.length === 0) {
    return null;
  }

  const compFilter = (comp || 'all') as Competition | 'all';

  const viewsConfig = [
    {key: 'all', text: t('common.all')},
    {key: 'Vttl', text: 'Vttl'},
    {key: 'Sporta', text: 'Sporta'},
  ];

  const hasUnsyncedMatches = realMatches.some(m => !m.isSyncedWithFrenoy);

  return (
    <div style={{paddingTop: 10}}>
      {/* Sticky filter bar */}
      <div
        style={{
          position: 'sticky',
          top: 48,
          backgroundColor: 'white',
          zIndex: 100,
          padding: '8px 0',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <ButtonStack
          config={viewsConfig}
          small={false}
          activeView={compFilter}
          onClick={newCompFilter => onChangeCompetition(newCompFilter)}
        />
        {user.canManageTeams() && hasUnsyncedMatches ? (
          <EditButton onClick={() => setEditMode(!editMode)} />
        ) : null}
      </div>

      {/* Render all weeks */}
      {weekCalcer.weeks.map((week, index) => {
        const weekMatches = weekCalcer.getMatchesForWeek(index);
        const isCurrentWeek = index === weekCalcer.currentWeek - 1;

        return (
          <div
            key={index}
            ref={el => {
              if (el) weekRefs.current.set(index, el);
            }}
            style={{
              marginTop: 24,
              paddingTop: 12,
              borderTop: index > 0 ? '1px solid #ddd' : undefined,
              backgroundColor: isCurrentWeek ? '#f8f9fa' : undefined,
              padding: isCurrentWeek ? '12px 8px' : undefined,
              borderRadius: isCurrentWeek ? 4 : undefined,
            }}
          >
            <WeekTitle weekCalcer={weekCalcer} weekIndex={index} style={{ marginBottom: 16 }} />

            {compFilter !== 'Sporta' && (
              <MatchesWeekPerCompetition comp="Vttl" editMode={editMode} matches={weekMatches} />
            )}
            {compFilter === 'all' && weekMatches.some(m => m.competition === 'Vttl') && weekMatches.some(m => m.competition === 'Sporta') && (
              <hr style={{marginLeft: '10%', marginRight: '10%', marginTop: 30, marginBottom: 20}} />
            )}
            {compFilter !== 'Vttl' && (
              <MatchesWeekPerCompetition comp="Sporta" editMode={editMode} matches={weekMatches} />
            )}
          </div>
        );
      })}
    </div>
  );
};


type MatchesWeekPerCompetitionProps = {
  comp: Competition;
  editMode: boolean;
  matches: IMatch[];
};

const MatchesWeekPerCompetition = ({comp, editMode, matches}: MatchesWeekPerCompetitionProps) => {
  const matchSorter = (a: IMatch, b: IMatch) => a.getTeam().teamCode.localeCompare(b.getTeam().teamCode);

  matches = matches.filter(x => x.competition === comp);
  if (matches.length === 0) {
    return null;
  }

  return (
    <div>
      <h4><strong>{comp}</strong></h4>
      <MatchesTable
        editMode={editMode}
        matches={matches.sort(matchSorter)}
        ownTeamLink="week"
      />
    </div>
  );
};

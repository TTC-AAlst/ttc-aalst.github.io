import React from 'react';
import { useParams } from 'react-router-dom';
import { MobileLiveMatchCard } from '../MobileLiveMatches/MobileLiveMatchCard';
import { FullScreenSpinner } from '../../controls/controls/Spinner';
import { NotFound } from '../../other/NotFound';
import { selectMatches, useTtcSelector } from '../../../utils/hooks/storeHooks';

export const RoutedMatchCard = () => {
  const params = useParams<{matchId: string, tabKey: string}>();
  const matches = useTtcSelector(selectMatches);
  const initialLoad = useTtcSelector(state => state.config.initialLoad);
  const match = !!params.matchId && matches.find(x => x.id === parseInt(params.matchId as string, 10));

  if (!match) {
    if (initialLoad === 'done') {
      return <NotFound />;
    }
    return <FullScreenSpinner />;
  }

  return (
    <div style={{marginBottom: 20, marginTop: 20, marginLeft: 5, marginRight: 5}}>
      <MobileLiveMatchCard
        match={match}
        expanded={true}
        onToggle={() => {}}
        isCollapsible={false}
      />
    </div>
  );
};

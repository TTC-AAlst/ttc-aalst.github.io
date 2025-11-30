import React from 'react';
import { useParams } from 'react-router-dom';
import MatchCard from './MatchCard';
import { FullScreenSpinner } from '../../controls/controls/Spinner';
import { NotFound } from '../../other/NotFound';
import { selectMatches, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { useViewport } from '../../../utils/hooks/useViewport';

export const RoutedMatchCard = () => {
  const params = useParams<{matchId: string, tabKey: string}>();
  const viewport = useViewport();
  const matches = useTtcSelector(selectMatches);
  const initialLoad = useTtcSelector(state => state.config.initialLoad);
  const match = !!params.matchId && matches.find(x => x.id === parseInt(params.matchId as string, 10));

  // TODO: fetch the match by id if it's not present in the store?
  // const getMatch = (props) => {
  //   const matchId = parseInt(props.match.params.matchId, 10);
  //   const match = storeUtil.getMatch(matchId);
  //   if (!match) {
  //     this.props.fetchMatch(this.props.match.params.matchId);
  //   }
  //   return match;
  // }

  if (!match) {
    if (initialLoad === 'done') {
      return <NotFound />;
    }
    return <FullScreenSpinner />;
  }

  return (
    <div style={{marginBottom: 20, marginTop: 20, marginLeft: 5, marginRight: 5}}>
      <MatchCard
        match={match}
        isOpen
        params={params}
        viewport={viewport}
      />
    </div>
  );
};

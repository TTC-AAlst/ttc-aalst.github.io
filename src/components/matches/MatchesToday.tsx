import React, { useEffect } from 'react';
import MatchCard from './Match/MatchCard';
import { MobileLiveMatches } from './MobileLiveMatches/MobileLiveMatches';
import { IMatch } from '../../models/model-interfaces';
import { useViewport } from '../../utils/hooks/useViewport';
import { selectMatchesBeingPlayed, useTtcDispatch, useTtcSelector } from '../../utils/hooks/storeHooks';
import { setSetting } from '../../reducers/configReducer';

export const MatchesToday = () => {
  const viewport = useViewport();
  const dispatch = useTtcDispatch();
  const isMobile = viewport.width < 768;

  useEffect(() => {
    if (!isMobile) {
      dispatch(setSetting({key: 'container100PerWidth', value: true}));
      return () => {
        dispatch(setSetting({key: 'container100PerWidth', value: false}));
      };
    }
    return undefined;
  }, [isMobile]);

  const matchesToday = useTtcSelector(selectMatchesBeingPlayed);
  if (matchesToday.length === 0) {
    return <div />;
  }

  if (isMobile) {
    return <MobileLiveMatches matches={matchesToday} />;
  }

  if (viewport.width > 1500) {
    return (
      <div>
        <BigMatches matches={matchesToday.slice(0, 2)} />
        {matchesToday.length > 2 && <BigMatches matches={matchesToday.slice(2)} />}
      </div>
    );
  }

  // Medium devices
  return (
    <div className="row">
      {matchesToday.map(match => (
        <div className="col-lg-6" style={{paddingBottom: 5, paddingTop: 5}} key={match.id}>
          <MatchCard
            match={match}
            isOpen={false}
            viewportWidthContainerCount={viewport.width > 1200 ? 2 : 1}
            viewport={viewport}
          />
        </div>
      ))}
    </div>
  );
};

const BigMatches = ({matches}: {matches: IMatch[]}) => {
  const viewport = useViewport();
  return (
    <div className="row">
      {matches.map(match => (
        <div className="col-md-6" style={{paddingBottom: 5, paddingTop: 5}} key={match.id}>
          <MatchCard
            match={match}
            isOpen
            viewportWidthContainerCount={2}
            big
            viewport={viewport}
          />
        </div>
      ))}
    </div>
  );
};

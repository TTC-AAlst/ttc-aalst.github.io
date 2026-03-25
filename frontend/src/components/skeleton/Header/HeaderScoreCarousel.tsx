import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IMatch } from '../../../models/model-interfaces';
import { MatchScore } from '../../matches/MatchScore';
import { t } from '../../../locales';

type HeaderScoreCarouselProps = {
  matches: IMatch[];
};

export const HeaderScoreCarousel = ({ matches }: HeaderScoreCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (matches.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % matches.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [matches.length]);

  if (matches.length === 0) return null;

  const itemHeight = 28;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.08)',
        borderRadius: 4,
        padding: '4px 10px',
      }}
    >
      <Link
        to={t.route('matchesToday')}
        className="Header-carousel"
        style={{
          height: itemHeight,
          overflow: 'hidden',
          cursor: 'pointer',
          display: 'block',
          textDecoration: 'none',
        }}
      >
        <div
          className="Header-carousel-inner"
          style={{
            transform: `translateY(-${currentIndex * itemHeight}px)`,
            transition: 'transform 0.4s ease-in-out',
          }}
        >
          {matches.map(match => {
            const team = match.getTeam();
            const teamLabel = `${match.competition} ${team.teamCode}`;
            const locationEmoji = match.isHomeMatch ? '🏠' : '✈️';

            return (
              <div
                key={match.id}
                className="Header-carousel-item"
                style={{
                  height: itemHeight,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.8em',
                  whiteSpace: 'nowrap',
                  gap: 16,
                }}
              >
                <span style={{ color: '#fff' }}>
                  {locationEmoji} {teamLabel}
                </span>
                <MatchScore match={match} noLink forceDisplay showThrophy={false} />
              </div>
            );
          })}
        </div>
      </Link>
    </div>
  );
};

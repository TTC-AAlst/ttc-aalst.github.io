import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IMatch } from '../../../models/model-interfaces';
import { Icon } from '../../controls/Icons/Icon';
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

  const itemHeight = 24;

  return (
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
          const score = `${match.score.home}-${match.score.out}`;

          return (
            <div
              key={match.id}
              className="Header-carousel-item"
              style={{
                height: itemHeight,
                display: 'flex',
                alignItems: 'center',
                color: 'var(--brand-color)',
                fontSize: '1em',
                whiteSpace: 'nowrap',
              }}
            >
              {match.isHomeMatch && (
                <Icon fa="fa fa-home" style={{ marginRight: 6, fontSize: '0.85em' }} />
              )}
              <span>
                {teamLabel}: {score}
              </span>
            </div>
          );
        })}
      </div>
    </Link>
  );
};

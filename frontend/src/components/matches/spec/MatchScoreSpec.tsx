import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { renderWithProviders, TestRouter } from '../../../utils/test-utils';
import { MatchScore } from '../MatchScore';
import { IMatch } from '../../../models/model-interfaces';

vi.mock('../../../storeUtil', () => ({ default: {} }));

const woMatch = (overrides: Partial<IMatch> = {}): IMatch =>
  ({
    id: 1,
    scoreType: 'WalkOver',
    score: { home: 0, out: 0 },
    isDerby: false,
    isHomeMatch: true,
    comments: [],
    description: '',
    getPreviousMatch: () => null,
    ...overrides,
  }) as unknown as IMatch;

const render = (match: IMatch, forceDisplay = false) =>
  renderWithProviders(
    <TestRouter>
      <MatchScore match={match} forceDisplay={forceDisplay} noLink />
    </TestRouter>,
  );

describe('MatchScore — walkover', () => {
  it('shows a "WO" badge instead of 0 - 0 (forceDisplay, e.g. match detail header)', () => {
    render(woMatch(), true);
    expect(screen.getByText('WO')).toBeInTheDocument();
    expect(screen.queryByText('0 - 0')).not.toBeInTheDocument();
  });

  it('shows "WO" without forceDisplay (does not fall back to the previous encounter)', () => {
    render(woMatch());
    expect(screen.getByText('WO')).toBeInTheDocument();
  });
});

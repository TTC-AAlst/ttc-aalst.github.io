import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { renderWithProviders, TestRouter } from '../../../../utils/test-utils';
import { ViewMatchDetailsButton } from '../ViewMatchDetailsButton';
import { IMatch } from '../../../../models/model-interfaces';

vi.mock('../../../../storeUtil', () => ({ default: {} }));

const woMatch = (): IMatch =>
  ({
    id: 1,
    shouldBePlayed: true,
    scoreType: 'WalkOver',
    score: { home: 0, out: 0 },
    isDerby: false,
    isHomeMatch: true,
    comments: [],
    description: '',
    renderScore: () => '', // a walkover has no numeric score
    getPreviousMatch: () => null,
  }) as unknown as IMatch;

describe('ViewMatchDetailsButton — walkover', () => {
  it('shows a "WO" badge instead of the "Details" link', () => {
    renderWithProviders(
      <TestRouter>
        <ViewMatchDetailsButton match={woMatch()} size={null} />
      </TestRouter>,
    );
    expect(screen.getByText('WO')).toBeInTheDocument();
  });
});

import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { renderWithProviders, TestRouter } from '../../../../utils/test-utils';
import { Header } from '../Header';

vi.mock('../../../../storeUtil', () => ({
  default: {
    getTeams: vi.fn().mockReturnValue([]),
    getMatches: vi.fn().mockReturnValue([]),
    matches: { getAllMatches: vi.fn().mockReturnValue([]) },
  },
}));

const renderHeader = () =>
  renderWithProviders(
    <TestRouter>
      <Header navOpen={false} setNavOpen={() => {}} />
    </TestRouter>,
    {
      preloadedState: { user: { playerId: 0, teams: [], security: [] }, matches: [], teams: [], players: [] },
    },
  );

describe('Header', () => {
  it('does not underline the top-right menu link buttons', () => {
    const { container } = renderHeader();

    // HeaderButton renders <Link><Button variant="link">…</Button></Link>; the hamburger
    // .btn-link is not wrapped in an anchor, so this targets only the menu links.
    const linkButtons = container.querySelectorAll('a .btn-link');
    expect(linkButtons.length).toBeGreaterThan(0);
    linkButtons.forEach(btn => expect(btn.classList.contains('text-decoration-none')).toBe(true));
  });

  it('shows a DEV badge and amber bar off production (test host is non-prod)', () => {
    const { container } = renderHeader();
    expect(screen.getByText('DEV')).toBeInTheDocument();
    expect(container.querySelector('.Header-nonprod')).not.toBeNull();
  });

  it('shows a heart + Claude label in the header', () => {
    const { container } = renderHeader();
    const claude = container.querySelector('.Header-claude');
    expect(claude).not.toBeNull();
    expect(claude).toHaveTextContent('Claude');
    expect(claude?.querySelector('.fa-heart')).not.toBeNull();
  });
});

import { vi } from 'vitest';
import { renderWithProviders, TestRouter } from '../../../../utils/test-utils';
import { Kampioenen } from '../Kampioenen';
import { ITeam } from '../../../../models/model-interfaces';

// Break the storeUtil -> store -> matchesReducer import cycle (see DashboardUpcomingMatchesSpec).
vi.mock('../../../../storeUtil', () => ({ default: {} }));
vi.mock('../../../teams/controls/TeamRankingBadges', () => ({ TeamRankingBadges: () => null }));
vi.mock('../../../teams/controls/TeamPlayerAvatars', () => ({ TeamPlayerAvatars: () => null }));

const makeTeam = (id: number): ITeam =>
  ({
    id,
    teamCode: 'A',
    competition: 'Sporta',
    renderOwnTeamTitle: () => `TTC Aalst ${id}`,
    getDivisionDescription: () => 'Sporta D',
  }) as unknown as ITeam;

const renderKampioenen = (teams: ITeam[]) =>
  renderWithProviders(
    <TestRouter>
      <Kampioenen topTeams={teams} />
    </TestRouter>,
  );

describe('Kampioenen', () => {
  it('renders nothing when there are no champions', () => {
    const { container } = renderKampioenen([]);
    expect(container.querySelector('.kampioen')).toBeNull();
  });

  it('centers the team box when there is a single champion', () => {
    const { container } = renderKampioenen([makeTeam(1)]);
    const cols = container.querySelectorAll('.col-md-4');
    expect(cols).toHaveLength(1);
    cols.forEach(col => expect(col.classList.contains('mx-auto')).toBe(true));
  });

  it('does not center the team boxes when there are multiple champions', () => {
    const { container } = renderKampioenen([makeTeam(1), makeTeam(2)]);
    const cols = container.querySelectorAll('.col-md-4');
    expect(cols).toHaveLength(2);
    cols.forEach(col => expect(col.classList.contains('mx-auto')).toBe(false));
  });
});

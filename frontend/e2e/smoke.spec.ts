import { test, expect } from '@playwright/test';

// Minimal mock data for initial load
const mockClubs = [
  { id: 1, name: 'TTC Aalst', codeSporta: 'A123', codeVttl: 'OVL001', active: true },
];

const mockConfig = {
  params: {},
  clubs: mockClubs,
  currentSeason: 2024,
  year: 2024,
  competitionEndDate: '2025-05-31',
  frenoyTeamLinksId: [],
};

const mockPlayers = [
  {
    id: 1,
    firstName: 'Test',
    lastName: 'Player',
    alias: 'TestPlayer',
    active: true,
    vttl: { clubId: 1, competition: 'Vttl', ranking: 'B6', position: 1, uniqueIndex: 100, rankingIndex: 1, rankingValue: 50 },
    sporta: null,
    contact: { playerId: 1, email: '', mobile: '', address: '', city: '' },
    style: {},
    quitYear: null,
    security: 'Player',
    hasKey: false,
  },
];

const mockTeams = [
  {
    id: 1,
    competition: 'Vttl',
    teamCode: 'A',
    clubId: 1,
    year: 2024,
    divisionId: 1,
    divisionName: 'Afdeling 1',
    divisionCategory: null,
    opponents: [],
    players: [],
    frenoy: { divisionId: 1, linkId: '', teamId: 1 },
  },
];

const mockMatches = [];

test.describe('Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock all initial API calls
    await page.route('**/api/clubs', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockClubs) }),
    );
    await page.route('**/api/config', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockConfig) }),
    );
    await page.route('**/api/players', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockPlayers) }),
    );
    await page.route('**/api/teams', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockTeams) }),
    );
    await page.route('**/api/matches', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockMatches) }),
    );
    // Mock secondary load calls
    await page.route('**/api/teams/*/ranking', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
    );
    await page.route('**/api/players/ranking/predictions', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
    );
    // Mock SignalR negotiation
    await page.route('**/hubs/ttc/negotiate**', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ connectionId: 'test', availableTransports: [] }) }),
    );
  });

  test('homepage loads without crashing', async ({ page }) => {
    await page.goto('/');

    // App should render (check for header or main content)
    await expect(page.locator('body')).toBeVisible();

    // Should not show error boundary
    await expect(page.getByText('Er is iets misgegaan')).not.toBeVisible();

    // Should show some content from the app (club name or nav)
    await expect(page.locator('nav, header, .app, #root')).toBeVisible();
  });

  test('players page loads', async ({ page }) => {
    await page.goto('/spelers');

    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByText('Er is iets misgegaan')).not.toBeVisible();
  });

  test('matches page loads', async ({ page }) => {
    await page.goto('/wedstrijden');

    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByText('Er is iets misgegaan')).not.toBeVisible();
  });
});

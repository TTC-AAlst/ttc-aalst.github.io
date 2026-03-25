import React from 'react';
import { render, screen } from '@testing-library/react';
import { TimeAgo } from '../TimeAgo';

describe('TimeAgo', () => {
  it('renders relative time for a valid date string', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 15, 12, 0, 0));

    render(<TimeAgo date="2025-03-15T09:00:00" />);
    expect(screen.getByText('3 uur geleden')).toBeDefined();

    vi.useRealTimers();
  });

  it('renders relative time for a Date object', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 15, 12, 0, 0));

    render(<TimeAgo date={new Date(2025, 2, 14, 12, 0, 0)} />);
    expect(screen.getByText(/dag geleden/)).toBeDefined();

    vi.useRealTimers();
  });

  it('returns null for falsy date (undefined-like)', () => {
    const { container } = render(<TimeAgo date={undefined as any} />);
    expect(container.innerHTML).toBe('');
  });

  it('returns null for empty string', () => {
    const { container } = render(<TimeAgo date={'' as any} />);
    expect(container.innerHTML).toBe('');
  });

  it('returns null for 0 (falsy number)', () => {
    const { container } = render(<TimeAgo date={0} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders something for garbage input (dayjs does not throw)', () => {
    const { container } = render(<TimeAgo date="not-a-date" />);
    expect(container.querySelector('span')).not.toBeNull();
  });

  it('renders nl locale output', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 15, 12, 0, 0));

    render(<TimeAgo date="2025-03-12T12:00:00" />);
    expect(screen.getByText('3 dagen geleden')).toBeDefined();

    vi.useRealTimers();
  });
});

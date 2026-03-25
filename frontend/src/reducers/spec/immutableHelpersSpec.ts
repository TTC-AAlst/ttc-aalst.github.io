import { mergeInStore2 } from '../immutableHelpers';

type Item = { id: number; name: string };

describe('mergeInStore2', () => {
  it('returns state unchanged for null/undefined payload', () => {
    const state: Item[] = [{ id: 1, name: 'a' }];
    expect(mergeInStore2(state, null as never)).toBe(state);
    expect(mergeInStore2(state, undefined as never)).toBe(state);
  });

  it('adds single item to empty state', () => {
    const state: Item[] = [];
    const result = mergeInStore2(state, { id: 1, name: 'a' });
    expect(result).toEqual([{ id: 1, name: 'a' }]);
  });

  it('adds array of items to empty state', () => {
    const state: Item[] = [];
    const result = mergeInStore2(state, [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ]);
    expect(result).toEqual([
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ]);
  });

  it('updates existing item by id', () => {
    const state: Item[] = [
      { id: 1, name: 'old' },
      { id: 2, name: 'keep' },
    ];
    mergeInStore2(state, { id: 1, name: 'new' });
    expect(state[0]).toEqual({ id: 1, name: 'new' });
    expect(state[1]).toEqual({ id: 2, name: 'keep' });
  });

  it('appends new item to non-empty state', () => {
    const state: Item[] = [{ id: 1, name: 'a' }];
    mergeInStore2(state, { id: 2, name: 'b' });
    expect(state).toHaveLength(2);
    expect(state[1]).toEqual({ id: 2, name: 'b' });
  });

  it('applies filter to payload', () => {
    const state: Item[] = [];
    const result = mergeInStore2(
      state,
      [
        { id: 1, name: 'yes' },
        { id: 2, name: 'no' },
      ],
      item => item.name === 'yes',
    );
    expect(result).toEqual([{ id: 1, name: 'yes' }]);
  });

  it('handles mix of updates and inserts', () => {
    const state: Item[] = [{ id: 1, name: 'old' }];
    mergeInStore2(state, [
      { id: 1, name: 'updated' },
      { id: 2, name: 'new' },
    ]);
    expect(state).toEqual([
      { id: 1, name: 'updated' },
      { id: 2, name: 'new' },
    ]);
  });
});

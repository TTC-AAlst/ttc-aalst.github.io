export function mergeInStore2<T extends {id: number}>(
  state: T[],
  anyPayload: T | T[],
  filter?: (itm: T) => boolean,
) {

  if (!anyPayload) {
    return state;
  }

  let payload = Array.isArray(anyPayload) ? anyPayload : [anyPayload];
  if (filter) {
    payload = payload.filter(filter);
  }

  if (state.length === 0) {
    return state.concat(payload);
  }

  payload.forEach(match => {
    const index = state.findIndex(obj => obj.id === match.id);
    if (index !== -1) {
      state[index] = match;
    } else {
      state.push(match);
    }
  });
  return state;
}

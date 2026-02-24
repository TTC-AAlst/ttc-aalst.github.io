export function debounce<Args extends unknown[]>(cb: (...args: Args) => void, duration: number): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb(...args);
    }, duration);
  };
}

export function debounce<T extends (...args: unknown[]) => void>(cb: T, duration: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb(...args);
    }, duration);
  };
}

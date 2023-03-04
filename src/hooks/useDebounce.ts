import { useCallback, useRef } from "react";

export const useDebounce = <T>(
  callback: (arg: T) => void,
  delay: number
): [(arg: T) => void, () => void] => {
  const timer = useRef<NodeJS.Timeout>();
  const clearDebounce = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }
  }, []);
  const debounce = useCallback(
    (arg: T) => {
      clearDebounce();
      timer.current = setTimeout(() => {
        callback(arg);
      }, delay);
    },
    [callback, clearDebounce, delay]
  );
  return [debounce, clearDebounce];
};

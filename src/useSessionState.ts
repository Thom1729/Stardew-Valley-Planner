import { useState, useEffect, type Dispatch, type SetStateAction } from "react";

export function useSessionState<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const stored = window.sessionStorage.getItem(key);

  const [state, setState] = useState(
    (stored === null) ? initialValue : JSON.parse(stored) as T
  );

  useEffect(
    () => window.sessionStorage.setItem(key, JSON.stringify(state)),
    [key, state],
  );

  return [state, setState];
}

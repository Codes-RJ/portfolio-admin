import { useLayoutEffect, useRef, useState } from 'react';

// Stable dispatch identities, with the latest committed authentication and
// state captured by the implementation. Consumers need not subscribe to every
// editor render just to call an action.
export function useStableActions<T extends { [K in keyof T]: (...args: never[]) => unknown }>(actions: T): T {
  const actionsRef = useRef(actions);
  useLayoutEffect(() => { actionsRef.current = actions; });
  // The factory stores callbacks; it never invokes their ref reads during render.
  // eslint-disable-next-line react-hooks/refs
  const [stable] = useState(() => Object.fromEntries(Object.keys(actions).map(key => [
    key, (...args: never[]) => actionsRef.current[key as keyof T](...args),
  ])) as T);
  return stable;
}

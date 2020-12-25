import React from "react";
import { EMPTY } from "./empty";
import { Notifier } from "./Notifier";
import { useForceUpdate } from "./useForceUpdate";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

export function createUseContainer<Container>(
  notifierContext: React.Context<Notifier<Container> | typeof EMPTY>,
) {
  function useContainer(): Container;
  function useContainer<T>(
    selector: (container: Container) => T,
    selectorDeps?: React.DependencyList,
    comparer?: (prev: T, next: T) => boolean,
  ): T;
  function useContainer<T>(
    selector: (container: Container) => T = defaultSelector,
    selectorDeps: React.DependencyList = [],
    comparer: (prev: T, next: T) => boolean = defaultComparer,
  ): T {
    const notifier = React.useContext(notifierContext);
    if (notifier === EMPTY) {
      throw new Error("Component must be wrapped with <ContainerProvider>");
    }

    const memoizedSelector = React.useCallback(selector, selectorDeps);

    const forceUpdate = useForceUpdate();
    const prevSelectedValue = React.useMemo(() => memoizedSelector(notifier.container), [
      memoizedSelector,
      notifier.container,
    ]);

    const listener = React.useCallback(
      (value: Container) => {
        const nextSelectedValue = memoizedSelector(value);

        if (!comparer(prevSelectedValue, nextSelectedValue)) {
          forceUpdate();
        }
      },
      [memoizedSelector, prevSelectedValue, forceUpdate],
    );

    useIsomorphicLayoutEffect(() => {
      notifier.register(listener);

      return () => notifier.unregister(listener);
    }, [listener, notifier]);

    return prevSelectedValue;
  }

  return useContainer;
}

const defaultSelector = (container: any) => container;
const defaultComparer = (a: unknown, b: unknown) => a === b;

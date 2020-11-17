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
    comparer?: (prev: T, next: T) => boolean,
  ): T;
  function useContainer<T>(
    selector: (container: Container) => T = defaultSelector,
    comparer: (prev: T, next: T) => boolean = defaultComparer,
  ): T {
    const notifier = React.useContext(notifierContext);
    if (notifier === EMPTY) {
      throw new Error("Component must be wrapped with <ContainerProvider>");
    }

    const forceUpdate = useForceUpdate();
    const prevSelectedValueRef = React.useRef<T>(selector(notifier.container));

    const listenerRef = React.useRef((value: Container) => {
      const nextSelectedValue = selector(value);

      if (!comparer(prevSelectedValueRef.current, nextSelectedValue)) {
        prevSelectedValueRef.current = nextSelectedValue;

        forceUpdate();
      }
    });

    useIsomorphicLayoutEffect(() => {
      const listener = listenerRef.current;

      notifier.register(listener);

      return () => notifier.unregister(listener);
    }, [notifier]);

    return prevSelectedValueRef.current;
  }

  return useContainer;
}

const defaultSelector = (container: any) => container;
const defaultComparer = (a: unknown, b: unknown) => a === b;

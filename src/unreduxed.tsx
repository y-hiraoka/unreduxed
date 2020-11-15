import React from "react";
import { Notifier } from "./Notifier";
import { useForceUpdate } from "./useForceUpdate";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

type Holder<T> = { value: T };

const EMPTY: unique symbol = Symbol();

type ContainerProviderProps<I, C> = ({ mock: C } | { initialState?: I }) & {
  children: React.ReactNode;
};

export function unreduxed<Container, Init = undefined>(
  useHook: (initialState?: Init) => Container,
) {
  const notifierContext = React.createContext<Notifier<Container> | typeof EMPTY>(EMPTY);
  const holderContext = React.createContext<Holder<Container> | typeof EMPTY>(EMPTY);

  const Provider: React.FC<ContainerProviderProps<Init, Container>> = props => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const container = "mock" in props ? props.mock : useHook(props.initialState);

    const notifierRef = React.useRef(new Notifier<Container>());
    const holderRef = React.useRef<Holder<Container>>({ value: container });

    holderRef.current.value = container;

    useIsomorphicLayoutEffect(() => {
      notifierRef.current.notify(container);
    }, [container]);

    return (
      <notifierContext.Provider value={notifierRef.current}>
        <holderContext.Provider value={holderRef.current}>
          {props.children}
        </holderContext.Provider>
      </notifierContext.Provider>
    );
  };

  function useContainer(): Container;
  function useContainer<T>(
    selector: (container: Container) => T,
    comparer?: (prev: T, next: T) => boolean,
  ): T;
  function useContainer<T>(
    selector: (container: Container) => T = container => container as any,
    comparer: (prev: T, next: T) => boolean = defaultComparer,
  ): T {
    const notifier = React.useContext(notifierContext);
    const holder = React.useContext(holderContext);
    if (notifier === EMPTY || holder === EMPTY) {
      throw new Error("Component must be wrapped with <ContainerProvider>");
    }

    const forceUpdate = useForceUpdate();
    const prevSelectedValueRef = React.useRef<T>(selector(holder.value));

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

  return [Provider, useContainer] as const;
}

const defaultComparer = (a: unknown, b: unknown) => a === b;

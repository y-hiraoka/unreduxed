import React from "react";
import { EMPTY } from "./empty";
import { Notifier } from "./Notifier";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

type ContainerProviderProps<I, C> = ({ mock: C } | { initialState?: I }) & {
  children: React.ReactNode;
};

export function createContainerProvider<Init, Container>(
  useHook: (initialState?: Init) => Container,
  notifierContext: React.Context<Notifier<Container> | typeof EMPTY>,
) {
  const ContainerProvider: React.FC<ContainerProviderProps<Init, Container>> = props => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const container = "mock" in props ? props.mock : useHook(props.initialState);

    const notifierRef = React.useRef(new Notifier<Container>(container));

    useIsomorphicLayoutEffect(() => {
      notifierRef.current.container = container;
      notifierRef.current.notify();
    }, [container]);

    return (
      <notifierContext.Provider value={notifierRef.current}>
        {props.children}
      </notifierContext.Provider>
    );
  };

  return ContainerProvider;
}

import React from "react";
import { EMPTY } from "./empty";
import { Notifier } from "./Notifier";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

type ContainerProviderProps<HookArgs extends Record<string, any>, Container> = (
  | (HookArgs & { __mock?: undefined })
  | ({ __mock: Container } & { [K in keyof HookArgs]?: undefined })
) & { children: React.ReactNode };

export function createContainerProvider<HookArgs extends Record<string, any>, Container>(
  useHook: (args: HookArgs) => Container,
  notifierContext: React.Context<Notifier<Container> | typeof EMPTY>,
) {
  const ContainerProvider: React.FC<ContainerProviderProps<
    HookArgs,
    Container
  >> = props => {
    const { children, ...others } = props;

    // @ts-expect-error
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const container: Container = "__mock" in others ? others.__mock : useHook(others);

    const notifierRef = React.useRef(new Notifier<Container>(container));

    useIsomorphicLayoutEffect(() => {
      notifierRef.current.container = container;
      notifierRef.current.notify();
    }, [container]);

    return (
      <notifierContext.Provider value={notifierRef.current}>
        {children}
      </notifierContext.Provider>
    );
  };

  return ContainerProvider;
}

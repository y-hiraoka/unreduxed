import React from "react";
import { createContainerProvider } from "./createContainerProvider";
import { createUseContainer } from "./createUseContainer";
import { EMPTY } from "./empty";
import { Notifier } from "./Notifier";

export function unreduxed<Container, HookArgs extends Record<string, any> = {}>(
  useHook: (arg: HookArgs) => Container,
) {
  const notifierContext = React.createContext<Notifier<Container> | typeof EMPTY>(EMPTY);

  const Provider = createContainerProvider(useHook, notifierContext);

  const useContainer = createUseContainer(notifierContext);

  return [Provider, useContainer] as const;
}

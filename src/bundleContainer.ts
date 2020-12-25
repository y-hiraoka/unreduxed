import React from "react";
import { createContainerProvider } from "./createContainerProvider";
import { createUseBundledHook } from "./createUseBundledHook";
import { createUseContainer } from "./createUseContainer";
import { EMPTY } from "./empty";
import { Notifier } from "./Notifier";

export function bundleContainer<Hooks extends Record<string, (init?: undefined) => any>>(
  containerHooks: Hooks,
) {
  const useBundledHook = createUseBundledHook(containerHooks);

  const notifierContext = React.createContext<
    Notifier<ReturnType<typeof useBundledHook>> | typeof EMPTY
  >(EMPTY);

  const ContainerProvider = createContainerProvider(useBundledHook, notifierContext);

  const useContainer = createUseContainer(notifierContext);

  return [ContainerProvider, useContainer] as const;
}

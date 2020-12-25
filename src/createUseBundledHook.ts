type BundledContainer<
  T extends Record<string, (init?: undefined) => any>
> = keyof T extends string ? { [K in keyof T]: ReturnType<T[K]> } : never;

type BundledInitialStates<
  T extends Record<string, (init?: undefined) => any>
> = keyof T extends string ? { [K in keyof T]?: Parameters<T[K]>[0] } : never;

export function createUseBundledHook<
  Hooks extends Record<string, (initialState?: undefined) => any>
>(hooks: Hooks) {
  function useBundledHook(
    bundledInitialStates?: BundledInitialStates<Hooks>,
  ): BundledContainer<Hooks> {
    const bundled = {} as Record<string, unknown>;

    const sortedEntries = Object.entries(hooks).sort(([a], [b]) => a.localeCompare(b));

    for (const [key, useHook] of sortedEntries) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      bundled[key] = useHook(
        bundledInitialStates === undefined ? undefined : bundledInitialStates[key],
      );
    }

    return bundled as any;
  }

  return useBundledHook;
}

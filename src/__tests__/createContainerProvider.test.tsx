import React from "react";
import { createContainerProvider } from "../createContainerProvider";
import { EMPTY } from "../empty";
import { Notifier } from "../Notifier";
import { renderHook, act } from "@testing-library/react-hooks";

const useTestHook = (init?: number) => {
  const [count, setCount] = React.useState(init ?? 0);

  const increment = React.useCallback(() => setCount(prev => prev + 1), []);
  const decrement = React.useCallback(() => setCount(prev => prev - 1), []);

  return { count, increment, decrement };
};

type ContainerType = ReturnType<typeof useTestHook>;
type TestNotifier = Notifier<ContainerType>;

const context = React.createContext<TestNotifier | typeof EMPTY>(EMPTY);

const ContainerProvider = createContainerProvider(useTestHook, context);

const useConatinerMocked = () => React.useContext(context);

test("ContainerProvider provides Notifier instance", () => {
  const { result } = renderHook(
    () => {
      const notifier = useConatinerMocked();
      return { notifier };
    },
    { wrapper: ContainerProvider },
  );

  const notifier = result.current.notifier;
  expect(notifier).toBeInstanceOf(Notifier);

  act(() => {
    (notifier as TestNotifier).container.increment();
  });

  expect((result.current.notifier as TestNotifier).container.count).toBe(1);
  expect(result.current.notifier).toBe(notifier);
});

test("Pass a initial state to ContainerProvider", () => {
  const PassingInitStateProvder = (props: { children: React.ReactNode }) => (
    <ContainerProvider {...props} initialState={100} />
  );

  const { result } = renderHook(
    () => {
      const notifier = useConatinerMocked();
      return { notifier };
    },
    { wrapper: PassingInitStateProvder },
  );

  expect((result.current.notifier as TestNotifier).container.count).toBe(100);
});

test("Pass a mocked container to ContainerProvider", () => {
  const mock: ContainerType = {
    count: 200,
    increment: () => {},
    decrement: () => {},
  };

  const PassingMockedProvider = (props: { children: React.ReactNode }) => (
    <ContainerProvider {...props} mock={mock} />
  );

  const { result } = renderHook(
    () => {
      const notifier = useConatinerMocked();
      return { notifier };
    },
    { wrapper: PassingMockedProvider },
  );

  expect((result.current.notifier as TestNotifier).container.count).toBe(200);
});

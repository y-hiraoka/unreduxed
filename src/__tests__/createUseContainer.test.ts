import React from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { createUseContainer } from "../createUseContainer";
import { EMPTY } from "../empty";
import { Notifier } from "../Notifier";

const initialValue = [0, 1, 2, 3, 4, 5];
const notifier = new Notifier<number[]>(initialValue);
const context = React.createContext<typeof notifier | typeof EMPTY>(notifier);

const useContainer = createUseContainer(context);

test("get whole container.", () => {
  const { result } = renderHook(() => {
    const value = useContainer();
    return { value };
  });

  expect(result.current.value).toBe(initialValue);
});

test("select a value from container", () => {
  const { result } = renderHook(() => {
    const value = useContainer(c => c[2]);
    return { value };
  });

  expect(result.current.value).toBe(2);
});

test("selector depends on a local state.", () => {
  const { result } = renderHook(() => {
    const [index, setIndex] = React.useState(0);
    const selected = useContainer(c => c[index]);

    return { selected, index, setIndex };
  });

  expect(result.current.selected).toBe(0);

  act(() => result.current.setIndex(3));

  expect(result.current.selected).toBe(3);
});

test("pass a comparer function", () => {
  let renderCount = 0;

  renderHook(() => {
    renderCount++;

    useContainer(
      c => c.slice(), // create a copied instance.
      (prev, next) => prev.every((item, index) => next[index] === item),
    );
  });

  expect(renderCount).toBe(1);
  act(() => notifier.notify());
  expect(renderCount).toBe(1);
});

test("Error occurs when unwrapped with Provider.", () => {
  const emptyContext = React.createContext<React.ContextType<typeof context>>(EMPTY);
  const useContainer = createUseContainer(emptyContext);
  const { result } = renderHook(() => useContainer());

  expect(result.error.message).toBe("Component must be wrapped with <ContainerProvider>");
});
